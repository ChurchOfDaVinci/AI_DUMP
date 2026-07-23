import type { Control as TcHmiParametersAndFunctions } from './TcHmiParametersAndFunctions.esm.js';
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
//# sourceMappingURL=SelectRuntime.d.ts.map