import React, { useState } from 'react';
import { Form, Input, Button, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import './LoginPage.scss';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you would typically make an API call to authenticate
      // For now, we'll simulate a successful login
      console.log(values, 'line 12');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(login(values));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <div className="login-left">
          <div className="welcome-text">
            <h2>Welcome to</h2>
            <h1>
              Enterprise
              <br />
              Resource
              <br />
              Application
            </h1>
            <p className="subtitle">
              ADDING GOOD - TO MAKE PLASTICS
              <br />
              SAFER, AFFORDABLE &amp; SUSTAINABLE
            </p>
          </div>
        </div>
        <div className="login-right">
          <div className="alok-login-container">
            <img src="/Logo.png" alt="ALOK Logo" className="alok-logo" />
          </div>

          <div className="login-form-wrapper">
            <h2 className="welcome-back">Welcome Back</h2>
            <p className="login-desc">
              Enter your email and password to access your account
            </p>
            <Form name="login" onFinish={onFinish} layout="vertical">
              <Form.Item
                name="username"
                label="UserName"
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <Input placeholder="Write your email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter your password"
                />
              </Form.Item>

              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Input type="checkbox" style={{ marginRight: 8 }} />
                  <span>Remember me</span>
                </Form.Item>
                <a href="#" className="forgot-password">
                  Forgot Password
                </a>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="login-btn"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <p className="agreement-text">
              By clicking Continue, you agree to Alok’s{' '}
              <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>,
              and <a href="#">Cookie Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
