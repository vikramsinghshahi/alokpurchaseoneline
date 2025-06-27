/* eslint-disable no-prototype-builtins */
import React from 'react';
// import ConfirmationBox from 'Common/SettingsForm/ConfirmationBox';
import moment from 'moment';
import True from '../Icons/True';
import False from '../Icons/False';
// import { fetchAPI } from '../../../_actions/actions';
// import Excel from 'exceljs';
// import { saveAs } from 'file-saver';
// import store from '../../../_store/store';
// import { getServerSideExportData } from './httpUtils';

/**
 * Function to access an Object using a dot-delimited accessor
 * @param {Object} data from which to read
 * @param {String} accessor dot-delimited query to access the obj
 * @returns {Variant}
 */
export function selectDotNotation(data, accessor) {
  return accessor.split('.').reduce((obj, split) => obj && obj[split], data);
}

/**
 * Function to set an Object using a dot-delimited accessor
 *  @param {String} data source object
 * @param {String} accessor dot-delimited query to access the object
 * @param {Variant} value value to set
 * @returns {Variant}
 */
export function setDotNotation(data, accessor, value) {
  const keys = (accessor && accessor.split('.')) || [];

  keys.reduce((acc, curr, indx) => {
    let pointer = acc;
    // let pointerValue = pointer[curr]

    if (indx === keys.length - 1) {
      pointer[curr] = value;
    } else if (!pointer[curr]) {
      pointer[curr] = {};
    }

    pointer = pointer[curr];
    return pointer;
  }, data);
}

/**
 * Function to sort an array of objects alphabetically by a certain key
 * @param {Array} options
 * @param {String} sortKey
 * @returns {Array}
 * Note: Does not work well if option[sortKey] has a mixed type; it should
 * consistently be either a string or number
 */
export function sortOptions(options, sortKey) {
  return options.sort((obj1, obj2) => {
    // Make sort case-insensitive
    const val1 =
      typeof obj1[sortKey] === 'string'
        ? obj1[sortKey].toUpperCase()
        : obj1[sortKey];
    const val2 =
      typeof obj2[sortKey] === 'string'
        ? obj2[sortKey].toUpperCase()
        : obj2[sortKey];
    if (val1 > val2) return 1;
    if (val1 < val2) return -1;
    return 0;
  });
}

/**
 * Function to generate an array of characters from one char to another
 * @param {String} charA
 * @param {String} charZ
 * @returns {Array}
 */
export function genCharArray(charA, charZ) {
  const a = [];
  let i = charA.charCodeAt(0);
  const j = charZ.charCodeAt(0);

  for (; i <= j; i += 1) {
    a.push(String.fromCharCode(i));
  }
  return a;
}

/**
 * Function for debounce
 * @param {Function} func
 * @param {Number} timeout
 * @returns {Function}
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}

/**
 * Function for check object
 * @param {Object} object
 * @returns {Boolean}
 */
export function isObject(object) {
  if (typeof object === 'object' && object !== null) {
    return true;
  }
  return false;
}

/**
 * Function to generate the available dynamic lot type options
 * @param {Array} campaignLots
 * @returns {Function}
 */
export function getLotTypeOptions(campaignLots = []) {
  return (currentRow) => {
    const alphabet = genCharArray('A', 'Z');

    function countTypes(lTypes, type) {
      const filterLotType = lTypes
        .filter((t) => t && String(t).includes(type))
        .map((v) => {
          const typeArr = v.split(' ');
          return (typeArr.length && typeArr[1] && Number(typeArr[1])) || 0;
        });
      return (filterLotType.length && Math.max(...filterLotType)) || 0;
    }

    function containsType(type) {
      return (
        currentRow &&
        currentRow.lotType &&
        String(currentRow.lotType).includes(type)
      );
    }

    const lTypes = campaignLots.map((cl) => cl.lotType);
    const balanceCount = countTypes(lTypes, 'Balance');
    const controlCount = countTypes(lTypes, 'Control');

    const options = [
      {
        lotType: containsType('Balance')
          ? currentRow.lotType
          : `Balance ${balanceCount + 1}`,
      },
      {
        lotType: containsType('Control')
          ? currentRow.lotType
          : `Control ${controlCount + 1}`,
      },
    ];

    function getTestOption() {
      let testCount = controlCount;

      if (containsType('Test')) {
        return currentRow.lotType;
      }

      if (containsType('Control')) {
        testCount = controlCount - 1;

        if (testCount === 0) {
          return '';
        }
      }

      const tests = lTypes.filter(
        (t) => t && String(t).includes('Test') && String(t).includes(testCount)
      );
      const testSuffixes = tests
        .map((t) => t.slice(-1))
        .sort((a, b) => a.localeCompare(b));
      const nextSuffix = alphabet.filter(
        (al) => !testSuffixes.some((ts) => ts === al)
      )[0];

      return `Test ${testCount}${nextSuffix}`;
    }

    if (controlCount > 0) {
      const testOption = getTestOption();

      if (testOption) {
        options.push({
          lotType: testOption,
        });
      }
    }

    return options;
  };
}

/**
 * Function that gets the component option id
 * @param {Object} component
 * @param {Object} selectedComponent
 * @param {String} option
 * @returns {String|null}
 */
export function getComponentOptionID(
  component,
  selectedComponent,
  option = ''
) {
  if (!option.length || option.indexOf('Option') < 0) {
    throw new Error('Must provide a valid option to get a component option id');
  }

  const compOpt = component[option];
  const accessor = option.slice(0, -'Option'.length);

  return compOpt
    ? (
        selectedComponent[accessor].data.find(
          (i) => i[option] === component[option]
        ) || {}
      ).id
    : null;
}

/**
 * Function that gets the component size id
 * @param {Object} component
 * @param {Object} selectedComponent
 * @returns {String|null}
 */
export function getComponentSizeID(component, selectedComponent) {
  return component.flatSize && component.finishedSize
    ? (
        selectedComponent.size.data.find(
          (i) =>
            i.flatSize === component.flatSize &&
            i.finishedSize === component.finishedSize
        ) || {}
      ).id
    : null;
}

/**
 * Function that gets the component size id
 * @param {Object} component
 * @param {Object} selectedComponent
 * @returns {String|null}
 */
export function getComponentStockID(component, selectedComponent) {
  return component.stockType && component.stockOption
    ? (
        selectedComponent.stock.data.find(
          (i) =>
            i.stockType === component.stockType &&
            i.stockOption === component.stockOption
        ) || {}
      ).id
    : null;
}

/**
 * Function that maps singleton items within an array,
 * to an array containing a new object using the
 * specified fieldName
 * @param {Object} options
 * @param {String} fieldName
 * @returns {String|null}
 */
export function mapFieldOptions(options, fieldName) {
  return options.map((i) => ({ [fieldName]: i }));
}

/**
 * Function that checks if a user has permission,
 * @param {String} authNeeded
 * @param {Object} userData
 * @returns {Boolean}
 */
export function checkAuth(authNeeded, userData) {
  if (Array.isArray(authNeeded)) {
    return authNeeded.every((permission) =>
      userData.permissions.includes(permission)
    );
  }
  return userData.permissions.includes(authNeeded);
}

/**
 * Function that returns the name of a phase given the id
 * @param {Number} phaseID
 * @returns {String}
 */

/**
 * Function that returns an array of phase name/id given data from a compaing form
 * @param {Array}
 * @returns {Array}
 */
export function phaseOptions(phasesData) {
  const state = store.getState();
  const phases = state.phaseData.data;
  const filteredPhases =
    phasesData && phases
      ? phases.phaseTabs.filter((x) =>
          phasesData.some((y) => y.phaseNumber === x.id)
        )
      : [];
  const structuredFilteredPhases = filteredPhases.map((e) => ({
    key: e.id,
    label: e.title,
  }));
  return phasesData ? structuredFilteredPhases : [];
}

/**
 * Function that returns an array of lot name/id given data from a compaing form
 * @param {Array} tabData
 * @returns {Array}
 */
export function lotOptions(tabData) {
  const { campaignLots } = tabData || {};
  return (campaignLots || []).map((lot) => ({
    id: lot.id,
    lotNumber: lot.lotNumber,
  }));
}

/**
 * Function that returns phase tab options based on which ones are used
 * @param {Array} phaseData
 * @returns {Array}
 */
export function phaseTabOptions(phasesData, phaseMapData) {
  const phases = phaseMapData;
  const filteredPhases =
    phasesData && phases
      ? phases.phaseTabs.filter((x) =>
          phasesData.some((y) => y.phaseNumber === x.id)
        )
      : [];
  const structuredFilteredPhases = filteredPhases.map((e) => ({
    key: e.id,
    label: e.title,
  }));
  return phasesData ? structuredFilteredPhases : [];
}

/**
 * Function that returns an icon based on a boolean value
 * @param {Boolean} value
 * @returns {Element}
 */
export function getBoolIcon(value) {
  return value ? <True /> : <False />;
}

/**
 * Function that returns the title data for campaign forms with job number
 * @param {String} title
 * @param {Number} cmapaignID
 * @param {Number} phaseNumber
 * @returns {Object}
 */
export function campaignTitleData(title, campaignID, phaseNumber) {
  return {
    name: title,
    fields: [
      {
        label: 'Job Number',
        value: `${campaignID}-${phaseNumber}`,
      },
    ],
  };
}

export function fileUploadFormik(files, values, accessor, setFieldValue) {
  const currentData = [...values[accessor]];
  const uploadedFiles = typeof files === 'string' ? [files] : files;
  const newData = currentData.concat(uploadedFiles);

  setFieldValue(accessor, newData);
}

export function fileDisplayFormik(files, values, accessor, setFieldValue) {
  const currentData =
    (values[accessor] &&
      values[accessor] &&
      values[accessor].map(
        (s3File) => s3File.s3FileUpload && s3File.s3FileUpload.fileName
      )) ||
    [];

  const uploadedFiles = typeof files === 'string' ? [files] : files;
  const newData = currentData.concat(uploadedFiles);

  setFieldValue(accessor, newData);
}

export function fileDeleteFormik(e, values, accessor, setFieldValue) {
  const currentData = (values[accessor] && values[accessor]) || [];
  const removeFiles = values.removeFiles || []; // current file names we are removing

  currentData.forEach((fileData) => {
    removeFiles.push(fileData.s3FileUpload.fileName);
  });

  setFieldValue('removeFiles', removeFiles); // creates a removeFiles array that contains a list of filenames the backend knows to remove from the database and s3

  currentData.splice(e.target.id, 1); // removes the file information from the UI
  setFieldValue(accessor, currentData);
}

