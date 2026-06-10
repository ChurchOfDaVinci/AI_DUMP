// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var TcHmi_ePU10;
        (function (TcHmi_ePU10) {
            // ctx - function have to be asynchronous
            // EnumDataSymbol - returns object containing symbol expression instead of resolved value
            function GetEnumString(ctx, EnumDataSymbol) {

                // gets symbol expression
                var symbolExpression = EnumDataSymbol.__symbol.__expression.__expression;

                // get enum scheme
                EnumDataSymbol.resolveSchema(function (data) {
                    if (data.error === TcHmi.Errors.NONE) {
                        var schema = data.schema;

                        // read value of enum symbol
                        TcHmi.Symbol.readEx2(
                            symbolExpression,
                            function (data) {

                                if (data.error === TcHmi.Errors.NONE) {

                                    // ctx.success = return value in HMI async function
                                    //      get string from enum scheme by value resolved integer value of enum
                                    ctx.success(
                                        schema.options[data.value].label);
                                } else {
                                    ctx.error(TcHmi.Errors.ERROR);
                                }
                            });


                    } else {
                        ctx.error(TcHmi.Errors.ERROR);
                    }
                });

            }
            TcHmi_ePU10.GetEnumString = GetEnumString;
        })(TcHmi_ePU10 = Functions.TcHmi_ePU10 || (Functions.TcHmi_ePU10 = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);
TcHmi.Functions.registerFunctionEx('GetEnumString', 'TcHmi.Functions.TcHmi_ePU10', TcHmi.Functions.TcHmi_ePU10.GetEnumString);
