import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addCategory, updateCategory } from '../redux/slices/restaurantSlice'

const AddCategoryModal = ({ category, onClose }) => {
  const dispatch = useDispatch()
  
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
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    items: 0,
    active: true
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        location: category.location || '',
        items: category.items || 0,
        active: category.active !== undefined ? category.active : true
      })
    }
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const categoryData = {
      ...formData,
      items: parseInt(formData.items)
    }

    if (category) {
      dispatch(updateCategory({ id: category.id, ...categoryData }))
    } else {
      dispatch(addCategory(categoryData))
    }
    
    onClose()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              {category ? 'Edit Category' : 'Add Category'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5" aria-hidden="true">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Location *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
            >
              <option value="">Select Location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Initial Items Count
            </label>
            <input
              type="number"
              name="items"
              value={formData.items}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              placeholder="0"
            />
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-xs text-gray-700">Active category</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-xs"
            >
              {category ? 'Update Category' : 'Add Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategoryModal