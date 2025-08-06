'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to CampusConnect</h1>
          <p className="text-gray-400">Choose your service</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
          <Link href="/deliverymate" className="flex-1">
            <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-2xl p-8 hover:from-red-800 hover:to-red-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
                  <i className="ri-restaurant-line text-3xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">DELIVERYMATE</h2>
                <p className="text-red-100 text-lg">
                  Get food, stationery, and printouts delivered by fellow students
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4 text-red-200">
                  <div className="flex items-center">
                    <i className="ri-restaurant-fill mr-2"></i>
                    <span>Food</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-book-fill mr-2"></i>
                    <span>Stationery</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-printer-fill mr-2"></i>
                    <span>Printouts</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ridemate" className="flex-1">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="ri-motorbike-line text-3xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">RIDEMATE</h2>
                <p className="text-blue-100 text-lg">
                  Share rides with fellow students going your way
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4 text-blue-200">
                  <div className="flex items-center">
                    <i className="ri-motorbike-fill mr-2"></i>
                    <span>Bike Rides</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-car-fill mr-2"></i>
                    <span>Car Rides</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-map-pin-fill mr-2"></i>
                    <span>Campus Routes</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <i className="ri-logout-box-line mr-2"></i>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}