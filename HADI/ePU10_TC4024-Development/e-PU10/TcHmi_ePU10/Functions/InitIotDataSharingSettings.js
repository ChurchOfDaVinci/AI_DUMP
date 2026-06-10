// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.762.56/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            /**
             * Initialises the IoT Data Sharing overlay state on every page open.
             *
             * Called from the content's onInitialized trigger. Ensures both overlays
             * start in a known-good state, then subscribes one-shot to the PLC data
             * symbol to hide the load overlay once the initial data arrives.
             *
             * Shared state (_loadSubscription, _searchDebounceTimer, _searchPending,
             * _setOverlayShow) is stored on the TcHmi_ePU10 namespace object so that
             * ApplyIotSearchFilter.js can access the same values.
             *
             * Search filtering is handled by ApplyIotSearchFilter (ApplyIotSearchFilter.js),
             * called from the TcHmiInput_SearchIotData.onTextChanged trigger.
             *
             * @param {object} ctx - TcHMI injected context; call ctx.onFinished() when done.
             * @returns {Function} Destroy function called by the framework on content disposal.
             */
            function InitIotDataSharingSettings(ctx) {
                // Cancel any subscription / debounce timer left over from a previous page visit.
                if (TcHmi_ePU10._loadSubscription) { TcHmi_ePU10._loadSubscription(); TcHmi_ePU10._loadSubscription = null; }
                if (TcHmi_ePU10._searchDebounceTimer !== null) { clearTimeout(TcHmi_ePU10._searchDebounceTimer); TcHmi_ePU10._searchDebounceTimer = null; }
                TcHmi_ePU10._searchPending = false;

                // Reset concurrency guard so the Save button works normally on re-entry.
                TcHmi_ePU10._isSaving = false;

                // Start with save overlay hidden and load overlay visible.
                TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotSaveOverlay', false);
                TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', true);

                // One-shot subscription: once the first batch of PLC data arrives,
                // expand the datagrid's paging buffer to cover the entire dataset and
                // then hide the load overlay.
                //
                // Background: TcHmiDatagrid uses server-side paging when its DataSymbol
                // points to a PLC/server symbol (__pagingInfo.usePaging = true).
                // The default buffer is 30 rows.  When the user scrolls beyond those
                // 30 rows, TcHMI cancels the current subscription and opens a new paged
                // request for the new viewport — causing a round-trip delay during which
                // the new rows are empty.
                //
                // Setting buffer = 2000 makes the single subscription window large enough
                // to cover any realistic IoT variable list in one server request, so
                // scrolling never triggers a second round-trip.  This mirrors the
                // private-API pattern already used in SaveIotDataSharingSettings.js.
                TcHmi_ePU10._loadSubscription = TcHmi.Symbol.readEx2(
                    '%s%PLC.ControlManager.IoT::IotDataSharingList%/s%',
                    function (data) {
                        if (data && data.error === TcHmi.Errors.NONE) {
                            if (TcHmi_ePU10._loadSubscription) { TcHmi_ePU10._loadSubscription(); TcHmi_ePU10._loadSubscription = null; }

                            // Expand the paging buffer so that all rows are fetched in
                            // one subscription window.  A short delay ensures the grid
                            // has finished its initial layout (rowCount > 0) before the
                            // call, which is a guard condition inside __updatePaging.
                            setTimeout(function () {
                                var dgElements = document.querySelectorAll('[id$="TcHmiDatagrid_IotDataSharing"]');
                                if (dgElements && dgElements.length > 0) {
                                    var grid = TcHmi.Controls.get(dgElements[0].id);
                                    if (grid && grid.__pagingInfo && typeof grid.__updatePaging === 'function') {
                                        grid.__pagingInfo.buffer = 2000;
                                        grid.__updatePaging(true);

                                        // __updatePaging(true) sets firstResponsePending = true and
                                        // fires a new subscription to the server.  The flag is cleared
                                        // synchronously inside __onDataSymbolPage when the full dataset
                                        // arrives, at which point the DOM is already up to date.
                                        //
                                        // Poll at 50 ms intervals until the flag clears, then hide the
                                        // overlay after one requestAnimationFrame so the browser paints
                                        // all rows before the overlay disappears.  Hard ceiling: 1 500 ms
                                        // (matches the fallback timeout below).
                                        //
                                        // If __updatePaging returned early (rowCount still 0), the flag
                                        // stays false and we fall through to the 1500 ms fallback below.
                                        if (grid.__pagingInfo.timing && grid.__pagingInfo.timing.firstResponsePending) {
                                            var pollCount = 0;
                                            var MAX_POLLS = 30; // 30 × 50 ms = 1 500 ms (matches fallback)

                                            function waitForLoad() {
                                                pollCount++;
                                                if (!grid.__pagingInfo.timing.firstResponsePending || pollCount >= MAX_POLLS) {
                                                    requestAnimationFrame(function () {
                                                        // Switch to client-side filtering so that setFilter()
                                                        // calls from ApplyIotSearchFilter use __filterAndSort()
                                                        // instead of a server-side subscription.  The TcHMI
                                                        // server filter engine does not support the 'contains'
                                                        // comparator, so server-side filtering always returns
                                                        // 0 rows.  All data is already in __data (buffer=2000),
                                                        // and __onDataSymbolPage continues to push live updates
                                                        // which re-apply the filter automatically via
                                                        // __processSrcData → __filterAndSort.
                                                        grid.__pagingInfo.usePaging = false;
                                                        if (!TcHmi_ePU10._searchPending) {
                                                            TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', false);
                                                        }
                                                    });
                                                } else {
                                                    setTimeout(waitForLoad, 50);
                                                }
                                            }
                                            setTimeout(waitForLoad, 50);
                                            return;
                                        }
                                    }
                                }

                                // Fallback: grid not found or __updatePaging returned early
                                // (rowCount = 0).  Keep the original 1500 ms guard.
                                setTimeout(function () {
                                    // Switch to client-side filtering even in the fallback path
                                    // (see comment above).
                                    var dgEl2 = document.querySelectorAll('[id$="TcHmiDatagrid_IotDataSharing"]');
                                    if (dgEl2 && dgEl2.length > 0) {
                                        var g2 = TcHmi.Controls.get(dgEl2[0].id);
                                        if (g2 && g2.__pagingInfo) { g2.__pagingInfo.usePaging = false; }
                                    }
                                    if (!TcHmi_ePU10._searchPending) {
                                        TcHmi_ePU10._setOverlayShow('TcHmiContainer_IotLoadOverlay', false);
                                    }
                                }, 1500);
                            }, 100);
                        }
                    }
                );

                ctx.onFinished(TcHmi.Errors.NONE, null);

                return function () {
                    // Cleanup on content disposal – avoids memory leaks and ghost callbacks.
                    if (TcHmi_ePU10._loadSubscription) { TcHmi_ePU10._loadSubscription(); TcHmi_ePU10._loadSubscription = null; }
                    if (TcHmi_ePU10._searchDebounceTimer !== null) { clearTimeout(TcHmi_ePU10._searchDebounceTimer); TcHmi_ePU10._searchDebounceTimer = null; }
                };
            }
            TcHmi_ePU10.InitIotDataSharingSettings = InitIotDataSharingSettings;

            // ---------------------------------------------------------------------------
            // Shared state – stored on the namespace so ApplyIotSearchFilter.js can
            // read and write the same values from its own IIFE closure.
            // ---------------------------------------------------------------------------
            /** @type {Function|null} Destroy handle for the one-shot PLC symbol subscription. */
            TcHmi_ePU10._loadSubscription = null;
            /** @type {number|null} Native timer handle for the search-input debounce. */
            TcHmi_ePU10._searchDebounceTimer = null;
            /** @type {boolean} True while a search debounce is pending. */
            TcHmi_ePU10._searchPending = false;
            /** @type {number} Incremented on every keystroke; stops stale debounce closures from hiding the overlay prematurely. */
            TcHmi_ePU10._searchGen = 0;

            /**
             * Shows or hides an overlay TcHmiContainer by the trailing segment of its runtime ID.
             * Uses setVisibility('Visible'/'Collapsed') – the correct TcHMI control API.
             * Shared with ApplyIotSearchFilter.js via the namespace object.
             * @param {string} idSuffix  Trailing part of the control's runtime ID.
             * @param {boolean} show     true = Visible, false = Collapsed.
             */
            TcHmi_ePU10._setOverlayShow = function (idSuffix, show) {
                var elements = document.querySelectorAll('[id$="' + idSuffix + '"]');
                if (!elements || elements.length === 0) { return; }
                var ctrl = TcHmi.Controls.get(elements[0].id);
                if (ctrl && typeof ctrl.setVisibility === 'function') {
                    ctrl.setVisibility(show ? 'Visible' : 'Collapsed');
                }
            };
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('InitIotDataSharingSettings', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.InitIotDataSharingSettings);