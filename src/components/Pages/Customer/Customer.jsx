import React, { useRef } from 'react';
import AgDataGrid from '../../Common/AgDataGrid/AgDataGrid';

const Customer = () => {
  const agDataGridRefCustomersSpecificGrid = useRef(null);
  const data = [
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      address: '123 Main St',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      address: '456 Elm St',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      age: 35,
      address: '789 Oak St',
    },
  ];
  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      contentAlign: 'center',
      editable: true,
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Age',
      accessor: 'age',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Address',
      accessor: 'address',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
  ];

  const authUser = {
    id: 1,
    username: 'admin',
    name: 'Netnapa Suwanatrai',
    roleID: 1,
    departmentID: null,
    roleName: 'Admin',
    permissionFrom: 'position',
  };

  console.log('hello');

  return (
    <div>
      <span>Hello I am header</span>
      <AgDataGrid
        ref={agDataGridRefCustomersSpecificGrid}
        data={data}
        gridId="customersSpecificGrid"
        columns={columns}
        authUser={authUser}
        rowKey="id"
        permissions={{
          add: true,
          update: true,
          remove: true,
        }}
      />
    </div>
  );
};

export default Customer;
