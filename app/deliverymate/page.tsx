
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DeliveryMate() {
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    const coins = parseInt(localStorage.getItem('userCoins') || '0');
    setUserCoins(coins);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-white hover:text-red-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-3xl font-bold text-white">DeliveryMate</h1>
          <Link href="/deliverymate/duocoins" className="flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-orange-600 px-3 py-2 rounded-full text-white cursor-pointer hover:from-yellow-700 hover:to-orange-700 transition-all">
            <i className="ri-copper-coin-line text-lg"></i>
            <span className="font-semibold">{userCoins}</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto mb-8">
          <Link href="/deliverymate/order" className="flex-1">
            <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-2xl p-8 hover:from-red-800 hover:to-red-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
                  <i className="ri-shopping-cart-line text-4xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">ORDER</h2>
                <p className="text-red-100 text-lg mb-6">
                  Place orders for food, stationery, or printouts
                </p>
                <div className="space-y-2 text-red-200">
                  <div className="flex items-center justify-center">
                    <i className="ri-check-line mr-2"></i>
                    <span>Quick delivery to your block</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-copper-coin-line mr-2"></i>
                    <span>Pay with DuoCoins</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-time-line mr-2"></i>
                    <span>Regular or ASAP delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/deliverymate/earn" className="flex-1">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="ri-copper-coin-line text-4xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">EARN</h2>
                <p className="text-blue-100 text-lg mb-6">
                  Accept delivery requests and earn DuoCoins
                </p>
                <div className="space-y-2 text-blue-200">
                  <div className="flex items-center justify-center">
                    <i className="ri-smartphone-line mr-2"></i>
                    <span>Real-time order notifications</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-filter-line mr-2"></i>
                    <span>Filter by destination blocks</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-copper-coin-line mr-2"></i>
                    <span>Earn up to 30 coins per delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <Link href="/deliverymate/duocoins" className="block max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-2xl p-8 hover:from-yellow-800 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
                <i className="ri-copper-coin-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">DUOCOINS</h2>
              <p className="text-yellow-100 text-lg mb-6">
                Manage your digital currency and redeem rewards
              </p>
              <div className="grid grid-cols-3 gap-4 text-yellow-200">
                <div className="flex items-center justify-center">
                  <i className="ri-trophy-line mr-2"></i>
                  <span>Earn & Track</span>
                </div>
                <div className="flex items-center justify-center">
                  <i className="ri-gift-line mr-2"></i>
                  <span>Redeem Rewards</span>
                </div>
                <div className="flex items-center justify-center">
                  <i className="ri-history-line mr-2"></i>
                  <span>View History</span>
                </div>
              </div>
              <div className="mt-4 text-yellow-400 font-bold text-xl">
                Current Balance: {userCoins} DuoCoins
              </div>
            </div>
          </div>
        </Link>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Connect with fellow students • Earn digital rewards • Campus-wide service
          </p>
        </div>
      </div>
    </div>
  );
}
