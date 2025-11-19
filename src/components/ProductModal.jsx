import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const ProductModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch()

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Price:</span>
                  <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Category:</span>
                  <span className="text-gray-600 capitalize">{product.category}</span>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal