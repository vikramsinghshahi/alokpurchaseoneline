import React, { PureComponent } from 'react';
import {
  string,
  bool,
  func,
  any,
  oneOf,
  arrayOf,
  object,
  number,
  instanceOf,
  shape,
} from 'prop-types';
import Switch from 'react-switch';
import Select, { createFilter } from 'react-select';
import Creatable from 'react-select/creatable';
import DatePicker from 'react-datepicker';
// import { NumericFormat } from 'react-number-format'
import { NumericFormat } from 'react-number-format';
// import AddressPop from 'Common/AddressPop/AddressPop';
// import FileUpload from 'Common/FileUpload/FileUpload';
// import NewFileUpload from 'Common/FileUpload/NewFileUpload';
import ReactQuill from 'react-quill';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2';
import {
  sortOptions,
  selectDotNotation,
  formatDate,
  debounce,
} from '../Utils/CommonUtils';
import 'react-quill/dist/quill.snow.css';
import './DataField.scss';
import 'react-phone-input-2/lib/style.css';
// import NewFileList from 'Common/FileUpload/NewFileList';
import MaskedInput from 'react-text-mask';
// import Dropdown from '../DropDown/Dropdown';
import DataFieldGridDropDown from './DataFieldGridDropDown';
// Custom Filter for React Select
const customFilter = createFilter({
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
  //   matchFrom: 'start',
});
export default class DataField extends PureComponent {
  static propTypes = {
    /** test */
    className: string,
    // title of input field label
    title: string,
    // type of input returned
    type: oneOf([
      'text',
      'number',
      'percent',
      'currency',
      'date',
      'phone',
      'quill',
      'textarea',
      'switch',
      'select',
      'creatable',
      'address',
      'file2',
      'negative',
      'file',
      'dataGridDropDown',
      'dropdown',
      'generatePassword',
      'dataFieldGridDropDown',
      'custom',
      'dateTime',
    ]).isRequired,
    // the value passed to the input
    value: any,
    // the key passed to onChange handler (also the field name for file upload post request)
    accessor: string,
    // onChange(key, value)
    onChange: func,
    error: string,
    handleBlur: func,
    touched: any,
    setFieldTouched: func,
    disabled: bool,
    // SELECT:
    // array of options for the select
    options: arrayOf(object),
    // set if Select can be cleared
    clearable: bool,
    // sort the Select options alphabetically
    sorting: any,
    // the key in the options array to use as the value
    valueKey: string,
    // the key in the options array to use as the label
    labelKey: string,
    isLoading: bool,
    // PERCENT, CURRENCY:
    decimalScale: number,
    fixedDecimalScale: bool,
    // QUILL:
    ref: shape({ current: instanceOf(Element) }),
    // rows of text for TEXTAREA or QUILL
    rows: number,
    // FILE2
    onFileUploadSuccess: func,
    allowedFileTypes: arrayOf(string),
    maxNumberOfFiles: number,
    files: arrayOf(string),
    // table name to get the URL for upload post request
    table: string,
    recID: string,
    // ADDRESS:
    // override the keys used for country, state, postalCode, ect
    fieldKeys: object,
    placeholder: string,
    isInline: bool,
    isMulti: bool,
    onFileDelete: func,
    maxLength: number,
    isVisibleDelete: bool,
    handleDeleteFile: func,
    uploadType: string,
    format: string,
    handleFileChange: func,
    minDate: instanceOf(Date),
    instantUpload: any,
    refOn: any,
    allowLeadingZeros: bool,
    thousandSeparator: any,
    decimalSeparator: bool,
    subColumns: any,
    endpoint: string,
    genPassword: any,
    setFieldValue: any,
    template: any,
    uploadingFiles: any,
    fileUploaderTitle: any,
    showQuickFilter: bool,
    quillFormats: any,
    width: any,
    isRowSelectable: any,
    description: string,
    filterInactive: bool,
    hideUploadButton: bool,
    getIsSubmittingState: func,
    getFileUploadingState: func,
    showOverFlow: bool,
    defaultCountry: any,
    showBackgroundColor: any,
    switchTextStart: any,
    switchTextEnd: any,
  };

  static defaultProps = {
    clearable: true,
    disabled: false,
    className: '',
    sorting: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    rows: 5,
    isInline: false,
    isMulti: false,
    showOverFlow: false,
    defaultCountry: 'in',
    showBackgroundColor: false,
  };

