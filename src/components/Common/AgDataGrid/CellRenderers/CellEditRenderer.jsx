import React, { Component } from 'react';
import { any, number } from 'prop-types';
// import moment from 'moment';
// import Select, { createFilter } from 'react-select';
// import Creatable from 'react-select/creatable';
import DatePicker from 'react-datepicker';
// import Switch from 'react-switch';
// import { NumericFormat as NumberFormatBase } from 'react-number-format';
// import MaskedInput from 'react-text-mask';
import { Portal } from 'react-overlays';
// import ReactModal from 'react-modal';
// import PhoneInput from 'react-phone-input-2';
// import DataGridDropDown from './DataGridDropDown';
import {
  selectDotNotation,
  //   handleTwoDigitDatedateValue,
} from '../../Utils/CommonUtils';
// import AddressPopUp from './AddressPopUp';
// import FileUpload from './FileUpload/FileUpload';
// import MultiFileUpload from './MultiFileUpload/MultiFileUpload';
import 'react-datepicker/dist/react-datepicker.css';

// function CalendarContainer({ children }) {
//   const el = document.getElementById('calendar-portal');

//   return <Portal container={el}>{children}</Portal>;
// }

// CalendarContainer.propTypes = {
//   children: any,
// };

// const customFilter = createFilter({
//   ignoreCase: true,
//   ignoreAccents: true,
//   trim: true,
//   matchFrom: 'start',
// });

export default class CellEditRenderer extends Component {
  static propTypes = {
    colDef: any,
    value: any,
    api: any,
    rowIndex: number,
    column: any,
    charPress: any,
  };

  state = {
    value: this.props.value,
  };

  constructor(props) {
    super(props);
    // eslint-disable-next-line react/state-in-constructor
    this.state = this.createInitialState(props);
  }

  /* Utility methods */
  createInitialState = (props) => {
    const { colDef, value } = props;
    const { cellEditorParams } = colDef;
    const { cell, cellProps, dynamicProps } = cellEditorParams;
    const evaluatedProps =
      cell || cellProps || (dynamicProps && dynamicProps(this.props));
    const { type } = evaluatedProps;

    let startValue;
    if (props.eventKey === 'Backspace' || props.eventKey === 'Delete') {
      // if backspace or delete pressed, we clear the cell
      startValue = null;
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
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
          startValue = value;
        } else {
          startValue = floatValue;
        }
      }
    } else {
      // otherwise we start with the current value
      startValue = props.value;
    }

    if (['dataGridDropDown', 'select', 'address', 'creatable'].includes(type)) {
      return {
        value,
        startValue: props.charPress || '',
        type,
      };
    }

    return {
      value: startValue,
      type,
    };
  };

  getOptions = (cell) => {
    const { options } = cell;
    const data = [];
    if (options) {
      options.forEach((v) => {
        // eslint-disable-next-line no-prototype-builtins
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

  /* this function use by AgGrid to get value from custom editor as DatePicker, Select etc. */
  getValue() {
    const { value, type } = this.state;
    if (type && type === 'date' && value && value.length <= 2) {
      return null;
    }
    return value;
  }

  handleTextChange = (e) => {
    this.setState({ value: (e && e.target && e.target.value) || '' });
  };

  stopEditing = () => {
    const { api } = this.props;
    setTimeout(() => {
      api.stopEditing();
    });
  };

  setCaretPosition = (ctrl, pos) => {
    if (ctrl.setSelectionRange) {
      ctrl.setSelectionRange(pos, pos);
    }
  };

  render() {
    const { colDef, api, rowIndex, column, charPress } = this.props;
    const { value, startValue, valueChanged } = this.state;
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
      cell || cellProps || (dynamicProps && dynamicProps(this.props));
    const {
      valueKey,
      labelKey,
      type,
      isMulti,
      // onChange,
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
    const options = this.getOptions(evaluatedProps);
    if (
      this.inputElem &&
      !valueChanged &&
      ['currency', 'percent'].includes(type)
    ) {
      const { length } = this.inputElem.value;
      if (parseFloat(this.inputElem.value)) {
        if (charPress) {
          this.setCaretPosition(
            this.inputElem,
            length - (type === 'currency' ? 5 : 3)
          );
        }
      } else {
        this.setCaretPosition(this.inputElem, 1);
      }
    }
    switch (type) {
      case 'dataGridDropDown': {
        return (
          <DataGridDropDown
            value={value}
            options={options}
            getOptionData={getOptionData}
            evaluatedProps={evaluatedProps}
            isMulti={isMulti}
            labelKeyName={labelKey}
            valueKeyName={valueKey}
            endpoint={endpoint}
            defaultInputValue={startValue}
            // setValue={setValue}
            // cellValue={cellValue}
            onChange={onChange}
            handleSubValueSelect={(changeProps) => {
              const { selectedRowsData } = changeProps;
              const isValueChange =
                value !==
                (selectedRowsData &&
                  selectedRowsData[0][valueGetter ? labelKey : valueKey]);
              if (isValueChange) {
                this.setState(
                  {
                    value:
                      (selectedRowsData && selectedRowsData[0][valueKey]) ||
                      null,
                  },
                  () => {
                    api.stopEditing();
                  }
                );
                if (handleSubValueSelect) {
                  handleSubValueSelect({
                    ...changeProps,
                    ...this.props,
                  });
                }
              }
            }}
            handleClose={() => {
              api.setFocusedCell(rowIndex, column);
              api.stopEditing();
            }}
            // row={row}
            subColumns={subColumns}
            handleErrorInfo={handleErrorInfo}
            dataFieldKey={field}
            disabled={disabled}
          />
        );
      }
      // case 'address': {
      //   return (
      //     <AddressPopUp
      //       {...this.props}
      //       importAddressData={importAddressData}
      //       fieldKeys={addressFieldKeys}
      //       stopEditing={this.stopEditing}
      //       onChange={(params) => {
      //         this.setState({ value: params.renderAddressValue });
      //         this.props.api.applyTransaction({
      //           update: [
      //             {
      //               ...params.data,
      //             },
      //           ],
      //         });
      //         this.stopEditing();
      //       }}
      //     />
      //   );
      // }
      case 'creatable': {
        const creatableOptions = (options || []).map((opt) => ({
          ...opt,
          label: opt[labelKey],
          value: opt[valueKey],
        }));
        const optionsData = creatableOptions.find((v) => v.value === value);
        return (
          <Creatable
            value={optionsData}
            options={creatableOptions}
            onChange={(selected) => {
              this.setState({ value: selected.value });
              this.stopEditing();
            }}
            className="gridSelect"
            classNamePrefix="react-select"
            openMenuOnFocus
            autoFocus
            menuPortalTarget={document.body}
            defaultInputValue={startValue}
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
        options.sort = labelKey; // always sort by label name
        const vKey = valueKey;
        const lKey = labelKey || vKey;

        const getOptionValue = (o) => selectDotNotation(o, vKey);
        const getOptionLabel = (o) => selectDotNotation(o, lKey);
        const optionsData =
          options &&
          options.filter(
            (o) => selectDotNotation(o, valueGetter ? lKey : vKey) === value
          );
        return (
          <div>
            <Select
              options={options}
              value={isMulti ? value : optionsData}
              isMulti={isMulti}
              searchEnabled
              getOptionLabel={lKey ? getOptionLabel : getOptionValue}
              getOptionValue={getOptionValue}
              displayExpr={labelKey}
              valueExpr={valueKey}
              defaultInputValue={startValue}
              showClearButton
              className="gridSelect"
              onChange={(changeProps) => {
                const newValue = isMulti
                  ? changeProps
                  : changeProps && changeProps[vKey];
                if (value !== newValue) {
                  this.setState({ value: newValue });
                }
                this.stopEditing();
              }}
              // onBlur={() => {
              // 	api.stopEditing()
              // }}
              classNamePrefix="react-select"
              disabled={disabled}
              openMenuOnFocus
              autoFocus
              menuPortalTarget={document.body}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  marginTop: 0,
                }),
                menuPortal: (provided) => ({
                  ...provided,
                  zIndex: '99',
                }),
              }}
              filterOption={customFilter}
              menuPosition="fixed"
              isClearable
            />
          </div>
        );
      }
      case 'number':
      case 'unformatednumber':
        return (
          <NumberFormatBase
            className="gridInput"
            // eslint-disable-next-line no-restricted-globals
            value={value && !isNaN(value) && value}
            displayType="input"
            decimalSeparator={decimalSeparator}
            // thousandSeparator={
            // 	thousandSeparator === undefined
            // 		? true
            // 		: thousandSeparator
            // }
            allowLeadingZeros={allowLeadingZeros || false}
            maxLength={maxLength || null}
            onValueChange={(changeProps) => {
              const { floatValue } = changeProps;
              this.setState({
                value: floatValue === 0 ? 0 : floatValue || null,
              });
            }}
            isNumericString
            disabled={disabled}
            decimalScale={decimalScale === 0 ? 0 : decimalScale || 2}
            fixedDecimalScale={fixedDecimalScale}
            onBlur={() => {
              this.stopEditing();
            }}
            autoFocus
            allowNegative={allowNegative}
          />
        );
      case 'date': {
        const updatedValue = this.state.value;
        const dateFormat = 'MM/dd/yyyy';
        let formattedDate =
          (updatedValue || value) &&
          moment.utc(updatedValue || value).format('MM/DD/YYYY');
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
            // minDate={minDate || null}
            onChange={(changeProps) => {
              const date = handleTwoDigitDatedateValue(changeProps);
              if (date !== 'Invalid date') {
                this.setState({ value: date });
              }
              this.stopEditing();
            }}
            customInput={
              <MaskedInput
                type="text"
                // eslint-disable-next-line prettier/prettier
                mask={[
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
              />
            }
            disabled={disabled}
            placeholderText="MM-DD-YYYY"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat={dateFormat}
            // name={accessor}
            value={formattedDate}
            autoComplete="off"
            autoFocus
            popperContainer={CalendarContainer}
            onBlur={() => {
              this.stopEditing();
            }}
          />
        );
      }
      case 'switch':
        return (
          <Switch
            ref={this.switchRef}
            onChange={(changeProps) => {
              this.setState({ value: changeProps });
              if (onChange) {
                onChange(changeProps);
              }
              this.stopEditing();
            }}
            onKeyUpCapture={(event) => {
              if (event.keyCode === 39) {
                this.setState({ value: true });
              }
              if (event.keyCode === 37) {
                this.setState({ value: false });
              }
            }}
            checked={value || false}
            disabled={disabled}
            onColor="#2f52b6"
            onHandleColor="#FFFFFF"
            // boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 0px 0px rgba(0, 0, 0, 0.2)"
            height={16}
            width={44}
            handleDiameter={26}
            uncheckedIcon={false}
            checkedIcon={false}
            className="react-switch switch-center ag-grid-custom-switch"
            autoFocus
            onBlurCapture={() => {
              this.stopEditing();
            }}
            // menuIsOpen={true}
          />
        );
      case 'currency':
        return (
          <NumberFormatBase
            className="gridInput"
            value={value || 0}
            displayType="input"
            decimalSeparator={decimalSeparator}
            // thousandSeparator={thousandSeparator || true}
            allowLeadingZeros={allowLeadingZeros || false}
            onValueChange={(changeProps) => {
              const { floatValue } = changeProps;
              this.setState({
                value: floatValue === 0 ? 0 : floatValue || null,
                valueChanged: true,
              });
            }}
            isNumericString
            disabled={disabled}
            decimalScale={decimalScale || 2}
            fixedDecimalScale={fixedDecimalScale}
            onBlur={() => {
              this.stopEditing();
            }}
            getInputRef={(el) => {
              this.inputElem = el;
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
        const integerValue = value === '' ? '' : value;
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
              this.setState({
                value: decimalValue,
                valueChanged: true,
              });
            }}
            onBlur={() => {
              this.stopEditing();
            }}
            disabled={disabled}
            isNumericString
            autoFocus
            decimalScale={decimalScale || 2}
            fixedDecimalScale={fixedDecimalScale}
            getInputRef={(el) => {
              this.inputElem = el;
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
            files={value}
            title={title}
            instantUpload={false}
            uploadType={uploadType}
            handleFileChange={(params) => {
              const file = {
                add: (params && params.add) || [],
                remove:
                  (params && params.remove) || (value && value.remove) || [],
                fileName: params ? params.fileName : '',
                mimeType: params ? params.mimeType : '',
                name:
                  (params &&
                    (params.preview ? params.preview.name : params.name)) ||
                  '',
                preview: (params && params.preview) || null,
                utils: (params && params.utils) || null,
              };

              this.setState({
                value: file,
              });
              this.stopEditing();
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
            {...this.props}
            edit
            stopEditing={this.stopEditing}
            parentID={parentID}
            fileDocTypeOptions={fileDocTypeOptions}
            allUsersList={allUsersList}
            permissions={permissions || {}}
            onChange={(params) => {
              const { data } = params;
              const { fileDetails } = data || {};
              this.setState({
                value: fileDetails || [],
                valueChanged: true,
              });
              this.stopEditing();
            }}
          />
        );
      }
      case 'phone': {
        return (
          <div className="phone-editor-popup">
            <PhoneInput
              country="th"
              value={value}
              displayInitialValueAsLocalNumber={false}
              layout="second"
              // name={accessor}
              onChange={(params) => {
                this.setState({
                  value: params.data,
                });
              }}
              // onBlur={this.selectBlur}
              disabled={disabled}
              // styles={{
              //   menu: (provided) => {
              //     return { ...provided, marginTop: 0 };
              //   },
              //   menuPortal: (provided) => {
              //     return {
              //       ...provided,
              //       zIndex: '99',
              //     };
              //   },
              // }}
            />
          </div>
        );
      }
      default:
        return (
          <div className="ag-grid-custom-text">
            <input
              name={field}
              className="ag-grid-custom-text-input"
              autoComplete="new-password"
              type="text"
              value={value}
              onChange={this.handleTextChange}
              disabled={disabled}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlur={() => {
                this.stopEditing();
              }}
              maxLength={maxLength}
            />
          </div>
        );
    }
  }
}
