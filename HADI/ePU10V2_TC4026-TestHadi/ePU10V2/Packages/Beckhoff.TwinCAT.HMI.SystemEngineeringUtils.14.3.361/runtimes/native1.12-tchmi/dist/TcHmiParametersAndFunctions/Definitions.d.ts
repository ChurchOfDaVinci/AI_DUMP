import type { TcHmiPermissionManagement } from 'Beckhoff.TwinCAT.HMI.Controls/index.esm.js';
import type { ParametersAndFunctions } from './ParametersAndFunctionsTable.js';
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
//# sourceMappingURL=Definitions.d.ts.map