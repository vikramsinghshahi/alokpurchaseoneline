import { any, func, string } from 'prop-types';
import React, { Component } from 'react';
import DataField from '../../DataField/DataField';
// import { fetchAPI } from 'src/_actions/actions';
import { Formik } from 'formik';
import ReactModal from '../../ReactModal/ReactModal';
import { selectDotNotation, isObject } from '../../Utils/CommonUtils';
// import { connect } from 'react-redux';

// @connect()
export default class AgGridEditor extends Component {
  static propTypes = {
    params: any,
    gridProps: any,
    onRequestClose: func,
    state: string,
    dispatch: func,
  };

  state = {
    isOpen: true,
    formModified: false,
    showLogGrid: false,
  };

  trackChanges = {
    newValues: [],
    oldValues: {},
  };

  componentDidMount() {
    const { params } = this.props;
    const { data } = params;
    this.trackChanges.oldValues = JSON.parse(JSON.stringify(data || {}));
    this.trackChanges.newValues = [];
  }

  componentWillUnmount() {
    this.trackChanges.newValues = [];
    this.trackChanges.oldValues = {};
  }

  renderField = (column, formik, index) => {
    const { state } = this.props;
    const { values, setFieldValue, errors, touched, setFieldTouched } = formik;

    const { Header } = column;
    let { editProps } = column;
    if (typeof editProps === 'function') {
      editProps = editProps(values);
    }
    let { options } = editProps || {};
    if (
      editProps &&
      editProps.options &&
      typeof editProps.options !== 'function' &&
      editProps.filterInActive
    ) {
      options = editProps.options.filter((item) => item.active);
    }

    if (
      editProps &&
      editProps.options &&
      typeof editProps.options === 'function'
    ) {
      options = editProps.options(values);
    }

    return (
      <>
        {editProps.type === 'button' && <button>Rate Button</button>}
        <DataField
          key={index}
          {...(editProps || {})}
          title={!editProps?.hideHeader && Header}
          type={editProps.type}
          accessor={editProps.accessor}
          value={selectDotNotation(values, editProps.accessor)}
          options={options}
          handleFileChange={(params) => {
            if (editProps.handleFileChange) {
              editProps.handleFileChange(params);
              this.setState({ formModified: true });
            }
          }}
          onChange={(field, value) => {
            setFieldValue(field, value);
            if (editProps.onChange) {
              editProps.onChange(field, value, setFieldValue, values, state);
              if (field === 'rate') {
                this.setState({ showLogGrid: true });
              }
            }
            if (
              editProps.type === 'dataFieldGridDropDown' ||
              editProps.type === 'quill'
            ) {
              this.handleTrackChanges(editProps.accessor, value, true);
            }
          }}
          disabled={
            state === 'add'
              ? editProps.isDisabledOnAdd
              : editProps.isDisabledOnEdit
          }
          error={errors && selectDotNotation(errors, editProps.accessor)}
          touched={touched && selectDotNotation(touched, editProps.accessor)}
          setFieldTouched={setFieldTouched}
          handleBlur={() => {
            this.handleTrackChanges(
              editProps.accessor,
              selectDotNotation(values, editProps.accessor),
              formik.dirty
            );

            setFieldTouched(editProps.accessor, true);
          }}
          className={
            editProps.isDisabledOnAdd && editProps.isDisabledOnEdit
              ? ''
              : 'addEditableColor'
          }
          setFieldValue={setFieldValue}
          thousandSeparator={false}
          required={editProps.required}
          defaultCountry={editProps.teleFlag}
        />
      </>
    );
  };

  handleTrackChanges = (key, value, formModified) => {
    if (formModified) {
      const newData = {
        column: key,
        oldValue: this.trackChanges.oldValues[key],
        newValue: value,
      };
      const findIndex = this.trackChanges.newValues.findIndex(
        (v) => v.column === key
      );
      if (findIndex === -1) {
        this.trackChanges.newValues.push(newData);
      } else {
        this.trackChanges.newValues.splice(findIndex, 1, newData);
      }
    } else {
      const findIndex = this.trackChanges.newValues.findIndex(
        (v) => v.column === key
      );
      this.trackChanges.newValues.splice(findIndex, 1);
    }
  };

  renderColumnsBySection = (columns, section, formik) => {
    const { state } = this.props;

    return columns.map((column, index) => {
      if (
        !column.editProps ||
        column.hide ||
        (column.hideOnAdd && state === 'add') ||
        (column.hideOnUpdate && state === 'update') ||
        column.section !== section
      ) {
        return null;
      }

      return this.renderField(column, formik, index);
    });
  };

