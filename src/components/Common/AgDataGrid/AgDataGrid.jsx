import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { any, array, bool, func, object, string } from 'prop-types';
import { AgDataGridServices } from './AgDataGrid.Services';
import {
  AllEnterpriseModule,
  LicenseManager,
  ModuleRegistry,
  themeBalham,
  colorSchemeLightCold,
  iconSetQuartzBold,
} from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllEnterpriseModule]);
LicenseManager.setLicenseKey('<your license key>');

const AgDataGrid = (props) => {
  const {
    fetching,
    showSideBar,
    columns,
    handleSave,
    synChanges,
    filterValues,
    handleHeaderFilter,
    inlineFilter,
    data,
    detailCellRendererParams,
    masterDetail,
    rowNodeId,
    rowModelType,
    validationRules,
    validateData,
    onRowClicked,
    onInitNewRow,
    rowKey,
    hideSaveButton,
    showHeaderPanel,
    enableRowSelection,
    showRemoveIcon,
    gridId,
    authUser,
    autoPersistState,
    exportServerSide,
    showUndoRedo,
    checkValid,
    permissions,
    enableImport,
    importAddRows,
    importComponent,
    isValid,
    hasValidChanges,
    progressPercent,
    gridTitle,
    showExportButton,
    customDeleteUnDelete,
    customExport,
    domLayout,
    onPullPackageCodeInLots,
    isRowSelectable,
    quickFilters,
    selectedTab,
    onFilterChange,
    className,
    editMode,
    hideGridTitle,
    canAddNewRow,
    settingGridComponent,
    tabs,
    titleData,
    saveIcon,
    saveButtonHidden,
    checkPhaseValid,
    countHit,
    onSelectionChanged,
    onTabChange,
    hideFloatFilter,
    onRowGroupOpened,
    hideActionColumn,
    detailCellRenderer,
    handlePackageInstruction,
    formik,
    changesKey,
    fetchEndPoint,
    footerPinnedColumns,
    report,
    onRequestClose,
    disableServerSideExport,
    validateAfterImport,
    onCopyLots,
    copyLotInfo,
    renderCustomAddComponent,
    renderCustomUpdateComponent,
    showCustomAddComponent,
    actionColumnWidth,
    hideheaderCheckbox,
    setSelected,
    getPinnedBottomDataValues,
    onEditButtonClick,
    onCustomDeleteButtonClick,
    paginationPageSize,
    cacheBlockSize,
    leftTitle,
    showEmailIconOnActionColumn,
    onEmailButtonClick,
  } = props;

  // State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowEditor, setRowEditor] = useState({
    isVisibleRowEditor: false,
    data: {},
    state: '',
  });
  const [isFilterLock, setIsFilterLock] = useState(false);
  const [initialColumns, setInitialColumns] = useState([]);

  // Refs
  const gridContainerRef = useRef();
  const gridRef = useRef();

  // gridChanges as ref (since it's not stateful for rendering)
  const gridChanges = useRef({
    add: [],
    update: [],
    remove: [],
    isValid: true,
    validationError: [],
    modifiedCells: [],
    undoStack: [],
    redoStack: [],
    masterDetailChanges: {
      add: [],
      update: [],
      remove: [],
      isValid: true,
      validationError: [],
      modifiedCells: [],
    },
  });

  // componentDidMount logic
  useEffect(() => {
    if (
      formik &&
      changesKey &&
      formik.values &&
      formik.values[changesKey] &&
      Object.prototype.hasOwnProperty.call(formik.values[changesKey], 'isValid')
    ) {
      gridChanges.current = formik.values[changesKey];
    }
    persistState();
    // eslint-disable-next-line
  }, []);

  // componentDidUpdate logic for columns
  useEffect(() => {
    const cloneColumns = Array.from(columns).map((c) => ({ ...c }));
    const cloneInitialColumns = Array.from(initialColumns).map((c) => ({
      ...c,
    }));
    if (JSON.stringify(cloneColumns) !== JSON.stringify(cloneInitialColumns)) {
      resetColumns();
    }
    // eslint-disable-next-line
  }, [columns]);

  // Example: persistState as a function
  const persistState = useCallback(async () => {
    if (autoPersistState && authUser) {
      const storageKey = `${authUser.id}_${gridId}`;
      const isSavedFilter = localStorage.getItem(`${storageKey}_saved`);
      const storage =
        JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
      const savedColumnState = storage && storage.columnState;
      if (
        isSavedFilter &&
        isSavedFilter === 'true' &&
        savedColumnState &&
        savedColumnState.length
      ) {
        const newColumns = [];
        savedColumnState.forEach((savedColumn) => {
          const column = columns.find(
            (col) => col.accessor === savedColumn.colId
          );
          if (column) {
            column.width = savedColumn.width;
            column.sort = savedColumn.sort;
            newColumns.push(column);
          }
        });
        columns.forEach((col) => {
          const column = newColumns.find(
            (newColumn) => col.accessor === newColumn.accessor
          );
          if (!column) {
            newColumns.push(column);
          }
        });
        const columnDefs = renderColumn(
          newColumns,
          props,
          gridRef && gridRef.current
        );
        setColumnDefs(columnDefs);
        setIsFilterLock(true);
        if (gridRef && gridRef.current && gridRef.current.api) {
          await setTimeout(
            () => gridRef.current.api.setColumnDefs(columnDefs),
            100
          );
        }
        resetColumns();
      } else {
        resetColumns();
      }
    }
  }, [autoPersistState, authUser, gridId, columns, props]);

  // resetColumns function
  const resetColumns = async (type) => {
    const {
      columns,
      authUser,
      autoPersistState,
      gridId,
      footerPinnedColumns,
      setSelected,
    } = props;
    const cloneColumns = Array.from(columns).map((c) => ({ ...c }));
    const cloneInitialColumns = Array.from(columns).map((c) => ({ ...c }));
    // if (!type) {
    const currentColumnDefs =
      (gridRef &&
        gridRef.current &&
        gridRef.current.api &&
        gridRef.current.api.getColumnDefs()) ||
      [];
    cloneColumns.forEach((column) => {
      const existingColumn = currentColumnDefs.find(
        (col) => col.colId === column.accessor
      );
      if (existingColumn) {
        column.width = type ? column.width : existingColumn.width;
        column.sort = type ? null : existingColumn.sort;
      }
    });
    // }
    const newColumnDefs = renderColumn(cloneColumns, props, gridRef.current);
    setColumnDefs(newColumnDefs);
    setInitialColumns(cloneInitialColumns);
    if (gridRef && gridRef.current && gridRef.current.api && authUser) {
      await gridRef.current.api.setColumnDefs(newColumnDefs);
      const storageKey = `${authUser.id}_${gridId}`;
      const isSavedFilter = localStorage.getItem(`${storageKey}_saved`);
      if (
        !(
          isSavedFilter &&
          isSavedFilter === 'true' &&
          autoPersistState &&
          authUser
        )
      ) {
        // const allColIds = this.gridRef.current.columnApi
        // 	.getAllColumns()
        // 	.filter(
        // 		(v) =>
        // 			v.colDef &&
        // 			v.colDef.cellEditorParams &&
        // 			!v.colDef.cellEditorParams.skipAutoResize
        // 	)
        // 	.map((column) => column.colId)
        // this.gridRef.current.columnApi.autoSizeColumns(allColIds)
      }
    }
    if (footerPinnedColumns) {
      updatePinnedBottomTotal();
    }

    if (setSelected) {
      setSelected(gridRef && gridRef.current);
    }
  };

  // handleDelete function
  const handleDelete = async (params, props) => {
    const { rowKey, rowModelType } = props;
    // if (params && params.data && params.data[rowKey || 'id']) {
    //   const response = await AgGridDeleteEditor(
    //     params.data[rowKey || 'id'],
    //     props
    //   );
    //   const gridApi =
    //     (gridRef && gridRef.current && gridRef.current.api) || null;
    //   if (
    //     gridApi &&
    //     response &&
    //     response.value &&
    //     rowModelType === 'serverSide'
    //   ) {
    //     gridApi.refreshServerSideStore();
    //   }
    // }
  };

  // actionCellRenderer function
  const actionCellRenderer = (
    params,
    permissions,
    gridChanges,
    props,
    gridType = 'main',
    gridRef
  ) => {
    const {
      checkValid,
      rowModelType,
      synChanges,
      renderCustomUpdateComponent,
      onEmailButtonClick,
      showEmailIconOnActionColumn,
    } = props;
    const { rowKey, editMode, onEditButtonClick, onCustomDeleteButtonClick } =
      props;
    const editingCells = params.api.getEditingCells();

    const isCurrentRowEditing = editingCells.some(
      (cell) => cell.rowIndex === params.node.rowIndex
    );

    let canRemove = permissions && permissions.remove;
    if (typeof canRemove === 'function') {
      canRemove = canRemove(params.data);
    }
    if (params.data && params.data.isNewRow) {
      canRemove = true;
    }
    const canEdit = () => {
      let edit = permissions && permissions.update;
      if (typeof edit === 'function') {
        edit = edit(params.data);
      }
      return edit;
    };

    if (isCurrentRowEditing) {
      return <></>;
    }

    const isDeleted =
      gridChanges &&
      gridChanges.remove.find((row) => row === params.data[rowKey]);
    return (
      <div className="action">
        <div>
          {renderCustomUpdateComponent && (
            <>
              <button
                type="button"
                className="edit"
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.stopPropagation();
                    if (onEditButtonClick) {
                      onEditButtonClick(params.data);
                    }
                    // this.setState({
                    // 	rowEditor: {
                    // 		isVisibleRowEditor: true,
                    // 		params,
                    // 		state: 'update',
                    // 	},
                    // })
                  };
                }}
                aria-label="edit"
              >
                <PencilEdit />
              </button>
              <button
                type="button"
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.stopPropagation();
                    if (onCustomDeleteButtonClick) {
                      onCustomDeleteButtonClick(params.data);
                    }
                  };
                }}
                aria-label="delete"
              >
                <Delete />
              </button>
            </>
          )}
          {!renderCustomUpdateComponent &&
            (synChanges || editMode === 'popup') &&
            canEdit() && (
              <button
                type="button"
                className="edit"
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.stopPropagation();
                    if (onEditButtonClick) {
                      onEditButtonClick(params.data);
                    }
                    setRowEditor({
                      isVisibleRowEditor: true,
                      params,
                      state: 'update',
                    });
                  };
                }}
                aria-label="edit"
              >
                <PencilEdit />
              </button>
            )}
          {!renderCustomUpdateComponent &&
            canRemove &&
            params.data &&
            !isDeleted && (
              <>
                {showEmailIconOnActionColumn && (
                  <button
                    type="button"
                    className="emailBtn"
                    aria-label="emailIcon"
                    ref={(ref) => {
                      if (!ref) return;
                      ref.onclick = (e) => {
                        e.stopPropagation();
                        if (onEmailButtonClick) {
                          onEmailButtonClick(params.data);
                        }
                      };
                    }}
                  >
                    <EmailIcon width="24" height="24" />
                  </button>
                )}

                <button
                  type="button"
                  ref={(ref) => {
                    if (!ref) return;
                    ref.onclick = (e) => {
                      e.stopPropagation();
                      if (
                        rowModelType === 'serverSide' ||
                        editMode === 'popup'
                      ) {
                        handleDelete(params, props);
                      } else {
                        removeRow(params.data, gridRef, props, gridType);
                        setTimeout(() => {
                          if (params.api && params.api.redrawRows) {
                            params.api.redrawRows();
                          }
                        }, 100);
                      }
                    };
                  }}
                  aria-label="delete"
                >
                  <Delete />
                </button>
              </>
            )}
          {canRemove && params.data && isDeleted && (
            <button
              type="button"
              onClick={() => {
                revertRemovedRow(
                  params.data,
                  gridRef,
                  gridChanges,
                  props,
                  gridType
                );
                setTimeout(() => {
                  if (params.api && params.api.redrawRows) {
                    params.api.redrawRows();
                  }
                  if (checkValid) checkValid();
                }, 100);
              }}
              aria-label="undo"
            >
              <Undo />
            </button>
          )}
          {params?.data?.activeStatus && (
            <span className="activeStatusIcon">A</span>
          )}
        </div>
      </div>
    );
  };

  const onBtExport = (gridApi) => {
    const {
      customExport,
      synChanges,
      fetchEndPoint,
      gridTitle,
      titleData,
      disableServerSideExport,
    } = props;
    if (synChanges && !disableServerSideExport) {
      const excelTitle = gridTitle || (titleData && titleData.name);
      agGridExportUtil(fetchEndPoint, gridApi, excelTitle);
    } else if (customExport) {
      customExport();
    } else {
      const allColIds = gridRef.current.columnApi
        .getAllDisplayedColumns()
        .filter((v) => v.colId !== 'action')
        .map((column) => column.colId);
      gridApi.exportDataAsExcel({ columnKeys: allColIds });
    }
  };

  const saveEditData = () => {
    const { handleSave } = props;
    const dataToSave = getEditedData();
    if (handleSave) handleSave(dataToSave);
    resetUpdatedData();
    // ReactTooltip.hide();
    return dataToSave;
  };

  const getEditedData = () => {
    const { rowKey, detailCellRendererParams } = props;
    const updatedData = JSON.parse(JSON.stringify(gridChanges.current));
    const dataToSave = {
      ...updatedData,
      add: updatedData.add.map((v) => {
        const temp = { ...v };
        delete temp[rowKey];
        delete temp.isNewRow;
        return temp;
      }),
      update: (updatedData.update || []).filter(
        (v) => !(updatedData.remove || []).includes(v[rowKey])
      ),
      remove: updatedData.remove,
      masterDetailChanges: detailCellRendererParams && {
        ...updatedData.masterDetailChanges,
        add: updatedData.masterDetailChanges.add.map((v) => {
          const temp = { ...v };
          delete temp[detailCellRendererParams.rowKey];
          delete temp.isNewRow;
          return temp;
        }),
        update: (updatedData.masterDetailChanges.update || []).filter(
          (v) =>
            !(updatedData.masterDetailChanges.remove || []).includes(
              v[detailCellRendererParams.rowKey]
            )
        ),
        remove: updatedData.masterDetailChanges.remove,
      },
    };
    if (!detailCellRendererParams) {
      delete dataToSave.masterDetailChanges;
    }
    return dataToSave;
  };

  const resetUpdatedData = () => {
    gridChanges.current = {
      add: [],
      update: [],
      remove: [],
      isValid: true,
      validationError: [],
      modifiedCells: [],
      undoStack: [],
      redoStack: [],
      masterDetailChanges: {
        add: [],
        update: [],
        remove: [],
        isValid: true,
        validationError: [],
        modifiedCells: [],
      },
    };
    setTimeout(async () => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        resetColumns();
        gridRef.current.api.refreshCells();
        gridRef.current.api.redrawRows();
      }
    }, 100);
  };

  const addNewRowMasterDetail = async (
    gridRef,
    validationRules = null,
    newRowData = null,
    isImported = false
  ) => {
    const detailGridRef = gridRef.api.getDetailGridInfo(gridRef.node.id);
    const { data } = gridRef;
    const { checkValid, detailCellRendererParams } = props;
    const { onInitNewRow, rowKey, detailGridTableName } =
      detailCellRendererParams;
    const newRow = newRowData || { isNewRow: true, [rowKey]: v4() };
    if (onInitNewRow) {
      onInitNewRow(
        getAllRows(detailGridRef.api),
        newRow,
        gridChanges.current.masterDetailChanges,
        gridRef.data
      );
    }
    const index = (newRowData && newRowData.index) || 0;
    detailGridRef.api.applyTransaction({
      addIndex: index,
      add: [newRow],
    });
    gridChanges.current.masterDetailChanges.add.push(newRow);
    if (data) {
      data[detailGridTableName].unshift(newRow);
    }
    if (validationRules) {
      validateRow(
        newRow,
        { validationRules, rowKey },
        gridChanges.current.masterDetailChanges
      );
      if (!isImported) {
        setTimeout(() => {
          detailGridRef.api.redrawRows();
          if (checkValid) {
            checkValid();
          }
        }, 100);
      }
    }
  };

  const addNewRow = async (
    gridApi,
    validationRules = null,
    newRowData = null,
    isImported = false
  ) => {
    const {
      onInitNewRow,
      rowKey,
      data,
      checkValid,
      rowModelType,
      editMode,
      canAddNewRow,
      formik,
      changesKey,
    } = props;

    if (canAddNewRow && !canAddNewRow()) {
      return;
    }

    if (rowModelType === 'serverSide' || editMode === 'popup') {
      setRowEditor({
        isVisibleRowEditor: true,
        params: gridApi,
        state: 'add',
      });
      return;
    }

    const newRow = newRowData || { isNewRow: true, [rowKey]: v4() };
    if (onInitNewRow) {
      onInitNewRow(getAllRows(gridApi), newRow, gridChanges.current);
    }
    const index = (newRowData && newRowData.index) || 0;
    gridApi.applyTransaction({
      addIndex: index,
      add: [newRow],
    });
    gridChanges.current.add.push(newRow);
    // this.gridChanges.undoStack.push({
    // 	type: 'add',
    // 	rowData: newRow,
    // })
    if (data) {
      data.unshift(newRow);
    }
    if (validationRules) {
      validateRow(newRow, props, gridChanges.current);
      if (!isImported) {
        setTimeout(() => {
          gridApi.redrawRows();
          if (checkValid) {
            checkValid();
          }
        }, 100);
      }
    }
    if (formik) {
      const { setFieldValue } = formik;
      setFieldValue(changesKey, gridChanges.current);
    }
  };

  const removeSelectedRow = (gridRef, props, gridType = 'main') => {
    const getSelectedRows = gridRef.api.getSelectedRows();
    const { checkValid } = props;
    const { permissions } = props;
    getSelectedRows.forEach((row) => {
      let canRemove = permissions && permissions.remove;
      if (typeof canRemove === 'function') {
        canRemove = canRemove({ row });
      }
      if (canRemove) {
        removeRow(row, gridRef, props, gridType);
      }
    });
    setTimeout(() => {
      gridRef.api.redrawRows();
      if (checkValid) {
        checkValid();
      }
    }, 100);
  };

  const removeRow = (row, gridRef, props, gridType) => {
    const { formik, changesKey } = props;
    let gridChanges;
    let data = [];
    let ref;
    if (gridType === 'masterDetail') {
      const { detailGridTableName } = props;
      data = gridRef.data[detailGridTableName];
      gridChanges = gridChanges.current.masterDetailChanges;
      ref = gridRef.api.getDetailGridInfo(gridRef.node.id);
    } else {
      data = (gridRef.props && gridRef.props.rowData) || [];
      // eslint-disable-next-line prefer-destructuring
      gridChanges = gridChanges.current;
      ref = gridRef;
    }
    const { checkValid, customDeleteUnDelete } = props;
    const { rowKey, afterNewRowDelete } = props;
    if (row.isNewRow) {
      // this.gridChanges.undoStack.push({
      // 	rowData: row,
      // 	type: 'delete',
      // })
      gridChanges.add.splice(
        gridChanges.add.findIndex((v) => v[rowKey] === row[rowKey]),
        1
      );
      ref.api.applyTransaction({ remove: [row] });
      if (data) {
        const rowIndex = (data || []).findIndex(
          (v) => v[rowKey] === row[rowKey]
        );
        if (rowIndex !== -1) {
          data.splice(rowIndex, 1);
        }
      }
      if (afterNewRowDelete) {
        afterNewRowDelete(row);
      }
    } else {
      const rowIndex = gridChanges.remove.findIndex((v) => v === row[rowKey]);
      if (rowIndex !== -1) {
        gridChanges.remove.splice(rowIndex, 1);
      }
      gridChanges.remove.push(row[rowKey]);
    }
    const rowIndex = gridChanges.validationError.findIndex(
      (v) => v.rowID === row[rowKey]
    );
    if (rowIndex !== -1) {
      gridChanges.validationError.splice(
        gridChanges.validationError.findIndex((v) => v.rowID === row[rowKey]),
        1
      );
    }
    if (customDeleteUnDelete) {
      customDeleteUnDelete(row, gridChanges);
    }
    gridChanges.isValid = !gridChanges.validationError.length;
    if (checkValid) {
      checkValid();
    }
    if (formik) {
      const { setFieldValue } = formik;
      setFieldValue(changesKey, gridChanges.current);
    }
  };

  const unDeleteSelectedRow = (gridApi, validationRules) => {
    const getSelectedRows = gridApi.getSelectedRows();
    const { checkValid } = props;
    getSelectedRows.forEach((row) => {
      revertRemovedRow(row, validationRules);
    });
    setTimeout(() => {
      gridApi.redrawRows();
      if (checkValid) {
        checkValid();
      }
    }, 100);
  };

  const revertRemovedRow = (row, gridRef, gridChanges, props) => {
    const { rowKey } = props;
    const { customDeleteUnDelete, formik, changesKey } = props;
    if (!row.isNewRow) {
      const rowIndex = gridChanges.remove.findIndex((v) => v === row[rowKey]);
      if (rowIndex !== -1) {
        gridChanges.remove.splice(rowIndex, 1);
      }
      delete row.isDeleted;
      validateRow(row, props, gridChanges);
      if (customDeleteUnDelete) {
        customDeleteUnDelete(row, gridChanges);
      }
      if (formik) {
        const { setFieldValue } = formik;
        setFieldValue(changesKey, gridChanges.current);
      }
    }
  };

  const getAllRows = (gridApi) => {
    const allRow = [];
    if (gridApi) {
      gridApi.forEachNode((node) => {
        allRow.push(node.data);
      });
    }

    return allRow;
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // ReactTooltip.hide();
  };

  const toggleToolPanel = (key) => {
    if (gridRef.current.api.isToolPanelShowing()) {
      gridRef.current.api.closeToolPanel();
    } else {
      gridRef.current.api.openToolPanel(key);
    }
  };

  const undo = (gridApi, validationRules) => {
    const { rowKey, checkValid } = props;
    const { undoStack } = gridChanges.current;
    if (undoStack && undoStack.length) {
      // Pop last element
      const change = undoStack.pop();
      gridChanges.current.redoStack.push(change);

      if (change.type === 'add') {
        const { rowData } = change;
        gridApi.applyTransaction({ remove: [rowData] });
      }

      if (change.type === 'undelete') {
        const { rowData } = change;
        if (rowData.isNewRow) {
          addNewRow(gridApi, validationRules, rowData);
        } else {
          const index = gridChanges.current.remove.findIndex(
            (x) => x === rowData[rowKey]
          );
          gridChanges.current.remove.splice(index, 1);
        }
      }
      if (change.type === 'update') {
        const { value, column, rowData } = change;
        const currentValue = rowData[column];
        rowData[column] = value;
        change.value = currentValue;
        // const updatedRowIndex = this.gridChanges.update.findIndex(
        // 	up => up[rowKey] === rowData[rowKey]
        // )
        // const modifiedCell = this.gridChanges.modifiedCells.filter(mf => mf[rowKey] === rowData[rowKey])
      }
      setTimeout(() => {
        gridApi.redrawRows();
        if (checkValid) {
          checkValid();
        }
      }, 100);
      // gridApi.undoCellEditing()
    }
  };

  const redo = (gridApi, validationRules) => {
    const { rowKey, checkValid } = props;
    const { redoStack } = gridChanges.current;
    if (redoStack && redoStack.length) {
      // Pop last element
      const change = redoStack.pop();
      gridChanges.current.undoStack.push(change);

      if (change.type === 'add') {
        const { rowData } = change;
        gridApi.applyTransaction({ remove: [rowData] });
      }

      if (change.type === 'delete') {
        const { rowData } = change;
        if (rowData.isNewRow) {
          addNewRow(gridApi, validationRules, rowData);
        } else {
          gridChanges.current.remove.push(rowData[rowKey]);
        }
      }
      if (change.type === 'update') {
        const { value, column, rowData } = change;
        const currentValue = rowData[column];
        rowData[column] = value;
        change.value = currentValue;
      }
      setTimeout(() => {
        gridApi.redrawRows();
        if (checkValid) {
          checkValid();
        }
      }, 100);
      // gridApi.undoCellEditing()
    }
  };

  const hasEditData = () => {
    if (
      gridChanges.current.add.length ||
      gridChanges.current.update.length ||
      gridChanges.current.remove.length ||
      gridChanges.current.masterDetailChanges.add.length ||
      gridChanges.current.masterDetailChanges.update.length ||
      gridChanges.current.masterDetailChanges.remove.length
    ) {
      return true;
    }
    return false;
  };

  const renderFilterComponent = (Filter) => {
    const { filterValues, handleHeaderFilter } = props;
    return (
      <Filter
        values={filterValues}
        setFieldValue={(key, value) => {
          handleHeaderFilter(key, value);
        }}
      />
    );
  };

  const renderSettingGridComponent = (SettingsGrid) => {
    const {
      titleData,
      tabs,
      selectedTab,
      saveIcon,
      saveButtonHidden,
      checkPhaseValid,
      onTabChange,
      countHit,
    } = props;
    return (
      <SettingsGrid
        titleData={titleData}
        tabs={tabs}
        selectedTab={selectedTab}
        saveIcon={saveIcon}
        saveButtonHidden={saveButtonHidden}
        checkPhaseValid={checkPhaseValid}
        onTabChange={onTabChange}
        countHit={countHit}
      />
    );
  };

  const handleImport = () => {
    const { showImportModal } = props;
    if (showImportModal && typeof showImportModal === 'function') {
      showImportModal(true);
    } else {
      setShowImportModal(true);
    }
  };

  const renderImportComponent = (ImportModal) => {
    const {
      columns,
      importAddRows,
      validationRules,
      checkValid,
      gridTitle,
      validateAfterImport,
    } = props;
    const { showImportModal } = { showImportModal };
    return (
      <ReactModal
        isOpen={showImportModal}
        onRequestClose={closeImportModal}
        className="componentDetailsModal importExcel"
        shouldCloseOnOverlayClick={false}
      >
        <ImportModal
          title={`Import ${gridTitle || ''}`}
          columns={columns}
          addRow={importAddRows}
          parentGridRef={this}
          closeModal={closeImportModal}
          validationRules={validationRules}
          checkValid={checkValid}
          validateAfterImport={validateAfterImport}
        />
      </ReactModal>
    );
  };

  const renderColumn = (columns = [], props, gridRef, gridType = 'main') => {
    const {
      detailCellRendererParams,
      synChanges,
      hideActionColumn,
      editMode,
      actionColumnWidth,
      hideheaderCheckbox,
    } = props;
    let { permissions, enableRowSelection, enableCheckboxSelection } = props;
    if (gridType === 'masterDetail') {
      permissions = detailCellRendererParams.permissions || {
        add: false,
        update: false,
        remove: false,
      };
      enableRowSelection = detailCellRendererParams.enableRowSelection || false;
      enableCheckboxSelection =
        detailCellRendererParams.enableCheckboxSelection || false;
    }

    let canAdd = permissions && permissions.add;
    if (typeof canAdd === 'function') {
      canAdd = canAdd(gridRef);
    }

    let canRemove = permissions && permissions.remove;
    if (typeof canRemove === 'function') {
      canRemove = canRemove({});
    }
    const isServerSide = (synChanges && true) || false;
    const columnsDefs = columns.map((column) =>
      // if (column.children) {
      // 	column.children = column.children.map(childColumn => {
      // 		return AgDataGridServices.renderColumnProperties(
      // 			childColumn,
      // 			gridType === 'masterDetail'
      // 				? detailCellRendererParams
      // 				: props,
      // 			gridType === 'masterDetail'
      // 				? this.gridChanges.masterDetailChanges
      // 				: this.gridChanges,
      // 			gridRef
      // 		)
      // 	})
      // }
      AgDataGridServices.renderColumnProperties(
        column,
        gridType === 'masterDetail' ? detailCellRendererParams : props,
        gridType === 'masterDetail'
          ? gridChanges.current.masterDetailChanges
          : gridChanges.current,
        gridRef,
        {
          canAdd,
          canRemove,
          isServerSide,
          gridType,
          removeRow: removeRow,
        }
      )
    );

    const columnsArray = columnsDefs;
    // if (columnStateInfo && columnStateInfo.length) {
    // 	columnStateInfo.forEach(col => {
    // 		const column = columnsDefs.find(cl => cl.field === col.colId)
    // 		if (column && col.colId !== 'action') {
    // 			column.width = col.width
    // 			column.flex = col.width ? false : 1
    // 			columnsArray.push(column)
    // 		}
    // 	})
    // }
    function AddComponent() {
      return React.createElement(() => (
        <span
          role="button"
          tabIndex="-1"
          onClickCapture={() => {
            addNewRowMasterDetail(
              gridRef,
              detailCellRendererParams.validationRules
            );
          }}
          className="ag-grid-custom-add-icon"
        >
          <Add />
        </span>
      ));
    }
    if (
      !hideActionColumn &&
      (canRemove ||
        ((isServerSide || editMode === 'popup') &&
          permissions &&
          permissions.update) ||
        (gridType === 'masterDetail' && (canAdd || canRemove)) ||
        enableCheckboxSelection)
    ) {
      const checkboxSelection =
        (enableRowSelection &&
          columnsArray &&
          columnsArray.length &&
          canRemove) ||
        enableCheckboxSelection;

      columnsArray.push({
        minWidth: actionColumnWidth || 70,
        width: actionColumnWidth || 30,
        cellRenderer: (params) =>
          actionCellRenderer(
            params,
            permissions,
            gridType === 'masterDetail'
              ? gridChanges.current.masterDetailChanges
              : gridChanges.current,
            gridType === 'masterDetail' ? detailCellRendererParams : props,
            gridType,
            gridRef
          ),
        editable: false,
        colId: 'action',
        // contentAlign: 'center',
        headerName: gridType === 'masterDetail' && canAdd ? '' : 'Action',
        headerComponent: gridType === 'masterDetail' && canAdd && AddComponent,
        cellClass: ['ag-grid-custom-style', 'center'],
        headerClass: ['ag-grid-custom-style', 'center'],
        pinned: 'left',
        filter: false,
        floatingFilter: false,
        suppressMenu: true,
        resizable: true,
        checkboxSelection,
        headerCheckboxSelection: checkboxSelection && !hideheaderCheckbox,
        headerCheckboxSelectionFilteredOnly: checkboxSelection,
        lockPosition: 'left',
      });
    }
    // if (
    // 	(enableRowSelection &&
    // 		columnsArray &&
    // 		columnsArray.length &&
    // 		canRemove) ||
    // 	enableCheckboxSelection
    // ) {
    // 	columnsArray[0].checkboxSelection = true
    // 	columnsArray[0].headerCheckboxSelection = true
    // 	columnsArray[0].headerCheckboxSelectionFilteredOnly = true
    // 	if (columnsArray[0].children && columnsArray[0].children.length) {
    // 		columnsArray[0].children[0].checkboxSelection = true
    // 		columnsArray[0].children[0].headerCheckboxSelection = true
    // 		columnsArray[0].children[0].headerCheckboxSelectionFilteredOnly = true
    // 		columnsArray[0].children[0].minWidth = 120
    // 	}
    // }
    return columnsArray;
  };

  // const validateData = async () => {
  // 	await AgDataGridServices.validateData(
  // 		props,
  // 		gridChanges.current,
  // 		gridRef && gridRef.current && gridRef.current.api
  // 	)
  // }

  const validateRow = (rowData, props, gridChanges) => {
    AgDataGridServices.validateRow(rowData, props, gridChanges);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
  };

  const renderQuickFilterTab = () => {
    const { quickFilters, selectedTab, onFilterChange } = props;
    let renderQuickFilters;
    if (quickFilters) {
      const filterTabs = quickFilters.map((tab, index) => (
        <button
          type="button"
          className={
            tab.key === selectedTab.key || tab.label === selectedTab.label
              ? 'phaseTab activeTab'
              : 'phaseTab'
          }
          onClick={() => onFilterChange(index, tab)}
          key={tab.key}
        >
          {tab.label}
        </button>
      ));

      renderQuickFilters = (
        <div className="formSectionFilterContainer">{filterTabs}</div>
      );
    }

    return renderQuickFilters;
  };

  const renderHeaderPanel = () => {
    const {
      validationRules,
      hideSaveButton,
      showRemoveIcon,
      showUndoRedo,
      permissions,
      enableImport,
      hasValidChanges,
      inlineFilter,
      gridTitle,
      showExportButton,
      showSideBar,
      onPullPackageCodeInLots,
      settingGridComponent,
      tabs,
      quickFilters,
      hideGridTitle,
      titleData,
      report,
      onCopyLots,
      copyLotInfo,
      renderCustomAddComponent,
      showCustomAddComponent,
      leftTitle,
    } = props;
    const { isFullScreen, selectedNode, isFilterLock } = { isFullScreen };
    const gridApi = (gridRef && gridRef.current && gridRef.current.api) || {};

    let canRemove = permissions && permissions.remove;
    if (typeof canRemove === 'function') {
      canRemove = canRemove({});
    }

    return (
      <div className="gridHeaderPanel">
        <div className="left">
          {!hideGridTitle && (gridTitle || titleData) && (
            <div className="gridTitle">
              {gridTitle || (titleData && titleData.name)}
            </div>
          )}
          {leftTitle && leftTitle.customFields && (
            <div className="page-info">{leftTitle.customFields}</div>
          )}
        </div>
        <div className={`${isFullScreen || ''} middle`}>
          {inlineFilter && renderFilterComponent(inlineFilter)}
          {tabs && renderSettingGridComponent(settingGridComponent)}
          {quickFilters && renderQuickFilterTab()}
        </div>
        <div className="gridHeaderPanelAction">
          {titleData && titleData.customFields && (
            <div className="page-info" style={{ marginRight: '1rem' }}>
              {titleData.customFields}
            </div>
          )}
          {false && !hideSaveButton && (
            <button
              type="button"
              onClick={saveEditData}
              className={!hasValidChanges ? 'disable' : ''}
              disabled={!hasValidChanges}
              data-tip="Save"
              data-for="toolTipHeaderPanel"
            >
              {/* <SaveIcon /> */}
            </button>
          )}
          {permissions && permissions.add && gridApi.applyTransaction && (
            <button
              type="button"
              title="Add"
              onClick={() => {
                addNewRow(gridApi, validationRules);
              }}
              data-tip="Add"
              data-for="toolTipHeaderPanel"
              aria-label="Add"
            >
              <Add />
            </button>
          )}
          {renderCustomAddComponent && (
            <button
              type="button"
              title="Add"
              onClick={() => {
                // this.addNewRow(gridApi, validationRules);
                showCustomAddComponent();
              }}
              data-tip="Add"
              data-for="toolTipHeaderPanel"
              aria-label="Add"
            >
              <Add />
            </button>
          )}
          {showRemoveIcon && canRemove && (
            <>
              <button
                type="button"
                onClick={() => {
                  removeSelectedRow(gridRef.current, props);
                }}
                disabled={!selectedNode.length}
                data-tip="Delete"
                data-for="toolTipHeaderPanel"
                aria-label="Delete"
              >
                {/* <Delete /> */}
              </button>
              {/* <button
									type="button"
									onClick={() => {
										this.unDeleteSelectedRow(
											gridApi,
											validationRules
										)
									}}
									disabled={!selectedNode.length}
									data-tip="Un Delete"
									data-for="toolTipHeaderPanel"
								>
									<DeleteUndo />
								</button> */}
            </>
          )}
          {report && (
            <button
              type="button"
              title="Report"
              onClick={() => report()}
              data-tip="Report"
              data-for="toolTipHeaderPanel"
              className="Report"
            >
              {/* <ReportPDF /> */}
            </button>
          )}
          {/* {showExportButton && (
            <button
              type="button"
              title="Download"
              onClick={() => this.onBtExport(this.gridRef.current.api)}
              data-tip="Export"
              data-for="toolTipHeaderPanel"
              className="export"
            >
              <DownloadIcon />
            </button>
          )} */}
          {enableImport && (
            <button type="button" onClick={() => handleImport()}>
              <Upload />
            </button>
          )}
          {/* {showSideBar && (
						<button
							type="button"
							title="Column Chooser"
							onClick={() => this.toggleToolPanel('columns')}
							data-tip="Side Panel"
							data-for="toolTipHeaderPanel"
						>
							<ColumnChooser />
						</button>
					)} */}
          {/* <button
						type="button"
						title="Lock Filter"
						className={`filterLock ${isFilterLock ? 'active' : ''}`}
						onClick={() => this.saveFilterGrid()}
						data-tip="Lock Filter"
						data-for="toolTipHeaderPanel"
					>
						<FilterClear />
					</button> */}

          <button
            type="button"
            title="Clear Filter"
            onClick={() => resetGrid(gridRef.current.api)}
            data-tip="Reset Filter"
            data-for="toolTipHeaderPanel"
            className={`reset ${isFilterLock ? 'active' : ''}`}
          >
            <Clear />
          </button>
          <button
            title="Maximize"
            type="button"
            onClick={() => toggleFullScreen()}
            data-tip="Fullscreen"
            data-for="toolTipHeaderPanel"
            className="maximize"
          >
            {isFullScreen ? <Compress /> : <Expand />}
          </button>
        </div>
        <ReactTooltip place="top" id="toolTipHeaderPanel" />
      </div>
    );
  };

  const saveFilterGrid = () => {
    const { gridId, authUser } = props;
    const { isFilterLock } = { isFilterLock };
    if (authUser && gridId) {
      const storageKey = `${authUser.id}_${gridId}_saved`;
      localStorage.setItem(storageKey, true);
      if (isFilterLock) {
        setIsFilterLock(false);
        localStorage.removeItem(storageKey);
      } else {
        setIsFilterLock(true);
        localStorage.setItem(storageKey, true);
      }
    }
  };

  const onSaveGridColumnState = (params) => {
    const { columnApi } = params;
    // if (type === 'columnResized' && source === 'flex') {
    // 	return
    // }
    saveGridState('columnState', columnApi?.getColumnState());
    saveGridState('columnGroupState', columnApi?.getColumnGroupState());
  };

  const onFilterChanged = (params) => {
    const filterModel = params.api.getFilterModel();
    saveGridState('filterModel', filterModel);
  };

  const saveGridState = (key, value) => {
    const { gridId, authUser, autoPersistState } = props;
    if (autoPersistState && authUser) {
      // const storageKey = `${window.location.pathname}_${authUser.id}_${gridId}`
      const storageKey = `${authUser.id}_${gridId}`;
      const isStorageKeyPresent = localStorage.getItem(storageKey);
      const storage = JSON.parse(isStorageKeyPresent || '{}') || {};
      storage[key] = value;
      localStorage.setItem(storageKey, JSON.stringify(storage));
    }
    // if (key === 'columnState') {
    // 	this.setState({ columnStateInfo: value })
    // }
  };

  const onFirstDataRendered = () => {
    resetColumns();
    // const { columnApi, api } = params
    // const { gridId, authUser, autoPersistState } = this.props
    // const { columns } = this.props
    // this.setState({
    // 	columnDefs: this.renderColumn(
    // 		columns || [],
    // 		this.props,
    // 		this.gridRef.current
    // 	),
    // })
    // if (autoPersistState && authUser) {
    // 	// const storageKey = `${window.location.pathname}_${authUser.id}_${gridId}`
    // 	const storageKey = `${authUser.id}_${gridId}`
    // 	const storage =
    // 		JSON.parse(localStorage.getItem(storageKey) || '{}') || {}
    // 	if (storage && storage.columnState) {
    // 		columnApi.applyColumnState({
    // 			state: storage.columnState,
    // 			applyOrder: true,
    // 		})
    // 	}
    // 	if (storage && storage.filterModel) {
    // 		api.setFilterModel(storage.filterModel)
    // 	}
    // }
  };

  const resetGrid = async (gridApi) => {
    const { autoPersistState, authUser, gridId } = props;
    if (gridApi) {
      const { columnModel } = gridApi;
      const { columnApi } = columnModel;
      setTimeout(async () => {
        gridApi.setFilterModel(null);
        if (autoPersistState && authUser) {
          // const storageKey = `${window.location.pathname}_${authUser.id}_${gridId}`
          const storageKey = `${authUser.id}_${gridId}`;
          localStorage.removeItem(`${storageKey}_saved`);
        }
        // columnApi.resetColumnState();
        resetColumns({});
      }, 100);
    }
    setIsFilterLock(false);
    // setTimeout(async () => {
    // 	this.resetColumns({})
    // }, 1000)
    // this.gridApi.setFilterModel(null)
    // this.gridColumnApi.resetColumnState()
  };

  const refreshRowData = () => {
    const { data } = props;
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(data || []);
    }
  };

  const onSelectionChanged1 = (params) => {
    const { api } = params;
    const { onSelectionChanged } = props;
    const selectedRows = (api && api.getSelectedNodes()) || [];
    setSelectedNode(selectedRows.map((v) => v.id));
    if (onSelectionChanged) onSelectionChanged(selectedRows);
  };

  const onRequestClose1 = () => {
    const { onRequestClose } = props;
    setRowEditor({
      isVisibleRowEditor: false,
      params: {},
      state: '',
    });
    const gridApi = (gridRef && gridRef.current && gridRef.current.api) || null;
    // if (gridApi) {
    //   gridApi.refreshServerSideStore();
    // }
    if (onRequestClose) {
      onRequestClose();
    }
  };

  const renderFloatingFilterIcon = () => `<span>
		        	 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		             	<path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/>
		        	 </svg>
		    	</span>`;

  const updatePinnedBottomTotal = () => {
    const { footerPinnedColumns, getPinnedBottomDataValues } = props;
    if (
      footerPinnedColumns &&
      gridRef &&
      gridRef.current &&
      gridRef.current.api
    ) {
      const pinnedBottomData = AgDataGridServices.generatePinnedBottomData(
        gridRef.current,
        footerPinnedColumns
      );
      gridRef.current.api.setPinnedBottomRowData([pinnedBottomData]);

      if (getPinnedBottomDataValues) {
        getPinnedBottomDataValues(pinnedBottomData);
      }
    }
  };

  const darkMode = localStorage.getItem('darkMode') === 'true';
  console.log(columnDefs);
  const gridOptions = {
    // columnDefs: this.renderColumn(
    // 	columns || [],
    // 	this.props,
    // 	this.gridChanges,
    // 	this.gridRef
    // ),
    columnDefs,
    defaultColDef: AgDataGridServices.defaultColDef,
    rowData: data,
    rowModelType,
    serverSideStoreType: 'partial',
    paginationPageSize: paginationPageSize || '50',
    cacheBlockSize: cacheBlockSize || '50',
    maxConcurrentDatasourceRequests: -1,
    blockLoadDebounceMillis: 1000,
    hideOverlay: true,
    onGridReady: (params) =>
      AgDataGridServices.onGridReady(params, props, gridChanges.current),
    enableRangeSelection: true,
    enableFillHandle: true,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: true,
    // enableCellChangeFlash: true,
    sideBar: showSideBar && {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
          },
        },
        // {
        //   id: 'filters',
        //   labelDefault: 'Filters',
        //   labelKey: 'filters',
        //   iconKey: 'filter',
        //   toolPanel: 'agFiltersToolPanel',
        // },
      ],
      hiddenByDefault: false,
    },
    masterDetail,
    rowSelection: 'multiple',
    columnTypes: AgDataGridServices.columnType,
    // detailCellRenderer: detailCellRenderer || MasterDetailRenderer,
    detailCellRendererParams: (gridRef) => {
      const res = {};
      res.detailGridOptions = {
        columnDefs: renderColumn(
          detailCellRendererParams.getColumns(gridRef, props),
          props,
          gridRef,
          'masterDetail'
        ),
        defaultColDef: AgDataGridServices.defaultColDef,
        columnTypes: AgDataGridServices.columnType,
        onCellValueChanged: (params) =>
          AgDataGridServices.onCellValueChanged(
            params,
            detailCellRendererParams,
            gridChanges.current.masterDetailChanges
          ),
        rowClassRules: AgDataGridServices.setRowClassRules(
          detailCellRendererParams,
          gridChanges.current.masterDetailChanges
        ),
        components: { agDateInput: CustomDateComponent },
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        getRowId: (row) =>
          AgDataGridServices.getRowNodeId(
            row,
            detailCellRendererParams.rowKey || 'id'
          ),
        isRowSelectable: detailCellRendererParams.isRowSelectable
          ? (params) =>
              detailCellRendererParams.isRowSelectable(params, gridRef)
          : undefined,
        onSelectionChanged: detailCellRendererParams.onSelectionChanged
          ? (params) =>
              detailCellRendererParams.onSelectionChanged(params, gridRef)
          : undefined,
        onFirstDataRendered: (params) => {
          if (detailCellRendererParams.setSelected) {
            detailCellRendererParams.setSelected(params, gridRef);
          }
        },
        icons: { filter: renderFloatingFilterIcon() },
        detailGridTableName: detailCellRendererParams.detailGridTableName,
        handlePackageInstruction,
        rowHeight: 30,
        headerHeight: 30,
      };
      res.getDetailRowData = async (params) => {
        const getFilterRows = detailCellRendererParams.filterRows;
        await params.successCallback(
          getFilterRows
            ? getFilterRows(
                params.data[detailCellRendererParams.detailGridTableName],
                params
              )
            : params.data[detailCellRendererParams.detailGridTableName]
        );
      };

      res.refreshStrategy = 'rows';
      return res;
    },
    onCellValueChanged: (params) => {
      AgDataGridServices.onCellValueChanged(params, props, gridChanges.current);
      updatePinnedBottomTotal();
    },
    detailRowAutoHeight: true,
    getRowId: (row) => AgDataGridServices.getRowNodeId(row, rowKey),
    rowClassRules: AgDataGridServices.setRowClassRules(
      props,
      gridChanges.current
    ),
    suppressRowClickSelection: true,
    onColumnMoved: onSaveGridColumnState,
    onRowClicked,
    onColumnVisible: onSaveGridColumnState,
    onColumnPinned: onSaveGridColumnState,
    onColumnResized: onSaveGridColumnState,
    onColumnRowGroupChanged: onSaveGridColumnState,
    maintainColumnOrder: true,
    onFirstDataRendered: onFirstDataRendered,
    onFilterChanged: onFilterChanged,
    onSortChanged: onSaveGridColumnState,
    pivotPanelShow: false,
    // suppressClipboardPaste: true,
    onCellEditingStarted: (params) => {
      if (params.data && params.data.isDeleted) {
        params.api.stopEditing();
      }
    },
    // suppressKeyboardEvent: AgDataGridServices.suppressEnter,
    processCellForClipboard: AgDataGridServices.processCellForClipboard,
    processCellFromClipboard: AgDataGridServices.processCellFromClipboard,
    onSelectionChanged: (params) => onSelectionChanged1(params),
    // components: { agDateInput: CustomDateComponent },
    domLayout,
    isRowSelectable,
    keepDetailRows: true,
    icons: { filter: renderFloatingFilterIcon() },
    onRowGroupOpened,
    defaultExcelExportParams: {
      fileName: `${
        (gridTitle && gridTitle.split(' ').join('')) || 'export'
      }.xlsx`,
      sheetName: `${gridTitle || 'Sheet1'}`,
      processCellCallback: (params) => {
        const { column, node } = params;
        const { cellEditorParams, valueGetter } = column.colDef;
        if (cellEditorParams) {
          const { cell, cellProps, dynamicProps } = cellEditorParams;
          const evaluatedProps =
            cell || cellProps || (dynamicProps && dynamicProps(node)) || {};
          const {
            type,
            isMulti,
            labelKey,
            options,
            valueKey,
            defaultTextValue,
          } = evaluatedProps;
          if (valueGetter === undefined) {
            if (type === 'hidden') {
              return '';
            }
            if (['dataGridDropDown', 'select'].includes(type)) {
              if (isMulti) {
                return (
                  params.value &&
                  params.value.length &&
                  params.value.map((v) => v[labelKey]).join(', ')
                );
              }
              const selectedOption =
                (options || []).find(
                  // eslint-disable-next-line eq==eq
                  (v) => v[valueKey] == params.value
                ) || null;
              return (
                (selectedOption && selectedOption[labelKey]) || params.value
              );
            }
            if (type === 'date') {
              return (
                (params.value &&
                  new Date(params.value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })) ||
                null
              );
            }
            if (type === 'switch') {
              return (params.value && true) || false;
            }
            if (type === 'defaultText') {
              return defaultTextValue || params.value;
            }
          }
        }
        return params.value;
      },
    },
    onModelUpdated: () => {
      updatePinnedBottomTotal();
    },
    rowHeight: 38,
    headerHeight: 38,
    alwaysShowHorizontalScroll: true,
    floatingFiltersHeight: 30,
    overlayNoRowsTemplate:
      '<span style="padding: 10px; display: inline-block; font-family: Poppins;">No Data </span>',
  };

  return (
    <div style={{ height: 500 }}>
      <div
        className={`${
          isFullScreen
            ? `${
                darkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
              } agGrid agGrid-fullscreen`
            : `${darkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'} agGrid `
        }`}
        style={{ width: '100%', height: '100%' }}
        ref={gridContainerRef}
      >
        {showHeaderPanel && renderHeaderPanel()}
        <AgGridReact className={className} ref={gridRef} {...gridOptions} />
        {fetching && (
          <Loader />
          // <div className="loading">
          // 	<span className="sync">
          // 		<Sync width="50" height="50" />
          // 	</span>
          // 	{progressPercent ? (
          // 		<span className="percentage">
          // 			{progressPercent} %
          // 		</span>
          // 	) : (
          // 		''
          // 	)}
          // </div>
        )}
        {showImportModal && renderImportComponent(importComponent)}
        {rowEditor && rowEditor.isVisibleRowEditor && (
          <AgGridEditor
            params={rowEditor.params}
            onRequestClose={onRequestClose1}
            gridProps={props}
            state={rowEditor.state}
          />
        )}
        {/* <ReactTooltip
        place="bottom"
        id="cellError"
        className="gridToolTipMessage"
      />
      <ReactTooltip
        place="bottom"
        id="cellWarning"
        className="gridToolTipMessage"
      /> */}
      </div>
    </div>
  );
};

AgDataGrid.propTypes = {
  fetching: bool,
  showSideBar: bool,
  columns: array,
  handleSave: func,
  synChanges: func,
  filterValues: any,
  handleHeaderFilter: func,
  inlineFilter: any,
  data: any,
  detailCellRendererParams: any,
  masterDetail: bool,
  rowNodeId: string,
  rowModelType: string,
  validationRules: any,
  validateData: array,
  onRowClicked: func,
  onInitNewRow: func,
  rowKey: string,
  hideSaveButton: bool,
  showHeaderPanel: bool,
  enableRowSelection: bool,
  showRemoveIcon: bool,
  gridId: string,
  authUser: any,
  autoPersistState: bool,
  exportServerSide: func,
  showUndoRedo: bool,
  checkValid: func,
  permissions: object,
  enableImport: bool,
  importAddRows: func,
  importComponent: any,
  isValid: bool,
  hasValidChanges: bool,
  progressPercent: any,
  gridTitle: any,
  showExportButton: bool,
  customDeleteUnDelete: func,
  customExport: func,
  domLayout: string,
  onPullPackageCodeInLots: func,
  isRowSelectable: func,
  quickFilters: array,
  selectedTab: any,
  onFilterChange: func,
  className: string,
  editMode: any,
  hideGridTitle: bool,
  canAddNewRow: func,
  settingGridComponent: any,
  tabs: any,
  titleData: any,
  saveIcon: any,
  saveButtonHidden: any,
  checkPhaseValid: any,
  countHit: any,
  onSelectionChanged: func,
  onTabChange: func,
  hideFloatFilter: bool,
  onRowGroupOpened: func,
  hideActionColumn: bool,
  detailCellRenderer: any,
  handlePackageInstruction: func,
  formik: any,
  changesKey: string,
  fetchEndPoint: string,
  footerPinnedColumns: any,
  report: func,
  onRequestClose: func,
  disableServerSideExport: any,
  validateAfterImport: func,
  onCopyLots: any,
  copyLotInfo: any,
  renderCustomAddComponent: bool,
  renderCustomUpdateComponent: bool,
  showCustomAddComponent: func,
  actionColumnWidth: any,
  hideheaderCheckbox: bool,
  setSelected: func,
  getPinnedBottomDataValues: func,
  onEditButtonClick: func,
  onCustomDeleteButtonClick: func,
  paginationPageSize: any,
  cacheBlockSize: any,
  leftTitle: any,
  showEmailIconOnActionColumn: bool,
  onEmailButtonClick: func,
};

AgDataGrid.defaultProps = {
  showSideBar: false,
  rowKey: 'id',
  hideSaveButton: false,
  showHeaderPanel: true,
  enableRowSelection: false,
  showRemoveIcon: false,
  gridId: 'grid',
  autoPersistState: false,
  showUndoRedo: true,
  enableImport: false,
  isValid: true,
  showExportButton: true,
  hideFloatFilter: false,
  hideActionColumn: false,
  renderCustomAddComponent: false,
  renderCustomUpdateComponent: false,
  hideheaderCheckbox: false,
  showEmailIconOnActionColumn: false,
};

export default AgDataGrid;
