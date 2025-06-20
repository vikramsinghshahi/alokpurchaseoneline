import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { any, object } from 'prop-types';

export default class MasterDetailRenderer extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      rowId: props.node.id,
      masterGridApi: props.api,
    };
  }

  static propTypes = {
    data: any,
    detailGridOptions: object,
    node: any,
    api: any,
  };

  componentWillUnmount = () => {
    const { masterGridApi, rowId } = this.state;
    masterGridApi.removeDetailGridInfo(rowId);
  };

  onGridReady = (params) => {
    const { rowId, masterGridApi } = this.state;
    const gridInfo = {
      id: rowId,
      api: params.api,
      columnApi: params.columnApi,
    };

    masterGridApi.addDetailGridInfo(rowId, gridInfo);
  };

  render() {
    const { data, detailGridOptions } = this.props;
    const { detailGridTableName } = detailGridOptions;

    return (
      <div
        className="ag-theme-alpine customMasterDetail"
        style={{ width: '100%', padding: '10px' }}
      >
        <div className="">
          <AgGridReact
            {...detailGridOptions}
            className="full-width-grid ag-theme-alpine"
            rowData={(data && data[detailGridTableName]) || []}
            onGridReady={this.onGridReady}
            domLayout="autoHeight"
          />
        </div>
      </div>
    );
  }
}
