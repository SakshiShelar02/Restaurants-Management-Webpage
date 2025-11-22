import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRestaurant, updateRestaurant } from '../redux/slices/restaurantSlice'

const AddRestaurantModal = ({ restaurant, onClose }) => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.restaurant.categories)
  
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
    description: '',
    category: '',
    location: '',
    averageBill: '',
    operatingCost: '',
    seatingCapacity: '',
    establishmentYear: new Date().getFullYear(),
    active: true,
    hasOutdoorSeating: false,
    rating: 4.0,
    monthlyCustomers: 0,
    vegNonVeg: 'Non-Veg'
  })

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        category: restaurant.category || '',
        location: restaurant.location || '',
        averageBill: restaurant.averageBill || '',
        operatingCost: restaurant.operatingCost || '',
        seatingCapacity: restaurant.seatingCapacity || '',
        establishmentYear: restaurant.establishmentYear || new Date().getFullYear(),
        active: restaurant.active !== undefined ? restaurant.active : true,
        hasOutdoorSeating: restaurant.hasOutdoorSeating || false,
        rating: restaurant.rating || 4.0,
        monthlyCustomers: restaurant.monthlyCustomers || 0,
        vegNonVeg: restaurant.vegNonVeg || 'Non-Veg'
      })
    }
  }, [restaurant])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const restaurantData = {
      ...formData,
      averageBill: parseFloat(formData.averageBill),
      operatingCost: parseFloat(formData.operatingCost),
      seatingCapacity: parseInt(formData.seatingCapacity),
      monthlyCustomers: parseInt(formData.monthlyCustomers),
      rating: parseFloat(formData.rating)
    }

    if (restaurant) {
      dispatch(updateRestaurant({ id: restaurant.id, ...restaurantData }))
    } else {
      dispatch(addRestaurant(restaurantData))
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
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              {restaurant ? 'Edit Restaurant' : 'Add Restaurant'}
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

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="Enter restaurant name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
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
                Veg/Non-Veg Type
              </label>
              <select
                name="vegNonVeg"
                value={formData.vegNonVeg}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Average Bill ($) *
              </label>
              <input
                type="number"
                name="averageBill"
                value={formData.averageBill}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Operating Cost ($) *
              </label>
              <input
                type="number"
                name="operatingCost"
                value={formData.operatingCost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Seating Capacity *
              </label>
              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Establishment Year
              </label>
              <input
                type="number"
                name="establishmentYear"
                value={formData.establishmentYear}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Monthly Customers
              </label>
              <input
                type="number"
                name="monthlyCustomers"
                value={formData.monthlyCustomers}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="4.0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                placeholder="Enter restaurant description"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-xs text-gray-700">Active restaurant</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasOutdoorSeating"
                    checked={formData.hasOutdoorSeating}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-xs text-gray-700">Outdoor seating available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-xs"
            >
              {restaurant ? 'Update Restaurant' : 'Add Restaurant'}
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

export default AddRestaurantModal