export function formatDateStandard(date) {
  const year = date.getFullYear();
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getUTCDate()}`;

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  const updatedDate = `${year}-${month}-${day}`;
  if (updatedDate.length !== 10) {
    return null;
  }

  return `${month}-${day}-${year}`;
}

export function formatDate(date) {
  const year = date.getFullYear();
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  const updatedDate = `${year}-${month}-${day}`;
  if (updatedDate.length !== 10) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

export function formatDateInStandardForm(date) {
  if (date) {
    // just get rid of any timezone info...
    const fdate = new Date(date);
    let year = fdate.getFullYear();
    let month = `${fdate.getMonth() + 1}`;
    let day = `${fdate.getDate()}`;

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    if (year.toString().length > 4) {
      year = year.toString().slice(0, 4);
    }

    return `${year}-${month}-${day}`;
  }
  return date;
}

export function subtractDays(date, numberOfDays) {
  if (numberOfDays === null) return null;
  return moment.utc(date).subtract(numberOfDays, 'days').toISOString();
}

/**
 * Function that returns an array of client permit poi-permitNumber given data
 * @param {String} key1
 * @param {String} key2
 * @returns {String}
 */
export function hyphenate(key1, key2) {
  return `${key1} - ${key2}`;
}

/**
 * Function that returns an string which removed html entity of data
 * @param {String} html
 * @returns {String}
 */
export function stripHtml(html) {
  // Create a new div element
  const temporalDivElement = document.createElement('div');
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || '';
}

/**
 * Function that returns diff of two object
 * @param {Object} originalObject
 * @param {Object} modifiedObject
 * @return {Object}
 */
export function diffNestedTableData(
  originalObject,
  modifiedObject,
  subtableKey
) {
  const changes = {
    add: [],
    update: [],
    delete: [],
  };
  if (originalObject.length) {
    originalObject.forEach((oldRow) => {
      const modifiedRow = modifiedObject.find((mr) => mr.id === oldRow.id);
      const oldRowData = { ...oldRow };
      const modifiedRowData = { ...modifiedRow };
      delete oldRowData[subtableKey];
      delete modifiedRowData[subtableKey];
      // Check for row existence
      if (!modifiedRow) {
        changes.delete.push(oldRow);
      } else {
        for (let i = 0; i < Object.keys(oldRowData).length; i++) {
          if (
            oldRowData[Object.keys(oldRowData)[i]] !==
            modifiedRowData[Object.keys(modifiedRowData)[i]]
          ) {
            modifiedRowData.action = 'update';
            break;
          }
        }
        modifiedRowData[subtableKey] = [];
        oldRow[subtableKey].forEach((oldRowSubTableData) => {
          const modifiedRowSubTableData = modifiedRow[subtableKey].find(
            (modifiedRowDataItem) =>
              modifiedRowDataItem.id === oldRowSubTableData.id
          );
          if (!modifiedRowSubTableData) {
            oldRowSubTableData.action = 'delete';
            modifiedRowData[subtableKey].push(oldRowSubTableData);
          } else {
            for (let i = 0; i < Object.keys(oldRowSubTableData).length; i++) {
              if (
                oldRowSubTableData[Object.keys(oldRowSubTableData)[i]] !==
                modifiedRowSubTableData[Object.keys(modifiedRowSubTableData)[i]]
              ) {
                modifiedRowSubTableData.action = 'update';
                modifiedRowData[subtableKey].push(modifiedRowSubTableData);
                break;
              }
            }
          }
        });
        modifiedRow[subtableKey].forEach((modifiedRowObject) => {
          if (!modifiedRowObject.id) {
            modifiedRowObject.action = 'add';
            modifiedRowData[subtableKey].push(modifiedRowObject);
          }
        });
      }
      if (
        modifiedRowData.action ||
        (modifiedRowData[subtableKey] &&
          modifiedRowData[subtableKey].find(
            (isActionHappen) => isActionHappen.action
          ))
      ) {
        changes.update.push(modifiedRowData);
      }
    });
    modifiedObject.forEach((modifiedRow) => {
      if (!modifiedRow.id) {
        changes.add.push(modifiedRow);
      }
    });
  } else {
    changes.add = modifiedObject;
  }
  return changes;
}

/**
 * Function that returns sort order of two number
 * @param {Number} firstOrderValue
 * @param {Number} secondOrderValue
 * @return {Integer}
 */
export function stringNumberSort(firstOrderValue, secondOrderValue) {
  const aSplit = (firstOrderValue || Number.MAX_SAFE_INTEGER)
    .toString()
    .split('.');
  const bSplit = (secondOrderValue || Number.MAX_SAFE_INTEGER)
    .toString()
    .split('.');
  if (parseInt(aSplit[0], 10) > parseInt(bSplit[0], 10)) {
    return 1;
  }

  if (
    parseInt(aSplit[0], 10) === parseInt(bSplit[0], 10) &&
    parseInt(aSplit[1], 10) > parseInt(bSplit[1], 10)
  ) {
    return 1;
  }
  return -1;
}

export function exportExcel(
  columns,
  data,
  selectedColumn,
  extraColumnToExport = [],
  exportFileName = 'innsight'
) {
  if (columns) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');
    const tableColumn = columns || [];
    const tableRows = data;
    const exportColumns = [];
    tableColumn.forEach((value) => {
      if (value.columns) {
        value.columns.forEach((item) => {
          if (
            selectedColumn.length === 0 ||
            (selectedColumn.length !== 0 &&
              selectedColumn.includes(item.accessor))
          ) {
            exportColumns.push({
              header: item.Header,
              key: item.accessor,
              cellProps: item.cellProps,
            });
          }
        });
      } else if (
        selectedColumn.length === 0 ||
        (selectedColumn.length !== 0 && selectedColumn.includes(value.accessor))
      ) {
        exportColumns.push({
          header: value.Header,
          key: value.accessor,
          cellProps: value.cellProps,
        });
      }
    });

    extraColumnToExport.forEach((value) => {
      if (selectedColumn.includes(value.id)) {
        exportColumns.push({
          header: value.name,
          key: value.id,
          type: 'external',
          value: value.value,
        });
      }
    });

    worksheet.columns = exportColumns;
    tableRows.forEach((row) => {
      const tempRow = {};
      exportColumns.forEach((column) => {
        let options =
          column.cellProps && column.cellProps.options
            ? column.cellProps.options
            : undefined;
        if (options && column.cellProps.valueKey) {
          const option = options.find(
            (value) =>
              // eslint-disable-next-line eqeqeq
              value[column.cellProps.valueKey] == row[column.key]
          );
          tempRow[column.key] = option
            ? option[column.cellProps.labelKey]
            : row[column.key];
        } else {
          const keys = column.key ? column.key.split('.') : [];
          let val = row;
          keys.forEach((key) => {
            val = val[key];
          });
          tempRow[column.key] = val;
        }

        if (column.type) {
          tempRow[column.key] = column.value;
        }

        if (typeof column.cellProps === 'function') {
          const newRow = { original: row };
          const cellProps = column.cellProps(newRow);
          if (cellProps.importOptions) {
            options =
              (cellProps &&
                cellProps.importOptions &&
                cellProps.importOptions.options) ||
              undefined;

            const option = options.find(
              (value) =>
                // eslint-disable-next-line eqeqeq
                value[cellProps.valueKey] == row[column.key]
            );

            tempRow[column.key] = option
              ? option[
                  (cellProps.importOptions &&
                    cellProps.importOptions.labelKey) ||
                    cellProps.labelKey
                ]
              : row[column.key];
          } else if (cellProps.options) {
            options = (cellProps && cellProps.options) || undefined;

            const option = options.find(
              (value) =>
                // eslint-disable-next-line eqeqeq
                value[cellProps.valueKey] == row[column.key]
            );

            tempRow[column.key] = option
              ? option[(cellProps && cellProps.labelKey) || cellProps.labelKey]
              : row[column.key];
          }
        }
      });
      // eslint-disable-next-line no-undef
      worksheet.addRow(tempRow);
    });
    workbook.xlsx.writeBuffer().then((exportData) => {
      // eslint-disable-next-line no-undef
      saveAs(new Blob([exportData]), `${exportFileName}.xlsx`);
    });
  }
}

/**
 * Function that returns Export Columns from react-table column
 * @param {Array} columns
 * @return {Array}
 */
export function exportColumn(columns = [], extraColumnToExport = []) {
  const exportColumns = [];
  columns.forEach((value) => {
    if (value.columns) {
      value.columns.forEach((item) => {
        exportColumns.push({
          name: item.Header,
          id: item.accessor,
          cellProps: item.cellProps,
        });
      });
    } else {
      exportColumns.push({
        name: value.Header,
        id: value.accessor,
        cellProps: value.cellProps,
      });
    }
  });

  extraColumnToExport.forEach((value) => {
    exportColumns.push(value);
  });

  return exportColumns;
}

/**
 * Function to sort an array of objects alphaNumerically by a certain key
 * @param {Array} options
 * @param {String} sortKey
 * @returns {Array}
 */
export function sortOptionsAlphaNumeric(options, sortKey) {
  return options.sort((obj1, obj2) => {
    const val1 = obj1[sortKey].split(' ').shift();
    const val2 = obj2[sortKey].split(' ').shift();
    const a = isNaN(parseInt(val1)) ? 0 : parseInt(val1);
    const b = isNaN(parseInt(val2)) ? 0 : parseInt(val2);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
}

/**
 * Function to get Output Status
 * @returns {Array}
 */
export function outputStatus() {
  return [
    // { name: 'Approved' },
    // { name: 'In Process' },
    // { name: 'Other Status' },
    { name: 'New Art' },
    { name: 'Reprint Art' },
    { name: 'No Art' },
  ];
}

export function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}

export function getExtremeDataGridParams(loadOptions) {
  let params = '';
  [
    'skip',
    'take',
    'requireTotalCount',
    'requireGroupCount',
    'sort',
    'filter',
    'totalSummary',
    'group',
    'groupSummary',
  ].forEach((i) => {
    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
      if (i === 'filter') {
        params += `${i}=${encodeURIComponent(JSON.stringify(loadOptions[i]))}&`;
      } else {
        params += `${i}=${JSON.stringify(loadOptions[i])}&`;
      }
    }
  });

  return params;
}

function flatColumn(column, columns, headerColumn, a) {
  if (column.columns || column.children) {
    headerColumn.push({
      header: column.Header,
      key: '',
      length:
        (column.columns && column.columns.length) ||
        (column.children && column.children.length),
      start: a.index,
    });
    (column.columns || column.children).forEach((c) => {
      flatColumn(c, columns, headerColumn, a);
    });
  } else {
    // eslint-disable-next-line no-param-reassign
    a.index += 1;
    columns.push({
      header: column.Header,
      key: column.accessor,
      valueGetter: column.valueGetter,
    });
  }
}

/**
 * Function that returns Export Columns from react-table column
 * @param {Array} outerColumns
 * @param {Array} innerColumns
 * @param {Array} exportData
 * @param {String} exportFileName
 * @param {String} outerSheetName
 * @param {String} innerSheetName
 * @param {String} innerTableKey
 * @param {String} depth
 * @param {Function} innerLabelCb
 */
export function innerTableExport({
  outerColumns = [],
  innerColumns = [],
  exportData = [],
  exportFileName,
  outerSheetName,
  innerSheetName,
  innerTableKey,
  depth,
  innerLabelCb,
}) {
  const columns = [];
  const headerColumn = [];
  const a = { index: 0, depth: 0 };
  innerColumns.forEach((c) => flatColumn(c, columns, headerColumn, a));
  const workbook = new Excel.Workbook();
  const sheetOne = workbook.addWorksheet(outerSheetName);
  const sheetTwo = workbook.addWorksheet(innerSheetName);
  headerColumn.forEach((c) => {
    sheetTwo.mergeCells(depth - 1, c.start + 1, depth - 1, c.length + c.start);
    const cell = sheetTwo.getCell(
      depth - 1,
      c.start + 1,
      depth - 1,
      c.length + c.start
    );
    cell.value = c.header;
    cell.font = { bold: true };
  });
  columns.forEach((c, index) => {
    const cell = sheetTwo.getCell(depth, index + 1, depth, index + 1);
    cell.value = c.header;
    cell.font = { bold: true };
  });

  let innerLabelMergeIndex = depth + 1;
  const columnLength = columns.length;
  exportData.forEach((item, index) => {
    sheetTwo.mergeCells(
      innerLabelMergeIndex,
      1,
      innerLabelMergeIndex,
      columnLength
    );
    const cell = sheetTwo.getCell(
      innerLabelMergeIndex,
      1,
      innerLabelMergeIndex,
      columnLength
    );
    cell.value = innerLabelCb(item, index);
    cell.style = { font: { bold: true } };
    const innerExportData = item && item[innerTableKey];
    innerExportData.forEach((row, i) => {
      const tmpRow = [];
      columns.forEach((c) => {
        const val =
          (c.valueGetter && c.valueGetter({ data: row })) ||
          selectDotNotation(row, c.key);
        tmpRow.push(val);
      });
      sheetTwo.addRow(tmpRow);
      sheetTwo.getRow(innerLabelMergeIndex + i + 1).outlineLevel = 1;
    });
    innerLabelMergeIndex = innerLabelMergeIndex + 1 + innerExportData.length;
    sheetTwo.getRow(innerLabelMergeIndex).outlineLevel = undefined;
    // added for lots

    const columnsAsk = outerColumns;
    const headers = [];
    columnsAsk.forEach((c) => {
      headers.push({
        header: c.Header,
        key: c.accessor,
        exportProps: c.exportProps,
      });
    });
    headers.forEach((c, i) => {
      const sheetCell = sheetOne.getCell(1, i + 1, 2, i + 1);
      sheetCell.value = c.header;
      sheetCell.font = { bold: true };
    });
    const tmpRow = [];
    headers.forEach((c) => {
      const keys = c.key ? c.key.split('.') : [];
      let val = item;
      keys.forEach((key) => {
        if (c.exportProps && c.exportProps.type === 'select') {
          const { valueKey, labelKey } = c.exportProps;
          const option = c.exportProps.options.find(
            (v) => v[valueKey] === val[key]
          );
          val = (option && option[labelKey]) || null;
        } else {
          val = (val && val[key]) || null;
        }
      });
      tmpRow.push(val);
    });
    sheetOne.addRow(tmpRow);
  });
  workbook.xlsx.writeBuffer().then((exportFinalData) => {
    // eslint-disable-next-line no-undef
    saveAs(new Blob([exportFinalData]), exportFileName);
  });
}

/**
 * Function that returns Export Columns from react-table column
 * @param {Array} lotColumns
 * @param {Array} summaryColumns
 * @param {Array} lotData
 * @param {String} exportFileName
 * @param {String} outerSheetName
 * @param {String} innerSheetName
 *  @param {Array} summaryData
 */
export function exportWithSummary({
  lotColumns = [],
  summaryColumns = [],
  lotData = [],
  exportFileName,
  outerSheetName,
  innerSheetName,
  summaryData,
}) {
  const workbook = new Excel.Workbook();
  const sheetOne = workbook.addWorksheet(outerSheetName);
  const sheetTwo = workbook.addWorksheet(innerSheetName);
  lotData.forEach((item, index) => {
    const columnsLot = lotColumns;
    const headers = [];
    columnsLot.forEach((c) => {
      headers.push({
        header: c.Header,
        key: c.accessor,
        exportProps: c.exportProps,
        cellProps: c.cellProps,
      });
    });
    headers.forEach((c, i) => {
      const sheetCell = sheetOne.getCell(1, i + 1, 2, i + 1);
      sheetCell.value = c.header;
      sheetCell.font = { bold: true };
    });
    const tmpRow = [];
    headers.forEach((c) => {
      const keys = c.key ? c.key.split('.') : [];
      let val = item;
      keys.forEach((key) => {
        if (c.exportProps && c.exportProps.type === 'select') {
          const { valueKey, labelKey } = c.exportProps;
          const option = c.exportProps.options.find(
            (v) => v[valueKey] === val[key]
          );
          val = (option && option[labelKey]) || null;
        } else {
          val = (val && val[key]) || null;
        }
      });
      if (
        c.cellProps &&
        c.cellProps.type &&
        c.cellProps.type === 'currency' &&
        !val
      ) {
        val = 0;
      }
      tmpRow.push(val);
    });
    sheetOne.addRow(tmpRow);
  });
  // added for summary
  summaryData.forEach((item, index) => {
    const columnsSummary = summaryColumns;
    const headerColumn = [];
    columnsSummary.forEach((c) => {
      headerColumn.push({
        header: c.Header,
        key: c.accessor,
        exportProps: c.exportProps,
        cellProps: c.cellProps,
      });
    });
    headerColumn.forEach((c, i) => {
      const sheetCell = sheetTwo.getCell(1, i + 1, 2, i + 1);
      sheetCell.value = c.header;
      sheetCell.font = { bold: true };
    });
    const tmpRow = [];
    headerColumn.forEach((c) => {
      const keys = c.key ? c.key.split('.') : [];
      let val = item;
      keys.forEach((key) => {
        if (c.exportProps && c.exportProps.type === 'select') {
          const { valueKey, labelKey } = c.exportProps;
          const option = c.exportProps.options.find(
            (v) => v[valueKey] === val[key]
          );
          val = (option && option[labelKey]) || null;
        } else {
          val = (val && val[key]) || null;
        }
      });
      if (
        c.cellProps &&
        c.cellProps.type &&
        c.cellProps.type === 'currency' &&
        !val
      ) {
        val = 0;
      }
      tmpRow.push(val);
    });
    sheetTwo.addRow(tmpRow);
  });
  workbook.xlsx.writeBuffer().then((exportFinalData) => {
    // eslint-disable-next-line no-undef
    saveAs(new Blob([exportFinalData]), exportFileName);
  });
}

/**
 * Function that returns Export Columns from react-table column
 * @param {Array} tableColumns
 * @param {Array} exportData
 * @param {String} exportFileName
 * @param {String} sheetName
 */
export function exportGrid({
  tableColumns = [],
  exportData = [],
  exportFileName,
  sheetName,
}) {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.properties.defaultColWidth = 20;

  const columns = tableColumns;
  const headers = [];
  columns.forEach((c) => {
    if (!c.hideInTable) {
      headers.push({
        header: c.Header,
        key: c.accessor,
        exportProps: c.exportProps,
        type: c.type,
      });
    }
  });

  exportData.forEach((item) => {
    headers.forEach((c, i) => {
      const sheetCell = sheet.getCell(1, i + 1, 2, i + 1);
      sheetCell.value = c.header;
      sheetCell.font = { bold: true };
    });
    const tmpRow = [];
    headers.forEach((c) => {
      const keys = c.key ? c.key.split('.') : [];
      let val;
      keys.forEach((key) => {
        if (c.exportProps && c.exportProps.type === 'select') {
          const { valueKey, labelKey } = c.exportProps;
          const option = c.exportProps.options.find(
            (v) => v[valueKey] === item[key]
          );
          val = (option && option[labelKey]) || null;
        } else {
          val = (item && item[key]) || null;
        }
      });
      if (c.type && c.type === 'dateColumn') {
        const timeFormat =
          val && val.length === 10 ? 'MM/DD/YYYY' : 'MM/DD/YYYY | hh:mm:ss A';
        val = (val && moment.parseZone(val).format(timeFormat)) || null;
      }
      tmpRow.push(val);
    });
    sheet.addRow(tmpRow);
  });
  workbook.xlsx.writeBuffer().then((exportFinalData) => {
    // eslint-disable-next-line no-undef
    saveAs(new Blob([exportFinalData]), exportFileName);
  });
}

/**
 * Function that export server side or client side based on condition from AG Grid
 * @param {String} fetchEndPoint
 * @param {Object} gridApi
 * @param {String} gridTitle
 */
export function agGridExportUtil(fetchEndPoint, gridApi, gridTitle) {
  const fetchUrl = decodeURIComponent(fetchEndPoint).split('params=');
  const endpoint = fetchUrl[0];
  const params = JSON.parse(fetchUrl[1]);
  delete params.endRow;
  delete params.startRow;
  const url = `${endpoint}params=${encodeURIComponent(JSON.stringify(params))}`;
  const serverSideState = (gridApi.getServerSideStoreState() || [])[0];
  let allRowCount = 0;
  gridApi.forEachNode(() => {
    allRowCount += 1;
  });
  const columns = [];
  const columnDefs = gridApi.getColumnDefs();
  const columnKeys = [];
  columnDefs.forEach((col) => {
    if (col.colId !== 'action' && !col.hide) {
      columns.push({
        ...col.cellEditorParams,
        width: col.width,
        type:
          col.type && Array.isArray(col.type) && col.type.length
            ? col.type[0]
            : col.type,
      });
      columnKeys.push(col.colId);
    }
  });

  if (serverSideState && serverSideState.rowCount === allRowCount) {
    gridApi.exportDataAsExcel({ columnKeys });
  } else {
    getServerSideExportData(url).then((result) => {
      exportGrid({
        tableColumns: columns,
        exportData: (result.data && result.data.data) || result.data || [],
        exportFileName: `${gridTitle || 'export'}.xlsx`,
        sheetName: gridTitle || 'Sheet1',
      });
    });
  }
}

// export const getGridColumnFilterValues =
//   (params, endpoint, query) => async (dispatch) => {
//     const { column, api } = params;
//     const { colId } = column;
//     const request = {
//       filterModel: api.getFilterModel(),
//     };

//     delete request.filterModel[colId];
//     const columnValues = await dispatch(
//       fetchAPI({
//         endpoint,
//         query: {
//           ...query,
//           field: colId,
//           params: JSON.stringify(request),
//         },
//       })
//     );
//     return columnValues;
//   };

/**
 * Handle Two Digit Date
 */

export function handleTwoDigitDatedateValue(dateValue) {
  // early return if we are clearing a date
  if (dateValue === null || dateValue === undefined || dateValue === '')
    return null;

  let cleanedDate = dateValue;
  let seperatedDateObject;
  let datesYear;
  let datesMonth;
  let datesDay;
  if (cleanedDate instanceof Date) {
    // we want the date time the user entered so trust the local timezone
    // cleanedDate = dateValue.toLocaleDateString([], {
    // 	year: 'numeric',
    // 	month: '2-digit',
    // 	day: '2-digit',
    // })
    cleanedDate = moment(cleanedDate).format('YYYY-MM-DD');
    // seperatedDateObject = cleanedDate.substring(0, 10).split('/')
    // datesDay = seperatedDateObject[1]
    // datesYear = seperatedDateObject[2]
    // datesMonth = seperatedDateObject[0]
    seperatedDateObject = cleanedDate.substring(0, 10).split('-');
    datesDay = seperatedDateObject[2];
    datesYear = seperatedDateObject[0];
    datesMonth = seperatedDateObject[1];
  } else {
    seperatedDateObject = cleanedDate.substring(0, 10).split('-');
    datesDay = seperatedDateObject[2];
    datesYear = seperatedDateObject[0];
    datesMonth = seperatedDateObject[1];
  }

  if (cleanedDate && datesYear < 1900) {
    datesYear = 2000 + parseInt(datesYear.slice(-2), 10);
  }
  // const finalDate = `${datesMonth}/${datesDay}/${datesYear}`
  const finalDate = `${datesYear}-${datesMonth}-${datesDay}`;
  return moment(finalDate).format('YYYY-MM-DD');
}

export function renderDateFormat(value) {
  if (!value) {
    return '';
  }
  const timeFormat = 'MM/DD/YYYY';
  return moment.parseZone(value).format('MM/DD/YYYY') === 'Invalid date'
    ? null
    : value && moment.parseZone(value).format(timeFormat);
}

export function columnType(column = '') {
  const columnPrefix = column.split('_')[0];
  switch (columnPrefix) {
    case 'id':
    case 'int':
      return 'number';
    case 'createdAt':
    case 'updatedAt':
    case 'dat':
      return 'date';
    case 'cur':
    case 'dec':
      return 'currency';
    case 'f':
      return 'switch';
    default:
      return 'text';
  }
}

export function filterSearchCond(
  column,
  value,
  selectedFilterOperations,
  target
) {
  const { headerFilterProps, headerFilter, dataField } = column;
  const searchCond = [];
  const { labelKey, valueKey } = headerFilterProps;
  let filterOptions = [];
  if (selectedFilterOperations === '<>' || selectedFilterOperations === '=') {
    filterOptions = (headerFilter.dataSource || [])
      .filter(
        (v) =>
          v[valueKey] &&
          v[labelKey].toString().toLowerCase() === value.toLowerCase()
      )
      .map((v) => v[valueKey]);
  } else if (selectedFilterOperations === 'startswith') {
    filterOptions = (headerFilter.dataSource || [])
      .filter(
        (v) =>
          v[valueKey] &&
          v[labelKey].toString().toLowerCase().startsWith(value.toLowerCase())
      )
      .map((v) => v[valueKey]);
  } else if (selectedFilterOperations === 'endswith') {
    filterOptions = (headerFilter.dataSource || [])
      .filter(
        (v) =>
          v[valueKey] &&
          v[labelKey].toString().toLowerCase().endsWith(value.toLowerCase())
      )
      .map((v) => v[valueKey]);
  } else {
    filterOptions = (headerFilter.dataSource || [])
      .filter(
        (v) =>
          v[valueKey] &&
          v[labelKey].toString().toLowerCase().includes(value.toLowerCase())
      )
      .map((v) => v[valueKey]);
  }
  if (['notcontains', '<>'].includes(selectedFilterOperations)) {
    if (filterOptions.length) {
      filterOptions.forEach((v) => {
        searchCond.push([dataField, selectedFilterOperations, v]);
        searchCond.push('and');
      });
    } else {
      searchCond.push([dataField, selectedFilterOperations, value]);
      searchCond.push('and');
    }
    searchCond.pop();
    return searchCond;
  }
  if (filterOptions.length) {
    filterOptions.forEach((v) => {
      searchCond.push([dataField, '=', v]);
      searchCond.push('or');
    });
  } else {
    searchCond.push([dataField, '=', value]);
    searchCond.push('or');
  }
  searchCond.pop();
  return searchCond;
}

export function renderAddress(data, f) {
  if (
    data &&
    (data[f.address] ||
      data[f.address2] ||
      data[f.city] ||
      data[f.state] ||
      data[f.postalCode] ||
      data[f.country])
  ) {
    const address = data[f.address] || '';
    const address2 = data[f.address2] || '';
    const city = data[f.city] || '';
    const state = data[f.state] || '';
    const postalCode = data[f.postalCode] || '';
    const country = data[f.country] || '';

    const addressLine1 = `${address} ${address2}`;

    const addressLine2 = `${city}${
      data[f.city] && data[f.state] ? ',' : ''
    } ${state} ${postalCode} ${country}`;

    return `${addressLine1}, ${addressLine2}`;
  }

  return 'None';
}

/**
 * Function that return camel case string to upper case space separated,
 * @param {String} string
 * @returns {String}
 */
export function camelCaseToUpperCaseSpaceSeparated(string = '') {
  const spaceSeparated = string.replace(/([A-Z]+)/g, ' $1') || '';
  return (
    spaceSeparated.charAt(0).toUpperCase() + spaceSeparated.slice(1)
  ).trim();
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function flatterRoutes(routes, linerRoutes = []) {
  if (Array.isArray(routes)) {
    routes.forEach((r) => {
      flatterRoutes(r, linerRoutes);
    });
    return;
  }
  if (routes.subRoutes) {
    flatterRoutes(routes.subRoutes, linerRoutes);
    return;
  }
  linerRoutes.push(routes);
}

// function detectScreenResolution() {
//   const screenResolutionCheck = window.localStorage.getItem(
//     'screenResolutionCheck'
//   );
//   if (
//     (window.screen.width * window.devicePixelRatio < 1920 ||
//       window.screen.height * window.devicePixelRatio < 1080) &&
//     !screenResolutionCheck
//   ) {
//     ConfirmationBox({
//       title: 'Unsupported Screen Resolution',
//       message: `We have detected that you are using a monitor that may not be fully compatible with JAGOTA. Please use a monitor with a screen resolution of 1920 x 1080 or greater.`,
//       confirmButtonText: 'Continue Anyway',
//       showCancelButton: false,
//       allowOutsideClick: false,
//       callback: (confirm) => {
//         if (confirm === 'YES') {
//           localStorage.setItem('screenResolutionCheck', 1);
//         }
//       },
//     });
//   }
// }

// function detectBrowser() {
//   let browserSupported = false;
//   if (!browserSupported && window.navigator.userAgent.indexOf('Edg') !== -1) {
//     browserSupported = true;
//   }
//   if (
//     !browserSupported &&
//     window.navigator.userAgent.indexOf('Chrome') !== -1
//   ) {
//     browserSupported = true;
//   }
//   const browserSupportCheck = window.localStorage.getItem(
//     'browserSupportCheck'
//   );
//   if (!browserSupported && !browserSupportCheck) {
//     ConfirmationBox({
//       title: 'Unsupported Browser',
//       message: `We have detected that you are using an unsupported browser. Please use Google Chrome or Microsoft Edge.`,
//       confirmButtonText: 'Continue Anyway',
//       showCancelButton: false,
//       allowOutsideClick: false,
//       callback: (confirm) => {
//         if (confirm === 'YES') {
//           localStorage.setItem('browserSupportCheck', 1);
//           detectScreenResolution();
//         }
//       },
//     });
//   } else {
//     detectScreenResolution();
//   }
// }

/* Convert AG Grid Type */
function convertAgGridValueType(params) {
  const { filterType, type, dateFrom, dateTo, filter, filterTo, values } =
    params;
  if (type === 'inRange' && filterType === 'date') {
    const fromDate = formatDateInStandardForm(dateFrom);
    const toDate = formatDateInStandardForm(dateTo);
    return `['${fromDate}','${filterType}','${type}', '${toDate}']`;
  }
  if (type === 'inRange') {
    return `['${filter}','${filterType}','${type}', '${filterTo}']`;
  }
  if (type === 'blank') {
    const value = filterType === 'text' ? null : 0;
    return `[${value},'${filterType}','${type}']`;
  }
  if (filterType === 'date') {
    const date = formatDateInStandardForm(dateFrom);
    return `['${date}','${filterType}','${type}']`;
  }
  if (filterType === 'text') {
    return `['${filter}','${filterType}','${type}']`;
  }
  if (filterType === 'set') {
    return `[${JSON.stringify(values)},'${filterType}']`;
  }
  return `['${filter}','${filterType}','${type}']`;
}

/* Convert Ag Grid Filter To Url String */
export function convertAgGridFilterToQueryParams(params) {
  const { filterModel } = params || {};
  let filterParams = '[';
  Object.keys(filterModel || []).forEach((column, index) => {
    filterParams += index > 0 ? ',[' : '[';
    if (
      filterModel[column].hasOwnProperty('operator') ||
      filterModel[column].hasOwnProperty('filterType')
    ) {
      filterParams += `['columnName','${column}'],`;
      Object.keys(filterModel[column]).forEach((condition) => {
        if (condition.slice(0, 9) === 'condition') {
          const valueType = convertAgGridValueType(filterModel[column]);
          filterParams += valueType;
        }
      });
      filterParams += `['operator','${filterModel[column].operator}']`;
    } else {
      filterParams += `['columnName','${column}'],`;
      const valueType = convertAgGridValueType(filterModel[column]);
      filterParams += valueType;
    }
    filterParams += ']';
  });
  filterParams += ']';
  return filterParams;
}
/* convert Ag Grid Sort to Url String */
export function convertAgGridSortToQueryParams(params, defaultSorted) {
  const { sortModel } = params || {};
  const sort = [];
  (sortModel || []).forEach((c) => {
    sort.push([c.colId, c.sort]);
  });
  if (!(sort && sort.length) && defaultSorted) {
    sort.push(defaultSorted);
  }
  return JSON.stringify(sort);
}
/* currency format */
export function formatCurrency(value) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
  }).format(value || 0);
}
/* number format */
export function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}
// detectBrowser()
