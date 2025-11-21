import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [
    { id: 1, name: 'Fine Dining', location: 'Mumbai', items: 2, active: true },
    { id: 2, name: 'Casual Dining', location: 'Delhi', items: 1, active: true },
    { id: 3, name: 'Fast Food', location: 'Pune', items: 1, active: true },
    { id: 4, name: 'Cafe & Bakery', location: 'Bangalore', items: 1, active: true },
    { id: 5, name: 'Bar & Grill', location: 'Hyderabad', items: 0, active: true },
  ],
  restaurants: [
    { 
      id: 1, 
      name: 'La Belle Cuisine', 
      description: 'French fine dining with seasonal ingredients', 
      establishmentYear: 2015, 
      seatingCapacity: 80, 
      category: 'Fine Dining', 
      averageBill: 85.00, 
      operatingCost: 25000, 
      location: 'Mumbai', 
      active: true, 
      hasOutdoorSeating: true, 
      rating: 4.7,
      monthlyCustomers: 1200,
      monthlyRevenue: 102000,
      profitMargin: 28.5,
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Sakura Japanese', 
      description: 'Authentic Japanese cuisine and sushi bar', 
      establishmentYear: 2018, 
      seatingCapacity: 60, 
      category: 'Fine Dining', 
      averageBill: 65.00, 
      operatingCost: 18000, 
      location: 'Mumbai', 
      active: true, 
      hasOutdoorSeating: false, 
      rating: 4.8,
      monthlyCustomers: 1500,
      monthlyRevenue: 97500,
      profitMargin: 32.1,
      createdAt: '2024-01-10'
    },
    { 
      id: 3, 
      name: 'Urban Bistro', 
      description: 'Modern American comfort food', 
      establishmentYear: 2020, 
      seatingCapacity: 120, 
      category: 'Casual Dining', 
      averageBill: 35.00, 
      operatingCost: 15000, 
      location: 'Delhi', 
      active: true, 
      hasOutdoorSeating: true, 
      rating: 4.3,
      monthlyCustomers: 2800,
      monthlyRevenue: 98000,
      profitMargin: 35.2,
      createdAt: '2024-01-12'
    },
    { 
      id: 4, 
      name: 'Burger Express', 
      description: 'Quick service burgers and fries', 
      establishmentYear: 2021, 
      seatingCapacity: 45, 
      category: 'Fast Food', 
      averageBill: 12.50, 
      operatingCost: 8000, 
      location: 'Pune', 
      active: true, 
      hasOutdoorSeating: false, 
      rating: 4.1,
      monthlyCustomers: 4500,
      monthlyRevenue: 56250,
      profitMargin: 42.5,
      createdAt: '2024-01-08'
    },
    { 
      id: 5, 
      name: 'Brew & Bites Cafe', 
      description: 'Specialty coffee and fresh bakery items', 
      establishmentYear: 2022, 
      seatingCapacity: 40, 
      category: 'Cafe & Bakery', 
      averageBill: 8.50, 
      operatingCost: 6000, 
      location: 'Bangalore', 
      active: true, 
      hasOutdoorSeating: true, 
      rating: 4.6,
      monthlyCustomers: 5200,
      monthlyRevenue: 44200,
      profitMargin: 45.3,
      createdAt: '2024-01-25'
    }
  ],
  stats: {
    totalRestaurants: 5,
    active: 5,
    monthlyRevenue: 397950,
    avgRating: 4.5
  },
  filters: {
    search: '',
    category: 'All',
    rating: 'All',
    seatingCapacity: 'All',
    hasOutdoorSeating: 'All',
    sortBy: 'name',
    sortOrder: 'ASC',
    status: 'All',
    location: 'all'
  }
}

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now(),
        ...action.payload
      }
      state.categories.push(newCategory)
    },
    
    updateCategory: (state, action) => {
      const { id, ...updates } = action.payload
      const categoryIndex = state.categories.findIndex(cat => cat.id === id)
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = { ...state.categories[categoryIndex], ...updates }
      }
    },
    
    deleteCategory: (state, action) => {
      const categoryId = action.payload
      state.categories = state.categories.filter(cat => cat.id !== categoryId)
      
      const categoryName = state.categories.find(cat => cat.id === categoryId)?.name
      if (categoryName) {
        state.restaurants = state.restaurants.filter(restaurant => restaurant.category !== categoryName)
      }
      
      state.stats.totalRestaurants = state.restaurants.length
      state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
      state.stats.monthlyRevenue = state.restaurants.reduce((total, restaurant) => total + restaurant.monthlyRevenue, 0)
      state.stats.avgRating = state.restaurants.length > 0 
        ? state.restaurants.reduce((total, restaurant) => total + restaurant.rating, 0) / state.restaurants.length
        : 0
    },
    
    addRestaurant: (state, action) => {
      const newRestaurant = {
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...action.payload,
        monthlyRevenue: action.payload.averageBill * (action.payload.monthlyCustomers || 0),
        profitMargin: ((action.payload.averageBill - (action.payload.operatingCost / (action.payload.monthlyCustomers || 1))) / action.payload.averageBill * 100).toFixed(1)
      }
      state.restaurants.push(newRestaurant)
      
      state.stats.totalRestaurants = state.restaurants.length
      state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
      state.stats.monthlyRevenue = state.restaurants.reduce((total, restaurant) => total + restaurant.monthlyRevenue, 0)
      state.stats.avgRating = state.restaurants.reduce((total, restaurant) => total + restaurant.rating, 0) / state.restaurants.length
      
      const category = state.categories.find(cat => cat.name === action.payload.category)
      if (category) {
        category.items += 1
      }
    },
    
    updateRestaurant: (state, action) => {
      const { id, ...updates } = action.payload
      const restaurantIndex = state.restaurants.findIndex(restaurant => restaurant.id === id)
      
      if (restaurantIndex !== -1) {
        const originalRestaurant = state.restaurants[restaurantIndex]
        const updatedRestaurant = {
          ...originalRestaurant,
          ...updates,
          monthlyRevenue: updates.averageBill ? updates.averageBill * (updates.monthlyCustomers || originalRestaurant.monthlyCustomers) : originalRestaurant.monthlyRevenue,
          profitMargin: updates.averageBill || updates.operatingCost 
            ? ((updates.averageBill || originalRestaurant.averageBill) - ((updates.operatingCost || originalRestaurant.operatingCost) / (updates.monthlyCustomers || originalRestaurant.monthlyCustomers || 1))) / (updates.averageBill || originalRestaurant.averageBill) * 100
            : originalRestaurant.profitMargin
        }
        
        state.restaurants[restaurantIndex] = updatedRestaurant
        
        state.stats.totalRestaurants = state.restaurants.length
        state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
        state.stats.monthlyRevenue = state.restaurants.reduce((total, restaurant) => total + restaurant.monthlyRevenue, 0)
        state.stats.avgRating = state.restaurants.reduce((total, restaurant) => total + restaurant.rating, 0) / state.restaurants.length
      }
    },
    
    deleteRestaurant: (state, action) => {
      const restaurantId = action.payload
      const restaurantIndex = state.restaurants.findIndex(restaurant => restaurant.id === restaurantId)
      
      if (restaurantIndex !== -1) {
        const restaurant = state.restaurants[restaurantIndex]
        state.restaurants.splice(restaurantIndex, 1)
        
        const category = state.categories.find(cat => cat.name === restaurant.category)
        if (category && category.items > 0) {
          category.items -= 1
        }
        
        state.stats.totalRestaurants = state.restaurants.length
        state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
        state.stats.monthlyRevenue = state.restaurants.reduce((total, restaurant) => total + restaurant.monthlyRevenue, 0)
        state.stats.avgRating = state.restaurants.length > 0 
          ? state.restaurants.reduce((total, restaurant) => total + restaurant.rating, 0) / state.restaurants.length
          : 0
      }
    },
    
    toggleRestaurantStatus: (state, action) => {
      const restaurantId = action.payload
      const restaurant = state.restaurants.find(restaurant => restaurant.id === restaurantId)
      
      if (restaurant) {
        restaurant.active = !restaurant.active
        state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
      }
    },
    
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    
    refreshData: (state) => {
      console.log('Refreshing restaurant data...')
      state.restaurants.forEach(restaurant => {
        if (Math.random() > 0.7) {
          const customerChange = Math.floor(Math.random() * 200) - 100
          restaurant.monthlyCustomers = Math.max(0, restaurant.monthlyCustomers + customerChange)
          restaurant.monthlyRevenue = restaurant.averageBill * restaurant.monthlyCustomers
        }
      })
      
      state.stats.totalRestaurants = state.restaurants.length
      state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
      state.stats.monthlyRevenue = state.restaurants.reduce((total, restaurant) => total + restaurant.monthlyRevenue, 0)
      state.stats.avgRating = state.restaurants.reduce((total, restaurant) => total + restaurant.rating, 0) / state.restaurants.length
    },
    
    copyRestaurantToLocation: (state, action) => {
      const { restaurantId, targetLocation } = action.payload
      const originalRestaurant = state.restaurants.find(restaurant => restaurant.id === restaurantId)
      
      if (originalRestaurant) {
        const newRestaurant = {
          ...originalRestaurant,
          id: Date.now(),
          location: targetLocation,
          monthlyCustomers: Math.floor(originalRestaurant.monthlyCustomers * 0.7),
          monthlyRevenue: originalRestaurant.averageBill * Math.floor(originalRestaurant.monthlyCustomers * 0.7),
          createdAt: new Date().toISOString().split('T')[0]
        }
        
        state.restaurants.push(newRestaurant)
        
        state.stats.totalRestaurants = state.restaurants.length
        state.stats.active = state.restaurants.filter(restaurant => restaurant.active).length
        
        const category = state.categories.find(cat => 
          cat.name === originalRestaurant.category && cat.location === targetLocation
        )
        if (category) {
          category.items += 1
        } else {
          state.categories.push({
            id: Date.now() + 1,
            name: originalRestaurant.category,
            location: targetLocation,
            items: 1,
            active: true
          })
        }
      }
    }
  },
})

export const { 
  addCategory, 
  updateCategory,
  deleteCategory,
  addRestaurant, 
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  updateFilters, 
  clearFilters, 
  refreshData,
  copyRestaurantToLocation
} = restaurantSlice.actions

export default restaurantSlice.reducer