import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { BreadcrumbsProvider } from "./context/BreadcrumbsContext";
import { store } from "./redux/store";
import { setUser } from "./redux/userSlice";
import { CurrentUser } from "./API/api"; // Import the API call

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
      <BreadcrumbsProvider>
        <Router>
          <InitializeUser /> {/* Fetch user on app load */}
          <AppRoutes />
        </Router>
      </BreadcrumbsProvider>
    </Provider>
  );
}

export default App;
