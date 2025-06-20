import React, { useState } from 'react';
import { any } from 'prop-types';
// import moment from 'moment';
// import { Tooltip as ReactTooltip } from 'react-tooltip'
// import PriceListUpload from 'Common/Icons/PriceListUpload';
// import True from '../../Icons/True';
// import Sync from 'Common/Icons/Synchronize'
// import Delete from '../../Icons/Delete';
// import False from '../../Icons/False';
// import IconInfoTooltip from '../../Icons/IconInfoTooltip';
// import MultiFileUpload from './MultiFileUpload/MultiFileUpload';
import { isObject } from '../../Utils/CommonUtils';
// import { getSignedURLByID } from 'Common/Utils/httpUtils'
// import ComponentInfo from './ComponentInfo'
// import ErrorInfo from './ErrorInfo';

// import EYE from '../../Icons/Eye';
// import CSIcon from '../../Icons/CSIcon';
// import Refresh from '../../Icons/Refresh';
// import ShelfIcon from '../../Icons/ShelfIcon';
// import SWI from '../../Icons/SWI';
// // import Truck from '../../Icons/Truck';
// // import Air from '../../Icons/Air';
// // import Sea from '../../Icons/Sea';
// import Docs from '../../Icons/Docs';
// import LogIcon from '../../Icons/LogIcon';
// import PriceListView from '../../Icons/PriceListView';
// import SupCerti from '../../Icons/SupCerti';
// import Approvestatus from '../../Icons/Approvestatus';

// import AddressPopUp from './AddressPopUp'

