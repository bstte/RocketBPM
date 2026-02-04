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
        }
    },
});

export const { setMapData, removeMapData, clearMapCache, invalidateCacheForLevel } = mapDataSlice.actions;
export default mapDataSlice.reducer;
