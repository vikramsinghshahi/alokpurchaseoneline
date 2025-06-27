import React, { Component, createRef } from 'react';
import { array, func, object, any, string, bool } from 'prop-types';
// import { connect } from 'react-redux';
// import ArrowDown from 'Common/Icons/ArrowDown';
import PopOver from '../PopOver/PopOver';
import DropDownGrid from './DropDownGrid';

// @connect()
export default class DataFieldGridDropDown extends Component {
  selectRef = createRef();

  static propTypes = {
    value: any,
    options: any,
    isMulti: bool,
    onSelectionChanged: func,
    values: array,
    row: object,
    subColumns: any,
    handleClose: func,
    endpoint: string,
    dispatch: func,
    labelKeyName: string,
    valueKeyName: string,
    width: any,
    disabled: bool,
    onBlur: func,
  };

  modalRef = React.createRef();

  contentRef = React.createRef();

  buttonRef = React.createRef();

  searchInput = React.createRef();

  onSelectionChanged = (rows) => {
    const { onSelectionChanged, isMulti, onBlur } = this.props;
    if (onSelectionChanged) {
      onSelectionChanged(rows);
    }
    if (!isMulti && this.modalRef && this.modalRef.current) {
      this.modalRef.current.closeModal();
      onBlur();
    }
  };

  renderClose = () => (
    <svg
      height="20"
      width="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      className="css-6q0nyr-Svg"
      fill="red"
    >
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
    </svg>
  );

  renderSelection = () => {
    const { value, labelKeyName, valueKeyName, options, disabled } = this.props;

    let optionsData = options;
    if (typeof options === 'function') {
      optionsData = options();
    }

    if (Array.isArray(value) && value.length) {
      const selectedOptions = (optionsData || [])
        .filter((v) => value.includes(v[valueKeyName]))
        .map((v) => v[labelKeyName]);

      return (
        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedOptions.map((option) => (
            <div
              key={option}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <span>{option}</span>
              <button
                style={{
                  background: 'transparent',
                  // border: 'none',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  color: 'black',
                  fontSize: '16px',
                  border: '1px solid red',
                }}
                onClick={(e) => {
                  const getSelectedOptionData =
                    (optionsData || []).filter((v) =>
                      value.includes(v[valueKeyName])
                    ) || [];

                  const getRowsAfterRemove =
                    getSelectedOptionData.filter(
                      (singleData) => singleData[labelKeyName] !== option
                    ) || [];
                  if (!disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.modalRef.current.closeModal();
                    this.onSelectionChanged(getRowsAfterRemove || []);
                  }
                }}
                // onClick={() => handleUnselect(option.value)}
              >
                &times;
              </button>
            </div>
          ))}
          {/* {selectedOptions.join(', ')} */}
        </div>
      );
    }
    if (!Array.isArray(value) && value) {
      const selectedOption = (optionsData || []).find(
        (v) => v[valueKeyName] === value
      );
      return (
        <div className="button-content">
          <div
            className={`clear-container ${
              disabled && 'disable-clear-conatiner'
            }`}
          >
            {selectedOption && selectedOption[labelKeyName]}
            {selectedOption && selectedOption[labelKeyName] ? (
              <div className="clear-content">
                <button
                  onClick={(e) => {
                    if (!disabled) {
                      e.preventDefault();
                      e.stopPropagation();
                      this.onSelectionChanged();
                    }
                  }}
                  className={`clear ${disabled && 'disable-clear'}`}
                >
                  {this.renderClose()}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div
            className={`arrow-down-container ${
              disabled && 'disable-arrow-down'
            }`}
          >
            {/* <ArrowDown width="20" height="20" /> */}1
          </div>
        </div>
      );
    }

    return (
      <div className="button-content">
        <div className="select">Select</div>
        <div
          className={`arrow-down-container ${disabled && 'disable-arrow-down'}`}
        >
          {/* <ArrowDown width="20" height="20" /> */}
        </div>
      </div>
    );
  };

  render() {
    const { width, disabled, onBlur } = this.props;
    return (
      <PopOver
        className="popover-gridDropDown"
        enablePortal
        portalID="DataFieldGridDropDown"
        button={this.renderSelection()}
        buttonClass="popOver-btn"
        buttonDisabled={disabled}
        ref={this.modalRef}
        onCloseEvent={onBlur}
        content={
          <div
            className="gridContainer"
            style={{ minWidth: width || '350px', width }}
          >
            <DropDownGrid
              {...this.props}
              onSelectionChanged={this.onSelectionChanged}
            />
          </div>
        }
      />
    );
  }
}
