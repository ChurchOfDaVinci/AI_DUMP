// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

/*
 * Generated 2/6/2023 2:45:56 PM
 * Copyright (C) 2023
 */
var TcHmi;
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    let Controls;
    (function (/** @type {globalThis.TcHmi.Controls} */ Controls) {
        let Loading_Spinner_Package;
        (function (Loading_Spinner_Package) {
            class LoadingSpinner extends TcHmi.Controls.System.TcHmiControl {
                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters.
                - The "changed detection" in the setter will result in processing the value only once while compile.
                - Attention: If we have a Server Binding on an Attribute the setter will be called once with null to initialize and later with the correct value.
                */
                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                    this.__LoadingSpinnerSpin = false;
                    this.__LoadingSpinnerBorderWidth;
                }
                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_Loading_Spinner_Package_LoadingSpinner-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    this.__spinner = this.__elementTemplateRoot.find('.spinner');
                    // Call __previnit of base class
                    super.__previnit();
                }
                /**
                 * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init() {
                    super.__init();
                }
                /**
                * Is called by the system after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __attach() {
                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }
                /**
                * Is called by the system after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __detach() {
                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }
                /**
                * Destroy the current control instance.
                * Will be called automatically if system destroys control!
                */
                destroy() {
                    /**
                    * While __keepAlive is set to true control must not be destroyed.
                    */
                    if (this.__keepAlive) {
                        return;
                    }
                    super.destroy();
                    /**
                    * Free resources like child controls etc.
                    */
                }
                getLoadingSpinnerSpin() {
                    return this.__LoadingSpinnerSpin;
                }
                setLoadingSpinnerSpin(valueNew) {
                    var convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal("Spin");
                    }
                    if (convertedValue === this.__LoadingSpinnerSpin) {
                        return;
                    }
                    this.__LoadingSpinnerSpin = convertedValue;
                    TcHmi.EventProvider.raise(this.getId() + ".onFunctionResultChanged", ["getLoadingSpinnerSpin"]);
                    this.__processLoadingSpinnerSpin();
                }
                __processLoadingSpinnerSpin() {
                    if (this.__LoadingSpinnerSpin) {
                        this.__spinner.toggleClass("running");
                    } else {
                        this.__spinner.toggleClass("running");
                    }
                }
                getLoadingSpinnerBorderWidth() {
                    return this.__LoadingSpinnerBorderWidth;
                }
                setLoadingSpinnerBorderWidth(valueNew) {
                    var convertedValue = TcHmi.ValueConverter.toNumber(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal("BorderWidth");
                    }
                    if (convertedValue === this.__LoadingSpinnerBorderWidth) {
                        return;
                    }
                    this.__LoadingSpinnerBorderWidth = convertedValue;
                    TcHmi.EventProvider.raise(this.getId() + ".onFunctionResultChanged", ["getLoadingSpinnerBorderWidth"]);
                    this.__processLoadingSpinnerBorderWidth();
                }
                __processLoadingSpinnerBorderWidth() {
                    var r = document.querySelector(':root');
                    r.style.setProperty('--spinner-border-width', this.__LoadingSpinnerBorderWidth + "px");
                }
            }
            Loading_Spinner_Package.LoadingSpinner = LoadingSpinner;
        })(Loading_Spinner_Package = Controls.Loading_Spinner_Package || (Controls.Loading_Spinner_Package = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('LoadingSpinner', 'TcHmi.Controls.Loading_Spinner_Package', TcHmi.Controls.Loading_Spinner_Package.LoadingSpinner);
