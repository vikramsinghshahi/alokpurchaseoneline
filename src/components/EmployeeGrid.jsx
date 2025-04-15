import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'first_name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'department', headerName: 'Department', width: 180 },
  // { field: 'status', headerName: 'Status', width: 120 },
  { field: 'avatar', headerName: 'Avatar', width: 280 },
];

const EmployeeGrid = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Replace with your actual API call
    const fetchData = async () => {
      try {
        // https://reqres.in/api/users?page=2
        const response = await axios.get('https://reqres.in/api/users?page=1'); // mock this or replace with real API
        const response2 = await axios.get('https://reqres.in/api/users?page=2');

        // const response = { data: [] };
        setRows(response.data.data.concat(response2.data.data) || []);
        console.log(response.data.data.concat(response2.data.data));
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchData();
  }, []);

  console.log('count');
  return (
    <>
      <h2 style={{ color: '#000' }}>Employee Directory List</h2>
      <div style={{ width: '90%' }} class="employGrid">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </div>
    </>
  );
};

export default EmployeeGrid;
