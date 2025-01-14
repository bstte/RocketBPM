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
import SwimlaneModel from './Pages/Map_level/Swimlane_model';
import PublishedMapLevel from './Pages/Map_level/PublishedProcess/PublishedMapLevel';
import PublishedSwimlaneModel from './Pages/Map_level/PublishedProcess/PublishedSwimlaneModel';
import DraftProcesMapLevel from './Pages/Map_level/DraftProcessView/DraftProcesMapLevel';
import DraftSwimlineLevel from './Pages/Map_level/DraftProcessView/DraftSwimlineLevel';

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
  const hasCheckedToken = useRef(false); 

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
      <Route path="/Map-level" element={<PrivateRoute><MapLevel /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/Add-process-title" element={<PrivateRoute><ProcessTitle /></PrivateRoute>} />
      <Route path="/List-process-title" element={<PrivateRoute><ListProcessTitle /></PrivateRoute>} />
      <Route path="/swimlane/level/:level/:parentId" element={<SwimlaneModel />} />

      <Route path="/level/:level/:parentId/*" element={<PrivateRoute><MapLevel /></PrivateRoute>} />

      <Route path="/Published_Map_level" element={<PrivateRoute><PublishedMapLevel /></PrivateRoute>} />
      <Route path="/PublishedMapLevel/:level/:parentId/*" element={<PrivateRoute><PublishedMapLevel /></PrivateRoute>} />
      <Route path="/Published_swimlane/level/:level/:parentId" element={<PublishedSwimlaneModel />} />

      <Route path="/Draft-Process-View" element={<PrivateRoute><DraftProcesMapLevel /></PrivateRoute>} />
      <Route path="/Draft-Process-View/:level/:parentId/*" element={<PrivateRoute><DraftProcesMapLevel /></PrivateRoute>} />
      <Route path="/Draft-Swim-lanes-View/level/:level/:parentId" element={<DraftSwimlineLevel />} />
    </Routes>
  );
};

export default App;
