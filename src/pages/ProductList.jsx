import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
import Filter from '../components/Filter'
import ProductModal from '../components/ProductModal'
import { clearFilters, setCategories } from '../store/filterSlice'
import productsData from '../data/products.json'

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')
  
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const filteredProducts = useMemo(() => {
    let filtered = productsData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(filter.searchQuery.toLowerCase())
      
      const matchesPrice = product.price >= filter.priceRange[0] && 
                          product.price <= filter.priceRange[1]
      
      const matchesCategory = filter.categories.length === 0 || 
                             filter.categories.includes(product.category)
      
      return matchesSearch && matchesPrice && matchesCategory
    })

    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }

    return filtered
  }, [filter, sortBy])

  const handleViewDetails = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const clearAllFilters = () => {
    dispatch(clearFilters())
    setSortBy('popularity')
  }

  const removeCategoryFilter = (categoryToRemove) => {
    const updatedCategories = filter.categories.filter(category => category !== categoryToRemove)
    dispatch(setCategories(updatedCategories))
  }

  const getSortLabel = (sortValue) => {
    const labels = {
      'popularity': '🔥 Popularity',
      'price-low-high': '💰 Price: Low to High',
      'price-high-low': '💰 Price: High to Low',
      'name': '📝 Name: A to Z',
      'newest': '🆕 Newest First'
    }
    return labels[sortValue] || sortValue
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-12 text-white shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Winter Sale! 🎉</h1>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Discover amazing deals with up to 50% off on premium products. Limited time offer - shop now!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              🛍️ Shop Collection
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              🔥 View Deals
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Filter />
            <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why Shop With Us?
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ Free shipping over ₹50</li>
                <li>✅ 30-day return policy</li>
                <li>✅ 24/7 customer support</li>
                <li>✅ Secure payment</li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Featured Products</h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        Showing <span className="font-bold text-blue-600 text-lg">{filteredProducts.length}</span> of{" "}
                        <span className="font-semibold">{productsData.length}</span> products
                      </span>
                      
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(filteredProducts.length / productsData.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs">
                      {filteredProducts.length < productsData.length && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {productsData.length - filteredProducts.length} hidden
                        </span>
                      )}
                      
                      {filter.categories.length > 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {filter.categories.length} category filter(s)
                        </span>
                      )}
                      
                      {sortBy !== 'popularity' && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full capitalize">
                          {sortBy.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="popularity">🔥 Popularity</option>
                    <option value="price-low-high">💰 Price: Low to High</option>
                    <option value="price-high-low">💰 Price: High to Low</option>
                    <option value="name">📝 Name: A to Z</option>
                    <option value="newest">🆕 Newest First</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {filter.searchQuery && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm text-blue-800 font-medium">
                        Searching: "<span className="font-bold">{filter.searchQuery}</span>"
                      </span>
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button 
                      onClick={() => dispatch(clearFilters())}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Clear</span>
                    </button>
                  </div>
                )}

                {(filter.categories.length > 0 || filter.priceRange[0] > 0 || filter.priceRange[1] < 1000) && !filter.searchQuery && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                        <span className="text-sm text-green-800 font-medium">Active Filters</span>
                      </div>
                      <button 
                        onClick={clearAllFilters}
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Clear all</span>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {filter.categories.map(category => (
                        <span key={category} className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full capitalize flex items-center border border-green-300">
                          🏷️ {category}
                          <button 
                            onClick={() => removeCategoryFilter(category)}
                            className="ml-1 hover:text-green-900 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      
                      {(filter.priceRange[0] > 0 || filter.priceRange[1] < 1000) && (
                        <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full flex items-center border border-green-300">
                          💰 ₹{filter.priceRange[0]} - ₹{filter.priceRange[1]}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {sortBy !== 'popularity' && !filter.searchQuery && filter.categories.length === 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                      </svg>
                      <span className="text-sm text-purple-800 font-medium">
                        Sorted by: <span className="font-bold capitalize">{getSortLabel(sortBy)}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => setSortBy('popularity')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reset</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {filter.searchQuery 
                    ? `No products found for "${filter.searchQuery}". Try different keywords.`
                    : "We couldn't find any products matching your criteria. Try adjusting your filters."
                  }
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}

export default ProductList