import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import HeaderLayout from '../Header/Header';
import Alok from '../Common/Icons/Alok';
import Receivable from '../Common/Icons/Receivable';
import AlokNameIcon from '../Common/Icons/AlokNameIcon';
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorPrimary, colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '1',
      icon: <VideoCameraOutlined />,
      label: (
        <NavLink
          to="/receivable"
          className={({ isActive }) =>
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          Account Receivable
        </NavLink>
      ),
    },
    {
      key: '2',
      icon: <UploadOutlined />,
      label: (
        <NavLink
          to="/payable"
          className={({ isActive }) =>
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          Account Payable
        </NavLink>
      ),
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: (
        <NavLink
          to="/employee"
          className={({ isActive }) =>
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          Employee
        </NavLink>
      ),
    },
  ];

  return (
    <Layout style={{ height: '100vh', background: colorBgContainer }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sideBar"
        theme="light"
        style={{ background: colorBgContainer, borderRight: 'none' }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0px',
          }}
        >
          {collapsed ? <Alok /> : <AlokNameIcon />}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['2']}
          style={{ border: 'none' }}
          items={menuItems}
        />
      </Sider>
      <Layout
        style={{
          margin: '10px',
          borderRadius: '10px',
        }}
      >
        <HeaderLayout
          setCollapsed={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        <Content
          style={{
            // margin: '24px 16px',
            padding: '10px',
            minHeight: 280,
            borderRadius: borderRadiusLG,
            backgroundColor: '#FFFF',
            border: '1px solid #ebebeb',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
