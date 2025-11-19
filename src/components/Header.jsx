import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchQuery } from '../store/filterSlice'

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const dispatch = useDispatch()
  
  const cartItems = useSelector(state => state.cart.items)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    dispatch(setSearchQuery(localSearch))
  }

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value)
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopEasy
            </span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit}>
              <div className={`relative ${isSearchFocused ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} rounded-lg transition-all duration-300`}>
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  placeholder="Search for products, brands and more..."
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:bg-white border border-gray-200 focus:border-blue-500 transition-all duration-300"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors group">
              <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs mt-1 font-medium">Home</span>
            </Link>

            <Link to="/cart" className="relative flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors group">
              <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">Cart</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header