// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Login, defaultApi } from "../API/api";
import CustomAlert from "../components/CustomAlert";

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await Login(email, password);
      const { access_token, user, translations } = response; // Access data correctly
      localStorage.setItem("token", access_token);
      // console.log("inside login",response)

      return { user, translations };
    } catch (error) {
      console.error("login error", error);
      CustomAlert.warning("Error", error.response.data.message);

      return rejectWithValue(error.response?.data || "An error occurred"); // Improved error handling
    }
  }
);

// Create logout asyncThunk
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await defaultApi.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in header
          },
        }
      );
      localStorage.removeItem("token");
      return response.data; // Return the response message
    } catch (error) {
      console.error("logout error", error);
      return rejectWithValue(
        error.response?.data || "An error occurred during logout"
      );
    }
  }
);
const savedTranslations = localStorage.getItem("translations");
const savedUser = localStorage.getItem("user");
// Add setUser action to set user data directly
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null, // ✅ Restore user

    translations: savedTranslations ? JSON.parse(savedTranslations) : {}, // ✅ localStorage se load

    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Save the user data in Redux
    },
    setTranslations: (state, action) => {
      state.translations = action.payload;
      localStorage.setItem("translations", JSON.stringify(action.payload)); // ✅ update bhi karo
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("translations"); // ✅ clear karo
      localStorage.removeItem("user"); // ✅ remove user data too
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.translations = action.payload.translations || {}; // ✅ Save translations
        localStorage.setItem(
          "translations",
          JSON.stringify(state.translations)
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // ✅ Save user to localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Clear user state
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload; // Handle any logout error
      });
  },
});

export const { setUser, setTranslations, logout } = userSlice.actions;

export default userSlice.reducer;