  renderColumns = (formik) => {
    const { gridProps, state, darkMode } = this.props;
    const { popupViewFields, ratePopUpBody, LogGrid, activeRateGrid } =
      gridProps || {};
    const columns =
      (gridProps.columns &&
        gridProps.columns.length &&
        gridProps.columns.sort((a, b) => {
          const val1 = (a && a.order) || 0;
          const val2 = (b && b.order) || 0;
          if (val1 > val2) return 1;
          if (val1 < val2) return -1;
          return 0;
        })) ||
      [];
    const { showLogGrid } = this.state;
    return (
      <>
        {popupViewFields && (
          <div className="agGridPopUpDetailsSection">
            {popupViewFields.map((e) => (
              <div key={e.id} className="detail">
                <span className="key">{e.labelKey}</span>
                <span className="value">{e.valueKey}</span>
              </div>
            ))}
          </div>
        )}
        <div className="agGridPopupBody">
          {ratePopUpBody ? (
            <>
              {activeRateGrid && (
                <div className="gridSection activeRateGridSection">
                  {activeRateGrid()}
                </div>
              )}
              <div className="firstSection">
                {this.renderColumnsBySection(columns, 'first', formik)}
                {/* <button>Rate Log</button> */}
              </div>
              <div className="secondSection">
                {this.renderColumnsBySection(columns, 'second', formik)}
              </div>
              {state === 'update' && showLogGrid && (
                <div className="gridSection">{LogGrid && LogGrid()}</div>
              )}

              <div className="thirdSection">
                {this.renderColumnsBySection(columns, 'third', formik)}
              </div>
            </>
          ) : (
            columns.map((column, index) => {
              if (!column.editProps) {
                return <></>;
              }
              // Hide On Add, Update or hide
              if (column.hideOnAdd && state === 'add') {
                return <></>;
              }
              if (column.hideOnUpdate && state === 'update') {
                return <></>;
              }
              if (column.hide) {
                return <></>;
              }
              return this.renderField(column, formik, index);
            })
          )}
        </div>
      </>
    );
  };

  handleSubmit = async (formik) => {
    const { submitForm } = formik;
    submitForm();
  };

  onSubmit = async (values, formik) => {
    const { setSubmitting, resetForm } = formik;
    const { gridProps, onRequestClose, state, dispatch } = this.props;
    const { onAdd, onUpdate, pagePath, gridTitle, editPopupCloseOnUpdate } =
      gridProps;
    setSubmitting(true);
    if (onAdd && state === 'add') {
      const result = await onAdd(values);
      if (result) {
        onRequestClose();
      }
      setSubmitting(false);
      return;
    }
    if (onUpdate && state === 'update') {
      const result = await onUpdate(values, this.trackChanges);
      if (editPopupCloseOnUpdate) {
        onRequestClose();
      }
      if (result !== undefined && result) {
        // for page consistency from list page to update updatedAt in data
        setSubmitting(false);
        if (isObject(result) && 'updatedAt' in result) {
          resetForm({
            values: { ...values, updatedAt: result.updatedAt },
          });
        } else {
          resetForm({ values: { ...values } });
        }
        return;
      }
      if (result === null) {
        onRequestClose();
      }
    }
    setSubmitting(false);
    resetForm({ values: { ...values } });
  };

  renderForm = (formik) => {
    const { isOpen, formModified } = this.state;
    const { gridProps, params, onRequestClose } = this.props;
    const { gridTitle, updateModalTitleField, uniqueTitle, gridId } = gridProps;
    const { isSubmitting, dirty } = formik;
    const { rowKey, centerModalClass } = gridProps;
    const gridUniqueItemTitle =
      uniqueTitle ||
      (gridTitle && gridTitle.substring(0, gridTitle.length - 1)) ||
      '';
    return (
      <ReactModal
        className={`agGridPopup ${
          centerModalClass && 'agGridPopupCenter'
        } ${gridId}`}
        // className="permission-modal"
        onRequestClose={onRequestClose}
        isOpen={isOpen}
        shouldCloseOnOverlayClick={!isSubmitting}
      >
        <div className="agGridPopupTitle">
          {gridTitle && params && params.data && params.data[rowKey || 'id']
            ? `Update ${gridUniqueItemTitle}`
            : `Add ${gridUniqueItemTitle}`}
          <span className="agGridPopupTitleName">
            {selectDotNotation(
              params && params.data,
              updateModalTitleField || ''
            )}
          </span>
        </div>
        {this.renderColumns(formik)}
        <div className="footer agGridPopupFooter">
          <button
            type="submit"
            className="submit-btn cancle-btn"
            onClick={onRequestClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            onClick={() => this.handleSubmit(formik)}
            // disabled={
            //   (isSubmitting || !formModified) && (isSubmitting || !dirty)
            // }
          >
            Save
          </button>
        </div>
      </ReactModal>
    );
  };

  render() {
    const { params, gridProps, state } = this.props;
    const { validationRules, addItemValidationSchema, initialAddItemValues } =
      gridProps;
    const { data } = params;
    return (
      <Formik
        initialValues={data || { ...initialAddItemValues }}
        onSubmit={this.onSubmit}
        validationSchema={
          (state === 'add' &&
            addItemValidationSchema &&
            addItemValidationSchema) ||
          validationRules
        }
        enableReinitialize
      >
        {this.renderForm}
      </Formik>
    );
  }
}
