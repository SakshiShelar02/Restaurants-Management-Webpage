import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  refreshData, 
  updateRestaurant, 
  deleteRestaurant, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  toggleRestaurantStatus,
  copyRestaurantToLocation
} from '../redux/slices/restaurantSlice'
import AddCategoryModal from './AddCategoryModal'
import AddRestaurantModal from './AddRestaurantModal'
import RestaurantDetailsModal from './RestaurantDetailsModal'

const RestaurantManagement = () => {
  const dispatch = useDispatch()
  const restaurants = useSelector(state => state.restaurant.restaurants)
  const categories = useSelector(state => state.restaurant.categories)
  const stats = useSelector(state => state.restaurant.stats)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showRestaurantModal, setShowRestaurantModal] = useState(false)
  const [showRestaurantDetailsModal, setShowRestaurantDetailsModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingRestaurant, setEditingRestaurant] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [outdoorSeatingFilter, setOutdoorSeatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [pageSize, setPageSize] = useState(10)

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Ahmedabad',
    'Chennai',
    'Kolkata',
    'Surat',
    'Pune',
    'Jaipur',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara'
  ]

  // Calculate category statistics dynamically
  const getCategoryStats = () => {
    return categories.map(category => {
      const categoryRestaurants = restaurants.filter(restaurant => 
        restaurant.category === category.name && restaurant.location === category.location
      )
      return {
        ...category,
        items: categoryRestaurants.length
      }
    })
  }

  // Get stats with real-time calculations
  const getRealTimeStats = () => {
    const totalRestaurants = restaurants.length
    const active = restaurants.filter(r => r.active).length
    const monthlyRevenue = restaurants.reduce((sum, r) => sum + r.monthlyRevenue, 0)
    const avgRating = restaurants.length > 0 
      ? (restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)
      : '0.0'

    return {
      totalRestaurants,
      active,
      monthlyRevenue: monthlyRevenue.toLocaleString(),
      avgRating
    }
  }

  const categoryStats = getCategoryStats()
  const realTimeStats = getRealTimeStats()

  // Filtered and sorted restaurants
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants)

  useEffect(() => {
    let filtered = [...restaurants]

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.location === selectedLocation)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(restaurant => 
        selectedStatus === 'active' ? restaurant.active : !restaurant.active
      )
    }

    if (ratingFilter !== 'all') {
      switch (ratingFilter) {
        case 'high-rating':
          filtered = filtered.filter(restaurant => restaurant.rating >= 4.5)
          break
        case 'good-rating':
          filtered = filtered.filter(restaurant => restaurant.rating >= 4.0)
          break
        case 'average-rating':
          filtered = filtered.filter(restaurant => restaurant.rating >= 3.5)
          break
      }
    }

    if (capacityFilter !== 'all') {
      switch (capacityFilter) {
        case 'small':
          filtered = filtered.filter(restaurant => restaurant.seatingCapacity < 50)
          break
        case 'medium':
          filtered = filtered.filter(restaurant => restaurant.seatingCapacity >= 50 && restaurant.seatingCapacity <= 100)
          break
        case 'large':
          filtered = filtered.filter(restaurant => restaurant.seatingCapacity > 100)
          break
      }
    }

    if (outdoorSeatingFilter !== 'all') {
      filtered = filtered.filter(restaurant => 
        outdoorSeatingFilter === 'has-outdoor' ? restaurant.hasOutdoorSeating : !restaurant.hasOutdoorSeating
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'revenue':
          aValue = a.monthlyRevenue
          bValue = b.monthlyRevenue
          break
        case 'customers':
          aValue = a.monthlyCustomers
          bValue = b.monthlyCustomers
          break
        case 'capacity':
          aValue = a.seatingCapacity
          bValue = b.seatingCapacity
          break
        case 'established':
          aValue = new Date(a.establishmentYear, 0, 1)
          bValue = new Date(b.establishmentYear, 0, 1)
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredRestaurants(filtered)
  }, [
    restaurants, 
    searchTerm, 
    selectedLocation, 
    selectedCategory, 
    selectedStatus,
    ratingFilter, 
    capacityFilter, 
    outdoorSeatingFilter, 
    sortBy, 
    sortOrder
  ])

  const handleRefresh = () => {
    dispatch(refreshData())
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Restaurant Name,Category,Average Bill,Operating Cost,Seating Capacity,Location,Active,Rating,Monthly Customers,Monthly Revenue,Profit Margin,Established,Outdoor Seating\n"
      + restaurants.map(restaurant => 
          `"${restaurant.name}","${restaurant.category}",${restaurant.averageBill},${restaurant.operatingCost},${restaurant.seatingCapacity},"${restaurant.location}",${restaurant.active},${restaurant.rating},${restaurant.monthlyCustomers},${restaurant.monthlyRevenue},${restaurant.profitMargin}%,${restaurant.establishmentYear},${restaurant.hasOutdoorSeating}`
        ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "restaurant_management.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
    setShowRestaurantDetailsModal(true)
  }

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant)
    setShowRestaurantModal(true)
  }

  const handleDeleteRestaurant = (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      dispatch(deleteRestaurant(restaurantId))
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowCategoryModal(true)
  }

  const handleDeleteCategory = (categoryId) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId)
    const restaurantsInCategory = restaurants.filter(restaurant => 
      restaurant.category === categoryToDelete.name && restaurant.location === categoryToDelete.location
    )
    
    if (restaurantsInCategory.length > 0) {
      if (window.confirm(`This category has ${restaurantsInCategory.length} restaurant(s). Deleting it will also delete all associated restaurants. Are you sure you want to proceed?`)) {
        // Delete all restaurants in this category first
        restaurantsInCategory.forEach(restaurant => {
          dispatch(deleteRestaurant(restaurant.id))
        })
        // Then delete the category
        dispatch(deleteCategory(categoryId))
      }
    } else {
      if (window.confirm('Are you sure you want to delete this category?')) {
        dispatch(deleteCategory(categoryId))
      }
    }
  }

  const handleCopyRestaurant = (restaurant, targetLocation) => {
    dispatch(copyRestaurantToLocation({ restaurantId: restaurant.id, targetLocation }))
  }

  const handleToggleStatus = (restaurant) => {
    dispatch(toggleRestaurantStatus(restaurant.id))
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedLocation('all')
    setSelectedCategory('all')
    setSelectedStatus('all')
    setRatingFilter('all')
    setCapacityFilter('all')
    setOutdoorSeatingFilter('all')
    setSortBy('name')
    setSortOrder('asc')
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowCategoryModal(true)
  }

  const handleAddRestaurant = () => {
    setEditingRestaurant(null)
    setShowRestaurantModal(true)
  }

  const handleCloseModals = () => {
    setShowCategoryModal(false)
    setShowRestaurantModal(false)
    setShowRestaurantDetailsModal(false)
    setEditingCategory(null)
    setEditingRestaurant(null)
    setSelectedRestaurant(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="w-full max-w-full">
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 mb-4 py-4">
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download" aria-hidden="true">
              <path d="M12 15V3"></path>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <path d="m7 10 5 5 5-5"></path>
            </svg>
            Export
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Total Restaurants</p>
                <p className="text-lg font-bold text-gray-900">{realTimeStats.totalRestaurants}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building h-4 w-4 text-red-600" aria-hidden="true">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                  <path d="M10 6h4"></path>
                  <path d="M10 10h4"></path>
                  <path d="M10 14h4"></path>
                  <path d="M10 18h4"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Active</p>
                <p className="text-lg font-bold text-gray-900">{realTimeStats.active}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-4 w-4 text-red-600" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-lg font-bold text-gray-900">${realTimeStats.monthlyRevenue}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign h-4 w-4 text-red-600" aria-hidden="true">
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Avg Rating</p>
                <p className="text-lg font-bold text-gray-900">{realTimeStats.avgRating}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star h-4 w-4 text-red-600" aria-hidden="true">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-700">Location:</label>
              <div className="relative">
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock" aria-hidden="true">
                <path d="M12 6v6l4 2"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
            <button 
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-3 w-3" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add Category
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {categoryStats.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.location}</p>
                    <p className="text-xs text-blue-600">{category.items} restaurants</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen h-3 w-3" aria-hidden="true">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 lucide-trash-2 h-3 w-3" aria-hidden="true">
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurants Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Restaurants</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddRestaurant}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 text-xs"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-3 w-3" aria-hidden="true">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    Add Restaurant
                  </button>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" aria-hidden="true">
                        <path d="m21 21-4.34-4.34"></path>
                        <circle cx="11" cy="11" r="8"></circle>
                      </svg>
                      <input 
                        placeholder="Search restaurants..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs" 
                        type="text" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                  <select 
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="high-rating">High Rating (4.5+)</option>
                    <option value="good-rating">Good Rating (4.0+)</option>
                    <option value="average-rating">Average (3.5+)</option>
                  </select>
                  <select 
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">Small (&lt;50)</option>
                    <option value="medium">Medium (50-100)</option>
                    <option value="large">Large (&gt;100)</option>
                  </select>
                  <select 
                    value={outdoorSeatingFilter}
                    onChange={(e) => setOutdoorSeatingFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Outdoor Seating</option>
                    <option value="has-outdoor">Has Outdoor</option>
                    <option value="no-outdoor">No Outdoor</option>
                  </select>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="revenue">Sort by Revenue</option>
                    <option value="customers">Sort by Customers</option>
                    <option value="capacity">Sort by Capacity</option>
                    <option value="established">Sort by Established</option>
                  </select>
                  <button 
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
                  </button>
                  <button 
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x" aria-hidden="true">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                    Clear All
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>Showing {filteredRestaurants.length} of {restaurants.length} restaurants</div>
                  <div className="flex items-center gap-2">
                    <label>Show:</label>
                    <select 
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <input className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" type="checkbox" />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financials</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants.slice(0, pageSize).map(restaurant => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" type="checkbox" />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building w-4 h-4 text-gray-400" aria-hidden="true">
                            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                            <path d="M10 6h4"></path>
                            <path d="M10 10h4"></path>
                            <path d="M10 14h4"></path>
                            <path d="M10 18h4"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium text-gray-900">{restaurant.name}</div>
                            {restaurant.rating > 4.5 && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown w-3 h-3 text-yellow-500" aria-hidden="true">
                                <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                                <path d="M5 21h14"></path>
                              </svg>
                            )}
                            <span 
                              className={`w-2 h-2 rounded-full cursor-pointer ${restaurant.active ? 'bg-green-500' : 'bg-red-500'}`}
                              onClick={() => handleToggleStatus(restaurant)}
                              title={restaurant.active ? 'Click to deactivate' : 'Click to activate'}
                            ></span>
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-48">{restaurant.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-blue-600">{restaurant.seatingCapacity} seats</span>
                            <span className="text-xs text-gray-500">Est. {restaurant.establishmentYear}</span>
                            {restaurant.hasOutdoorSeating && (
                              <span className="text-xs text-green-600">Outdoor</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs text-gray-900">{restaurant.category}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <div className="text-xs font-medium text-gray-900">${restaurant.averageBill} avg bill</div>
                        <div className="text-xs text-gray-500">${restaurant.operatingCost} monthly cost</div>
                        <span className={`text-xs font-medium ${restaurant.profitMargin > 35 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {restaurant.profitMargin}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span 
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          restaurant.active 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                        onClick={() => handleToggleStatus(restaurant)}
                      >
                        <span className={`w-1 h-1 rounded-full mr-1 ${restaurant.active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {restaurant.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg 
                            key={star} 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="10" 
                            height="10" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className={`lucide lucide-star ${
                              star <= Math.floor(restaurant.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                            aria-hidden="true"
                          >
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                          </svg>
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{restaurant.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-xs text-gray-900">{restaurant.monthlyCustomers.toLocaleString()} monthly</div>
                      <div className="text-xs text-green-600">${restaurant.monthlyRevenue.toLocaleString()} revenue</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs text-gray-900">{restaurant.location}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleViewRestaurant(restaurant)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" 
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye" aria-hidden="true">
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEditRestaurant(restaurant)}
                          className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded" 
                          title="Edit Restaurant"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen" aria-hidden="true">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteRestaurant(restaurant.id)}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" 
                          title="Delete Restaurant"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 lucide-trash-2" aria-hidden="true">
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M3 6h18"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                        <div className="relative group">
                          <button className="p-1 text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true">
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <div className="p-2 max-h-60 overflow-y-auto">
                              <p className="text-xs font-medium text-gray-700 mb-2">Copy to:</p>
                              {locations.map(location => (
                                <button 
                                  key={location}
                                  onClick={() => handleCopyRestaurant(restaurant, location)}
                                  className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                                >
                                  {location}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showCategoryModal && (
          <AddCategoryModal 
            category={editingCategory}
            onClose={handleCloseModals} 
          />
        )}
        {showRestaurantModal && (
          <AddRestaurantModal 
            restaurant={editingRestaurant}
            onClose={handleCloseModals} 
          />
        )}
        {showRestaurantDetailsModal && selectedRestaurant && (
          <RestaurantDetailsModal 
            restaurant={selectedRestaurant}
            onClose={handleCloseModals}
          />
        )}
      </div>
    </div>
  )
}

export default RestaurantManagement