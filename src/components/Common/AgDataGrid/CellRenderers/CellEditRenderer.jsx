import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { any, number } from 'prop-types';
// import moment from 'moment';
// import Select, { createFilter } from 'react-select';
// import Creatable from 'react-select/creatable';
// import DatePicker from 'react-datepicker';
// import Switch from 'react-switch';
// import { NumericFormat as NumberFormatBase } from 'react-number-format';
// import MaskedInput from 'react-text-mask';
// import { Portal } from 'react-overlays';
// import ReactModal from 'react-modal';
// import PhoneInput from 'react-phone-input-2';
// import DataGridDropDown from './DataGridDropDown';
// import {
//   selectDotNotation,
//   handleTwoDigitDatedateValue,
// } from '../../Utils/commonUtils';
// // import AddressPopUp from './AddressPopUp';
// import FileUpload from './FileUpload/FileUpload';
// import MultiFileUpload from './MultiFileUpload/MultiFileUpload';
// import 'react-datepicker/dist/react-datepicker.css';

function CalendarContainer({ children }) {
  const el = document.getElementById('calendar-portal');
  return <Portal container={el}>{children}</Portal>;
}

CalendarContainer.propTypes = {
  children: any,
};

// const customFilter = createFilter({
//   ignoreCase: true,
//   ignoreAccents: true,
//   trim: true,
//   matchFrom: 'start',
// });

