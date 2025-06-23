import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorPrimary, colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  console.log(theme, colorPrimary, 'line 18');

  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      // label: <span>nav 1</span>, // just a label (not link)
    },
    {
      key: '2',
      icon: <VideoCameraOutlined />,

      label: (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          nav 2
        </NavLink>
      ),
    },
    {
      key: '3',
      icon: <UploadOutlined />,
      label: (
        <NavLink
          to="/customer"
          className={({ isActive }) =>
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          nav 3
        </NavLink>
      ),
    },
  ];

  return (
    <Layout style={{ height: '100vh', background: colorBgContainer }}>
      {/* <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sideBar"
        theme="light"
        background={colorBgContainer}
        border="none"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ border: 'none' }}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
              style: { backgroundColor: colorPrimary, color: '#ffff' },
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider> */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sideBar"
        theme="light"
        style={{ background: colorBgContainer, borderRight: 'none' }}
      >
        <div className="demo-logo-vertical" />
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
        <Header
          style={{
            padding: 0,
            background: colorPrimary,
            borderRadius: '10px 10px 0px 0px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          /> */}
        </Header>
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
