import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import './Header.scss';
const { Header, Sider, Content } = Layout;

const HeaderLayout = (props) => {
  const {
    token: { colorPrimary, colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const routesConfig = [
    {
      key: 'home',
      path: '/home',
      label: 'Home',
      showTabs: true,
      tabs: [],
    },
    {
      key: 'receivable',
      path: '/receivable',
      label: 'Accounts Receivable',
      showTabs: true,
      tabs: [
        { key: '/receivable/customers', label: 'Customers' },
        { key: '/receivable/invoices', label: 'Customers Invoice' },
        { key: '/receivable/freetaxinvoices', label: 'Free Tax Invoice' },
        { key: '/receivable/payments', label: 'Payments' },
        { key: '/receivable/collections', label: 'Collections' },
        { key: '/receivable/salesorder', label: 'Sales Orders' },
        { key: '/receivable/postdatecheques', label: 'Post Date Cheques' },
      ],
    },
    {
      key: 'payable',
      path: '/payable',
      label: 'Accounts Payable',
      showTabs: true,
      tabs: [
        { key: '/payable', label: 'Vendor List' },
        { key: '/payable/bills', label: 'Bills' },
      ],
    },
    {
      key: 'employee',
      path: '/employee',
      label: 'Human Resource',
      showTabs: true,
      tabs: [{ key: '/employee', label: 'Employee' }],
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current route config
  const currentRoute = routesConfig.find((route) =>
    location.pathname.startsWith(route.path)
  );

  const { setCollapsed, collapsed } = props;

  return (
    <Header
      id="header"
      style={{
        background: colorPrimary,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed()}
        style={{
          fontSize: '16px',
          width: 34,
          height: 64,
          color: '#ffff',
        }}
      />
      <Menu
        mode="horizontal"
        className="header-nav-container"
        selectedKeys={[location.pathname]}
        items={currentRoute?.tabs?.map((tab) => ({
          key: tab.key,
          label: tab.label,
          onClick: () => navigate(tab.key),
        }))}
      />
    </Header>
  );
};
export default HeaderLayout;