const CellEditRenderer = forwardRef((props, ref) => {
  const { colDef, value: propValue, api, rowIndex, column, charPress } = props;
  const { cellEditorParams, field } = colDef;
  const {
    cell,
    cellProps,
    dynamicProps,
    onChange,
    addressFieldKeys,
    importAddressData,
    valueGetter,
  } = cellEditorParams;
  const evaluatedProps =
    cell || cellProps || (dynamicProps && dynamicProps(props));
  const {
    valueKey,
    labelKey,
    type,
    isMulti,
    handleSubValueSelect,
    subColumns,
    handleErrorInfo,
    decimalSeparator,
    thousandSeparator,
    allowLeadingZeros,
    decimalScale,
    fixedDecimalScale,
    disabled,
    endpoint,
    maxLength,
    getOptionData,
    allowNegative = false,
    fileDocTypeOptions,
    allUsersList,
    permissions,
  } = evaluatedProps;

  const getOptions = (cell) => {
    const { options } = cell;
    const data = [];
    if (options) {
      options.forEach((v) => {
        if (v.hasOwnProperty('active')) {
          if (v.active) {
            data.push(v);
          }
        } else {
          data.push(v);
        }
      });
      return data || [];
    }
    return [];
  };
  const options = getOptions(evaluatedProps);

  // Initial state logic
  const createInitialState = () => {
    let startValue;
    if (props.eventKey === 'Backspace' || props.eventKey === 'Delete') {
      startValue = null;
    } else if (props.charPress) {
      startValue = props.charPress;
      if (type === 'date' && parseInt(props.charPress, 10) > 1) {
        startValue = `0${props.charPress}`;
      }
      if (type === 'percent') {
        startValue = parseInt(props.charPress, 10);
      }
      if (['currency', 'number', 'unformatednumber'].includes(type)) {
        const floatValue = parseFloat(props.charPress);
        if (Number.isNaN(floatValue)) {
          startValue = propValue;
        } else {
          startValue = floatValue;
        }
      }
    } else {
      startValue = propValue;
    }
    if (['dataGridDropDown', 'select', 'address', 'creatable'].includes(type)) {
      return {
        value: propValue,
        startValue: props.charPress || '',
        type,
      };
    }
    return {
      value: startValue,
      type,
    };
  };

  const [state, setState] = useState(createInitialState);
  const inputElem = useRef(null);
  const switchRef = useRef(null);

  // Expose getValue for AgGrid
  useImperativeHandle(ref, () => ({
    getValue: () => {
      const { value, type } = state;
      if (type && type === 'date' && value && value.length <= 2) {
        return null;
      }
      return value;
    },
  }));

  const setCaretPosition = (ctrl, pos) => {
    if (ctrl && ctrl.setSelectionRange) {
      ctrl.setSelectionRange(pos, pos);
    }
  };

  // For caret position logic (currency/percent)
  React.useEffect(() => {
    if (
      inputElem.current &&
      !state.valueChanged &&
      ['currency', 'percent'].includes(type)
    ) {
      const { length } = inputElem.current.value;
      if (parseFloat(inputElem.current.value)) {
        if (charPress) {
          setCaretPosition(
            inputElem.current,
            length - (type === 'currency' ? 5 : 3)
          );
        }
      } else {
        setCaretPosition(inputElem.current, 1);
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleTextChange = (e) => {
    setState((prev) => ({
      ...prev,
      value: (e && e.target && e.target.value) || '',
    }));
  };

  const stopEditing = () => {
    setTimeout(() => {
      api.stopEditing();
    });
  };

  switch (type) {
    case 'dataGridDropDown':
      return (
        <DataGridDropDown
          value={state.value}
          options={options}
          getOptionData={getOptionData}
          evaluatedProps={evaluatedProps}
          isMulti={isMulti}
          labelKeyName={labelKey}
          valueKeyName={valueKey}
          endpoint={endpoint}
          defaultInputValue={state.startValue}
          onChange={onChange}
          handleSubValueSelect={(changeProps) => {
            const { selectedRowsData } = changeProps;
            const isValueChange =
              state.value !==
              (selectedRowsData &&
                selectedRowsData[0][valueGetter ? labelKey : valueKey]);
            if (isValueChange) {
              setState((prev) => ({
                ...prev,
                value:
                  (selectedRowsData && selectedRowsData[0][valueKey]) || null,
              }));
              api.stopEditing();
              if (handleSubValueSelect) {
                handleSubValueSelect({
                  ...changeProps,
                  ...props,
                });
              }
            }
          }}
          handleClose={() => {
            api.setFocusedCell(rowIndex, column);
            api.stopEditing();
          }}
          subColumns={subColumns}
          handleErrorInfo={handleErrorInfo}
          dataFieldKey={field}
          disabled={disabled}
        />
      );
    case 'creatable': {
      const creatableOptions = (options || []).map((opt) => ({
        ...opt,
        label: opt[labelKey],
        value: opt[valueKey],
      }));
      const optionsData = creatableOptions.find((v) => v.value === state.value);
      return (
        <Creatable
          value={optionsData}
          options={creatableOptions}
          onChange={(selected) => {
            setState((prev) => ({
              ...prev,
              value: selected.value,
            }));
            stopEditing();
          }}
          className="gridSelect"
          classNamePrefix="react-select"
          openMenuOnFocus
          autoFocus
          menuPortalTarget={document.body}
          defaultInputValue={state.startValue}
          styles={{
            menu: (provided) => ({ ...provided, marginTop: 0 }),
            menuPortal: (provided) => ({
              ...provided,
              zIndex: '99',
            }),
          }}
        />
      );
    }
    case 'select': {
      const vKey = valueKey;
      const lKey = labelKey || vKey;
      const getOptionValue = (o) => selectDotNotation(o, vKey);
      const getOptionLabel = (o) => selectDotNotation(o, lKey);

      // Prepare value for AntD Select
      const value = isMulti
        ? state.value
        : state.value !== undefined
        ? state.value
        : undefined;

      // Prepare options for AntD Select
      const selectOptions = (options || []).map((o) => ({
        label: getOptionLabel(o),
        value: getOptionValue(o),
        original: o,
      }));

      return (
        <div>
          <Select
            options={selectOptions}
            value={value}
            mode={isMulti ? 'multiple' : undefined}
            showSearch
            allowClear
            placeholder={state.startValue}
            className="gridSelect"
            disabled={disabled}
            autoFocus
            filterOption={customFilter}
            onChange={(newValue, option) => {
              // For multi-select, newValue is an array; for single, it's a value
              if (state.value !== newValue) {
                setState((prev) => ({
                  ...prev,
                  value: newValue,
                }));
              }
              stopEditing();
            }}
            dropdownStyle={{ zIndex: 99 }}
            getPopupContainer={() => document.body}
          />
        </div>
      );
    }
    case 'number':
    case 'unformatednumber':
      return (
        <NumberFormatBase
          className="gridInput"
          value={state.value && !isNaN(state.value) && state.value}
          displayType="input"
          decimalSeparator={decimalSeparator}
          allowLeadingZeros={allowLeadingZeros || false}
          maxLength={maxLength || null}
          onValueChange={(changeProps) => {
            const { floatValue } = changeProps;
            setState((prev) => ({
              ...prev,
              value: floatValue === 0 ? 0 : floatValue || null,
            }));
          }}
          isNumericString
          disabled={disabled}
          decimalScale={decimalScale === 0 ? 0 : decimalScale || 2}
          fixedDecimalScale={fixedDecimalScale}
          onBlur={stopEditing}
          autoFocus
          allowNegative={allowNegative}
        />
      );
    case 'date': {
      const updatedValue = state.value;
      const dateFormat = 'MM/dd/yyyy';
      let formattedDate =
        (updatedValue || propValue) &&
        moment.utc(updatedValue || propValue).format('MM/DD/YYYY');
      if (
        updatedValue &&
        updatedValue.length <= 2 &&
        formattedDate !== 'Invalid date'
      ) {
        formattedDate = updatedValue;
      }
      return (
        <DatePicker
          className="formInput"
          selected={
            formattedDate &&
            formattedDate !== 'Invalid date' &&
            formattedDate.length > 2
              ? new Date(formattedDate)
              : null
          }
          onChange={(changeProps) => {
            const date = handleTwoDigitDatedateValue(changeProps);
            if (date !== 'Invalid date') {
              setState((prev) => ({
                ...prev,
                value: date,
              }));
            }
            stopEditing();
          }}
          customInput={
            <MaskedInput
              type="text"
              mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            />
          }
          disabled={disabled}
          placeholderText="MM-DD-YYYY"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          dateFormat={dateFormat}
          value={formattedDate}
          autoComplete="off"
          autoFocus
          popperContainer={CalendarContainer}
          onBlur={stopEditing}
        />
      );
    }
    case 'switch':
      return (
        <Switch
          ref={switchRef}
          onChange={(changeProps) => {
            setState((prev) => ({
              ...prev,
              value: changeProps,
            }));
            if (onChange) {
              onChange(changeProps);
            }
            stopEditing();
          }}
          onKeyUpCapture={(event) => {
            if (event.keyCode === 39) {
              setState((prev) => ({ ...prev, value: true }));
            }
            if (event.keyCode === 37) {
              setState((prev) => ({ ...prev, value: false }));
            }
          }}
          checked={state.value || false}
          disabled={disabled}
          onColor="#2f52b6"
          onHandleColor="#FFFFFF"
          activeBoxShadow="0px 0px 0px 0px rgba(0, 0, 0, 0.2)"
          height={16}
          width={44}
          handleDiameter={26}
          uncheckedIcon={false}
          checkedIcon={false}
          className="react-switch switch-center ag-grid-custom-switch"
          autoFocus
          onBlurCapture={stopEditing}
        />
      );
    case 'currency':
      return (
        <NumberFormatBase
          className="gridInput"
          value={state.value || 0}
          displayType="input"
          decimalSeparator={decimalSeparator}
          allowLeadingZeros={allowLeadingZeros || false}
          onValueChange={(changeProps) => {
            const { floatValue } = changeProps;
            setState((prev) => ({
              ...prev,
              value: floatValue === 0 ? 0 : floatValue || null,
              valueChanged: true,
            }));
          }}
          isNumericString
          disabled={disabled}
          decimalScale={decimalScale || 2}
          fixedDecimalScale={fixedDecimalScale}
          onBlur={stopEditing}
          getInputRef={(el) => {
            inputElem.current = el;
          }}
          isAllowed={(params) => {
            if (params.value.length > 13) {
              return false;
            }
            return true;
          }}
          autoFocus
        />
      );
    case 'percent': {
      const integerValue = state.value === '' ? '' : state.value;
      return (
        <NumberFormatBase
          className="gridInput"
          value={integerValue}
          displayType="input"
          decimalSeparator={decimalSeparator}
          thousandSeparator={thousandSeparator || true}
          onValueChange={(changeProps) => {
            const decimalValue =
              changeProps.value === '' ? null : changeProps.value;
            setState((prev) => ({
              ...prev,
              value: decimalValue,
              valueChanged: true,
            }));
          }}
          onBlur={stopEditing}
          disabled={disabled}
          isNumericString
          autoFocus
          decimalScale={decimalScale || 2}
          fixedDecimalScale={fixedDecimalScale}
          getInputRef={(el) => {
            inputElem.current = el;
          }}
        />
      );
    }
    case 'file': {
      const {
        uploadType,
        hideUploadButton,
        title,
        getFileUploadingState,
        getIsSubmittingState,
        allowedFileTypes,
      } = evaluatedProps;
      return (
        <FileUpload
          files={state.value}
          title={title}
          instantUpload={false}
          uploadType={uploadType}
          handleFileChange={(params) => {
            const file = {
              add: (params && params.add) || [],
              remove:
                (params && params.remove) ||
                (state.value && state.value.remove) ||
                [],
              fileName: params ? params.fileName : '',
              mimeType: params ? params.mimeType : '',
              name:
                (params &&
                  (params.preview ? params.preview.name : params.name)) ||
                '',
              preview: (params && params.preview) || null,
              utils: (params && params.utils) || null,
            };
            setState((prev) => ({
              ...prev,
              value: file,
            }));
            stopEditing();
          }}
          disabled={disabled}
          allowedFileTypes={allowedFileTypes}
          hideUploadButton={hideUploadButton}
          getFileUploadingState={getFileUploadingState}
          getIsSubmittingState={getIsSubmittingState}
        />
      );
    }
    case 'multiFileUpload': {
      const { parentID } = evaluatedProps;
      return (
        <MultiFileUpload
          {...props}
          edit
          stopEditing={stopEditing}
          parentID={parentID}
          fileDocTypeOptions={fileDocTypeOptions}
          allUsersList={allUsersList}
          permissions={permissions || {}}
          onChange={(params) => {
            const { data } = params;
            const { fileDetails } = data || {};
            setState((prev) => ({
              ...prev,
              value: fileDetails || [],
              valueChanged: true,
            }));
            stopEditing();
          }}
        />
      );
    }
    case 'phone': {
      return (
        <div className="phone-editor-popup">
          <PhoneInput
            country="th"
            value={state.value}
            displayInitialValueAsLocalNumber={false}
            layout="second"
            onChange={(params) => {
              setState((prev) => ({
                ...prev,
                value: params.data,
              }));
            }}
            disabled={disabled}
          />
        </div>
      );
    }
    default:
      return (
        <div className="ag-grid-custom-text">
          {console.log('i am here')}
          <input
            name={field}
            className="ag-grid-custom-text-input"
            autoComplete="new-password"
            type="text"
            value={state.value}
            onChange={handleTextChange}
            disabled={disabled}
            autoFocus
            onBlur={stopEditing}
            maxLength={maxLength}
          />
        </div>
      );
  }
});

CellEditRenderer.propTypes = {
  colDef: any,
  value: any,
  api: any,
  rowIndex: number,
  column: any,
  charPress: any,
};

export default CellEditRenderer;
