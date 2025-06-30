import React, { useRef, useState, useEffect } from 'react';
import AgDataGrid from '../../../Common/AgDataGrid/AgDataGrid';
import { Skeleton, Collapse, Typography, Divider, Tag, Button } from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './Customer.scss';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const Customer = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: 1,
    customerName: 'Rohit',
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const agDataGridRefCustomersSpecificGrid = useRef(null);

  const handleRowClick = (record) => {
    setSelectedCustomer(record);
    console.log('helli ');
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

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
      Header: 'Customer Account',
      accessor: 'custAccount',
      flex: false,
      minWidth: 300,
      contentAlign: 'left',
      hideInTable: true,
      cellProps: {
        type: 'text',
      },
      editProps: {
        type: 'text',
        accessor: 'name',
      },
    },
    {
      Header: 'Customer Name',
      accessor: 'customerName',
      flex: false,
      minWidth: 300,
      contentAlign: 'left',
      cellProps: {
        type: 'text',
      },
      editProps: {
        Header: 'Name',
        type: 'text',
        accessor: 'name',
        required: true,
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
      editProps: {
        type: 'text',
        accessor: 'customerGroup',
      },
    },
    {
      Header: 'Mode Of Delivery',
      accessor: 'modeOfDelivery',
      contentAlign: 'center',
      hideInTable: true,
      cellProps: {
        type: 'select',
        options: [],
      },
      editProps: {
        type: 'select',
        accessor: 'modeOfDelivery',
        options: [],
        labelKey: 'id',
        valuekey: 'id',
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
      editProps: {
        type: 'text',
        accessor: 'country',
      },
    },
    {
      Header: 'Terms of Payment',
      accessor: 'termsOfPayment',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
      editProps: {
        type: 'text',
        accessor: 'termsOfPayment',
      },
    },
    {
      Header: 'Delivery Terms',
      accessor: 'deliveryTerms',
      contentAlign: 'center',
      cellProps: {
        type: 'text',
      },
      editProps: {
        type: 'text',
        accessor: 'deliveryTerms',
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

  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="customer-details">
        <div className="customer-details__header">
          {/* <div className="customer-details__avatar">
            <UserOutlined className="customer-details__avatar-icon" />
          </div> */}
          <div>
            <Title level={4} className="customer-details__title">
              {selectedCustomer?.customerName}
            </Title>
            <Text type="secondary">{selectedCustomer?.customerNumber}</Text>
          </div>
        </div>

        <Divider className="customer-details__divider" />

        <Collapse defaultActiveKey={['1', '2']} ghost>
          <Panel header="Primary Information" key="1">
            <div className="info-panel">
              <div className="info-panel__item">
                <Text className="info-panel__label">Customer Group:</Text>
                <Tag color="blue" className="info-panel__tag">
                  {selectedCustomer.customerGroup}
                </Tag>
              </div>
              <div className="info-panel__item">
                <Text className="info-panel__label">Country:</Text>
                <Text>{selectedCustomer.country}</Text>
              </div>
              <div className="info-panel__item">
                <Text className="info-panel__label">Status:</Text>
                <Tag
                  className={`status-tag--${selectedCustomer?.status
                    ?.toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {selectedCustomer.status}
                </Tag>
              </div>
            </div>
          </Panel>

          <Panel header="Payment & Delivery" key="2">
            <div className="info-panel">
              <div className="info-panel__item">
                <Text className="info-panel__label">Terms of Payment:</Text>
                <Text>{selectedCustomer.termsOfPayment}</Text>
              </div>
              <div className="info-panel__item">
                <Text className="info-panel__label">Delivery Terms:</Text>
                <Text>{selectedCustomer.deliveryTerms}</Text>
              </div>
            </div>
          </Panel>

          <Panel header="Contact Information" key="3">
            <div className="info-panel">
              <div className="info-panel__item info-panel__item--contact">
                <PhoneOutlined className="info-panel__icon" />
                <Text>+1 234 567 8900</Text>
              </div>
              <div className="info-panel__item info-panel__item--contact">
                <MailOutlined className="info-panel__icon" />
                <Text>
                  contact@
                  {selectedCustomer?.customerName
                    ?.toLowerCase()
                    .replace(/\s+/g, '')}
                  .com
                </Text>
              </div>
              <div className="info-panel__item">
                <EnvironmentOutlined className="info-panel__icon" />
                <Text>
                  123 Business Street, Industrial Area,{' '}
                  {selectedCustomer.country}
                </Text>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  return (
    <div className="drawer-container">
      <div
        className={`drawer-container__main-content ${
          drawerVisible ? 'drawer-container__main-content--drawer-visible' : ''
        }`}
      >
        <Skeleton active paragraph={{ rows: 15 }} loading={loading}>
          <AgDataGrid
            ref={agDataGridRefCustomersSpecificGrid}
            data={data}
            gridId="customersSpecificGrid"
            gridTitle="Customer List"
            uniqueTitle="Customer List"
            columns={columns}
            authUser={authUser}
            editMode="popup"
            rowKey="id"
            onRowClicked={handleRowClick}
            rowStyle={{ cursor: 'pointer' }}
            containerClassName="ag-grid-container"
            permissions={{
              add: true,
              update: false,
              remove: false,
            }}
          />
        </Skeleton>
      </div>

      <div
        className={`drawer-container__drawer ${
          drawerVisible ? 'drawer-container__drawer--visible' : ''
        }`}
      >
        <div className="padding-10">
          <div className="drawer-container__drawer-header">
            <span>*NNP* SUNRISE TANKS PVT.LTD</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onCloseDrawer}
            />
          </div>
          <div className="drawer-container__drawer-content">
            {selectedCustomer && renderCustomerDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
