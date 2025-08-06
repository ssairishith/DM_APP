
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OrderPage() {
  const [orderDetails, setOrderDetails] = useState('');
  const [landmark, setLandmark] = useState('');
  const [destination, setDestination] = useState('');
  const [deliveryType, setDeliveryType] = useState('regular');
  const [useCoins, setUseCoins] = useState(false);

  const blocks = ['Block A', 'Block B', 'Block C', 'Block E', 'Block F', 'Block G', 'Block H'];

  // Check if user has enough coins for free delivery
  const userCoins = parseInt(localStorage.getItem('userCoins') || '0');
  const canUseCoins = userCoins >= 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderDetails && destination) {
      let coinCost = 0;
      if (useCoins && canUseCoins) {
        coinCost = 100; // Cost for free delivery
        const newBalance = userCoins - coinCost;
        localStorage.setItem('userCoins', newBalance.toString());

        // Add to coin history
        const coinHistory = JSON.parse(localStorage.getItem('coinHistory') || '[]');
        coinHistory.push({
          id: Date.now(),
          type: 'spent',
          amount: coinCost,
          reason: 'Free delivery order',
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('coinHistory', JSON.stringify(coinHistory));
      }

      const order = {
        id: Date.now(),
        details: orderDetails,
        landmark: landmark || 'No landmark specified',
        destination,
        type: deliveryType,
        timestamp: new Date().toISOString(),
        status: 'pending',
        paidWithCoins: useCoins && canUseCoins
      };

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      const userOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      userOrders.push(order);
      localStorage.setItem('myOrders', JSON.stringify(userOrders));

      alert(useCoins && canUseCoins ? 'Order placed with DuoCoins!' : 'Order placed successfully!');
      setOrderDetails('');
      setLandmark('');
      setDestination('');
      setDeliveryType('regular');
      setUseCoins(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/deliverymate" className="text-white hover:text-red-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">Place Order</h1>
          <Link href="/deliverymate/order/myorders" className="text-red-400 hover:text-red-300 text-sm cursor-pointer">
            My Orders
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">What do you need?</h3>
            <textarea
              value={orderDetails}
              onChange={(e) => setOrderDetails(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors resize-none"
              placeholder="Describe what you need (food items, stationery, printouts, etc.)&#10;&#10;Example:&#10;- 2 chicken biryanis from canteen&#10;- A4 sheets (50 pages)&#10;- Color printouts of my assignment (10 pages)"
              required
              maxLength={500}
            />
            <div className="text-right text-gray-400 text-sm mt-1">
              {orderDetails.length}/500 characters
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Landmark (Optional)</h3>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Any specific landmark near your location"
            />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Destination</h3>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors pr-8"
              required
            >
              <option value="">Select your block</option>
              {blocks.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Delivery Type</h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="regular"
                    checked={deliveryType === 'regular'}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-white">Regular (10-15 mins)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="asap"
                    checked={deliveryType === 'asap'}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-white">ASAP (5-10 mins)</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                <i className="ri-copper-coin-line mr-2 text-yellow-400"></i>
                Payment Method
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Your DuoCoins:</span>
                  <span className="text-yellow-400 font-bold">{userCoins} coins</span>
                </div>

                {canUseCoins && (
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCoins}
                      onChange={(e) => setUseCoins(e.target.checked)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <i className="ri-copper-coin-line text-yellow-400 mr-2"></i>
                      <span className="text-white">Use 100 DuoCoins (Free delivery!)</span>
                    </div>
                  </label>
                )}

                {!canUseCoins && (
                  <div className="text-gray-400 text-sm">
                    Need 100 coins for free delivery. Complete deliveries to earn more!
                  </div>
                )}
              </div>
            </div>
          </div>

          {orderDetails && destination && (
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="text-white">As described</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery type:</span>
                  <span className={`${deliveryType === 'asap' ? 'text-blue-400' : 'text-green-400'}`}>
                    {deliveryType.toUpperCase()}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Payment:</span>
                    <span className={useCoins && canUseCoins ? "text-yellow-400" : "text-green-400"}>
                      {useCoins && canUseCoins ? "100 DuoCoins" : "Student pays delivery partner"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold text-lg rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-send-plane-line mr-2"></i>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
