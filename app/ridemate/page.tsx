
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RideMate() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const checkNotifications = () => {
      const requests = JSON.parse(localStorage.getItem('rideRequests') || '[]');
      const pendingRequests = requests.filter((req: any) => req.status === 'pending');
      setNotificationCount(pendingRequests.length);
    };
    
    checkNotifications();
    const interval = setInterval(checkNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-white hover:text-blue-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-3xl font-bold text-white">RideMate</h1>
          <Link href="/ridemate/notifications" className="relative cursor-pointer">
            <i className="ri-notification-3-line text-2xl text-white hover:text-blue-400 transition-colors"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
          <Link href="/ridemate/ride" className="flex-1">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="ri-car-line text-4xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">RIDE</h2>
                <p className="text-blue-100 text-lg mb-6">
                  Offer rides to fellow students
                </p>
                <div className="space-y-2 text-blue-200">
                  <div className="flex items-center justify-center">
                    <i className="ri-map-pin-line mr-2"></i>
                    <span>Share your route</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-group-line mr-2"></i>
                    <span>Pick up passengers</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line mr-2"></i>
                    <span>Earn fuel money</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ridemate/join" className="flex-1">
            <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-2xl p-8 hover:from-red-800 hover:to-red-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
                  <i className="ri-user-add-line text-4xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">JOIN</h2>
                <p className="text-red-100 text-lg mb-6">
                  Find rides to your destination
                </p>
                <div className="space-y-2 text-red-200">
                  <div className="flex items-center justify-center">
                    <i className="ri-search-line mr-2"></i>
                    <span>Browse available rides</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-route-line mr-2"></i>
                    <span>Match your route</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-time-line mr-2"></i>
                    <span>Save time & money</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Safe campus rides • Verified students • Split fuel costs
          </p>
        </div>
      </div>
    </div>
  );
}
