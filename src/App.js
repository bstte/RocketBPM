import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { BreadcrumbsProvider } from "./context/BreadcrumbsContext";
import { store } from "./redux/store";
import { setUser } from "./redux/userSlice";
import "./App.css";
import { CurrentUser } from "./API/api"; // Import the API call
import { GoogleOAuthProvider } from "@react-oauth/google";

function InitializeUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await CurrentUser(token);
        dispatch(setUser(response)); // Store user in Redux
      } catch (error) {
        console.error("Error fetching user on reload:", error);
        localStorage.removeItem("token"); // Clear invalid token
      }
    };

    fetchUser();
  }, [dispatch]);

  return null; // This component does not render anything
}

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="654780250240-92hncbd7gse4bm196fl056l4a2s68aqk.apps.googleusercontent.com">

        <BreadcrumbsProvider>
          <Router>
            <InitializeUser /> {/* Fetch user on app load */}
            <AppRoutes />
          </Router>
        </BreadcrumbsProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
