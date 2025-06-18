import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './Components/Header';
import Customer from './Components/Pages/Customer/Customer';
import LoginPage from './Components/Pages/Auth/LoginPage';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div id="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Header />
                  <Customer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
