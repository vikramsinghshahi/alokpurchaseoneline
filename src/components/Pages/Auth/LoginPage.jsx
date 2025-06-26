import React, { useState } from 'react';
import { message } from 'antd';
import { Form, Input, Button, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import './LoginPage.scss';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step 1: Submit username/password, send OTP
  const onFinish = async (values) => {
    setLoading(true);
    setOtpError('');
    console.log({ values });
    try {
      // Replace with your real API call
      // const res = await api.post('/api/auth/login', { username: values.username, password: values.password });
      // if (!res.data.success) throw new Error(res.data.message);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock
      setUserData({ username: values.username, password: values.password });
      setEmail(values.username);
      setStep('otp');
      message.success('OTP sent to your email');
    } catch (error) {
      message.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e) => {
    console.log({ e });
    // e.preventDefault();
    setLoading(true);
    setOtpError('');
    try {
      const enteredOtp = otp.join('');
      console.log(enteredOtp);
      if (enteredOtp.length !== 4) {
        setOtpError('Please enter the 4-digit OTP');
        setLoading(false);
        return;
      }
      // Replace with your real API call
      // const res = await api.post('/api/auth/verify-otp', { username: userData.username, otp: enteredOtp });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock
      if (enteredOtp !== '4457') throw new Error('Invalid OTP'); // Mock: 4457 is correct
      console.log(userData);
      dispatch(login(userData));
      navigate('/receivable/customers');
    } catch (error) {
      setOtpError(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
      navigate('/receivable/customers');
    }
  };

  // OTP input handler
  const handleOtpChange = (value, idx) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && idx < 3) {
      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError('');
    try {
      // Replace with your real API call
      // await api.post('/api/auth/resend-otp', { username: userData.username });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock
      message.success('OTP resent to your email');
    } catch (error) {
      setOtpError('Failed to resend OTP');
    } finally {
      setResendLoading(false);
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
            {step === 'credentials' ? (
              <>
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
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
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
              </>
            ) : (
              <>
                <p className="login-desc" style={{ textAlign: 'center' }}>
                  Enter the 4 digit code sent to your email
                  <br />
                  {/* <span style={{ fontWeight: 600 }}>{email}</span> */}
                </p>
                <Form
                  onFinish={handleOtpSubmit}
                  name="otp"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  className="otp-form"
                >
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        style={{
                          width: 48,
                          height: 48,
                          fontSize: 32,
                          textAlign: 'center',
                          border: '2px solid #7e3ff2',
                          borderRadius: 8,
                        }}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                  {otpError && (
                    <div style={{ color: 'red', marginBottom: 8 }}>
                      {otpError}
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    Didn’t get a code?{' '}
                    <Button
                      type="link"
                      onClick={handleResendOtp}
                      loading={resendLoading}
                      style={{ padding: 0 }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                  <Form.Item className="otp-btn">
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className="login-btn"
                      style={{ width: '100% ' }}
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
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

//   : (
//   <>
//     <p className="login-desc" style={{ textAlign: 'center' }}>
//       Enter the 4 digit code sent to your email<br />
//       <span style={{ fontWeight: 600 }}>{email}</span>
//     </p>
//     <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
//         {otp.map((digit, idx) => (
//           <input
//             key={idx}
//             id={`otp-input-${idx}`}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={e => handleOtpChange(e.target.value, idx)}
//             style={{
//               width: 48,
//               height: 56,
//               fontSize: 32,
//               textAlign: 'center',
//               border: '2px solid #7e3ff2',
//               borderRadius: 8
//             }}
//             autoFocus={idx === 0}
//           />
//         ))}
//       </div>
//       {otpError && <div style={{ color: 'red', marginBottom: 8 }}>{otpError}</div>}
//       <div style={{ marginBottom: 16 }}>
//         Didn’t get a code?{' '}
//         <Button type="link" onClick={handleResendOtp} loading={resendLoading} style={{ padding: 0 }}>
//           Resend OTP
//         </Button>
//       </div>
//       <Button
//         type="primary"
//         htmlType="submit"
//         block
//         loading={loading}
//         className="login-btn"
//         style={{ width: 240 }}
//       >
//         Login with OTP
//       </Button>
//     </form>
//   </>
// )}
