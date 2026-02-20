import { createSlice } from "@reduxjs/toolkit";

const mapDataSlice = createSlice({
    name: "mapData",
    initialState: {
        cache: {}, // Stores data keyed by `${processId}_${levelParam}_${languageId}`
    },
    reducers: {
        setMapData: (state, action) => {
            const { key, data } = action.payload;
            state.cache[key] = data;
        },
        removeMapData: (state, action) => {
            const { key } = action.payload;
            delete state.cache[key];
        },
        clearMapCache: (state) => {
            state.cache = {};
        },
        invalidateCacheForLevel: (state, action) => {
            const { levelPattern } = action.payload;
            Object.keys(state.cache).forEach(key => {
                if (key.includes(levelPattern)) {
                    delete state.cache[key];
                }
            });
        },
        invalidateCacheForProcess: (state, action) => {
            const { processId } = action.payload;
            const pattern = `${processId}_`;
            Object.keys(state.cache).forEach(key => {
                if (key.startsWith(pattern)) {
                    delete state.cache[key];
                }
            });
        }
    },
});

export const { setMapData, removeMapData, clearMapCache, invalidateCacheForLevel, invalidateCacheForProcess } = mapDataSlice.actions;
export default mapDataSlice.reducer;
