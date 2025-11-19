import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    priceRange: [0, 1000],
    categories: [],
    searchQuery: '',
  },
  reducers: {
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.priceRange = [0, 1000];
      state.categories = [];
      state.searchQuery = '';
    },
  },
});

export const { setPriceRange, setCategories, setSearchQuery, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;