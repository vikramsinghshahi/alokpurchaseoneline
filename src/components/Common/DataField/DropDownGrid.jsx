import React, { Component, createRef } from 'react';
import { array, func, any, string, bool } from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
// import { connect } from 'react-redux'
// import { fetchAPI } from '../../../_actions/actions'

// @connect()
export default class DropDownGrid extends Component {
  selectRef = createRef();

  static propTypes = {
    value: any,
    options: any,
    isMulti: bool,
    onSelectionChanged: func,
    subColumns: any,
    handleClose: func,
    endpoint: string,
    dispatch: func,
    valueKeyName: string,
    showQuickFilter: bool,
    isRowSelectable: any,
    filterInactive: bool,
  };

  static defaultProps = {
    isMulti: false,
    showQuickFilter: true,
  };

  state = {
    value: '',
    options: [],
  };

  componentDidMount() {
    const { endpoint, dispatch, options, filterInactive } = this.props;
    let optionData = options;
    if (typeof options === 'function') {
      optionData = options();
    }
    this.setState({
      options:
        (filterInactive &&
          optionData.filter((v) =>
            Object.prototype.hasOwnProperty.call(v, 'active') ? v.active : true
          )) ||
        optionData,
    });

    // this.searchInput.focus()

    if (endpoint) {
      dispatch(
        fetchAPI({
          endpoint,
        })
      ).then((res) => {
        if (res && res.data) {
          this.setState({
            options: res.data,
          });
        } else {
          this.setState({
            options: res,
          });
        }
      });
    }
  }

  onSelectionChanged = (params) => {
    const { api } = params;
    const { onSelectionChanged } = this.props;
    const selectedRows = (api && api.getSelectedRows()) || [];
    if (onSelectionChanged) onSelectionChanged(selectedRows);
  };

  onFirstDataRendered = (params) => {
    const { valueKeyName, value } = this.props;
    params.api.forEachNode((node) => {
      if (Array.isArray(value) && value.includes(node.data[valueKeyName])) {
        node.setSelected(true, false, true);
      }
      if (!Array.isArray(value) && value && node.data[valueKeyName] === value) {
        node.setSelected(true, false, true);
      }
    });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  dataGridRenderer = () => {
    const { value, options } = this.state;
    const {
      subColumns,
      handleClose,
      isMulti,
      showQuickFilter,
      isRowSelectable,
    } = this.props;
    const darkMode = localStorage.getItem('darkMode') === 'true';
    return (
      <>
        {showQuickFilter && (
          <input
            type="text"
            placeholder="Search"
            onInput={(e) => {
              if (this.gridApi) {
                this.gridApi.setQuickFilter(e.target.value);
              }
            }}
            className="searchInput"
            autoComplete="off"
            ref={(input) => {
              this.searchInput = input;
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 27) {
                if (handleClose) {
                  handleClose();
                }
              }
            }}
          />
        )}
        <div
          className={` agGrid ${
            darkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
          }`}
        >
          <div>
            <AgGridReact
              onGridReady={this.onGridReady}
              rowData={options}
              hoverStateEnabled
              selectedRowKeys={value}
              onSelectionChanged={this.onSelectionChanged}
              suppressRowClickSelection={isMulti}
              rowSelection={isMulti ? 'multiple' : 'single'}
              height="500px"
              // columnDefs={subColumns}
              cacheQuickFilter
              defaultColDef={{
                minWidth: 100,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                wrapText: true,
                wrapHeaderText: true,
              }}
              columnDefs={[
                ...(isMulti
                  ? [
                      {
                        headerName: '',
                        checkboxSelection: isMulti,
                        headerCheckboxSelection: false,
                        headerCheckboxSelectionFilteredOnly: true,
                        minWidth: 50,
                        width: 50,
                        maxWidth: 50,
                        wrapHeaderText: true,
                      },
                    ]
                  : []),
                ...subColumns.map((col) => ({
                  ...col,
                  wrapText: true,
                  width: col.width && col.width,
                  minWidth: col.width && col.width,
                  flex: col.flex,
                  wrapHeaderText: true,
                })),
              ]}
              onFirstDataRendered={this.onFirstDataRendered}
              isRowSelectable={isRowSelectable}
              // checkboxSelection
              headerHeight={30}
              rowHeight={30}
            />
          </div>
        </div>
      </>
    );
  };

  render() {
    return this.dataGridRenderer();
  }
}
