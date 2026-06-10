// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.56/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            // Guard flag stored on the shared namespace so InitIotDataSharingSettings.js
            // can reset it on each page visit.  Initialised here if not already set by
            // the other file (load order is not guaranteed).
            if (TcHmi_ePU10._isSaving === undefined) {
                TcHmi_ePU10._isSaving = false;
            }

            /**
             * Shows or hides an overlay TcHmiContainer by the trailing segment of its runtime ID.
             * Uses setVisibility('Visible'/'Collapsed') – the correct TcHMI control API.
             * 'Collapsed' removes the element from layout and blocks pointer events.
             * @param {string} idSuffix  Trailing part of the control's runtime ID.
             * @param {boolean} show     true = Visible, false = Collapsed.
             */
            function _setOverlayShow(idSuffix, show) {
                var elements = document.querySelectorAll('[id$="' + idSuffix + '"]');
                if (!elements || elements.length === 0) { return; }
                var ctrl = TcHmi.Controls.get(elements[0].id);
                if (ctrl && typeof ctrl.setVisibility === 'function') {
                    ctrl.setVisibility(show ? 'Visible' : 'Collapsed');
                }
            }

            /**
             * Writes all staged (indirect-write) changes from the IoT data sharing datagrid
             * to the correct PLC symbol paths and signals completion only after every write
             * has been acknowledged by the server.
             *
             * The built-in writePreparedValues has a double-mapping bug when server-side paging
             * is active: it passes the already-resolved originalIndex back through
             * __srcDataIndexToOriginalIndex(), producing a wrong or -1 index and silently
             * dropping the write.  This function bypasses that by using entry.index directly.
             *
             * Using injectContextObject the function is async: the trigger chain is blocked
             * until ctx.onFinished() is called, guaranteeing that every PLC array element
             * has been written before the PLC is told to activate the new settings.
             *
             * b_ActivateIotSettings is written directly in JS (inside onAllWritesComplete
             * and the zero-write path) so it is reliably sent on every press, including
             * the first, regardless of trigger-chain asyncWait behaviour.
             *
             * @param {object} ctx - TcHMI injected context; call ctx.onFinished() when done.
             * @returns {Function} Destroy function called by the framework on content disposal.
             */
            function SaveIotDataSharingSettings(ctx) {
                // Prevent concurrent saves: a second click while writes are in flight is a no-op.
                if (TcHmi_ePU10._isSaving) {
                    ctx.onFinished(TcHmi.Errors.NONE, null);
                    return function () {};
                }

                // Locate the datagrid control by matching the trailing segment of its runtime ID.
                // When content files are embedded the framework prefixes IDs, so we use querySelectorAll.
                var elements = document.querySelectorAll('[id$="TcHmiDatagrid_IotDataSharing"]');
                if (!elements || elements.length === 0) {
                    ctx.onFinished(TcHmi.Errors.NONE, null);
                    return function () {};
                }

                var control = TcHmi.Controls.get(elements[0].id);
                if (!control || !control.__preparedValues || !control.__indirectWrite || control.__preparedValues.length === 0) {
                    ctx.onFinished(TcHmi.Errors.NONE, null);
                    return function () {};
                }

                TcHmi_ePU10._isSaving = true;

                // Show the save overlay.  Managed here (not in the trigger chain) so the overlay
                // is always hidden even if the content is destroyed before onAllWritesComplete.
                _setOverlayShow('TcHmiContainer_IotSaveOverlay', true);

                var preparedValues = control.__preparedValues.slice(); // snapshot before clearing
                var dataSymbolName = 'PLC.ControlManager.IoT::IotDataSharingList';

                // Clear the staged-edit state immediately so a second Save click does not re-send.
                control.__preparedValues = [];

                var pendingWrites = 0;
                var writeError = TcHmi.Errors.NONE;

                function onAllWritesComplete() {
                    TcHmi_ePU10._isSaving = false;

                    // Hide save overlay now that all writes are acknowledged.
                    _setOverlayShow('TcHmiContainer_IotSaveOverlay', false);

                    // Remove the prepared-value highlight from every cell.
                    if (control.__elementDataTableBody && control.__elementDataTableBody[0]) {
                        var liveElements = control.__elementDataTableBody[0].getElementsByClassName(
                            'TcHmi_Controls_Beckhoff_TcHmiDatagrid-prepared-value'
                        );
                        while (liveElements.length > 0) {
                            liveElements[0].classList.remove('TcHmi_Controls_Beckhoff_TcHmiDatagrid-prepared-value');
                        }
                    }

                    if (control.__updateTable) {
                        control.__updateTable(0);
                    }
                    if (control.__data && control.__data.copy) {
                        control.__oldData = control.__data.copy();
                    }

                    // Tell the PLC to activate the new IoT settings.  Done here (in JS, after all
                    // data writes are acknowledged) rather than in the trigger chain so it is
                    // reliably written on every press, including the first.
                    TcHmi.Symbol.writeEx(
                        '%s%PLC.HMI.Controlvars::control::b_ActivateIotSettings%/s%',
                        true,
                        null
                    );

                    // Signal the trigger chain that all writes are done.
                    ctx.onFinished(writeError, null);
                }

                function onWriteComplete(data) {
                    if (data && data.error !== TcHmi.Errors.NONE && writeError === TcHmi.Errors.NONE) {
                        writeError = data.error;
                    }
                    pendingWrites--;
                    if (pendingWrites === 0) {
                        onAllWritesComplete();
                    }
                }

                for (var i = 0; i < preparedValues.length; i++) {
                    var entry = preparedValues[i];
                    // entry.index is the original PLC array index, already correctly resolved
                    // when the user made the edit – no further mapping needed.
                    var symbol = dataSymbolName + '[' + entry.index + ']';
                    if (entry.column) {
                        symbol += '::' + entry.column;
                    }

                    // Keep the local data cache in sync so the grid shows the saved values
                    // immediately without waiting for the next server push.
                    if (control.__data && entry.column && control.__writeObjectProperty) {
                        var rowData = control.__data.get(entry.index);
                        if (rowData != null) {
                            control.__writeObjectProperty(rowData, entry.column, entry.userData);
                        }
                    }

                    pendingWrites++;
                    TcHmi.Server.writeSymbol(symbol, entry.userData, onWriteComplete);
                }

                // If no writes were issued (e.g. all entries had no column), finish immediately.
                if (pendingWrites === 0) {
                    TcHmi_ePU10._isSaving = false;
                    _setOverlayShow('TcHmiContainer_IotSaveOverlay', false);
                    TcHmi.Symbol.writeEx(
                        '%s%PLC.HMI.Controlvars::control::b_ActivateIotSettings%/s%',
                        true,
                        null
                    );
                    ctx.onFinished(TcHmi.Errors.NONE, null);
                }

                return function () {};
            }
            TcHmi_ePU10.SaveIotDataSharingSettings = SaveIotDataSharingSettings;
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('SaveIotDataSharingSettings', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.SaveIotDataSharingSettings);