const CellViewRenderer = (props) => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showErrorInfoPopup, setShowErrorInfoPopup] = useState(false);

  const onValidatedCellMessage = () => {
    // ReactTooltip.hide();
  };

  const renderDate = (value, time) => {
    if (!value) {
      return '';
    }
    const timeFormat = time ? 'DD-MM-YYYY | hh:mm:ss A' : 'DD-MM-YYYY';
    const formatDate =
      moment.parseZone(value).format('DD-MM-YYYY') === 'Invalid date'
        ? null
        : value && moment.parseZone(value).format(timeFormat);
    return formatDate;
  };

  const renderCurrency = (value) => {
    if (value === undefined || value === 0) {
      return (
        <span id="data-value">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 4,
          }).format(0)}
        </span>
      );
    }
    if (!value) {
      return '';
    }

    const currencyValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(value);

    if (currencyValue !== '$NaN') {
      return <span id="data-value">{currencyValue}</span>;
    }
    return value;
  };

  const renderPercentage = (value) => {
    const numericValue = parseFloat(value);
    if (Number.isNaN(numericValue)) {
      return value;
    }
    const percentValue = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
    return `${percentValue}%`;
  };

  const renderErrorInfo = (value) => {
    if (!value) return null;
    const errorInfo = JSON.parse(value);
    return (
      <div className="data-view" style={{ textAlign: 'center' }}>
        {(isObject(errorInfo) && Object.keys(errorInfo).length) ||
        (!isObject(errorInfo) && errorInfo) ? (
          <span
            onClickCapture={() => setShowErrorInfoPopup(true)}
            style={{
              color: 'red',
              display: 'inline-block',
            }}
          >
            <IconInfoTooltip width="12" height="12" />
          </span>
        ) : null}
        {showErrorInfoPopup && (
          <ErrorInfo
            value={value}
            closeInfoModal={() => setShowErrorInfoPopup(false)}
          />
        )}
      </div>
    );
  };

  const renderQuill = (value) => {
    const span = document.createElement('span');
    span.innerHTML = value;
    return (
      <div
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {span.textContent || span.innerText}
      </div>
    );
  };

  const renderNumber = (
    value,
    thousandSeparator,
    showThousandSeparator,
    tempNumber = false
  ) => {
    if (tempNumber && value === 0) {
      return value;
    }
    if (value === null || value === undefined || isNaN(Number(value))) {
      return null;
    }
    const numericValue = Number(value);
    const formatNumber =
      showThousandSeparator &&
      (thousandSeparator === undefined || thousandSeparator)
        ? new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }).format(numericValue)
        : numericValue;
    return formatNumber;
  };

  const handleView = () => {
    // const { value } = props;
    // if (value && value.s3FileUpload) {
    //   getSignedURLByID(value.id).then((res) => {
    //     window.open(res);
    //   });
    // }
  };

  const renderViewTypeButton = (type, shelfLifeColor, logColor) => {
    switch (type) {
      case 'shelfLife':
        return <ShelfIcon width={18} height={18} fill={shelfLifeColor} />;
      case 'eyeIcon':
        return <EYE />;
      case 'documnet':
        return <Docs />;
      case 'supProductView':
        return <SupCerti />;
      case 'log': {
        return <LogIcon width={18} height={18} color={logColor} />;
      }
      case 'supplier':
        return <SWI width={24} height={24} fill="black" />;
      case 'approvestatus':
        return <Approvestatus width={24} height={24} fill="black" />;
      case 'fdaType':
        return 'Request FDA';
      default:
        return <EYE />;
    }
  };

  // Main render logic
  const {
    colDef,
    data,
    value,
    gridChanges,
    node,
    columnProperty,
    gridRef,
    api,
    props: cellProps,
  } = props;
  const { field, cellEditorParams, cellRendererParams } = colDef;
  const {
    cell,
    cellProps: ceCellProps,
    dynamicProps,
    handleClick,
    contentAlign,
  } = cellEditorParams || {};
  const evaluationProps =
    cell || ceCellProps || (dynamicProps && dynamicProps(props));
  const {
    valueKey,
    labelKey,
    isMulti,
    type,
    options,
    enableHover,
    syncPackageCode,
    isLink,
    defaultTextValue,
    prefix,
    time,
    thousandSeparator,
    renderedValue,
    tempNumber,
    showShelfLifeIcon,
    showThousandSeparator,
    viewIconType,
    handlePriceList,
    handleShipmentby,
    truckColor,
    seaColor,
    airColor,
    logColor,
    shelfLifeColor,
    isSeaAvailable,
    isTruckAvailable,
    isAirAvailable,
    isServicesAvailable,
  } = evaluationProps || {};

  const currentColumnDef = (api && api.getColumnDefs()) || [];
  const actionColumn = (currentColumnDef || []).find(
    (v) => v.colId === 'action'
  );
  const isFirstCell =
    currentColumnDef &&
    currentColumnDef[0] &&
    currentColumnDef[0].field === field;

  let errorMessage = null;
  let rowKey = 'id';
  if (
    cellRendererParams &&
    cellRendererParams.props &&
    cellRendererParams.props.rowKey
  ) {
    rowKey =
      (cellRendererParams.props && cellRendererParams.props.rowKey) || 'id';
  }
  if (gridChanges) {
    const validatedRow = gridChanges.validationError.find(
      (row) => row.rowID == node.data[rowKey]
    );
    errorMessage =
      validatedRow &&
      validatedRow.messages.find((message) => message.column === field);
  }

  const { newRowDelete } = cellProps || {};

  let input = null;
  switch (type) {
    case 'dataGridDropDown':
    case 'select': {
      if (isMulti) {
        const selectedOption =
          value &&
          value.length &&
          value.map((v) => {
            const option = (options || []).find(
              (o) => o[valueKey] === v[valueKey]
            );
            return (option && option[labelKey]) || '';
          });
        input = `${
          (selectedOption && selectedOption.join(', ')) || value || ''
        }`;
        break;
      }
      const selectedOption = (options || []).find(
        (option) => value && option[valueKey] === value
      );
      input = `${(selectedOption && selectedOption[labelKey]) || value || ''}`;
      break;
    }
    // case 'address': {
    //   input = (
    //     <AddressPopUp
    //       {...props}
    //       edit={false}
    //       importAddressData={importAddressData}
    //       fieldKeys={addressFieldKeys}
    //     />
    //   );
    //   break;
    // }
    case 'phone': {
      input = value;
      break;
    }
    case 'multiFileUpload': {
      input = <MultiFileUpload {...props} edit={false} />;
      break;
    }
    case 'date': {
      input = renderDate(value, time);
      break;
    }
    case 'hidden': {
      return null;
    }
    case 'switch': {
      input = value ? <True /> : <False />;
      break;
    }
    case 'switch2': {
      input = value ? 'Active' : 'Inactive';
      break;
    }
    case 'currency': {
      input = renderCurrency(value);
      break;
    }
    case 'percent': {
      input = renderPercentage(value);
      break;
    }
    case 'errorInfo': {
      input = renderErrorInfo(value);
      break;
    }
    case 'defaultText':
      input = prefix ? `${prefix}${defaultTextValue}` : defaultTextValue;
      break;
    case 'quill': {
      input = renderQuill(value);
      break;
    }
    case 'number': {
      input = renderNumber(
        value,
        thousandSeparator,
        showThousandSeparator,
        tempNumber
      );
      break;
    }
    case 'file': {
      input = (
        <span className="link" onClickCapture={handleView}>
          {value && value.name}
        </span>
      );
      break;
    }
    case 'view': {
      input = (
        <span className="viewButton">
          {renderViewTypeButton(viewIconType, shelfLifeColor, logColor)}
        </span>
      );
      break;
    }
    case 'text':
    default:
      input = value;
      break;
  }

  if (evaluationProps && 'renderedValue' in evaluationProps) {
    input = evaluationProps.renderedValue;
  }

  const spanType =
    type === 'link' || isLink || type === 'view'
      ? {
          className: 'ag-grid-custom-text-view-value button',
          onClick: () => handleClick && handleClick(data),
        }
      : {
          className: 'ag-grid-custom-text-view-value',
        };
  spanType.style = {
    width: `${
      100 -
      [enableHover, syncPackageCode, errorMessage].filter((e) => e).length * 7
    }%`,
  };
  const classNameArr = ['ag-grid-custom-text-view'];
  if (contentAlign) classNameArr.push(contentAlign);
  return (
    <div className={classNameArr.join(' ')}>
      {isFirstCell &&
      !columnProperty.isServerSide &&
      !actionColumn &&
      data?.isNewRow &&
      !(newRowDelete === false) ? (
        <span
          className="newRowDelete"
          type="button"
          ref={(ref) => {
            if (!ref) return;
            ref.onclick = (e) => {
              e.stopPropagation();
              columnProperty.removeRow(
                data,
                gridRef,
                cellRendererParams.props,
                columnProperty.gridType
              );
              setTimeout(() => {
                if (api && api.redrawRows) {
                  api.redrawRows();
                }
              }, 100);
            };
          }}
        >
          <Delete />
        </span>
      ) : (
        <></>
      )}
      <span {...spanType}>{input}</span>
      {enableHover ||
      syncPackageCode ||
      errorMessage ||
      evaluationProps?.viewCs ||
      evaluationProps?.showWarning ? (
        <div className="info-syn-icon-container">
          {errorMessage && (
            <span
              role="button"
              tabIndex={0}
              onKeyUp={() => onValidatedCellMessage(errorMessage)}
              onClick={onValidatedCellMessage}
              data-tip={errorMessage.message}
              className="ag-grid-custom-text-view-validation"
              data-type="error"
              data-effect="solid"
              data-for="cellError"
              data-tooltip-id="cellError"
              data-tooltip-content={errorMessage.message}
              data-tooltip-place="left"
            >
              !
            </span>
          )}
          {evaluationProps.showWarning && (
            <span
              role="button"
              tabIndex={0}
              onKeyUp={() =>
                onValidatedCellMessage(evaluationProps.warningInfo)
              }
              onClick={onValidatedCellMessage}
              data-tip={evaluationProps.warningInfo}
              className="ag-grid-custom-text-view-warning"
              data-type="warning"
              data-effect="solid"
              data-for="cellWarning"
            >
              !
            </span>
          )}
          {evaluationProps.showlogs && (
            <span
              role="button"
              tabIndex={0}
              onKeyUp={() => onValidatedCellMessage(evaluationProps.logInfo)}
              onClick={onValidatedCellMessage}
              className="ag-grid-custom-text-view-log"
              data-tooltip-id="cellError"
              data-tooltip-content={evaluationProps.logsInfo}
              data-tooltip-place="left"
              aria-label="refreshForRate"
            >
              !
            </span>
          )}
          {evaluationProps.viewCs && (
            <span
              role="button"
              tabIndex={0}
              onKeyUp={() =>
                onValidatedCellMessage(evaluationProps.warningInfo)
              }
              onClick={() => {
                const { onviewCsClick } = evaluationProps;

                onValidatedCellMessage();
                if (onviewCsClick) {
                  onviewCsClick(data);
                }
              }}
              data-tip={evaluationProps.warningInfo}
              className="ag-grid-custom-text-view-warning"
              data-tooltip-id="cellError"
              data-tooltip-content="View Simulation Cost"
              data-tooltip-place="left"
              aria-label="cs"
            >
              <CSIcon />
            </span>
          )}
          {evaluationProps.viewRefreshCell && (
            <span
              role="button"
              tabIndex={0}
              onKeyUp={() =>
                onValidatedCellMessage(evaluationProps.warningInfo)
              }
              onClick={() => {
                const { refreshCell } = evaluationProps;

                if (refreshCell) {
                  refreshCell(data);
                }
              }}
              className="ag-grid-custom-text-view-warning ag-grid-custom-text-refresh-cell"
              data-tooltip-id="cellError"
              data-tooltip-content="Refresh For Rate"
              data-tooltip-place="left"
              aria-label="refreshForRate"
            >
              <Refresh />
            </span>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

CellViewRenderer.propTypes = {
  colDef: any,
  value: any,
  gridChanges: any,
  data: any,
  node: any,
  columnProperty: any,
  api: any,
  gridRef: any,
  props: any,
};

export default CellViewRenderer;
