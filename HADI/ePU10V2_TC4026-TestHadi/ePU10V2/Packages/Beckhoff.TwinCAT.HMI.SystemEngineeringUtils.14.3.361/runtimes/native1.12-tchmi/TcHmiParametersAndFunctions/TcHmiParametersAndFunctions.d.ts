// Compatibility file for non-module typescript compiles without adjustments.
// Use the following line for modern code (needs adjustments to tsconfig.json#configOptions/paths)
// import { TcHmiControl } from "Beckhoff.TwinCAT.HMI.Framework/index.esm.js";
// ***************************************************************************


export declare const extensionName = "TcHmiSystemEngineering";
export declare const extensionErrorPrefix = "HMI_SYSTEM_ENGINEERING_";
export declare const customElementsPrefix = "beckhoff-parameters-and-functions-";
export declare const attributeParameterPrefix = "TcHmiSystemEng.Parameter.";
export declare const attributeFunctionPrefix = "TcHmiSystemEng.Function.";
export type SymbolTrees = Map<string, SymbolTree>;
export type SymbolTree = {
    parent?: SymbolTree;
    image?: string | Symbol;
    subSymbols: SymbolTreeSubSymbols;
    children: SymbolTrees;
};
export type SymbolTreeSubSymbols = Map<string, SymbolTreeSubSymbol>;
export type SymbolTreeSubSymbol = TcHmiPermissionManagement.SymbolListEntry;
export type SymbolNested = {
    parent?: SymbolNested;
    subSymbols?: SymbolsNested;
    entry?: TcHmiPermissionManagement.SymbolListEntry;
    path?: string[];
};
export type SymbolsNested = Map<string, SymbolNested>;
export declare const icons: {
    info: string;
    filter: string;
    link: string;
    arrowUpCircle: string;
    bookOpen: string;
    download: string;
    upload: string;
    lock: string;
    x: string;
    alertCircle: string;
    checkCircle: string;
    externalLink: string;
    chevronDown: string;
    chevronRight: string;
    plus: string;
    trash2: string;
    menu: string;
    eye: string;
    eyeOff: string;
    flag: string;
    crosshair: string;
    delete: string;
};
export declare enum BtnStatus {
    Success = 0,
    Error = 1
}
export type SymbolName = string;
export type ParameterInfo = {
    mapping: string;
    name: string;
    info?: string;
    group?: string;
    visibility?: string;
};
/** SubtreeContent in server response */
export interface SubtreeContent {
    desc?: string;
    mapping?: string;
    image?: string;
    subtree?: SubtreeItem[];
    parameters?: ParameterInfo[];
    functions?: {
        template: string;
        name: string;
        mapping: string;
        info?: string;
        group?: string;
        visibility?: string;
        class?: string;
        content: string[];
        custom: Record<string, string>;
    }[];
    visibility?: string | boolean;
}
/** SubtreeItem in server response */
export type SubtreeItem = [string, SubtreeContent];
export type NavPath = {
    path: string;
    label: string;
    image: string | null;
    parametersAndFunctions: ParametersAndFunctions;
    treeViewIndex: number[] | null;
};
export interface NavTreeNode {
    name: string | null;
    desc: string | null;
    image: string | null;
    subtree: Map<string, NavTreeNode>;
    parametersAndFunctions: ParametersAndFunctions;
    children: NavTreeNode[];
    icon: HTMLElement | null;
    openPermissionsButton: HTMLElement | null;
    layerName: HTMLElement | null;
    navPaths: NavPath[];
}
export type Symbols = TcHmi.Symbol[];
export type TsAndValue<T> = {
    ts: number;
    value: T;
};
export type ExportParameters = {
    [key: string]: TsAndValue<any>[];
};
export type TimestampAndValue<T> = {
    timestamp: number;
    value: T;
};
export type StoredParameterValueEntry = {
    [key: string]: TimestampAndValue<any>;
};
export interface AuditTrailEntry {
    id: string;
    timestamp: string;
    name: string;
    newValue: any;
    oldValue: any;
    processedStart: string;
    processedEnd: string;
    readValue: any;
    sessionId: string;
    socketId: number;
    type: number;
    clientIp: string;
    userGroups: null | string;
    userName: string;
    error: {
        code: string;
        reason: string;
    } | null;
}

export declare class ContextMenu extends HTMLElement {
    private __target;
    private __container;
    private __isShowing;
    private __contextMenuOnCb?;
    constructor(target: HTMLElement, container: HTMLElement);
    connectedCallback(): void;
    disconnectedCallback(): void;
    toggleMenuOn(): void;
    toggleMenuOff(): void;
    set contextMenuOnCb(cb: () => any | undefined);
    private __addEvents;
    private __removeEvents;
    private __onContextMenu;
    private __onClickAway;
    private __onEscape;
    private __positionMenu;
}


export type ServerRuntimesConfig = Record<string, ServerRuntimeConfig>;
export type ServerRuntimeConfig = {
    adsRuntime: string;
    autoSymbolUpdate: boolean;
    enabled: boolean;
    entryPath?: string;
    isInitializedSymbol?: string;
    schema?: any;
    schemaHash?: any;
};
export type ServerADSRuntimeConfig = {
    ENABLED: boolean;
    NETID: string;
    PORT: number;
    READ_ONLY?: false;
    SYMBOLS?: any;
    USE_WHITELISTING?: boolean;
};
export declare class SelectRuntime extends HTMLElement {
    #private;
    private __control;
    static symbolName: string;
    constructor(control: TcHmiParametersAndFunctions);
    connectedCallback(): void;
    private __createAttributeGroup;
    private __createRuntimeSelector;
    disconnectedCallback(): void;
}


export declare enum TableOptions {
    None = 0,
    Flat = 1,
    PreparedValuesOnly = 2,
    Placeholder = 3
}
export type MatrixRow = {
    dataPath: string;
    displayPath: string;
    schema: any;
};
export declare class FloodProtector {
    private delay;
    private timeout;
    constructor(delay?: number);
    run(task: () => void): void;
}
export type FunctionInstance = {
    template: string;
    name: string;
    mapping: string;
    info?: string;
    group?: string;
    visibility?: string;
    class?: string;
    custom?: Record<string, string>;
    content: TcHmi.Symbol[];
};
export type ParametersAndFunctions = {
    parameters?: TcHmi.Symbol[];
    functions?: FunctionInstance[];
};
export declare class ParametersAndFunctionsTable extends HTMLElement {
    #private;
    private __theader;
    private __tbody;
    private __control;
    private __searchBar;
    private __searchBarEraseBtn;
    private __parametersAndFunctions;
    private __subscriptionIds;
    private __symbolsToSubscribe;
    private __visibilitySymbolsToSubscribe;
    private __tableOptions;
    private __tdInfo;
    private __tdError;
    private __auditTrailGridAvailable;
    private __editorFactory;
    private __placeholderIntersectionObserver;
    private __valueIntersectionObserver;
    private __parameterPlaceholderTemplate;
    constructor(control: TcHmiParametersAndFunctions, config: {
        auditTrailGridAvailable: boolean;
    });
    private __showPlaceholder;
    connectedCallback(): void;
    private __runtimeDisabledOverlayElement;
    private __configChangeCb;
    disconnectedCallback(): void;
    private __localizedElements;
    private __addLocalizedElement;
    private __addAllLocalizedElements;
    private __removeNotConnectedElements;
    private __removeLocalizedElement;
    private __removeAllLocalizedElements;
    createElementHelper<K extends keyof HTMLElementTagNameMap>(tagName: K, parent?: HTMLElement, options?: {
        classes?: string[];
        dataset?: DOMStringMap;
        localizedInfo?: LocalizedInfo;
        textContent?: string;
        htmlContent?: string;
    }): HTMLElementTagNameMap[K];
    private __applyAllParameters;
    private __createTableHeader;
    private __searchFloodProtector;
    private __execSearch;
    private __onSearchInput;
    protected __parameterPlaceholders: Map<HTMLElement, TcHmi.Symbol<any>>;
    protected __functionPlaceholders: Map<HTMLElement, FunctionInstance>;
    protected __symbolValueContainer: Map<HTMLElement, {
        symbol: TcHmi.Symbol;
        options: SubscriptionOption;
    }>;
    protected __symbolAccesses: Map<string, import("Beckhoff.TwinCAT.HMI.Framework/dist/API/ServerTypes.js").ACCESS>;
    private __updateTableCounter;
    updateTable(parametersAndFunctions?: ParametersAndFunctions, options?: TableOptions): void;
    requestSymbols(symbols: Map<string, SubscriptionOption[]>, requestType?: 'ReadWrite' | 'Subscription', callback?: () => any): number | null;
    protected __createSymbolGroupHeader(parent: HTMLElement, data: {
        name: string;
        mapping?: string;
        info?: string;
    }): HTMLDivElement;
    protected __applyMargin(tr: HTMLElement, attributes: TcHmi.Dictionary<any>): void;
    protected __createNameMappingInfoElements(parent: HTMLElement, name: string, mapping: string | undefined, info: string | undefined): void;
    protected __createSimpleParameterTableRow(updateTableCounter: number, symbol: TcHmi.Symbol, parameterName: string, parent: HTMLElement, resolvedSymbol: {
        meta: TcHmi.Symbol.IListSymbols;
        attributes: TcHmi.Dictionary<any>;
        schema: TcHmi.Dictionary<any>;
        symbolAccess: TcHmi.Server.ACCESS;
        parentIsArray: boolean;
    }, tableOptions?: TableOptions): Promise<void>;
    private __parseMatrixIndices;
    protected __createFunctionTableRow(updateTableCounter: number, fn: FunctionInstance, placeholder: HTMLElement): void;
    protected __createParameterTableRow(updateTableCounter: number, symbol: TcHmi.Symbol, placeholder: HTMLElement, promises: Promise<void>[], symbolAccesses: Map<string, TcHmi.Server.ACCESS>, tableOptions?: TableOptions): void;
    private __removeRow;
    private __createPreparedValueInputPlaceholder;
    private __createPreparedValueInput;
    private __addSubscriptionOption;
    insertSymbolOrPlainText(value: string, options: {
        container?: HTMLElement;
        wrapSymbol?: boolean;
        valueCb?: (value: string) => void;
        localize?: boolean;
        updateOnDemand?: boolean;
        observeElement?: HTMLElement;
    }, intersectionObserver?: IntersectionObserver | undefined, symbolValueContainer?: Map<HTMLElement, {
        symbol: TcHmi.Symbol;
        options: SubscriptionOption;
    }>, symbolsToSubscribeTo?: Map<string, SubscriptionOption[]>): void;
}







declare class TcHmiParametersAndFunctions extends TcHmi.Controls.System.TcHmiControl {
    #private;
    /**
     * Constructor of the control
     * @param element Element from HTML (internal, do not use)
     * @param pcElement precompiled Element (internal, do not use)
     * @param attrs Attributes defined in HTML in a special format (internal, do not use)
     */
    constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList);
    /** HTML root element */
    protected __mode: 'Runtime' | 'Designer' | 'Edit' | 'None';
    get mode(): "Runtime" | "Designer" | "Edit" | "None";
    private __destroyEventListeners;
    protected __elementControl: HTMLElement | null;
    protected __elementTemplateRoot: HTMLElement;
    get elementTemplateRoot(): HTMLElement;
    protected __localTopMostLayer: HTMLElement;
    protected __subscriptionIds: number[];
    protected __treeView: TcHmi.Controls.Beckhoff.TcHmiTreeView;
    protected __breadcrumb: TcHmiBreadcrumb.Control<BreadcrumbContentType>;
    protected __selectRuntime: SelectRuntime;
    protected __pageContent: HTMLElement;
    protected __elConfigRuntime: HTMLElement;
    protected __elConfigRuntimeName: HTMLElement;
    protected __elToggleRuntimeDiagnostics: HTMLElement;
    protected __elRuntimeDiagnostics: HTMLElement;
    protected __elNavigation: HTMLElement;
    protected __navigationCollapsed: boolean;
    protected __elToggleNavigation: HTMLElement;
    protected __elLocalTopMostLayer: HTMLElement;
    protected __splitView: Helpers.SplitView;
    protected __resizeBar: HTMLElement;
    protected __btnAllParameters: HTMLElement;
    protected __btnChanges: HTMLElement;
    protected __labelNumberOfChanges: HTMLElement;
    protected __btnImportParameters: HTMLElement;
    protected __btnExportParameters: HTMLElement;
    protected __btnUpdateSymbols: HTMLElement;
    protected __btnTeachSymbolValues: HTMLElement;
    protected __btnUpdateSymbolsIcon: SVGElement;
    protected __btnUpdateSymbolsStatus: HTMLElement;
    protected __notificationWrapper: HTMLElement;
    protected __elRuntimeUpToDateLabel: HTMLElement;
    private __symbolsToSubscribe;
    private __symbolsToSubscribe_subscriptionId;
    private __valueIntersectionObserver;
    protected __symbolValueContainer: Map<HTMLElement, {
        symbol: TcHmi.Symbol;
        options: SubscriptionOption;
    }>;
    /** Localization */
    protected __localizedElements: Map<HTMLElement, LocalizedInfo>;
    protected __independentLocalizedElements: Map<HTMLElement, LocalizedInfo>;
    protected __localizationReader: TcHmi.Locale.LocalizationReader | undefined;
    protected __applicationLocalization: TcHmi.Locale.Localization | undefined;
    protected __applicationLocalizationReader: TcHmi.Locale.LocalizationReader | undefined;
    protected __runtime: string | undefined;
    protected __initPath: string | undefined;
    protected __rootPath: string | undefined;
    protected __imageBasePath: string | undefined;
    protected __useValueAsDefaultPreparedValue: boolean | undefined;
    protected __autoFocusOut: boolean | undefined;
    protected __showParameters: boolean | undefined;
    protected __showFunctions: boolean | undefined;
    protected __showSymbolMapping: boolean | undefined;
    protected __showTreeView: boolean | undefined;
    protected __showBreadcrumb: boolean | undefined;
    protected __showNavigation: boolean | undefined;
    protected __allParameters: TcHmi.Symbol[];
    protected __parametersInfo: Map<TcHmi.Symbol<any>, ParameterInfo>;
    get parametersInfo(): Map<TcHmi.Symbol<any>, ParameterInfo>;
    protected __allSymbolNames: string[];
    protected __arraySymbols: Map<TcHmi.Symbol<any>, Map<string, TcHmi.Symbol<any>>>;
    get arraySymbols(): Map<TcHmi.Symbol, Map<string, TcHmi.Symbol>>;
    set arraySymbols(value: Map<TcHmi.Symbol, Map<string, TcHmi.Symbol>>);
    protected __displayedSymbols: Set<TcHmi.Symbol<any>>;
    get displayedSymbols(): Set<TcHmi.Symbol>;
    set displayedSymbols(value: Set<TcHmi.Symbol>);
    protected __parametersWithPreparedValue: Map<TcHmi.Symbol<any>, any>;
    get parametersWithPreparedValue(): Map<TcHmi.Symbol, any>;
    set parametersWithPreparedValue(value: Map<TcHmi.Symbol, any>);
    private __table;
    /**
     * If raised, the control object exists in control cache and constructor of each inheritation level was called.
     * Call attribute processor functions here to initialize default values!
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __previnit(): void;
    private __updateLocalizedElements;
    /**
     * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __init(): void;
    /**
     * Is called by the system after the control instance gets part of the current DOM.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __attach(): void;
    private __enterMode;
    static unsubscribe(subscriptionId: number | null): void;
    private __leaveMode;
    private __setTreeViewColumns;
    makeSymbolPathAbsolute(relativeSymbolPath: string, basePath: string): string;
    private __runtimeDisabledOverlayElement;
    private __config?;
    private __fetchConfigSubscriptionId;
    private __fetchConfig;
    private __configChangeCbs;
    addConfigChangeCb(cb: (oldConfig: RuntimeConfig | undefined, newConfig: any) => any): void;
    removeConfigChangeCb(cb: (oldConfig: RuntimeConfig | undefined, newConfig: RuntimeConfig) => any): void;
    private __extensionUpdateInProgress;
    private __fetchDiagnosticsSubscriptionId;
    private __fetchDiagnostics;
    /**
     * Add an element to be localized.
     * @param element The element.
     * @param localizedInfo The localization key and optional parameter and target.
     */
    addLocalizedElement(element: HTMLElement, localizedInfo: LocalizedInfo): void;
    /**
     * Add an element with a lifetime independent of the control's lifetime.
     * Added elements will be removed when not attached to the DOM.
     * @param element The element.
     * @param localizedInfo The localization key and optional parameter and target.
     */
    addIndependentLocalizedElement(element: HTMLElement, localizedInfo: LocalizedInfo): void;
    private __localizeElement;
    private __removeNotConnectedElements;
    /**
     * Remove a localized element.
     * @param element The element to remove.
     */
    removeLocalizedElement(element: HTMLElement): void;
    private __updateRuntime;
    private __updateView;
    private __syncConfigByMode;
    private __onToggleNavigation;
    protected __onImportParameters_resolvePreparedValuesBeforeImporting(): void;
    protected __onImportParameters(_event: PointerEvent): void;
    protected __onExportParameters(_event: PointerEvent): void;
    protected __onTeachSymbolValues(_event: PointerEvent): void;
    protected __onUpdatePLC(_event: PointerEvent): void;
    setButtonState(state: BtnStatus): void;
    getDateTimeString(): string;
    static removeSymbolNamePrefix(s: string): string;
    __findParameter(name: string, lookOnlyForSuffix?: boolean, searchScope?: TcHmi.Symbol[]): TcHmi.Symbol<any> | null;
    protected __onImportParameters_handleFileSelection(files: FileList | null): void;
    protected __openAllParameters(): void;
    protected __openChangedSymbols(): void;
    protected __pathChange(paths: string | NavPath[], symbolsAndFunctions: ParametersAndFunctions, treeViewIndex: number[] | null, tableOptions?: TableOptions): void;
    /**
     * Is called by the system after the control instance is no longer part of the current DOM.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __detach(): void;
    /**
     * Destroy the current control instance.
     * Will be called automatically if system destroys control!
     */
    destroy(): void;
    updateBtnChanges(): void;
    protected __createLayerLabelElement(navPaths: NavPath[], name: string): HTMLSpanElement;
    protected __showIcon?: boolean;
    protected __showPermissionButton?: boolean;
    protected __treeView_iconCount: Set<HTMLElement>;
    protected __createLayerIconElement(iconSrc: string, options?: {
        observeElement?: HTMLElement;
        intersectionObserver?: IntersectionObserver;
        symbolValueContainer?: Map<HTMLElement, {
            symbol: TcHmi.Symbol;
            options: SubscriptionOption;
        }>;
    }): HTMLImageElement | null;
    protected __createOpenPermissionManagementButton(parametersAndFunctions: ParametersAndFunctions): HTMLButtonElement;
    protected __updateBreadcrumb(navPaths: string | NavPath[], symbolsAndFunctions: ParametersAndFunctions, treeViewIndex: number[] | null): void;
    private __getTreeViewSubscriptionId;
    protected __fetchSymbols(): void;
    private __hideNotifications;
    private __setNotification;
    private __cached_treeViewData;
    private __serverSymbolMetaDataChangedDestroyFn;
    private __visibilitySubscriptionSymbolsAndValues;
    private __visibilitySubscriptionId;
    private __parseSymbols;
    private __updateSymbolsToSubscribeTo;
    private __createTree;
    private __subscription_accessToPermissions;
    private __checkAccessToPermissions;
    setRuntimeInternal(value: string): void;
    /**
     * Category: Common
     */
    /**
     * Sets the value of the member variable "runtime" if the new value is not equal to the current value
     * @param valueNew The new value for runtime.
     */
    setRuntime(valueNew: string | null): void;
    getRuntime(): string | undefined;
    /**
     * Sets the value of the member variable "initPath" if the new value is not equal to the current value
     * @param valueNew The new value for initPath.
     */
    setInitPath(valueNew: string | null): void;
    getInitPath(): string | undefined;
    /**
     * Sets the value of the member variable "rootPath" if the new value is not equal to the current value
     * @param valueNew The new value for rootPath.
     */
    setRootPath(valueNew: string | null): void;
    getRootPath(): string | undefined;
    /**
     * Sets the value of the member variable "imageBasePath" if the new value is not equal to the current value
     * @param valueNew The new value for imageBasePath.
     */
    setImageBasePath(valueNew: string | null): void;
    getImageBasePath(): string | undefined;
    /**
     * Sets the value of the member variable "useValueAsDefaultPrepareValue" if the new value is not equal to the current value
     * @param valueNew The new value for useValueAsDefaultPrepareValue.
     */
    setUseValueAsDefaultPreparedValue(valueNew: boolean | null): void;
    getUseValueAsDefaultPreparedValue(): boolean | undefined;
    /**
     * Sets the auto focus out attribute and calls the associated process function (processAutoFocusOut).
     * @param valueNew The new value for autoFocusOut.
     */
    setAutoFocusOut(valueNew: boolean | null): void;
    /**
     * Returns the current value of autoFocusOut.
     * @returns The current value of autoFocusOut.
     */
    getAutoFocusOut(): boolean | undefined;
    /**
     * Category: Appearance
     */
    /**
     * Sets the value of the member variable "showParameters" if the new value is not equal to the current value
     * @param valueNew The new value for boolean showParameters.
     */
    setShowParameters(valueNew: boolean | null): void;
    getShowParameters(): boolean | undefined;
    /**
     * Sets the value of the member variable "showParameters" if the new value is not equal to the current value
     * @param valueNew The new value for boolean showParameters.
     */
    setShowFunctions(valueNew: boolean | null): void;
    getShowFunctions(): boolean | undefined;
    /**
     * Sets the value of the member variable "showSymbolMapping" if the new value is not equal to the current value
     * @param valueNew The new value for boolean showSymbolMapping.
     */
    setShowSymbolMapping(valueNew: boolean | null): void;
    getShowSymbolMapping(): boolean | undefined;
    /**
     * Sets the value of the member variable "showSymbolMapping" if the new value is not equal to the current value
     * @param valueNew The new value for boolean showSymbolMapping.
     */
    setShowTreeView(valueNew: boolean | null): void;
    getShowTreeView(): boolean | undefined;
    /**
     * Sets the value of the member variable "showNavigation" if the new value is not equal to the current value
     * @param valueNew The new value for boolean showNavigation.
     */
    setShowNavigation(valueNew: boolean | null): void;
    getShowNavigation(): boolean | undefined;
    /**
     * Sets the value of the member variable "showBreadcrumb" if the new value is not equal to the current value
     * @param valueNew The new value for boolean showBreadcrumb.
     */
    setShowBreadcrumb(valueNew: boolean | null): void;
    getShowBreadcrumb(): boolean | undefined;
}
export declare enum LocalizedResource {
    'Control' = 0,
    'Application' = 1
}
export declare enum LocalizedInfoTarget {
    TextContent = 0,
    Attribute_Placeholder = 1
}
export type SubscriptionOption = {
    container?: HTMLElement;
    observeElement?: HTMLElement;
    editor?: Helpers.Editor<any, Helpers.Editor.EditorInfo>;
    cbValue?: (value: string | number) => void;
    valuePlaceholders?: string[];
    localize?: boolean;
    updateOnDemand?: boolean;
};
export type LocalizedInfo = {
    key: string;
    parameters?: any[];
    target?: LocalizedInfoTarget;
    resource?: LocalizedResource;
    separateWrapper?: boolean;
};
export type BreadcrumbContentType = {
    navPaths: string | NavPath[];
    symbolsAndFunctions: ParametersAndFunctions;
    treeViewIndex: number[] | null;
};
export type RuntimeConfig = {
    adsRuntime: string;
    adsTimestamp: string;
    autoSymbolUpdate: boolean;
    enableAuditTrail: boolean;
    enabled: boolean;
    entryPath: string;
    restoreSymbolAccessOnUpdate: boolean;
    schema: any;
    schemaHash: string;
    symbolValues: Record<string, TimestampAndValue<any>>;
};
export { TcHmiParametersAndFunctions as Control };
declare const _TcHmiParametersAndFunctions: typeof TcHmiParametersAndFunctions;
type tTcHmiParametersAndFunctions = TcHmiParametersAndFunctions;
declare global {
    namespace TcHmi.Controls.Beckhoff {
        const TcHmiParametersAndFunctions: typeof _TcHmiParametersAndFunctions;
        type TcHmiParametersAndFunctions = tTcHmiParametersAndFunctions;
    }
}
