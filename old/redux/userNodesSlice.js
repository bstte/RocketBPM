import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserNodes } from "../API/api";

// Async Thunk for fetching user nodes
export const fetchUserNodes = createAsyncThunk(
  "userNodes/fetchUserNodes",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserNodes(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userNodesSlice = createSlice({
  name: "userNodes",
  initialState: {
    nodes: [],
    assignedProcesses: [],
    processTitle: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserNodes.fulfilled, (state, action) => {
        state.loading = false;
        state.nodes = action.payload.nodes || [];
        state.assignedProcesses = action.payload.assignedProcesses || [];
        state.processTitle = action.payload.ProcessTitle || [];
      })
      .addCase(fetchUserNodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userNodesSlice.reducer;
