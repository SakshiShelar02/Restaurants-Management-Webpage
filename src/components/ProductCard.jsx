import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const ProductCard = ({ product, onViewDetails }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    dispatch(addToCart(product))
  }


  const discount = Math.floor(Math.random() * 50) + 10
  const rating = (Math.random() * 1 + 4).toFixed(1)
  const reviews = Math.floor(Math.random() * 1000) + 50


  const handleImageError = (e) => {
    e.target.style.display = 'none'
    const fallback = e.target.nextSibling
    if (fallback) {
      fallback.style.display = 'flex'
    }
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer group"
      onClick={() => onViewDetails(product)}
    >

      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />

        <div 
          className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center hidden"
        >
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white text-2xl">📦</span>
            </div>
            <span className="text-gray-600 text-sm font-medium">{product.name}</span>
            <p className="text-gray-400 text-xs mt-1">Product Image</p>
          </div>
        </div>
        
        <div className="absolute top-3 left-3">
          <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-lg">
            {discount}% OFF
          </span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-lg flex items-center">
            ⭐ {rating}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          <span className="text-sm text-gray-500 line-through">₹{(product.price * 1.3).toFixed(2)}</span>
          <span className="text-sm font-bold text-green-600">{discount}% off</span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= Math.floor(parseFloat(rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium capitalize border border-blue-200">
            {product.category}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:shadow-lg transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Add to Cart</span>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-green-600 font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free delivery • Delivery in 2 days
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard