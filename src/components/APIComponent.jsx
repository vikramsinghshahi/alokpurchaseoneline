import React, { useState, useEffect } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'employeeCode', headerName: 'Code', width: 90 },
  { field: 'firstName', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'department', headerName: 'Department', width: 180 },
  // { field: 'status', headerName: 'Status', width: 120 },
  { field: 'avatar', headerName: 'Avatar', width: 280 },
];

const APIComponent = () => {
  // State management
  const [token, setToken] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState({
    auth: false,
    api: false,
  });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    requestParam: '', // example parameter for second API
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1: Get authentication token
  const getAuthToken = async () => {
    setLoading((prev) => ({ ...prev, auth: true }));
    setError(null);

    const username = 'r78qppqslqwiz5nyuenq51aq';
    const password =
      '03v6k95i1qufjkgul40nwa4iq3ipau4kxibcpzs35a0iidatqha6as1ojfmf312h';

    const base64encodedData = btoa(`${username}:${password}`);

    console.log(base64encodedData);

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

      setToken(response.data.token); // Assuming token is in response.data.token
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  };

  // Step 2: Call protected API with token
  const callProtectedApi = async (authToken) => {
    setLoading((prev) => ({ ...prev, api: true }));
    setError(null);

    console.log(authToken, 'line 67');

    try {
      const response = await axios.post(
        'https://mservices.zinghr.com/etl/api/v2/Employee/GetEmployeeDetails',
        {
          FromDate: '01-03-2020',
          ToDate: '31-03-2025',
          PageSize: '100',
          PageNumber: '1',
          // You can include other keys here if needed:
          // DateFilterOn: 'DOJ',
          // EmployeeCode: '85372',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log({ response }, 'line 100');
      setApiData(
        response.data.data.employees.map((e, i) => ({ ...e, id: e.employeeID }))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'API request failed');
    } finally {
      setLoading((prev) => ({ ...prev, api: false }));
    }
  };

  // Combined function to execute the full flow
  const executeApiFlow = async (e) => {
    e.preventDefault();
    console.log('hello');
    try {
      console.log('hello');
      const authToken = await getAuthToken();
      console.log(authToken);
      // await callProtectedApi(authToken.data);
    } catch (err) {
      // Error already handled in individual functions
    }
  };

  console.log(apiData);

  return (
    <div className="api-container">
      <h2>API Integration Example</h2>

      <form onSubmit={executeApiFlow}>
        <button type="submit">
          {loading.auth
            ? 'Authenticating...'
            : loading.api
            ? 'Calling API...'
            : 'Execute API Flow'}
        </button>
      </form>

      {
        <div className="token-info">
          <h4>Authentication Token:</h4>
          {/* <p className="token">{token}</p> */}
          {/* <DataGrid
            rows={apiData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
          /> */}
        </div>
      }
    </div>
  );
};

export default APIComponent;
