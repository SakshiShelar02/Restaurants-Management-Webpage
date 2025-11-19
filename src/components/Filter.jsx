import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPriceRange, setCategories, setSearchQuery, clearFilters } from '../store/filterSlice'

const Filter = () => {
  const dispatch = useDispatch()
  const { priceRange, categories, searchQuery } = useSelector(state => state.filter)

  const allCategories = ['electronics', 'clothing', 'home', 'accessories']

  const handleCategoryChange = (category) => {
    const updatedCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category]
    dispatch(setCategories(updatedCategories))
  }

  const handlePriceRangeChange = (min, max) => {
    dispatch(setPriceRange([min, max]))
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={() => dispatch(clearFilters())}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>


      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 Search Products
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Type to search..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>


      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💰 Price Range
        </label>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
          <div className="flex space-x-4">
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="text-center text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded-lg">
            Selected: ₹{priceRange[0]} - ₹{priceRange[1]}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📦 Categories
        </label>
        <div className="space-y-3">
          {allCategories.map(category => (
            <label key={category} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 capitalize font-medium">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>


      {(categories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <span key={category} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                {category}
              </span>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Price: ₹{priceRange[0]}-₹{priceRange[1]}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Filter