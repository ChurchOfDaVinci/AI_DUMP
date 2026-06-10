// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.59/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            function GetCurrentUser() {
                return TcHmi.Server.getCurrentUser();
            }
            TcHmi_ePU10.GetCurrentUser = GetCurrentUser;
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('GetCurrentUser', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.GetCurrentUser);
