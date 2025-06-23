import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './global.scss';
import App from './App.jsx';
import { ConfigProvider } from 'antd';
import { Theme } from '../src/Components/Theme/Theme.jsx';
// import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={Theme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