  debouncedQuill = debounce((value, delta, source, editor) => {
    const { onChange, accessor } = this.props;
    onChange(accessor, value, delta, source, editor);
  }, 300);

  handleTextChange = (event) => {
    const { target } = event;
    const { value } = target;
    const { onChange, accessor } = this.props;
    onChange(accessor, value);
  };

  // TODO: Return null instead of empty string on all inputs?
  handleNumberChange = (values) => {
    const { value } = values;
    const { onChange, accessor } = this.props;
    onChange(accessor, value === '' ? null : value);
  };

  handlePhoneNumberChange = (values, country) => {
    const cleanValue =
      values && values.substring(0, 2) === '+1'
        ? values.substring(2).replace(/[+|\-| |(|)]/g, '')
        : values;
    if (cleanValue && country.name) {
      const { onChange, accessor } = this.props;
      onChange(accessor, cleanValue === '' ? null : cleanValue);
    }
  };

  handlePercentChange = (values) => {
    const { value } = values;
    const { onChange, accessor } = this.props;
    onChange(accessor, value === '' ? null : value / 100);
  };

  handleSwitch = (value) => {
    const { onChange, accessor } = this.props;
    onChange(accessor, value);
  };

  handleDateChange = (value) => {
    const { onChange, accessor, handleBlur } = this.props;
    const formattedDate = value && formatDate(value);
    const date = formattedDate === '' ? null : formattedDate;
    onChange(accessor, date);
    // if (handleBlur) {
    // 	handleBlur(date)
    // }
  };

  handleSelect = (option) => {
    const { onChange, accessor, valueKey, isMulti } = this.props;
    let selectedOption = null;
    if (isMulti) {
      selectedOption = option;
    } else {
      selectedOption =
        option && option[valueKey] === 0
          ? 0
          : (option && option[valueKey]) || null;
    }
    onChange(accessor, selectedOption);
  };

  handleDataGridDropdownChange = (component) => {
    const { onChange, accessor } = this.props;
    const value =
      (component &&
        component.selectedRowsData &&
        component.selectedRowsData.length &&
        component.selectedRowsData[0].id) ||
      null;
    onChange(accessor, value);
  };

  handleCreatableSelectChange = (newValue) => {
    const { onChange, accessor } = this.props;
    onChange(accessor, newValue?.value || null);
  };

  handleQuillChange = (value, delta, source, editor) => {
    if (source === 'user') {
      this.debouncedQuill(value, delta, source, editor);
    }
  };

  selectBlur = () => {
    const { setFieldTouched, accessor, handleBlur } = this.props;
    setFieldTouched(accessor, true);
    if (handleBlur) handleBlur();
  };

