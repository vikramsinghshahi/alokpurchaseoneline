import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Customer from './Components/Pages/AccountReceivable/Customer/Customer';
import LoginPage from './Components/Pages/Auth/LoginPage';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './Components/MainLayout/MainLayout';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import Payable from './Components/Pages/AccountPayable/Payable/Payable';
import Employee from './Components/Pages/HR/Employee';
import Invoice from './Components/Pages/AccountReceivable/Invoice/Invoice';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div id="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receivable"
                element={<Navigate to="/receivable/customers" replace />}
              />
              <Route
                path="/receivable/customers"
                element={
                  <ProtectedRoute>
                    <Customer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receivable/invoices"
                element={
                  <ProtectedRoute>
                    <Invoice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payable"
                element={
                  <ProtectedRoute>
                    <Payable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee"
                element={
                  <ProtectedRoute>
                    <Employee />
                  </ProtectedRoute>
                }
              />
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
