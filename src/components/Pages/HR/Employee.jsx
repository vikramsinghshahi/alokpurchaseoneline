import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AgDataGrid from '../../Common/AgDataGrid/AgDataGrid';
import { Skeleton, Card, Button, Modal } from 'antd';
import DataField from '../../Common/DataField/DataField';
import { PlusOutlined } from '@ant-design/icons';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'employeeCode', headerName: 'Code', width: 90 },
  { field: 'firstName', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'department', headerName: 'Department', width: 180 },
  { field: 'avatar', headerName: 'Avatar', width: 280 },
];

const Employee = () => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const showFirstModal = () => {
    setIsFirstModalOpen(true);
  };

  const handleFirstOk = () => {
    setIsFirstModalOpen(false);
  };

  const handleFirstCancel = () => {
    setIsFirstModalOpen(false);
  };

  const showSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  const handleSecondOk = () => {
    setIsSecondModalOpen(false);
  };

  const handleSecondCancel = () => {
    setIsSecondModalOpen(false);
  };
  const agDataGridRefEmployee = useRef(null);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState({
    auth: false,
    api: false,
  });
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authData = await getAuthToken();
        console.log({ authData });
        if (authData?.data) {
          console.log({ authData });
          const data = await callProtectedApi(authData.data);
          if (data) {
            setEmployeeData(data);
          }
        }
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data');
      }
    };

    fetchData();
  }, []);

  const getAuthToken = async () => {
    setLoading((prev) => ({ ...prev, auth: true }));
    setError(null);

    const username = 'r78qppqslqwiz5nyuenq51aq';
    const password =
      '03v6k95i1qufjkgul40nwa4iq3ipau4kxibcpzs35a0iidatqha6as1ojfmf312h';

    const base64encodedData = btoa(`${username}:${password}`);

    try {
      const response = await axios.get(
        'https://mservices.zinghr.com/etl/api/v2/Auth/GenerateJWTToken?apiPermission=GEMD',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${base64encodedData}`,
          },
        }
      );
      console.log('hello');

      // setToken(response.data.token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  };

  const callProtectedApi = async (authToken) => {
    setLoading((prev) => ({ ...prev, api: true }));
    setError(null);

    try {
      const response = await axios.post(
        'https://mservices.zinghr.com/etl/api/v2/Employee/GetEmployeeDetails',
        {
          FromDate: '01-03-2020',
          ToDate: '31-03-2025',
          PageSize: '100',
          PageNumber: '1',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.data?.employees) {
        const processedData = response.data.data.employees.map((emp) => ({
          ...emp,
          id: emp.employeeID,
          fullName: emp.firstName + ' ' + emp.lastName,
        }));
        return processedData;
      }
      return [];
    } catch (err) {
      setError(err.response?.data?.message || 'API request failed');
    } finally {
      setLoading((prev) => ({ ...prev, api: false }));
    }
  };

  // <>
  //   <Modal
  //     title="First Modal"
  //     open={isFirstModalOpen}
  //     onOk={handleFirstOk}
  //     onCancel={handleFirstCancel}
  //     width={isSecondModalOpen ? '80%' : '60%'}
  //     footer={null}
  //     centered={false}
  // style={{
  //   top: 0,
  //   right: 0,
  //   margin: 0,
  //   padding: 0,
  // }}
  //     bodyStyle={{
  //       height: 'calc(100vh - 55px)',
  //       overflow: 'auto',
  //     }}
  //     modalRender={(modal) => (
  //       <div style={{ position: 'absolute', right: 0 }}>{modal}</div>
  //     )}
  //   >
  //     <p>This is the first modal</p>
  //     <Button type="primary" onClick={showSecondModal}>
  //       Open Second Modal
  //     </Button>
  //   </Modal>

  //   <Modal
  //     title="Second Modal"
  //     open={isSecondModalOpen}
  //     onOk={handleSecondOk}
  //     onCancel={handleSecondCancel}
  //     width="50%"
  //     footer={null}
  //     centered={false}
  //     style={{
  //       top: 0,
  //       right: 0,
  //       margin: 0,
  //       padding: 0,
  //     }}
  //     bodyStyle={{
  //       height: 'calc(100vh - 55px)',
  //       overflow: 'auto',
  //     }}
  //     modalRender={(modal) => (
  //       <div style={{ position: 'absolute', right: 0 }}>{modal}</div>
  //     )}
  //   >
  //     <p>This is the second modal on top of the first one</p>
  //   </Modal>
  // </>;

  const columns = [
    {
      Header: 'Code',
      accessor: 'employeeCode',
      contentAlign: 'center',
      flex: false,
      editable: true,
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Name',
      accessor: 'fullName',
      contentAlign: 'center',
      editable: true,
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Email',
      accessor: 'personalEmail',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Mobile No.',
      accessor: 'mobileNo',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Login',
      accessor: 'canLogin',
      contentAlign: 'center',
      cellProps: {
        type: 'switch',
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

  //   console.log(employeeData, loading);
  //   import { Modal, Button } from 'antd';
  // import React from 'react';

  // const CustomModals = ({ isFirstModalOpen, isSecondModalOpen, handleFirstCancel, handleFirstOk, showSecondModal, handleSecondCancel, handleSecondOk }) => {
  //   return (

  //   );
  // };

  return (
    <div style={{ height: '100%', width: '100%', padding: '20px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showFirstModal}
        style={{ marginBottom: '16px', color: '#ffff' }}
      >
        Open Modal
      </Button>
      <Skeleton
        active
        paragraph={{ rows: 18 }}
        loading={loading.auth || loading.api}
      >
        <AgDataGrid
          ref={agDataGridRefEmployee}
          data={employeeData}
          gridTitle="Employee List"
          gridId="employeeGrid"
          columns={columns}
          authUser={authUser}
          rowKey="id"
          permissions={{
            add: true,
            update: true,
            remove: true,
          }}
        />
      </Skeleton>

      <Modal
        title="First Modal"
        open={isFirstModalOpen}
        onOk={handleFirstOk}
        onCancel={handleFirstCancel}
        width={'60%'}
        style={{
          right: 0,
          left: '40%',
          // height: '100vh',
          top: 0,
          padding: 0,
          margin: 0,
        }}
        // bodyStyle={{
        //   height: 'calc(100vh - 110px)',
        //   overflow: 'auto',
        // }}
      >
        <p>This is the first modal</p>
        {/* <AgDataGrid
          ref={agDataGridRefEmployee}
          data={[]}
          gridTitle="Employee List"
          gridId="employeeGrid"
          columns={[]}
          authUser={authUser}
          rowKey="id"
          permissions={{
            add: true,
            update: true,
            remove: true,
          }}
          
        /> */}
        <DataField
          type="text"
          accessor="name"
          title="Name"
          onChange={(key, value) => {
            console.log(key, value);
          }}
          error={true}
          touched={true}
        />
        <DataField
          type="textArea"
          accessor="area"
          title="Area"
          onChange={(key, value) => {
            console.log(key, value);
          }}
          error={true}
          touched={true}
        />
        <DataField
          type="number"
          accessor="number"
          title="Number"
          onChange={(key, value) => {
            console.log(key, value);
          }}
          error={true}
          touched={true}
        />
        <Button
          type="primary"
          onClick={showSecondModal}
          style={{ color: '#ffff' }}
        >
          Open Second Modal
        </Button>
      </Modal>
      <Modal
        title="Second Modal"
        open={isSecondModalOpen}
        onOk={handleSecondOk}
        onCancel={handleSecondCancel}
        width="40%"
        style={{
          right: 0,
          left: '60%',
          top: 0,
          // height: '100vh',
          padding: 0,
          margin: 0,
        }}
        // bodyStyle={{
        //   height: 'calc(100vh - 110px)',
        //   overflow: 'auto',
        // }}
      >
        <p>This is the second modal on top of the first one</p>
        <AgDataGrid
          ref={agDataGridRefEmployee}
          data={[]}
          gridTitle="Employee List"
          gridId="employeeGrid"
          columns={[]}
          authUser={authUser}
          rowKey="id"
          permissions={{
            add: true,
            update: true,
            remove: true,
          }}
        />
      </Modal>
    </div>
  );
};

export default Employee;
