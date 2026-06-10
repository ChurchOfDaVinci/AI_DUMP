// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            function ToggleSVG(Trigger, svgID1, svgID2) {

                if (svgID2 != '') {
                    var open = document.getElementById(svgID2);
                    if (Trigger) {
                        open.style.display = 'none';
                    } else {
                        open.style.display = 'block';
                    }
                }

                if (svgID1 != '') {
                    var close = document.getElementById(svgID1);
                    if (Trigger) {
                        close.style.display = 'block';
                    } else {
                        close.style.display = 'none';
                    }
                }
            }
            TcHmi_ePU10.ToggleSVG = ToggleSVG;
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('ToggleSVG', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.ToggleSVG);
