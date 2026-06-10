// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.56/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            /**
             * Called from the TcHmiInput_SearchIotData.onTextChanged trigger.
             *
             * Shows the load overlay immediately so the user gets visual feedback, then
             * applies a 250 ms debounce so the filter is sent only once the user pauses.
             *
             * After setFilter() is called a 600 ms timeout hides the overlay.  This is
             * 40 % faster than the original 1 000 ms and safe for any LAN-connected
             * published TcHMI server (typical round-trip is well under 200 ms).
             *
             * A generation counter (_searchGen) is incremented on every keystroke so
             * that the debounce closure can detect when a newer search has already
             * started and skip the overlay-hide step to avoid flicker.
             *
             * Shared state (_searchDebounceTimer, _searchPending, _searchGen,
             * _setOverlayShow) is initialised by InitIotDataSharingSettings.js on the
             * same namespace object.
             */
            function ApplyIotSearchFilter() {
                // Show the overlay right away so the user sees feedback on every keystroke.
                TcHmi_ePU10._searchPending = true;
                TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', true);

                // Increment the generation counter on every keystroke so that a debounce
                // closure from an earlier keystroke can detect it is stale and bail out
                // without hiding the overlay prematurely.
                TcHmi_ePU10._searchGen = (TcHmi_ePU10._searchGen || 0) + 1;

                if (TcHmi_ePU10._searchDebounceTimer !== null) { clearTimeout(TcHmi_ePU10._searchDebounceTimer); }
                TcHmi_ePU10._searchDebounceTimer = setTimeout(function () {
                    TcHmi_ePU10._searchDebounceTimer = null;

                    // Snapshot the generation so we can bail out if the user types again
                    // before the 600 ms post-filter timeout fires.
                    var myGen = TcHmi_ePU10._searchGen;

                    // Read the current search text from the input control.
                    var inputElements = document.querySelectorAll('[id$="TcHmiInput_SearchIotData"]');
                    var searchText = '';
                    if (inputElements && inputElements.length > 0) {
                        var inputCtrl = TcHmi.Controls.get(inputElements[0].id);
                        if (inputCtrl && typeof inputCtrl.getText === 'function') {
                            searchText = inputCtrl.getText() || '';
                        }
                    }

                    // Apply combined filter to the datagrid.
                    var dgElements = document.querySelectorAll('[id$="TcHmiDatagrid_IotDataSharing"]');
                    if (!dgElements || dgElements.length === 0) {
                        TcHmi_ePU10._searchPending = false;
                        TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', false);
                        return;
                    }
                    var grid = TcHmi.Controls.get(dgElements[0].id);
                    if (!grid || typeof grid.setFilter !== 'function') {
                        TcHmi_ePU10._searchPending = false;
                        TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', false);
                        return;
                    }

                    grid.setFilter(searchText
                        ? [
                            { path: 'Varname', comparator: '!=', value: 0 },
                            { logic: 'AND' },
                            { path: 'Label', comparator: 'contains [ignore case]', value: searchText }
                        ]
                        : [{ path: 'Varname', comparator: '!=', value: 0 }]
                    );

                    // Wait 600 ms for TcHMI to process the filter and render the updated
                    // rows (both client-side __filterAndSort and any server-side paging
                    // round-trip), then hide the overlay.  This is 40 % faster than the
                    // original 1 000 ms and comfortably covers any LAN-connected server.
                    setTimeout(function () {
                        if (TcHmi_ePU10._searchGen !== myGen) { return; } // newer search started
                        TcHmi_ePU10._searchPending = false;
                        TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', false);
                    }, 600);
                }, 250);
            }
            TcHmi_ePU10.ApplyIotSearchFilter = ApplyIotSearchFilter;
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('ApplyIotSearchFilter', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.ApplyIotSearchFilter);