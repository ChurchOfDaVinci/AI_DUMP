import { TcHmiControl } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
declare class TcHmiAuditTrailGrid extends TcHmiControl.Control {
    #private;
    constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList);
    protected __elementTemplateRoot: HTMLElement;
    protected __elementMenuBar: HTMLElement;
    protected __elementGridContainer: HTMLElement;
    protected __elementExportPopupContainer: HTMLElement | undefined;
    protected __datagrid: TcHmi.Controls.Beckhoff.TcHmiDatagrid;
    protected __filterButton: TcHmi.Controls.Beckhoff.TcHmiButton;
    protected __exportButton: TcHmi.Controls.Beckhoff.TcHmiButton;
    protected __filterPrompt: TcHmi.Controls.Helpers.FilterPrompt | null;
    protected __detailsPrompt: TcHmi.Controls.Helpers.HtmlAndButtonsPrompt<'close'> | null;
    protected __exportPrompt: TcHmi.Controls.Helpers.HtmlAndButtonsPrompt<'export' | 'close'> | null;
    protected __exportFormatCombobox: TcHmi.Controls.Beckhoff.TcHmiCombobox<'json' | 'csv'> | undefined;
    protected __exportLimitNumeric: TcHmi.Controls.Beckhoff.TcHmiNumericInput | undefined;
    protected __exportLimitCheckbox: TcHmi.Controls.Beckhoff.TcHmiCheckbox | undefined;
    protected __exportOffsetNumeric: TcHmi.Controls.Beckhoff.TcHmiNumericInput | undefined;
    protected __exportOffsetCheckbox: TcHmi.Controls.Beckhoff.TcHmiCheckbox | undefined;
    protected __exportOrderByInput: TcHmi.Controls.Beckhoff.TcHmiInput | undefined;
    protected __exportOrderByCheckbox: TcHmi.Controls.Beckhoff.TcHmiCheckbox | undefined;
    protected __exportFilterText: HTMLElement | undefined;
    protected __exportFilterButton: TcHmi.Controls.Beckhoff.TcHmiButton | undefined;
    protected __exportFilter: TcHmi.Filter;
    protected __columns: Column[] | undefined;
    protected __serverInterval: number | null | undefined;
    protected __allowDetailsPopup: boolean | undefined;
    protected __showMenuBar: boolean | undefined;
    protected __menuBarPosition: 'Top' | 'Bottom' | 'Left' | 'Right' | undefined;
    protected __buttonFontFamily: string | undefined;
    protected __buttonFontSize: number | undefined;
    protected __buttonFontSizeUnit: TcHmi.FontSizeUnit | undefined;
    protected __buttonFontStyle: TcHmi.FontStyle | undefined;
    protected __buttonFontWeight: TcHmi.FontWeight | undefined;
    protected __buttonHeight: number | undefined;
    protected __ignoreEscapeSequences: boolean | undefined;
    protected __localizedElements: Map<HTMLElement, {
        key: string;
        parameters?: any[];
    }>;
    protected __localizationReader: TcHmi.Locale.LocalizationReader | undefined;
    protected __subscriptionId: number | null;
    protected __lastReportedErrorDetail: TcHmi.IErrorDetails | undefined;
    protected __doubletapStartTime: number;
    protected __initializedAttributes: string[];
    /**
     * If raised, the control object exists in control cache and constructor of each inheritation level was called.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __previnit(): void;
    /**
     * If raised, all attributes have been set to it's default or dom values.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __init(): void;
    /**
     * Is called by the system after the control instance gets part of the current DOM.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    __attach(): void;
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
    /**
     * Add an element to be localized.
     * @param element The element.
     * @param key The localization key.
     * @param parameters Optional parameters to pass to tchmi_format_string.
     */
    protected __addLocalizedElement(element: HTMLElement, key: string, ...parameters: any[]): void;
    /**
     * Remove a localized element.
     * @param element The element to remove.
     */
    protected __removeLocalizedElement(element: HTMLElement): void;
    /**
     * Set the data symbol to the datagrid
     */
    protected __setDataSymbol(): void;
    /**
     * Handles the selectedItemChanged event of the datagrid.
     */
    protected __onSelectedItemChanged(): void;
    /**
     * Filter button pressed callback function
     */
    protected __onFilterPressed(): void;
    /**
     * Converts a Filter object to a filter string
     */
    protected __filterToString(filter: TcHmi.Filter): string;
    /**
     * Export button pressed callback function
     */
    protected __onExportPressed(): void;
    /**
     * Update the export promt content
     */
    protected __updateExportPrompt(): void;
    /**
     * Exports and download the audit trails due to the given parameters
     */
    protected __exportAuditTrail(format: 'json' | 'csv', limit: number | null, offset: number | null, orderBy: string | null, filter: string | null): void;
    /**
     * Returns currently selected Audit trail
     * @returns
     */
    getSelectedAuditTrail(): AuditTrail | null;
    /**
     * Handles double clicks on table rows.
     */
    protected __onDoubleclick(event: MouseEvent): void;
    /**
     * Handles touchstart events on table rows.
     */
    protected __onTouchStart(event: TouchEvent): void;
    /**
     * Opens the details prompt if allowed.
     * @returns
     */
    protected __showDetails(): void;
    /**
     * Updates the dispayed information of the details prompt.
     */
    protected __updateDetailsPrompt(): void;
    /**
     * Handles the onPropertyChanged event of the datagrid.
     */
    private __onDatagridPropertyChanged;
    /**
     * Sets the value of the member variable "Columns" if the new value is not equal to the current value
     * and calls the associated process function (processColumns) after that.
     * @param valueNew The new value for Columns.
     */
    setColumns(valueNew: Column[] | null): void;
    /**
     * The watch callback for the columns object resolver.
     */
    protected __onResolverForColumnsWatchCallback(data: TcHmi.Symbol.ObjectResolver.IWatchResultObject<Column[]>): void;
    /**
     * Returns the current value of the member variable text.
     * @returns the current value of the member variable text.
     */
    getColumns(): Column[] | undefined;
    /**
     * Processes the current value of columns and forward it to the treeview control.
     */
    protected __processColumns(): void;
    /**
     * Tells if a column data is sortable or not.
     */
    protected __isSortable(column: ColumnData | string | undefined): boolean;
    /**
     * Sets the filter value and calls the associated process function.
     * @param valueNew The new value for filter.
     */
    setFilter(valueNew: TcHmi.Filter | null): void;
    /**
     * Returns the current value of filter.
     */
    getFilter(): TcHmi.Filter | null | undefined;
    /**
     * Sets the sorting value.
     * @param valueNew The new value for sorting
     */
    setSorting(valueNew: TcHmi.SortingInfo[] | null): void;
    /**
     * Returns the current value of sorting.
     */
    getSorting(): TcHmi.SortingInfo[] | undefined;
    /**
     * Sets the serverInterval value and calls the associated process function.
     * @param valueNew The new value for serverInterval.
     */
    setServerInterval(valueNew: number | null): void;
    /**
     * Returns the current value of serverInterval.
     */
    getServerInterval(): number | null | undefined;
    /**
     * Sets the headerFontFamily value.
     * @param valueNew The new value for headerFontFamily
     */
    setHeaderFontFamily(valueNew: TcHmi.FontFamily | null): void;
    /**
     * Returns the current value of headerFontFamily.
     */
    getHeaderFontFamily(): string | null | undefined;
    /**
     * Sets the headerFontSize value.
     * @param valueNew The new value for headerFontSize
     */
    setHeaderFontSize(valueNew: number | null): void;
    /**
     * Returns the current value of headerFontSize.
     */
    getHeaderFontSize(): number | undefined;
    /**
     * Sets the headerFontSizeUnit value.
     * @param valueNew The new value for headerFontSizeUnit
     */
    setHeaderFontSizeUnit(valueNew: TcHmi.FontSizeUnit | null): void;
    /**
     * Returns the current value of headerFontSizeUnit.
     */
    getHeaderFontSizeUnit(): TcHmi.FontSizeUnit | undefined;
    /**
     * Sets the headerFontStyle value.
     * @param valueNew The new value for headerFontStyle
     */
    setHeaderFontStyle(valueNew: TcHmi.FontStyle | null): void;
    /**
     * Returns the current value of headerFontStyle.
     */
    getHeaderFontStyle(): TcHmi.FontStyle | undefined;
    /**
     * Sets the headerFontWeight value.
     * @param valueNew The new value for headerFontWeight
     */
    setHeaderFontWeight(valueNew: TcHmi.FontWeight | null): void;
    /**
     * Returns the current value of headerFontWeight.
     */
    getHeaderFontWeight(): TcHmi.FontWeight | undefined;
    /**
     * Sets the gridFontFamily value.
     * @param valueNew The new value for gridFontFamily
     */
    setGridFontFamily(valueNew: TcHmi.FontFamily | null): void;
    /**
     * Returns the current value of gridFontFamily.
     */
    getGridFontFamily(): string | null | undefined;
    /**
     * Sets the gridFontSize value.
     * @param valueNew The new value for gridFontSize
     */
    setGridFontSize(valueNew: number | null): void;
    /**
     * Returns the current value of gridFontSize.
     */
    getGridFontSize(): number | undefined;
    /**
     * Sets the gridFontSizeUnit value.
     * @param valueNew The new value for gridFontSizeUnit
     */
    setGridFontSizeUnit(valueNew: TcHmi.FontSizeUnit | null): void;
    /**
     * Returns the current value of gridFontSizeUnit.
     */
    getGridFontSizeUnit(): TcHmi.FontSizeUnit | undefined;
    /**
     * Sets the gridFontStyle value.
     * @param valueNew The new value for gridFontStyle
     */
    setGridFontStyle(valueNew: TcHmi.FontStyle | null): void;
    /**
     * Returns the current value of gridFontStyle.
     */
    getGridFontStyle(): TcHmi.FontStyle | undefined;
    /**
     * Sets the gridFontWeight value.
     * @param valueNew The new value for gridFontWeight
     */
    setGridFontWeight(valueNew: TcHmi.FontWeight | null): void;
    /**
     * Returns the current value of gridFontWeight.
     */
    getGridFontWeight(): TcHmi.FontWeight | undefined;
    /**
     * Sets the headerHeight value.
     * @param valueNew The new value for headerHeight
     */
    setHeaderHeight(valueNew: number | null): void;
    /**
     * Returns the current value of headerHeight.
     */
    getHeaderHeight(): number | undefined;
    /**
     * Sets the headerHeightUnit value.
     * @param valueNew The new value for headerHeightUnit
     */
    setHeaderHeightUnit(valueNew: TcHmi.DimensionUnit | null): void;
    /**
     * Returns the current value of headerHeightUnit.
     */
    getHeaderHeightUnit(): TcHmi.DimensionUnit | undefined;
    /**
     * Sets the rowHeight value.
     * @param valueNew The new value for rowHeight
     */
    setRowHeight(valueNew: number | null): void;
    /**
     * Returns the current value of rowHeight.
     */
    getRowHeight(): number | undefined;
    /**
     * Returns the current value of rowHeightUnit.
     */
    getRowHeightUnit(): string;
    /**
     * Sets the value of the member variable "cellContentPadding".
     * @param valueNew The new value for cellContentPadding.
     */
    setCellContentPadding(valueNew: TcHmi.FourSidedCss | null): void;
    /**
     * Returns the current value of the member variable cellContentPadding.
     * @returns the current value of the member variable cellContentPadding.
     */
    getCellContentPadding(): TcHmi.FourSidedCss | null | undefined;
    /**
     * Sets the background value.
     * @param valueNew The new value for the header background attribute as json string.
     */
    setHeaderBackgroundColor(valueNew: TcHmi.Color | null): void;
    /**
     * Returns the current header background value.
     * @returns The current value of the header background member variable as json in string format.
     */
    getHeaderBackgroundColor(): TcHmi.Color | null | undefined;
    /**
     * Sets the text color.
     * @param valueNew The new value for textFColor.
     */
    setHeaderTextColor(valueNew: TcHmi.SolidColor | null): void;
    /**
     * Returns the current value of headertextColor.
     * @returns The current value of headertextColor.
     */
    getHeaderTextColor(): TcHmi.SolidColor | null | undefined;
    /**
     * Sets the value of the member variable "headerCellPadding".
     * @param valueNew The new value for headerCellPadding.
     */
    setHeaderCellPadding(valueNew: TcHmi.FourSidedCss | null): void;
    /**
     * Returns the current value of the member variable headerCellPadding.
     * @returns the current value of the member variable headerCellPadding.
     */
    getHeaderCellPadding(): TcHmi.FourSidedCss | null | undefined;
    /**
     * Sets the value of the member variable "rowClassesProvider" order attribute.
     * @param value The new rowClassesProvider method.
     */
    setRowClassesProvider(valueNew: TcHmi.IFunction<string[]> | null): void;
    /**
     * Gets the current rowClassesProvider method.
     * @returns the current rowClassesProvider method.
     */
    getRowClassesProvider(): TcHmi.IFunction<string[]> | undefined;
    /**
     * Sets the row numbers background value.
     * @param valueNew The new value for the row numbers background attribute.
     */
    setRowNumbersBackgroundColor(valueNew: TcHmi.Color | null): void;
    /**
     * Returns the current row numbers background value.
     * @returns The current value of the row numbers background member variable.
     */
    getRowNumbersBackgroundColor(): TcHmi.Color | null | undefined;
    /**
     * Sets the value of the member variable "rowNumbersCellPadding" if the new value is not equal to the current value
     * and calls the associated process function (processRowNumbersCellPadding) after that.
     * @param valueNew The new value for rowNumbersCellPadding.
     */
    setRowNumbersCellPadding(valueNew: TcHmi.FourSidedCss | null): void;
    /**
     * Returns the current value of the member variable rowNumbersCellPadding.
     * @returns the current value of the member variable rowNumbersCellPadding.
     */
    getRowNumbersCellPadding(): TcHmi.FourSidedCss | null | undefined;
    /**
     * Sets the value of rowNumbersHorizontalAlignment
     * @param valueNew The new value for rowNumbersHorizontalAlignment
     */
    setRowNumbersHorizontalAlignment(valueNew: TcHmi.HorizontalAlignment | null): void;
    /**
     * Gets the value of rowNumbersHorizontalAlignment
     * @returns The current value of rowNumbersHorizontalAlignment
     */
    getRowNumbersHorizontalAlignment(): TcHmi.HorizontalAlignment | undefined;
    /**
     * Sets the value of rowNumbersVerticalAlignment
     * @param valueNew The new value for rowNumbersVerticalAlignment
     */
    setRowNumbersVerticalAlignment(valueNew: TcHmi.VerticalAlignment | null): void;
    /**
     * Gets the value of rowNumbersVerticalAlignment
     * @returns The current value of rowNumbersVerticalAlignment
     */
    getRowNumbersVerticalAlignment(): TcHmi.VerticalAlignment | undefined;
    /**
     * Sets the text color.
     * @param valueNew The new value for textFColor.
     */
    setRowNumbersTextColor(valueNew: TcHmi.SolidColor | null): void;
    /**
     * Returns the current value of rowNumberstextColor.
     * @returns the current value of rowNumberstextColor.
     */
    getRowNumbersTextColor(): TcHmi.SolidColor | null | undefined;
    /**
     * Sets the value of rowNumbersResizable
     * @param valueNew The new value for rowNumbersResizable
     */
    setRowNumbersResizable(valueNew: boolean | null): void;
    /**
     * Gets the value of rowNumbersResizable
     * @returns The current value of rowNumbersResizable
     */
    getRowNumbersResizable(): boolean | undefined;
    /**
     * Sets the value of rowNumbersStartNumber
     * @param valueNew The new value for rowNumbersStartNumber
     */
    setRowNumbersStartNumber(valueNew: number | null): void;
    /**
     * Gets the value of rowNumbersStartNumber
     * @returns The current value of rowNumbersStartNumber
     */
    getRowNumbersStartNumber(): number | undefined;
    /**
     * Sets the value of rowNumbersWidth
     * @param valueNew The new value for rowNumbersWidth
     */
    setRowNumbersWidth(valueNew: number | null): void;
    /**
     * Gets the value of rowNumbersWidth
     * @returns The current value of rowNumbersWidth
     */
    getRowNumbersWidth(): number | undefined;
    /**
     * Sets the value of rowNumbersWidthUnit
     * @param valueNew The new value for rowNumbersWidthUnit
     */
    setRowNumbersWidthUnit(valueNew: TcHmi.DimensionUnit | null): void;
    /**
     * Gets the value of rowNumbersWidthUnit
     * @returns The current value of rowNumbersWidthUnit
     */
    getRowNumbersWidthUnit(): TcHmi.DimensionUnit | undefined;
    /**
     * Sets the value of showRowNumbers
     * @param valueNew The new value for showRowNumbers
     */
    setShowRowNumbers(valueNew: boolean | null): void;
    /**
     * Gets the value of showRowNumbers
     * @returns The current value of showRowNumbers
     */
    getShowRowNumbers(): boolean | undefined;
    /**
     * Sets the table-border-color attribute value and calls the associated process function (processBorderColor).
     * @param valueNew The new attribute value.
     */
    setTableBorderColor(valueNew: TcHmi.SolidColor | null): void;
    /**
     * Returns the current table-border-color value.
     * @returns the current attribute value.
     */
    getTableBorderColor(): TcHmi.SolidColor | null | undefined;
    /**
     * Sets the Grid-width attribute value and calls the associated process function (processBorderWidth).
     * @param valueNew The new attribute value.
     */
    setTableBorderWidth(valueNew: number | null): void;
    /**
     * Returns the current table-border-width value.
     * @returns The current attribute value.
     */
    getTableBorderWidth(): number | undefined;
    /**
     * Internal reference to the attribute "data-tchmi-table-border-type".
     * @param valueNew The new BorderStyle of the table.
     */
    setTableBorderStyle(valueNew: TcHmi.BorderStyle | null): void;
    /**
     * Returns the current table-border-style value.
     * @returns The current attribute value.
     */
    getTableBorderStyle(): TcHmi.BorderStyle | null | undefined;
    /**
     * Sets the value of the member variable IgnoreEscapeSequences.
     * @param valueNew The new value for IgnoreEscapeSequences
     */
    setIgnoreEscapeSequences(valueNew: boolean | null | undefined): void;
    /**
     * Returns the current value of IgnoreEscapeSequences.
     * @returns The current value of IgnoreEscapeSequences.
     */
    getIgnoreEscapeSequences(): boolean | undefined;
    /**
     * Sets the allowDetailsPopup value and calls the associated process function.
     * @param valueNew The new value for allowDetailsPopup.
     */
    setAllowDetailsPopup(valueNew: boolean | null): void;
    /**
     * Returns the current value of allowDetailsPopup.
     */
    getAllowDetailsPopup(): boolean | undefined;
    /**
     * Processes the current allowDetailsPopup value.
     */
    protected __processAllowDetailsPopup(): void;
    /**
     * Sets the showMenuBar value and calls the associated process function.
     * @param valueNew The new value for showMenuBar.
     */
    setShowMenuBar(valueNew: boolean | null): void;
    /**
     * Returns the current value of showMenuBar.
     */
    getShowMenuBar(): boolean | undefined;
    /**
     * Processes the current showMenuBar value.
     */
    protected __processShowMenuBar(): void;
    /**
     * Sets the menuBarPosition value and calls the associated process function.
     * @param valueNew The new value for menuBarPosition.
     */
    setMenuBarPosition(valueNew: 'Top' | 'Bottom' | 'Left' | 'Right' | null): void;
    /**
     * Returns the current value of menuBarPosition.
     */
    getMenuBarPosition(): "Top" | "Bottom" | "Left" | "Right" | undefined;
    /**
     * Processes the current menuBarPosition value.
     */
    protected __processMenuBarPosition(): void;
    /**
     * Sets the buttonHeight value and calls the associated process function.
     * @param valueNew The new value for buttonHeight.
     */
    setButtonHeight(valueNew: number | null): void;
    /**
     * Returns the current value of buttonHeight.
     */
    getButtonHeight(): number | undefined;
    /**
     * Processes the current buttonHeight value.
     */
    protected __processButtonHeight(): void;
    /**
     * Returns the current value of buttonHeightUnit.
     */
    getButtonHeightUnit(): string;
    /**
     * Flexbox has a bug in all major browsers, where the width of a flexbox column does not grow when its child elements wrap. This method fixes that by setting min-width explicitly.
     */
    protected __fixVerticalMenuBarWidth(): void;
}
export interface AuditTrail {
    name: string;
}
export type ColumnData = 'contextDomain' | 'error::code' | 'error::reason' | 'id' | 'localizedText' | 'name' | 'newValue' | 'oldValue' | 'payload::name' | 'payload::domain' | 'payload::params::' | 'payload::severity' | 'payload::timeRaised' | 'processedEnd' | 'processedStart' | 'readValue' | 'serverUid' | 'sessionId' | 'symbolVersion' | 'timestamp' | 'type' | 'userName';
export interface Column {
    /** Background color of the cells in this column */
    cellBackground?: TcHmi.SolidColor | null;
    /** Text color of the cells in this column */
    textColor?: TcHmi.SolidColor | null;
    /** Data displayed in the column */
    columnData?: ColumnData | string;
    /** Custom Message displayed in the column */
    customMessage?: string;
    /** Name of the Label for this column */
    label?: string;
    /** Width for this column */
    width: number;
    /** Width unit for this column */
    widthUnit: TcHmi.Controls.Beckhoff.TcHmiDatagrid.DimensionUnitOrFactor;
    /** Can this column be resized? */
    resize?: boolean;
    /** Minimum width for this column */
    minWidth?: number;
    /** Minimum width unit for this column */
    minWidthUnit?: TcHmi.DimensionUnit;
    /** Horizontal alignment of this column */
    horizontalAlignment?: TcHmi.HorizontalAlignment;
    /** Vertical alignment of this column */
    verticalAlignment?: TcHmi.VerticalAlignment;
    /** A reference of function which is called with each entry */
    format?: TcHmi.IFunction;
    /**Horizontal alignment of this header */
    headerHorizontalAlignment?: TcHmi.HorizontalAlignment;
    /**Vertical alignment of this header */
    headerVerticalAlignment?: TcHmi.VerticalAlignment;
    /** When set to true a backslash in a text will be shown verbatim in the HMI. */
    ignoreEscapeSequences?: boolean;
}
export { TcHmiAuditTrailGrid as Control };
declare const _TcHmiAuditTrailGrid: typeof TcHmiAuditTrailGrid;
type tTcHmiAuditTrailGrid = TcHmiAuditTrailGrid;
type tAuditTrail = AuditTrail;
type tColumnData = ColumnData;
type tColumn = Column;
declare global {
    namespace TcHmi.Controls.Beckhoff.AuditTrailUtils {
        const TcHmiAuditTrailGrid: typeof _TcHmiAuditTrailGrid;
        type TcHmiAuditTrailGrid = tTcHmiAuditTrailGrid;
        namespace TcHmiAuditTrailGrid {
            type AuditTrail = tAuditTrail;
            type ColumnData = tColumnData;
            type Column = tColumn;
        }
    }
}
//# sourceMappingURL=TcHmiAuditTrailGrid.esm.d.ts.map