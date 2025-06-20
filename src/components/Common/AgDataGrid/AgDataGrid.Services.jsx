import CellViewRenderer from './CellRenderers/CellViewRenderer';
import CellEditRenderer from './CellRenderers/CellEditRenderer';
import { selectDotNotation } from '../Utils/CommonUtils';

export const AgDataGridServices = {
  columnType: {
    numberColumn: { width: 100, filter: 'agNumberColumnFilter' },
    stringColumn: { width: 100, filter: 'agTextColumnFilter' },
    boolean: { width: 100, filter: true },
    nonEditableColumn: { editable: false },
    dateColumn: {
      // specify we want to use the date filter
      filter: 'agDateColumnFilter',
      // add extra parameters for the date filter
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          const dateParts = cellValue.slice(0, 10).split('-');
          const day = Number(dateParts[2]);
          const month = Number(dateParts[1]) - 1;
          const year = Number(dateParts[0]);
          const cellDate = new Date(year, month, day);
          // Now that both parameters are Date objects, we can compare
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
  },

  defaultColDef: {
    width: 100,
    flex: 1,
    minWidth: 100,
    // filter: 'agTextColumnFilter',
    filter: 'agMultiColumnFilter',
    filterParams: {
      suppressAndOrCondition: true,
      newRowsAction: 'keep',
    },
    floatingFilter: true,
    floatingFilterComponentParams: {
      // suppressFilterButton: true,
    },
    sortable: true,
    menuTabs: ['filterMenuTab'],
    // wrapText: true,     // <-- HERE
    // autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  },

  onGridReady: async (params, props) => {
    const { synChanges } = props;
    const { autoPersistState, authUser, gridId } = props;
    if (autoPersistState && authUser) {
      // const storageKey = `${window.location.pathname}_${authUser.id}_${gridId}`
      const storageKey = `${authUser.id}_${gridId}`;
      const storage =
        JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
      const isSavedFilter = localStorage.getItem(`${storageKey}_saved`);
      // if (
      // 	isSavedFilter &&
      // 	isSavedFilter === 'true' &&
      // 	storage &&
      // 	storage.filterModel
      // ) {
      // 	params.api.setFilterModel(storage.filterModel)
      // 	// eslint-disable-next-line no-restricted-syntax, guard-for-in
      // 	// for (const index in Object.keys(storage.filterModel)) {
      // 	// 	const key = Object.keys(storage.filterModel)[index]
      // 	// 	const instance = params.api.getFilterInstance(key)
      // 	// 	if (instance) {
      // 	// 		// eslint-disable-next-line no-await-in-loop
      // 	// 		await instance.setModel(storage.filterModel[key])
      // 	// 		// eslint-disable-next-line no-await-in-loop
      // 	// 		await instance.applyModel()
      // 	// 	}
      // 	// 	params.api.setFilterModel(storage.filterModel)
      // 	// }
      // 	params.api.onFilterChanged()
      // }
      if (
        isSavedFilter &&
        isSavedFilter === 'true' &&
        storage &&
        storage.columnState
      ) {
        params.columnApi.applyColumnState({
          state: storage.columnState,
          applyOrder: true,
        });
        if (storage.filterModel) {
          params.api.setFilterModel(storage.filterModel);
          Object.keys(storage.filterModel).forEach((key) => {
            params.api.getFilterInstance(key, (instance) => {
              if (instance) {
                instance.setModel(storage.filterModel[key]);
                instance.applyModel();
              }
            });
          });
        }
        params.api.onFilterChanged();
      } else {
        // const allColIds = params.columnApi
        //   .getAllColumns()
        //   .filter(
        //     (v) =>
        //       v.colDef &&
        //       v.colDef.cellEditorParams &&
        //       !v.colDef.cellEditorParams.skipAutoResize
        //   )
        //   .map((column) => column.colId);
        // params.columnApi.autoSizeColumns(allColIds);
      }
    }
    if (synChanges) {
      const data = synChanges();
      params.api.setServerSideDatasource(data);
    }
  },

  generatePinnedBottomData: (params, footerPinnedColumns) => {
    // generate a row-data with null values
    const result = {};
    if (params && params.columnApi) {
      params.columnApi.getAllGridColumns().forEach((item) => {
        const columns =
          (footerPinnedColumns && footerPinnedColumns.fields) || [];
        if (columns.includes(item.colId)) {
          result[item.colId] = null;
        }
      });
      return AgDataGridServices.calculatePinnedBottomData(
        result,
        params,
        footerPinnedColumns
      );
    }
    return result;
  },

  calculatePinnedBottomData: (target, params, footerPinnedColumns) => {
    // list of columns fo aggregation
    const columns = (footerPinnedColumns && footerPinnedColumns.fields) || [];
    const captionColumn =
      (footerPinnedColumns && footerPinnedColumns.captionColumn) || '';
    columns.forEach((element) => {
      const elementKey = element.split('.');
      const nestedKey = elementKey && elementKey.length === 2;
      if (nestedKey) {
        if (!target[elementKey[0]]) {
          target[elementKey[0]] = {
            [elementKey[1]]: 0,
          };
          target[element] = 0;
        } else {
          target[elementKey[0]][elementKey[1]] = 0;
          target[element] = 0;
        }
      } else {
        target[element] = 0;
      }
      params.api.forEachNodeAfterFilter((rowNode) => {
        let value = nestedKey
          ? selectDotNotation(rowNode.data, element)
          : rowNode.data[element];
        if (
          Object.prototype.hasOwnProperty.call(rowNode.data, 'canceled') &&
          rowNode.data.canceled
        ) {
          value = null;
        }

        if (
          // eslint-disable-next-line no-prototype-builtins
          target.hasOwnProperty(element) &&
          element !== captionColumn
        ) {
          if (nestedKey) {
            target[elementKey[0]][elementKey[1]] += Number(value) || 0;
            target[elementKey[0]][elementKey[1]] =
              (target[elementKey[0]][elementKey[1]] &&
                Math.round(target[elementKey[0]][elementKey[1]] * 10000) /
                  10000) ||
              0;
            target[element] += Number(value) || 0;
          } else {
            target[element] += Number(value) || 0;
          }
          target[element] =
            (target[element] && Math.round(target[element] * 10000) / 10000) ||
            0;
        } else if (element === captionColumn) {
          target[element] = 'Total';
        } else {
          target[element] = '';
        }
      });
    });
    return target;
  },

  getRowStyle: (params, props, gridChanges) => {
    const { rowKey } = props;
    if (params && params.data) {
      const isModified = gridChanges.update.find(
        (row) => row[rowKey] === params.data[rowKey]
      );
      const isInvalidRow = gridChanges.validationError.find(
        (row) => row.rowID === params.data[rowKey]
      );
      if (isInvalidRow) {
        // return 'invalid-row'
        return {
          backgroundColor: 'lightcoral',
          color: 'white',
        };
      }
      if (isModified) {
        // return 'modified-row'
        return { backgroundColor: 'yellow' };
      }
      // return 'valid-row'
      return { backgroundColor: 'transparent' };
    }
    return { backgroundColor: 'transparent' };
    // return 'valid-row'
  },
  setRowClassRules: (props, gridChanges) => ({
    'new-row': (params) => {
      const { rowKey } = props;
      if (params && params.data && gridChanges) {
        const isNewRow = gridChanges.add.find(
          (row) => row[rowKey] === params.data[rowKey]
        );
        return isNewRow;
      }
      if (params && params.data && params.data.isNewRow) {
        return true;
      }
      return false;
    },
    'invalid-row': (params) => {
      const { rowKey } = props;
      if (params && params.data && gridChanges) {
        const isInvalidRow = gridChanges.validationError.find(
          (row) => row.rowID === params.data[rowKey]
        );
        return isInvalidRow;
      }
      return false;
    },
    'modified-row': (params) => {
      const { rowKey } = props;
      if (params && params.data && gridChanges) {
        const isModified = gridChanges.update.find(
          (row) => row[rowKey] === params.data[rowKey]
        );
        const isInvalidRow = gridChanges.validationError.find(
          (row) => row.rowID === params.data[rowKey]
        );
        return !isInvalidRow && isModified;
      }
      return false;
    },
    'deleted-row': (params) => {
      const { rowKey } = props;
      if (params && params.data && gridChanges) {
        const isDeleted = gridChanges.remove.find(
          (v) => v === params.data[rowKey]
        );
        return isDeleted;
      }
      return false;
    },
    'canceled-row': (params) => {
      const { rowKey, canceledRowStyleKey } = props;
      if (canceledRowStyleKey) {
        return (
          canceledRowStyleKey &&
          params &&
          params.data &&
          params.data[canceledRowStyleKey]
        );
      }
      if (params && params.data && gridChanges) {
        const isCanceled = params.data.canceled;
        const isDeleted = gridChanges.remove.find(
          (v) => v === params.data[rowKey]
        );
        return !isDeleted && isCanceled;
      }
      return false;
    },
    'delete-canceled-row': (params) => {
      const { rowKey } = props;
      if (params && params.data && gridChanges) {
        const isCanceled = params.data.canceled;
        const isDeleted = gridChanges.remove.find(
          (v) => v === params.data[rowKey]
        );
        return isDeleted && isCanceled;
      }
      return false;
    },
    addRow: (params) => {
      const { addRowStyleKey } = props;
      return (
        addRowStyleKey && params && params.data && params.data[addRowStyleKey]
      );
    },
    updatedRow: (params) => {
      const { updatedRowStyleKey } = props;
      return (
        updatedRowStyleKey &&
        params &&
        params.data &&
        params.data[updatedRowStyleKey]
      );
    },
    removedRow: (params) => {
      const { removedRowStyleKey } = props;
      return (
        removedRowStyleKey &&
        params &&
        params.data &&
        params.data[removedRowStyleKey]
      );
    },
  }),

  validateRow: async (rowData, props, gridChanges) => {
    const { validationRules, rowKey } = props;
    if (validationRules) {
      await validationRules
        .validate(rowData, { abortEarly: false })
        .then(() => {
          const errorRowIndex = gridChanges.validationError.findIndex(
            (row) => row.rowID === rowData[rowKey]
          );
          if (errorRowIndex > -1) {
            gridChanges.validationError.splice(errorRowIndex, 1);
          }
        })
        .catch((error) => {
          gridChanges.isValid = false;
          const errorRowIndex = gridChanges.validationError.findIndex(
            (row) => row.rowID === rowData[rowKey]
          );
          if (errorRowIndex > -1) {
            gridChanges.validationError[errorRowIndex].messages =
              error.inner.map((inner) => ({
                column: inner.path,
                message: inner.message,
              }));
            gridChanges.validationError[errorRowIndex].column = error.inner.map(
              (inner) => inner.path
            );
          } else {
            gridChanges.validationError.push({
              rowID: rowData[rowKey],
              column: error.inner.map((inner) => inner.path),
              messages: error.inner.map((inner) => ({
                column: inner.path,
                message: inner.message,
              })),
              data: rowData,
            });
          }
        });
    }
    gridChanges.isValid = !gridChanges.validationError.length;
  },

  onCellValueChanged: async (params, props, gridChanges) => {
    const {
      rowKey,
      validationRules,
      checkValid,
      handleErrorInfo,
      formik,
      changesKey,
    } = props;
    if (params.newValue === params.oldValue) {
      if (validationRules) {
        await AgDataGridServices.validateRow(params.data, props, gridChanges);
      }
      const cell = params.api.getFocusedCell();
      params.api.refreshCells({
        force: true,
        columns: [params.column.getId()],
        rowNodes: [params.node],
      });
      params.api.redrawRows({ rowNodes: [params.node] });
      if (cell) {
        params.api.setFocusedCell(cell.rowIndex, cell.column);
        if (cell.column.colId !== params.column.colId) {
          params.api.startEditingCell({
            rowIndex: cell.rowIndex,
            colKey: cell.column,
          });
        }
      }
      if (checkValid) {
        checkValid();
      }
      return;
    }
    const { colDef, data } = params;
    const { cellEditorParams, field } = colDef;
    if (params.data.isNewRow) {
      gridChanges.add.splice(
        gridChanges.add.findIndex((v) => v[rowKey] === params.data[rowKey]),
        1,
        params.data
      );
    } else {
      const rowIndex = gridChanges.update.findIndex(
        (v) => v[rowKey] === params.data[rowKey]
      );
      if (rowIndex !== -1) {
        gridChanges.update.splice(
          gridChanges.update.findIndex(
            (v) => v[rowKey] === params.data[rowKey]
          ),
          1,
          params.data
        );
      } else {
        gridChanges.update.push(params.data);
      }
    }
    // Set other properties of grid
    const isAlreadyModified = gridChanges.modifiedCells.find(
      (mf) =>
        mf[rowKey] === params.data[rowKey] && mf.column === params.column.colId
    );
    if (!isAlreadyModified) {
      gridChanges.modifiedCells.push({
        [rowKey]: params.data[rowKey],
        column: params.column.colId,
        oldValue: params.oldValue,
        value: params.value,
      });
    } else {
      isAlreadyModified.value = params.value;
    }
    // gridChanges.undoStack.push({
    // 	rowID: params.data[rowKey],
    // 	column: params.column.colId,
    // 	value: params.oldValue,
    // 	rowData: params.data,
    // 	type: 'update',
    // })
    // Validation Check
    if (validationRules) {
      await AgDataGridServices.validateRow(params.data, props, gridChanges);
    }
    if (cellEditorParams && cellEditorParams.customValidation) {
      const errorMessage = cellEditorParams.customValidation(
        params,
        gridChanges
      );
      if (errorMessage) {
        gridChanges.isValid = false;
        const errorRowID = gridChanges.validationError.find(
          (row) => row.rowID === data[rowKey]
        );
        if (!errorRowID) {
          gridChanges.validationError.push({
            rowID: data[rowKey],
            column: [field],
            messages: [
              {
                column: field,
                message: errorMessage,
              },
            ],
            data,
          });
        } else {
          errorRowID.column = [...errorRowID.column, field];
          errorRowID.messages = [
            ...errorRowID.messages,
            {
              column: field,
              message: errorMessage,
            },
          ];
        }
      }
    }
    if (handleErrorInfo) {
      handleErrorInfo(params);
    }
    AgDataGridServices.validateErrorInfo(params.data, gridChanges, rowKey);
    const cell = params.api.getFocusedCell();
    params.api.refreshCells({
      force: true,
      columns: [params.column.getId()],
      rowNodes: [params.node],
    });
    params.api.redrawRows({ rowNodes: [params.node] });
    if (cell) {
      params.api.setFocusedCell(cell.rowIndex, cell.column);
      if (cell.column.colId !== params.column.colId) {
        params.api.startEditingCell({
          rowIndex: cell.rowIndex,
          colKey: cell.column,
        });
      }
    }
    if (checkValid) {
      checkValid();
    }
    if (formik) {
      const { setFieldValue } = formik;
      setFieldValue(changesKey, gridChanges);
    }
  },

  renderColumnProperties: (
    column,
    props,
    gridChanges,
    gridRef,
    columnProperty
  ) => {
    if (!column) return null;
    const {
      permissions,
      getFilterValues,
      editMode,
      hideFloatFilter,
      disableGrid,
      data,
    } = props;
    const {
      editable,
      cell,
      cellProps,
      cellRendererType,
      valueSetter,
      onCellValueChanged,
      valueGetter,
      pinned,
      hideInTable,
      suppressColumnsToolPanel,
      cellRenderer,
      warningCellStyle,
      suppressSelectAll,
      children,
      filter,
      changeCellStyle,
      filterValueFormatter,
      hideSetFilter,
      hideFilter,
      sortable,
      suppressMenu,
      columnFilter,
      suppressStickyLabel,
      openByDefault,
      columnGroupShow,
      cellStyle,
      flex,
      // rowSpan,
      // rowGroup,
    } = column || {};

    let showFloatingFilter = !hideFloatFilter;
    if (filter === false) {
      showFloatingFilter = false;
    }

    // if (data && data.length < 5) {
    // 	showFloatingFilter = false
    // }

    const { synChanges } = props;
    const properties = cell || cellProps;
    const type = properties && properties.type;
    const fieldType = properties && properties.fieldType;
    let cellType = '';
    /* DevEx expects one of the following possible values
	   for the DataType prop:
	   string, number, date, boolean, object, datetime
	 */
    switch (fieldType || type) {
      case 'switch':
        cellType = 'boolean';
        break;
      case 'fixedPoint':
      case 'currency':
      case 'unformatednumber':
      case 'number':
        cellType = 'numberColumn';
        break;
      case 'date':
        cellType = 'dateColumn';
        break;
      case 'text':
        cellType = 'stringColumn';
        break;
      default:
        cellType = 'stringColumn';
        break;
    }

    const cellClassArr = ['ag-grid-custom-style'];
    if (column.className) cellClassArr.push(column.className);
    if (column.contentAlign) cellClassArr.push(column.contentAlign);

    const filters = [];
    let filterType = 'agTextColumnFilter';
    let defaultOption = 'contains';
    if (cellType === 'numberColumn') {
      filterType = 'agNumberColumnFilter';
      defaultOption = 'equals';
    }
    if (cellType === 'stringColumn') {
      filterType = 'agTextColumnFilter';
    }
    if (cellType === 'dateColumn') {
      filterType = 'agDateColumnFilter';
      defaultOption = 'equals';
    }

    if (columnFilter && columnFilter === 'agNumberColumnFilter') {
      filterType = 'agNumberColumnFilter';
      defaultOption = 'equals';
    }

    if (cellType !== 'boolean') {
      const filterParams = {
        excelMode: 'windows',
        defaultOption,
        buttons: ['apply', 'reset'],
      };
      if (cellType === 'dateColumn') {
        filterParams.comparator =
          AgDataGridServices.columnType.dateColumn.filterParams.comparator;
      }
      if (filterType === 'agTextColumnFilter' && !valueGetter && !synChanges) {
        filterParams.textMatcher = (params) => {
          const { value, filterText } = params;
          const evaluatedProps =
            cell ||
            cellProps ||
            (column.dynamicProps && column.dynamicProps(params.node)) ||
            {};

          const {
            isMulti,
            labelKey,
            options,
            valueKey,
            inputLabelKey,
            valueCellKey,
            defaultTextValue,
          } = evaluatedProps;
          const filterTextLowerCase = filterText.toLowerCase();
          let valueLowerCase = selectDotNotation(
            params.data,
            params.colDef.field
          );
          if (type === 'hidden') {
            return false;
          }
          if (['dataGridDropDown', 'select'].includes(evaluatedProps.type)) {
            if (isMulti) {
              valueLowerCase =
                valueLowerCase &&
                valueLowerCase.length &&
                valueLowerCase.map((o) => o[labelKey]).join(', ');
            } else {
              const selectedOption = (options || []).find(
                // eslint-disable-next-line eqeqeq
                (o) =>
                  (o[valueCellKey || valueKey] &&
                    o[valueCellKey || valueKey].toString().toLowerCase()) ===
                  (value && value.toLowerCase())
              );
              valueLowerCase =
                selectedOption && selectedOption[inputLabelKey || labelKey];
            }
          }
          if (evaluatedProps.type === 'defaultText') {
            valueLowerCase = defaultTextValue;
          }
          valueLowerCase =
            (valueLowerCase && valueLowerCase.toString().toLowerCase()) || '';
          switch (params.filterOption) {
            case 'contains':
              return (
                valueLowerCase &&
                valueLowerCase.indexOf(filterTextLowerCase) >= 0
              );
            case 'notContains':
              return (
                valueLowerCase &&
                valueLowerCase.indexOf(filterTextLowerCase) === -1
              );
            case 'equals':
              return valueLowerCase === filterTextLowerCase;
            case 'notEqual':
              return valueLowerCase !== filterTextLowerCase;
            case 'startsWith':
              return (
                valueLowerCase &&
                valueLowerCase.indexOf(filterTextLowerCase) === 0
              );
            case 'endsWith': {
              const index =
                valueLowerCase &&
                valueLowerCase.lastIndexOf(filterTextLowerCase);
              return (
                index >= 0 &&
                index ===
                  (valueLowerCase && valueLowerCase.length) -
                    (filterTextLowerCase && filterTextLowerCase.length)
              );
            }
            default:
              return (
                valueLowerCase &&
                valueLowerCase.indexOf(filterTextLowerCase) >= 0
              );
          }
        };
      }
      if (hideSetFilter !== false) {
        filters.push({
          filter: filterType,
          filterParams,
        });
      }
    }

    if (cellType !== 'dateColumn') {
      filters.push({
        filter: 'agSetColumnFilter',
        filterParams: {
          defaultToNothingSelected: true,
          refreshValuesOnOpen: true,
          suppressSelectAll,
          valueFormatter:
            filterValueFormatter ||
            ((params) => {
              const { value } = params;
              if (cellType === 'boolean') {
                if (['1', 1, 'true', true].includes(value)) {
                  return 'True';
                }
                if (['0', 0, 'false', false].includes(value)) {
                  return 'False';
                }
              }
              return value;
            }),
          values:
            (synChanges &&
              (async (params) => {
                if (
                  cellType === 'stringColumn' ||
                  cellType === 'numberColumn'
                ) {
                  const values = await getFilterValues(params);
                  params.success(values || []);
                }
                if (cellType === 'boolean') {
                  const values = [1, 0, null, ''];
                  params.success(values || []);
                }
              })) ||
            undefined,
        },
      });
    }

    const getTextWidth = (text, font) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = font || window.getComputedStyle(document.body).font;
      return context.measureText(text).width;
    };

    const textWidth = getTextWidth(column.Header, 'Lato');

    const columnData = {
      headerName: column.Header,
      field: column.accessor,
      width: column.width || Math.ceil(textWidth) + 70,
      sortable,
      sort: column.sort,
      resizable: true,
      // floatingFilter: false,
      type: cellType && [cellType],
      suppressMenu,
      // rowSpan: rowSpan || null,
      // rowGroup,
      keyCreator:
        (!valueGetter &&
          !synChanges &&
          ((params) => {
            const { value } = params;
            const evaluatedProps =
              cell ||
              cellProps ||
              (column.dynamicProps && column.dynamicProps(params.node)) ||
              {};

            const {
              isMulti,
              labelKey,
              options,
              valueKey,
              inputLabelKey,
              valueCellKey,
              defaultTextValue,
            } = evaluatedProps;
            if (evaluatedProps.type === 'hidden') {
              return '';
            }
            if (['dataGridDropDown', 'select'].includes(evaluatedProps.type)) {
              if (isMulti) {
                return (
                  value &&
                  value.length &&
                  value.map((o) => o[labelKey]).join(', ')
                );
              }
              const selectedOption = (options || []).find(
                // eslint-disable-next-line eqeqeq
                (o) => o[valueCellKey || valueKey] == value
              );
              return (
                selectedOption && selectedOption[inputLabelKey || labelKey]
              );
            }
            if (evaluatedProps.type === 'defaultText') {
              return defaultTextValue;
            }
            return value;
          })) ||
        undefined,
      comparator:
        (!valueGetter &&
          !synChanges &&
          ((valueA, valueB, nodeA, nodeB) => {
            if (!nodeA || !nodeB) {
              // eslint-disable-next-line eqeqeq
              if (valueA == valueB) return 0;
              return valueA > valueB ? 1 : -1;
            }
            let a = valueA;
            let b = valueB;
            const evaluatedPropsA =
              cell ||
              cellProps ||
              (column.dynamicProps && column.dynamicProps(nodeA)) ||
              {};

            const evaluatedPropsB =
              cell ||
              cellProps ||
              (column.dynamicProps && column.dynamicProps(nodeB)) ||
              {};

            const { isMulti, labelKey, valueKey } = evaluatedPropsA;
            if (['dataGridDropDown', 'select'].includes(evaluatedPropsA.type)) {
              if (isMulti) {
                a = a && a.length && a.map((o) => o[labelKey]).join(', ');

                b = b && b.length && b.map((o) => o[labelKey]).join(', ');
              } else {
                const selectedOptionA = (evaluatedPropsA.options || []).find(
                  // eslint-disable-next-line eqeqeq
                  (o) => o[valueKey] == a
                );
                a = selectedOptionA && selectedOptionA[labelKey];
                const selectedOptionB = (evaluatedPropsB.options || []).find(
                  // eslint-disable-next-line eqeqeq
                  (o) => o[valueKey] == b
                );
                b = selectedOptionB && selectedOptionB[labelKey];
              }
            }
            // eslint-disable-next-line eqeqeq
            if (a == b) return 0;
            return a > b ? 1 : -1;
          })) ||
        undefined,
      editable: (params) => {
        if (editMode && editMode === 'popup') {
          return false;
        }
        if (disableGrid) {
          return false;
        }
        if (params && params.node && params.node.rowPinned === 'bottom') {
          return false;
        }
        // check if row deleted then disable edit
        const isDeleted = (gridChanges.remove || []).includes(
          params.data[props.rowKey]
        );
        if (isDeleted) {
          return false;
        }
        let canUpdate = permissions && permissions.update;
        if (params && params.data && params.data.isNewRow) {
          if (editable !== undefined) {
            canUpdate = editable;
          } else {
            canUpdate = true;
          }
        }
        if (typeof canUpdate === 'function' && !canUpdate(params)) {
          return false;
        }

        if (!canUpdate) {
          return canUpdate;
        }

        if (editable !== undefined) {
          canUpdate = editable;
        }
        if (typeof canUpdate === 'function') {
          return canUpdate(params);
        }

        return canUpdate;
      },
      hide: hideInTable,
      suppressColumnsToolPanel,
      filter: !hideFilter && 'agMultiColumnFilter',
      floatingFilter: showFloatingFilter,
      // filter: 'agTextColumnFilter',
      filterParams: {
        filters,
      },
      minWidth: column.minWidth,
      cellEditorParams: column,
      valueSetter,
      onCellValueChanged,
      // children: column.children,
      valueGetter,
      // flex: column.width ? false : 1,
      flex,
      pinned,
      cellClass: cellClassArr,
      headerClass: ['ag-grid-custom-style center'],
      cellClassRules: {
        'invalid-cell': (params) => {
          const { rowKey } = props;
          if (params.colDef && gridChanges) {
            const validatedRow = gridChanges.validationError.find(
              // eslint-disable-next-line eqeqeq
              (row) => row.rowID == params.node[rowKey]
            );
            const validatedRowMessage =
              validatedRow &&
              validatedRow.messages.find(
                (message) => message.column === params.colDef.field
              );
            if (validatedRowMessage) {
              return true;
            }
          }
          return false;
        },
        'modified-cell': (params) => {
          const { rowKey } = props;
          if (params.colDef && gridChanges) {
            const validatedRow = gridChanges.validationError.find(
              // eslint-disable-next-line eqeqeq
              (row) => row.rowID === params.data[rowKey]
            );
            const updatedCell = gridChanges.modifiedCells.find(
              (modifiedRow) =>
                modifiedRow[rowKey] === params.data[rowKey] &&
                modifiedRow.column === params.colDef.field
            );
            const validatedRowMessage =
              validatedRow &&
              validatedRow.messages.find(
                (message) => message.column === params.colDef.field
              );
            if (!validatedRowMessage && updatedCell) {
              return true;
            }
          }
          return false;
        },
        'warning-cell': warningCellStyle,
        'change-cell': changeCellStyle,
      },
      suppressKeyboardEvent: (params) => {
        const { colDef } = params;
        const { cellEditorParams } = colDef;
        const { dynamicProps } = cellEditorParams || {};
        const evaluatedProps =
          cell || cellProps || (dynamicProps && dynamicProps(params));
        // return true (to suppress) if editing and user hit up/down keys
        const { key } = params.event;
        const gridShouldDoNothing =
          params.editing &&
          key === 'Enter' &&
          ['select', 'creatable'].includes(evaluatedProps.type);
        return gridShouldDoNothing;
      },
      suppressStickyLabel,
      openByDefault,
      columnGroupShow,
      cellStyle,
    };
    if (column.headerGroupComponent) {
      columnData.headerGroupComponent = column.headerGroupComponent;
    }
    // CellViewRenderer.defaultProps = {
    // 	gridChanges,
    // 	gridRef,
    // }
    columnData.cellRendererParams = {
      gridChanges,
      gridRef,
      props,
      columnProperty,
    };
    // if (['date', 'select', 'switch'].includes(fieldType || type)) {
    columnData.cellRenderer = cellRenderer || CellViewRenderer;
    columnData.cellEditor = CellEditRenderer;
    // }
    // if (['stringColumn', 'numberColumn', 'boolean'].includes(cellType)) {
    // 	columnData.cellEditorPopup = false
    // } else {
    // 	columnData.cellEditorPopup = true
    // }
    columnData.cellEditorPopup = false;

    if (cellRendererType) {
      columnData.cellRenderer = cellRendererType;
    }

    // if (column.width) {
    // 	columnData.suppressSizeToFit = true
    // }

    if (children) {
      columnData.children = children.map((col) =>
        AgDataGridServices.renderColumnProperties(
          col,
          props,
          gridChanges,
          gridRef,
          columnProperty
        )
      );
    }

    // return column
    return columnData;
  },

  getRowNodeId: (row, key) => (key ? row.data[key] : row.data.id),

  validateData: async (props, gridChanges, gridApi) => {
    const { validationRules, validateData, detailCellRendererParams, rowKey } =
      props;
    let validateRules = validationRules;
    if (typeof validationRules === 'function') {
      validateRules = validateRules(props);
    }
    if (validateData && validationRules) {
      for (let i = 0; i < validateData.length; i++) {
        const rowData = validateData[i];
        // eslint-disable-next-line no-await-in-loop
        await validateRules
          .validate(rowData, { abortEarly: false })
          .then(() => {
            const errorRowID = gridChanges.validationError.findIndex(
              (row) => row.rowID === rowData[rowKey]
            );
            if (errorRowID > -1) {
              gridChanges.validationError.splice(errorRowID, 1);
            }
            gridChanges.isValid = !gridChanges.validationError.length;
          })
          .catch((error) => {
            gridChanges.isValid = false;
            const errorRowID = gridChanges.validationError.find(
              (row) => row.rowID === rowData[rowKey]
            );
            if (!errorRowID) {
              gridChanges.validationError.push({
                rowID: rowData[rowKey],
                column: error.inner.map((inner) => inner.path),
                messages: error.inner.map((inner) => ({
                  column: inner.path,
                  message: inner.message,
                })),
                data: rowData,
              });
            }
          });
        AgDataGridServices.validateErrorInfo(rowData, gridChanges, rowKey);
      }
    }
    if (detailCellRendererParams) {
      (detailCellRendererParams.validateData || []).forEach((rowData) => {
        detailCellRendererParams.validationRules
          .validate(rowData, { abortEarly: false })
          .then(() => {
            //	console.log('jmj')
          })
          .catch((error) => {
            gridChanges.isValid = false;
            const errorRowID = gridChanges.validationError.find(
              (row) => row.rowID === rowData[rowKey]
            );
            if (!errorRowID) {
              gridChanges.validationError.push({
                rowID: rowData[rowKey],
                column: error.inner.map((inner) => inner.path),
                messages: error.inner.map((inner) => ({
                  column: inner.path,
                  message: inner.message,
                })),
                data: rowData,
              });
            }
          });
      });
    }
    if (gridApi) {
      setTimeout(() => {
        gridApi.refreshCells({ force: true });
        gridApi.redrawRows();
        // if (this.detailGridApi) {
        // 	this.detailGridApi.refreshCells({ force: true })
        // 	this.detailGridApi.redrawRows()
        // }
      }, 100);
    }
  },

  getCellProps: (params) => {
    const { colDef } = params;
    const { cell, cellProps, dynamicProps } = colDef;
    const evaluatedProps =
      dynamicProps !== undefined ? dynamicProps(params) : cell || cellProps;

    return evaluatedProps;
  },

  suppressEnter: (params) => {
    const KEY_ENTER = 'Enter';
    const { event } = params;
    const { key } = event;
    const suppress = key === KEY_ENTER;
    return suppress;
  },

  onRowEditingStarted: (params) => {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    });
  },

  onRowEditingStopped: (params) => {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    });
  },

  onCellClicked: (params) => {
    // Handle click event for action cells
    if (
      params.column.colId === 'action' &&
      params.event.target.dataset.action
    ) {
      const { action } = params.event.target.dataset;

      if (action === 'edit') {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        });
      }

      if (action === 'delete') {
        params.api.applyTransaction({
          remove: [params.node.data],
        });
      }

      if (action === 'update') {
        params.api.stopEditing(false);
      }

      if (action === 'cancel') {
        params.api.stopEditing(true);
      }
    }
  },
  processCellForClipboard: (params) => {
    const {
      value,
      column: { colDef },
      node,
    } = params;
    const { cellEditorParams } = colDef;
    const { cell, cellProps, dynamicProps } = cellEditorParams;
    const evaluatedProps =
      cell || cellProps || (dynamicProps && dynamicProps(node));
    const { type, options, valueKey, labelKey } = evaluatedProps;
    if (['select', 'dataGridDropDown'].includes(type) && options) {
      const option = options.find((v) => v[valueKey] === value);
      if (option) {
        return option[labelKey];
      }
    }
    return params.value;
  },
  processCellFromClipboard: (params) => {
    const {
      value,
      column: { colDef },
      node,
    } = params;
    const { cellEditorParams } = colDef;
    const { cell, cellProps, dynamicProps, customPaste } = cellEditorParams;
    const evaluatedProps =
      cell || cellProps || (dynamicProps && dynamicProps(node));
    const { type, options, valueKey, labelKey, maxLength } = evaluatedProps;
    if (customPaste) {
      return customPaste(params);
    }
    if (['select', 'dataGridDropDown'].includes(type) && options) {
      const option = options.find((v) => v[labelKey] === value);
      if (option) {
        return option[valueKey];
      }
      return null;
    }
    if (type === 'switch') {
      if (['true', 'TRUE', '1', 1].includes(value)) {
        return true;
      }
      return false;
    }
    if (type === 'percent') {
      return params.value / 100;
    }
    if (type === 'number') {
      const val = parseFloat(params.value);
      if (Number.isNaN(val)) {
        return null;
      }
      if (maxLength) {
        const maxValue = params.value.split('').splice(0, maxLength).join('');
        return parseFloat(maxValue) || null;
      }
      return val;
    }
    if (type === 'currency') {
      const currency = params.value.replace(/[$ a-zA-Z]/g, '');
      return (currency && parseFloat(currency)) || null;
    }
    return params.value || null;
  },
  validateErrorInfo: (rowData, gridChanges, rowKey) => {
    if (Object.prototype.hasOwnProperty.call(rowData, 'errorInfo')) {
      const errorInfo = JSON.parse(rowData.errorInfo || '{}');
      if (Object.keys(errorInfo).length) {
        gridChanges.isValid = false;
        const errorRowID = gridChanges.validationError.find(
          (row) => row.rowID === rowData[rowKey]
        );
        if (!errorRowID) {
          gridChanges.validationError.push({
            rowID: rowData[rowKey],
            column: Object.keys(errorInfo).map((key) => key),
            messages: Object.keys(errorInfo).map((key) => ({
              column: key,
              message: errorInfo[key],
            })),
            data: rowData,
          });
        } else {
          errorRowID.column = [
            ...errorRowID.column,
            ...Object.keys(errorInfo).map((key) => key),
          ];
          errorRowID.messages = [
            ...errorRowID.messages,
            ...Object.keys(errorInfo).map((key) => ({
              column: key,
              message: errorInfo[key],
            })),
          ];
        }
      }
    }
  },
};
