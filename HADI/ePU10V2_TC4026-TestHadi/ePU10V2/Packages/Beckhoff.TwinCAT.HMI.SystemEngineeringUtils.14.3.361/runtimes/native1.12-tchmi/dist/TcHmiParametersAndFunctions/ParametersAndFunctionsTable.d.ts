import { Control as TcHmiParametersAndFunctions, type SubscriptionOption, type LocalizedInfo } from './TcHmiParametersAndFunctions.esm.js';
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
//# sourceMappingURL=ParametersAndFunctionsTable.d.ts.map