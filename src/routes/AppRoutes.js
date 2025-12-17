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
import MapResolver from "./resolvers/MapResolver";
import SwimlaneResolver from "./resolvers/SwimlaneResolver";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-form" element={<SignupForm />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/account/settings" element={<Account />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Private Routes */}

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<ManageAssignedUsers />} />
        <Route path="/users/create" element={<AddUser />} />
        <Route path="/users/edit" element={<EditUser />} />
        <Route path="/processes/create" element={<ProcessTitle />} />
        <Route path="/list-process-title" element={<ListProcessTitle />} />


        {/* MAP */}
        <Route path=":mode/map/:processId" element={<MapResolver />} />
        <Route path=":mode/map/:processId/:level/:parentId" element={<MapResolver />} />

        {/* SWIMLANE */}
        <Route path=":mode/swimlane/:processId" element={<SwimlaneResolver />} />
        <Route path=":mode/swimlane/:processId/:level/:parentId" element={<SwimlaneResolver />} />
        <Route path="/swimlane-version/:processId/:level/:version/:pageTitle/:user_id/:currentParentId" element={<SwimlaneMapVersion />} />
        <Route path="/process-version/:processId/:level/:version/:pageTitle/:user_id/:currentParentId" element={<DraftProcessMapVersion />} />
      </Route>
      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;




{/* <Route
          path="/map-level/:processId/*"
          element={

            <ReactFlowProvider>
              <MapLevel />
            </ReactFlowProvider>

          }
        /> */}
{/* <Route path="/level/:level/:parentId/:processId/*" element={<MapLevel />} /> */ }
{/* <Route path="/swimlane/level/:level/:parentId/:processId/*" element={<SwimlaneModel />} /> */ }
{/* <Route path="/published-map-level/:processId" element={<PublishedMapLevel />} /> */ }
{/* <Route path="/published-map-level/:level/:parentId/:processId/*" element={<PublishedMapLevel />} /> */ }
{/* <Route path="/published-swimlane/level/:level/:parentId/:processId" element={<PublishedSwimlaneModel />} /> */ }
{/* <Route path="/draft-process-view/:processId" element={<DraftProcesMapLevel />} /> */ }
{/* <Route path="/draft-process-view/:level/:parentId/:processId/*" element={<DraftProcesMapLevel />} /> */ }
{/* <Route path="/draft-swimlane-view/level/:level/:parentId/:processId" element={<DraftSwimlineLevel />} /> */ }