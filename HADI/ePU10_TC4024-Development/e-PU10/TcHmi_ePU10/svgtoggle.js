// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            // ctx - function have to be asynchronous
            // EnumDataSymbol - returns object containing symbol expression instead of resolved value
            function svgtoggle(ctx, BoolDataSymbol, svgID1, svgID2) {         
                var close = document.getElementById(svgID1);
                var open = document.getElementById(svgID2);
                // ctx.success = return value in HMI async function
                //      get string from enum scheme by value resolved integer value of enum
                ctx.success(BoolDataSymbol
                    )
                if (BoolDataSymbol) {
                    close.style.display = 'block';
                    open.style.display = 'none';
                } else {
                    close.style.display = 'none';
                    open.style.display = 'block';
                }
            }
            TcHmi_ePU10.svgtoggle = svgtoggle;
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('svgtoggle', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.svgtoggle);
