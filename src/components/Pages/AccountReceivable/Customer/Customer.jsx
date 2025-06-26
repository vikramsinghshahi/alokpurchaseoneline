import React, { useRef, useState, useEffect } from 'react';
import AgDataGrid from '../../../Common/AgDataGrid/AgDataGrid';
import { Skeleton } from 'antd';

const Customer = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const agDataGridRefCustomersSpecificGrid = useRef(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Replace this with your actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

        const newData = [
          {
            customerName: '*NNP* SUNRISE TANKS PVT.LTD',
            customerNumber: 'C04330',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '*NNP* UNI PRODUCTS( INDIA) LTD',
            customerNumber: 'C05215',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Net 30 days',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '*NNP* SURAJ AGRO TECH',
            customerNumber: 'C01756',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Within 60',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: '*NNP* UNIPRODUCTS INDIA LIMITED',
            customerNumber: 'C04025',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Within 15D',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '*NNP* UNIVERSAL POLY PACKS PVT.LTD',
            customerNumber: 'C05961',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: '45 Day PDC',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: '*NNP* VIKAS TECHNOPLAST PVT LTD',
            customerNumber: 'C02085',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: 'A 2 Z PRINT N PROPACK PVT.LTD',
            customerNumber: 'C07046',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: 'A 1 POLYTRADE AND MANUFACTURING PVT LTD(HOLD)',
            customerNumber: 'C02085',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: 'A 1 PLASTIC MANUFACTURER (HOLD)',
            customerNumber: 'C01884',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Within 60',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: '4T LINK INDUSTRIES',
            customerNumber: 'C05504',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Within 15D',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '3PJ PLASTIC',
            customerNumber: 'C00001',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: '45 Day PDC',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: '3D TECHNOPACK PVT LTD',
            customerNumber: 'C04937',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '3D TECHNOPACK LTD',
            customerNumber: 'C04633',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: '3D TECHNOPACK LIMITED-N',
            customerNumber: 'C03422',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '3D TECHNOLOGIES',
            customerNumber: 'C07264',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '3D TECHNOPACK LIMITED-N',
            customerNumber: 'C03142',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '3D TECHNOPACK LTD',
            customerNumber: 'C00002',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: '3D TECHNOPACK PVT LTD',
            customerNumber: 'C03883',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
          {
            customerName: '3PJ PLASTIC',
            customerNumber: 'C04428',
            customerGroup: 'DOMES',
            country: 'INDIA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'On Hold',
          },
          {
            customerName: 'A 1 PLASTIC MANUFACTURER (HOLD)',
            customerNumber: 'C02657',
            customerGroup: 'FORIEG',
            country: 'USA',
            termsOfPayment: 'Advance',
            deliveryTerms: 'By US',
            status: 'Past Due',
          },
        ];

        // Add sequential IDs to the data
        const dataWithIds = newData.map((item, index) => ({
          id: index + 1,
          ...item,
        }));

        setData(dataWithIds);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      Header: 'Customer Name',
      accessor: 'customerName',
      flex: false,
      minWidth: 300,
      contentAlign: 'left',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Customer Number',
      accessor: 'customerNumber',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Customer Group',
      accessor: 'customerGroup',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Country',
      accessor: 'country',
      contentAlign: 'center',
      flex: false,
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Terms of Payment',
      accessor: 'termsOfPayment',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Delivery Terms',
      accessor: 'deliveryTerms',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      flex: false,
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

  // console.log('hello');

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         height: '100%',
  //         width: '100%',
  //         padding: '16px',
  //         backgroundColor: '#fff',
  //         borderRadius: '8px',
  //         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  //       }}
  //     >
  //       <Skeleton active paragraph={{ rows: 15 }} />
  //     </div>
  //   );
  // }

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <Skeleton ative paragraph={{ rows: 15 }} loading={loading}>
        <AgDataGrid
          ref={agDataGridRefCustomersSpecificGrid}
          data={data}
          gridId="customersSpecificGrid"
          gridTitle="Customer List"
          columns={columns}
          authUser={authUser}
          rowKey="id"
          permissions={{
            add: false,
            update: false,
            remove: false,
          }}
        />
      </Skeleton>
    </div>
  );
};

export default Customer;
