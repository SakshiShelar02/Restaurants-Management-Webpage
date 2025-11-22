import React from 'react'

const RestaurantDetailsModal = ({ restaurant, onClose }) => {
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-star text-yellow-400 fill-current" 
            aria-hidden="true"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
          </svg>
        )
      } else {
        stars.push(
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-star text-gray-300" 
            aria-hidden="true"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
          </svg>
        )
      }
    }
    return stars
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Restaurant Details</h3>
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

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Restaurant Header Section */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building w-8 h-8 text-gray-400" aria-hidden="true">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                    <path d="M10 6h4"></path>
                    <path d="M10 10h4"></path>
                    <path d="M10 14h4"></path>
                    <path d="M10 18h4"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{restaurant.name}</h4>
                    {restaurant.rating > 4.5 && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown w-4 h-4 text-yellow-500" aria-hidden="true">
                        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                        <path d="M5 21h14"></path>
                      </svg>
                    )}
                    <div className={`w-3 h-3 rounded-full ${restaurant.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{restaurant.description}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      restaurant.active 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1 ${restaurant.active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      {restaurant.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      restaurant.vegNonVeg === 'Veg' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1 ${
                        restaurant.vegNonVeg === 'Veg' ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      {restaurant.vegNonVeg}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(restaurant.rating)}
                      <span className="text-xs text-gray-600 ml-1">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <p className="text-xs text-gray-900">{restaurant.category}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
              <p className="text-xs text-gray-900">{restaurant.location}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Established</label>
              <p className="text-xs text-gray-900">{restaurant.establishmentYear}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Seating Capacity</label>
              <p className="text-xs text-gray-900">{restaurant.seatingCapacity} seats</p>
            </div>

            {/* Financial Information */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Average Bill</label>
              <p className="text-xs text-gray-900">${restaurant.averageBill}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Operating Cost</label>
              <p className="text-xs text-gray-900">${restaurant.operatingCost}/month</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Monthly Revenue</label>
              <p className="text-xs text-gray-900">${restaurant.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Monthly Customers</label>
              <p className="text-xs text-gray-900">{restaurant.monthlyCustomers.toLocaleString()}</p>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profit Margin</label>
              <span className={`text-xs font-medium ${restaurant.profitMargin > 35 ? 'text-green-600' : 'text-yellow-600'}`}>
                {restaurant.profitMargin}%
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Outdoor Seating</label>
              <p className="text-xs text-gray-900">{restaurant.hasOutdoorSeating ? 'Available' : 'Not Available'}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={onClose}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailsModal