import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";

// Public Pages
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";
import Forgotpassword from "../Pages/Forgotpassword/Forgotpassword";
import Account from "../Pages/Accountsettings/Account";

// Private Pages (Without Lazy Loading)
import Dashboard from "../Pages/Dashboard/Dashboard";
import Profile from "../Pages/Profile/Profile";
import ManageAssignedUsers from "../Pages/Manage Assigned Users/ManageAssignedUsers";
import AddUser from "../Pages/Manage Assigned Users/AddUser";
import MapLevel from "../Pages/Map_level/MapLevel";
import ProcessTitle from "../Pages/Map_level/ProcessTitle";
import ListProcessTitle from "../Pages/Map_level/ListProcessTitle";
import SwimlaneModel from "../Pages/Map_level/Swimlane_model";
import PublishedMapLevel from "../Pages/Map_level/PublishedProcess/PublishedMapLevel";
import PublishedSwimlaneModel from "../Pages/Map_level/PublishedProcess/PublishedSwimlaneModel";
import DraftProcesMapLevel from "../Pages/Map_level/DraftProcessView/DraftProcesMapLevel";
import DraftSwimlineLevel from "../Pages/Map_level/DraftProcessView/DraftSwimlineLevel";
import { ReactFlowProvider } from "@xyflow/react";
import EditUser from "../Pages/Manage Assigned Users/editUser";
import SignupForm from "../Pages/Signup/SignupForm";
import Setting from "../Pages/Setting/Setting";
import DraftProcessMapVersion from "../Pages/Map_level/DraftProcessMapVersion";
import SwimlaneMapVersion from "../Pages/Map_level/SwimlaneMapVersion";
import ResetPassword from "../Pages/Forgotpassword/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/SignupForm" element={<SignupForm />} />

      <Route path="/forgotpassword" element={<Forgotpassword />} />
      <Route path="/account" element={<Account />} />
      <Route path="/setting" element={<Setting />} />
  <Route path="/reset-password" element={<ResetPassword />} />
      {/* Private Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/user-management" element={<PrivateRoute><ManageAssignedUsers /></PrivateRoute>} />
      <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>} />
      <Route path="/edit-user" element={<PrivateRoute><EditUser /></PrivateRoute>} />

      <Route
        path="/map-level/:processId/*"
        element={
          <PrivateRoute>
            <ReactFlowProvider>
              <MapLevel />
            </ReactFlowProvider>
          </PrivateRoute>
        }
      />
   <Route path="/level/:level/:parentId/:processId/*" element={<PrivateRoute><MapLevel /></PrivateRoute>} />
      <Route path="/add-process-title" element={<PrivateRoute><ProcessTitle /></PrivateRoute>} />
      <Route path="/list-process-title" element={<PrivateRoute><ListProcessTitle /></PrivateRoute>} />
      <Route path="/swimlane/level/:level/:parentId/:processId/*" element={<PrivateRoute><SwimlaneModel /></PrivateRoute>} />
      <Route path="/published-map-level/:processId" element={<PrivateRoute><PublishedMapLevel /></PrivateRoute>} />

      <Route path="/published-map-level/:level/:parentId/:processId/*" element={<PrivateRoute><PublishedMapLevel /></PrivateRoute>} />
      <Route path="/published-swimlane/level/:level/:parentId/:processId" element={<PrivateRoute><PublishedSwimlaneModel /></PrivateRoute>} />
      {/* <Route path="/draft-process-view" element={<PrivateRoute><DraftProcesMapLevel /></PrivateRoute>} /> */}
      <Route path="/draft-process-view/:processId" element={<PrivateRoute><DraftProcesMapLevel /></PrivateRoute>} />


      <Route path="/draft-process-view/:level/:parentId/:processId/*" element={<PrivateRoute><DraftProcesMapLevel /></PrivateRoute>} />
      <Route path="/draft-swim-lanes-view/level/:level/:parentId/:processId" element={<PrivateRoute><DraftSwimlineLevel /></PrivateRoute>} />

      <Route path="/Swimlane-Version/:processId/:level/:version/:pageTitle/:user_id" element={<SwimlaneMapVersion />} />

      <Route path="/Draft-Process-Version/:processId/:level/:version/:pageTitle/:user_id" element={<DraftProcessMapVersion />} />

      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
