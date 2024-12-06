import React, { useCallback, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/userSlice'; // Action to set the user
import Login from './Pages/Login/Login';
import { BreadcrumbsProvider } from './context/BreadcrumbsContext';
import { CurrentUser } from './API/api';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import MapLevel from './Pages/Map_level/MapLevel';
import ProcessTitle from './Pages/Map_level/ProcessTitle';
import ListProcessTitle from './Pages/Map_level/ListProcessTitle';
import Swimlane_model from './Pages/Map_level/Swimlane_model';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BreadcrumbsProvider>
      <Router>
        <AppContent />
      </Router>
    </BreadcrumbsProvider>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasCheckedToken = useRef(false); // Use a ref to track if checkToken has been called

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await CurrentUser(token); // Fetch current user
        dispatch(setUser(response)); // Save user to Redux
        navigate('/List-process-title'); // Navigate to dashboard after fetching user
      } catch (error) {
        console.error('Error fetching current user:', error);
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login page
      }
    } else {
      navigate('/login'); // Redirect to login page if no token
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!hasCheckedToken.current) {
      checkToken(); // Check token when the app loads
      hasCheckedToken.current = true; // Set the ref to true after the first check
    }
  }, [checkToken]); // Include checkToken in the dependency array

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Map_level" element={<PrivateRoute><MapLevel /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/Add-process-title" element={<PrivateRoute><ProcessTitle /></PrivateRoute>} />
      <Route path="/List-process-title" element={<PrivateRoute><ListProcessTitle /></PrivateRoute>} />
      <Route path="/swimlane/level/:level/:parentId" element={<Swimlane_model />} />

      <Route path="/level/:level/:parentId/*" element={<PrivateRoute><MapLevel /></PrivateRoute>} />
    </Routes>
  );
};

export default App;