  render() {
    const {
      title,
      className,
      type,
      disabled,
      options,
      accessor,
      valueKey,
      labelKey,
      decimalScale,
      fixedDecimalScale,
      clearable,
      ref,
      onChange,
      rows,
      onFileUploadSuccess,
      allowedFileTypes,
      maxNumberOfFiles,
      files,
      table,
      recID,
      isLoading,
      sorting,
      fieldKeys,
      error,
      handleBlur,
      touched,
      setFieldTouched,
      placeholder,
      isInline,
      isMulti,
      onFileDelete,
      maxLength,
      isVisibleDelete,
      handleDeleteFile,
      uploadType,
      handleFileChange,
      minDate,
      format,
      allowLeadingZeros,
      thousandSeparator,
      subColumns,
      decimalSeparator,
      endpoint,
      genPassword,
      setFieldValue,
      uploadingFiles,
      fileUploaderTitle,
      showQuickFilter,
      quillFormats,
      width,
      template,
      isRowSelectable,
      description,
      filterInactive,
      hideUploadButton,
      required,
      showOverFlow,
      allowNegative,
      defaultCountry,
      showBackgroundColor,
      switchTextStart,
      switchTextEnd,
    } = this.props;

    let input = null;
    let { value } = this.props;
    value = value == null ? '' : value;

    let dataFieldClass = 'dataField';

    switch (type) {
      case 'text': {
        input = (
          <input
            name={accessor}
            className="formInput"
            autoComplete="new-password"
            type="text"
            value={value}
            maxLength={maxLength || null}
            onChange={this.handleTextChange}
            disabled={disabled}
            // onBlur={setFieldTouched ? this.selectBlur : undefined}
            onBlur={handleBlur}
          />
        );
        break;
      }
      case 'textArea': {
        input = (
          <textarea
            name={accessor}
            className="textArea"
            autoComplete="off"
            value={value}
            maxLength={maxLength || null}
            onChange={this.handleTextChange}
            disabled={disabled}
            onBlur={handleBlur}
            rows={rows || 3}
          />
        );
        break;
      }
      // case 'generatePassword': {
      //   input = (
      //     <>
      //       {/* <input
      //         name={accessor}
      //         className="formInput"
      //         autoComplete="new-password"
      //         type="text"
      //         value={value}
      //         maxLength={maxLength || null}
      //         onChange={this.handleTextChange}
      //         disabled={disabled}
      //         onBlur={handleBlur}
      //       /> */}
      //       <button
      //         disabled={disabled}
      //         className="generatePassword"
      //         onClick={() => genPassword(setFieldValue)}
      //       >
      //         GENERATE PASSWORD
      //       </button>
      //     </>
      //   );
      //   break;
      // }
      case 'percent': {
        const integerValue = value === '' ? '' : value * 100;
        input = (
          <NumericFormat
            className="formInput"
            value={integerValue}
            name={accessor}
            onBlur={handleBlur}
            displayType="input"
            thousandSeparator={
              thousandSeparator === undefined ? true : thousandSeparator
            }
            allowLeadingZeros={
              allowLeadingZeros === undefined ? false : allowLeadingZeros
            }
            onValueChange={this.handlePercentChange}
            isNumericString
            suffix="%"
            decimalScale={decimalScale}
            // fixedDecimalScale={fixedDecimalScale}
            disabled={disabled}
            allowNegative={allowNegative}
          />
        );
        break;
      }
      case 'currency': {
        input = (
          <NumericFormat
            className="formInput"
            value={value}
            name={accessor}
            onBlur={handleBlur}
            displayType="input"
            prefix=""
            onValueChange={this.handleNumberChange}
            thousandSeparator={
              thousandSeparator === undefined ? true : thousandSeparator
            }
            allowLeadingZeros={
              allowLeadingZeros === undefined ? false : allowLeadingZeros
            }
            isNumericString
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            disabled={disabled}
          />
        );
        break;
      }
      case 'date': {
        const dateFormat = format || 'dd/MM/yyyy';
        const formattedDate = value && moment.utc(value).format('YYYY/MM/DD');

        input = (
          <DatePicker
            className="formInput"
            selected={formattedDate ? new Date(formattedDate) : null}
            minDate={minDate || undefined}
            onChange={this.handleDateChange}
            customInput={
              <MaskedInput
                type="text"
                mask={[
                  /\d/,
                  /\d/,
                  '/',
                  /\d/,
                  /\d/,
                  '/',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
              />
            }
            disabled={disabled}
            placeholderText={placeholder || 'DD/MM/YYYY'}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat={dateFormat}
            name={accessor}
            autoComplete="off"
            onBlur={() => {
              if (setFieldTouched) {
                setFieldTouched(accessor, true);
              }
            }}
          />
        );
        break;
      }
      case 'dateTime': {
        const formattedDate =
          value && moment(value).format('YYYY/MM/DD h:mm a');
        input = (
          <DatePicker
            className="formInput"
            selected={formattedDate ? new Date(formattedDate) : null}
            minDate={minDate || null}
            onChange={(val) => {
              onChange(accessor, val);
            }}
            disabled={disabled}
            placeholderText={placeholder || 'DD/MM/YYYY hh:mm aa'}
            timeIntervals={1}
            showMonthDropdown
            showTimeSelect
            showYearDropdown
            dropdownMode="select"
            dateFormat="dd/MM/yyyy hh:mm aa"
            name={accessor}
            autoComplete="off"
            onBlur={() => {
              if (setFieldTouched) {
                setFieldTouched(accessor, true);
              }
              // if (handleBlur) {
              // 	handleBlur()
              // }
            }}
          />
        );
        break;
      }
      case 'number': {
        input = (
          <NumericFormat
            className="formInput"
            value={value}
            name={accessor}
            onBlur={handleBlur}
            displayType="input"
            disabled={disabled}
            onValueChange={this.handleNumberChange}
            maxLength={maxLength || null}
            decimalSeparator={
              decimalSeparator === undefined ? undefined : decimalSeparator
            }
            // thousandSeparator={
            // 	thousandSeparator === undefined
            // 		? true
            // 		: thousandSeparator
            // }
            thousandSeparator={thousandSeparator}
            allowLeadingZeros={
              allowLeadingZeros === undefined ? false : allowLeadingZeros
            }
            decimalScale={decimalScale === 0 ? 0 : decimalScale || 2}
            isNumericString
            allowNegative={allowNegative}
          />
        );
        break;
      }
      // case 'negative': {
      //   input = (
      //     <NumericFormat
      //       className="formInput negative"
      //       value={value === null || -Math.abs(value)}
      //       name={accessor}
      //       onBlur={handleBlur}
      //       displayType="input"
      //       prefix={Math.sign(value) > 0 ? '-$' : '$'}
      //       onValueChange={this.handleNumberChange}
      //       thousandSeparator={
      //         thousandSeparator === undefined ? true : thousandSeparator
      //       }
      //       allowLeadingZeros={
      //         allowLeadingZeros === undefined ? false : allowLeadingZeros
      //       }
      //       isNumericString
      //       decimalScale={decimalScale}
      //       fixedDecimalScale={fixedDecimalScale}
      //       disabled={disabled}
      //     />
      //   );
      //   break;
      // }
      case 'phone': {
        // const usaCanadaCountryCode =
        //   value.substring(0, 2) === '+1' ||
        //   value.replace(/[+1|\-| |(|)]/g, '').length === 10;
        input = (
          <PhoneInput
            country={defaultCountry || 'in'}
            value={value}
            displayInitialValueAsLocalNumber={false}
            layout="second"
            name={accessor}
            onChange={this.handlePhoneNumberChange}
            // onBlur={this.selectBlur}
            disabled={disabled}
          />
        );
        // const usaCanadaCountryCode =
        //   value.substring(0, 2) === '+1' ||
        //   value.replace(/[+1|\-| |(|)]/g, '').length === 10;
        // input = (
        //   <PhoneInput
        //     placeholder="Enter phone number"
        //     className="formInput"
        //     value={usaCanadaCountryCode ? `+1${value}` : value}
        //     country={usaCanadaCountryCode ? 'us' : ''}
        //     // value={value}
        //     // country={'us'}
        //     name={accessor}
        //     onBlur={this.selectBlur}
        //     onChange={this.handlePhoneNumberChange}
        //     disabled={disabled}
        //   />
        // );
        // input = (
        //   <input
        //     name={accessor}
        //     placeholder="Enter phone number"
        //     className="formInput"
        //     type="text"
        //     value={value}
        //     maxLength={15}
        //     minLength={5}
        //     onChange={this.handleTextChange}
        //     disabled={disabled}
        //     onBlur={handleBlur}
        //   />
        // );
        break;
      }
      /*
        // Do not use the delta object you receive from the onChange event as value.
        // This object does not contain the full document, but only the last modifications,
        // and doing so will most likely trigger an infinite loop where the same changes
        // are applied over and over again. Use editor.getContents() during the event to
        // obtain a Delta of the full document instead. ReactQuill will prevent you from
        // making such a mistake, however if you are absolutely sure that this is what you
        // want, you can pass the object through new Delta() again to un-taint it.
        // GitHub: https://github.com/zenoamaro/react-quill
        */
      case 'quill': {
        dataFieldClass = `${dataFieldClass} textArea`;

        input = (
          <ReactQuill
            value={value}
            rows={rows}
            cols="20"
            ref={ref}
            preserveWhitespace
            onChange={this.handleQuillChange}
            readOnly={disabled}
            className={disabled ? 'quillDisabled' : undefined}
            onBlur={handleBlur}
            quillFormats={quillFormats}
          />
        );
        break;
      }

      // case 'textarea': {
      //   dataFieldClass = `${dataFieldClass} textArea`;

      //   input = (
      //     <textarea
      //       rows={rows}
      //       maxLength={maxLength || undefined}
      //       cols="20"
      //       className="formTextArea"
      //       value={value}
      //       name={accessor}
      //       onBlur={handleBlur}
      //       onChange={this.handleTextChange}
      //       disabled={disabled}
      //     />
      //   );
      //   break;
      // }
      case 'switch': {
        input = (
          <>
            {switchTextStart && switchTextStart}
            <Switch
              onChange={this.handleSwitch}
              checked={value || false}
              disabled={disabled}
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={16}
              width={44}
              className={value ? 'react-switch-on' : 'react-switch-off'}
              onBlurCapture={handleBlur}
              // onBlur={handleBlur}
            />
            {switchTextEnd && switchTextEnd}
          </>
        );
        break;
      }
      case 'creatable': {
        const vKey = valueKey || accessor;

        let optionsData =
          options &&
          options.filter((o) => selectDotNotation(o, vKey) === value);
        optionsData =
          (optionsData &&
            (valueKey || labelKey) &&
            optionsData.map((item) => ({
              ...item,
              [labelKey]:
                !labelKey || !item[labelKey]
                  ? `${
                      (valueKey && item[valueKey]) || accessor
                    } - MISSING LABEL`
                  : item[labelKey],
            }))) ||
          options ||
          [];

        const defaultValue =
          optionsData.length === 0 ? { value, label: value } : optionsData;

        // TODO: clean this up
        input = (
          <Creatable
            name={accessor}
            value={defaultValue || value}
            isClearable
            options={options}
            onChange={this.handleCreatableSelectChange}
            onBlur={setFieldTouched ? this.selectBlur : undefined}
            isDisabled={disabled}
            isMulti={isMulti}
            className="Select"
            classNamePrefix="Select"
          />
        );
        break;
      }
      case 'select': {
        const vKey = valueKey || accessor;
        const lKey = labelKey || vKey;

        const getOptionValue = (o) => selectDotNotation(o, vKey);
        const getOptionLabel = (o) => selectDotNotation(o, lKey);

        value =
          value == null
            ? ''
            : (typeof value === 'string' && value.trim()) || value;

        let optionsData =
          options &&
          options.filter((o) => selectDotNotation(o, vKey) === value);
        optionsData =
          (optionsData &&
            (valueKey || labelKey) &&
            optionsData.map((item) => ({
              ...item,
              [labelKey]:
                !labelKey || !item[labelKey]
                  ? `${
                      (valueKey && item[valueKey]) || accessor
                    } - MISSING LABEL`
                  : item[labelKey],
            }))) ||
          options ||
          [];

        // TODO: clean this up
        const selectOptions = !options
          ? []
          : (sorting && sortOptions(options, lKey)) || options;
        const filterOptions = [];
        selectOptions.forEach((v) => {
          // eslint-disable-next-line no-prototype-builtins
          if (v.hasOwnProperty('active')) {
            if (v.active) {
              filterOptions.push(v);
            }
          } else {
            filterOptions.push(v);
          }
        });
        input = (
          <Select
            name={accessor}
            value={isMulti ? value : optionsData}
            onChange={this.handleSelect}
            onBlur={setFieldTouched ? this.selectBlur : undefined}
            options={filterOptions || []}
            getOptionLabel={lKey ? getOptionLabel : getOptionValue}
            getOptionValue={getOptionValue}
            isDisabled={disabled}
            isClearable={clearable}
            isLoading={isLoading}
            filterOption={customFilter}
            className="Select"
            classNamePrefix="Select"
            isMulti={isMulti}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 100,
              }),
              valueContainer: (provided) => ({
                ...provided,
                maxHeight: '115px',
                overflowY: 'auto',
              }),
            }}
            menuPortalTarget={showOverFlow && document.querySelector('body')}
            placeholder={placeholder || 'Select'}
            menuPosition="fixed"
            // menuIsOpen
          />
        );
        break;
      }
      // case 'dropdown': {
      //   input = (
      //     <Dropdown
      //       name={accessor}
      //       value={value}
      //       valueKey={valueKey}
      //       labelKey={labelKey}
      //       endpoint={endpoint}
      //       handleChange={onChange}
      //     />
      //   );
      //   break;
      // }
      // case 'file': {
      //   const {
      //     refOn,
      //     instantUpload,
      //     getFileUploadingState,
      //     getIsSubmittingState,
      //   } = this.props;
      //   input = (
      //     <NewFileUpload
      //       ref={refOn}
      //       files={files}
      //       title={title}
      //       instantUpload={instantUpload}
      //       uploadType={uploadType}
      //       handleFileChange={handleFileChange}
      //       disabled={disabled}
      //       allowedFileTypes={allowedFileTypes}
      //       hideUploadButton={hideUploadButton}
      //       getFileUploadingState={getFileUploadingState}
      //       getIsSubmittingState={getIsSubmittingState}
      //     />
      //   );
      //   break;
      // }
      // case 'file2': {
      //   input = (
      //     <FileUpload
      //       onSuccess={onFileUploadSuccess}
      //       files={files}
      //       recID={recID}
      //       fieldName={accessor.split('.').pop()}
      //       allowedFileTypes={allowedFileTypes}
      //       maxNumberOfFiles={maxNumberOfFiles}
      //       table={table}
      //       disabled={disabled}
      //       isEditable={!disabled}
      //       isInline={isInline}
      //       onDelete={onFileDelete}
      //       isVisibleDelete={isVisibleDelete}
      //       handleDeleteFile={handleDeleteFile}
      //     />
      //   );
      //   break;
      // }
      // case 'fileList': {
      //   input = (
      //     <NewFileList
      //       files={files}
      //       uploadingFiles={uploadingFiles}
      //       title={fileUploaderTitle}
      //       // uploadType="campaign-overview-documents"
      //       handleFileChange={handleFileChange}
      //       instantUpload={false}
      //       disabled={disabled}
      //       isMulti={isMulti}
      //     />
      //   );
      //   break;
      // }
      // case 'address': {
      //   input = (
      //     <AddressPop
      //       data={value}
      //       handleChange={onChange}
      //       fieldKeys={fieldKeys}
      //       hideButton={disabled}
      //       enablePortal
      //       handleBlur={handleBlur}
      //     />
      //   );
      //   break;
      // }
      case 'dataFieldGridDropDown': {
        input = (
          <div
            className={`${'gridDropdown'} ${
              touched ? 'gridDropDownTouch' : ''
            }`}
          >
            <DataFieldGridDropDown
              value={value}
              options={options}
              isMulti={isMulti}
              labelKeyName={labelKey}
              valueKeyName={valueKey}
              endpoint={endpoint}
              onSelectionChanged={(selectedRows) => {
                if (isMulti) {
                  const selectedData = selectedRows.map((v) => v[valueKey]);
                  onChange(accessor, selectedData, selectedRows);
                } else {
                  onChange(
                    accessor,
                    (selectedRows &&
                      selectedRows.length &&
                      selectedRows[0][valueKey]) ||
                      null,
                    (selectedRows && selectedRows.length && selectedRows[0]) ||
                      null
                  );
                }
              }}
              subColumns={subColumns}
              disabled={disabled}
              showQuickFilter={showQuickFilter}
              width={width}
              isRowSelectable={isRowSelectable}
              filterInactive={filterInactive}
              onBlur={() => {
                if (setFieldTouched && handleBlur) {
                  setFieldTouched(accessor, true);
                  handleBlur();
                }
              }}
            />
          </div>
        );
        break;
      }
      case 'custom': {
        input = template;
        break;
      }
      default:
        throw new Error('type prop not defined');
    }

    return (
      <div
        className={`dataFieldContainer ${className} ${
          showBackgroundColor && 'showBackgroundColor'
        }`}
      >
        <div className={dataFieldClass}>
          {title && (
            <div className="dataFieldTitleContainer">
              <span className={`dataFieldTitle ${required ? 'required' : ''} `}>
                {title}
              </span>
            </div>
          )}
          <div
            className={
              error && touched
                ? 'dataFieldInputContainer error'
                : 'dataFieldInputContainer'
            }
          >
            {input}
            {error && touched && (
              <>
                <span
                  role="button"
                  tabIndex={0}
                  onKeyUp={() => {}}
                  data-tooltip-id="dataField-error"
                  data-tooltip-content={error}
                  data-tooltip-place="left"
                  className="dataField-validation-error"
                >
                  !
                </span>
                <ReactTooltip
                  place="bottom"
                  id="dataField-error"
                  className="dataFieldToolTipMessage"
                />
              </>
            )}
          </div>
          {description && (
            <div className="dataFieldDescription">{description}</div>
          )}
          {/* {error && touched && (
						<div className="dataFieldError">{error}</div>
					)} */}
        </div>
      </div>
    );
  }
}
