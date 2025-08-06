
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  details: string;
  landmark: string;
  destination: string;
  type: string;
  timestamp: string;
  status: string;
  deliveryPartner?: string;
  paidWithCoins?: boolean;
}

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const myDeliveries = JSON.parse(localStorage.getItem('myDeliveries') || '[]');
    setDeliveries(myDeliveries.reverse());
  }, []);

  const getOrderValue = (order: Order) => {
    const details = order.details.toLowerCase();
    if (details.includes('biryani') || details.includes('meal') || details.includes('food') || 
        details.includes('pizza') || details.includes('burger') || details.includes('canteen')) {
      return Math.random() > 0.5 ? 'high' : 'medium';
    }
    return Math.random() > 0.7 ? 'high' : 'low';
  };

  const getCoinsForOrder = (order: Order) => {
    const orderValue = getOrderValue(order);
    let baseCoins = 10;
    
    if (orderValue === 'high') baseCoins = 20;
    else if (orderValue === 'medium') baseCoins = 15;
    
    return {
      base: baseCoins,
      asapBonus: order.type === 'asap' ? 5 : 0,
      onTimeBonus: 5
    };
  };

  const markAsDelivered = (orderId: number) => {
    const coins = getCoinsForOrder(deliveries.find(d => d.id === orderId)!);
    const totalCoins = coins.base + coins.asapBonus + coins.onTimeBonus;
    
    // Update all order statuses
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map((order: Order) => 
      order.id === orderId ? { ...order, status: 'delivered' } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    const myDeliveries = JSON.parse(localStorage.getItem('myDeliveries') || '[]');
    const updatedDeliveries = myDeliveries.map((order: Order) => 
      order.id === orderId ? { ...order, status: 'delivered' } : order
    );
    localStorage.setItem('myDeliveries', JSON.stringify(updatedDeliveries));
    
    const myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
    const updatedMyOrders = myOrders.map((order: Order) => 
      order.id === orderId ? { ...order, status: 'delivered' } : order
    );
    localStorage.setItem('myOrders', JSON.stringify(updatedMyOrders));
    
    // Award coins
    const currentCoins = parseInt(localStorage.getItem('userCoins') || '0');
    const newBalance = currentCoins + totalCoins;
    localStorage.setItem('userCoins', newBalance.toString());
    
    // Add to coin history
    const coinHistory = JSON.parse(localStorage.getItem('coinHistory') || '[]');
    coinHistory.push({
      id: Date.now(),
      type: 'earned',
      amount: totalCoins,
      reason: `Delivery completed - Order #${orderId}`,
      timestamp: new Date().toISOString(),
      breakdown: {
        base: coins.base,
        asapBonus: coins.asapBonus,
        onTimeBonus: coins.onTimeBonus
      }
    });
    localStorage.setItem('coinHistory', JSON.stringify(coinHistory));
    
    setDeliveries(updatedDeliveries.reverse());
    alert(`Delivery completed! You earned ${totalCoins} DuoCoins! 🎉`);
  };

  const openChat = (order: Order) => {
    setSelectedOrder(order);
    setShowChat(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-blue-400';
      case 'delivered': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return 'ri-truck-line';
      case 'delivered': return 'ri-check-double-line';
      default: return 'ri-question-line';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/deliverymate/earn" className="text-white hover:text-blue-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">My Deliveries</h1>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {deliveries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-truck-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Deliveries Yet</h3>
              <p className="text-gray-400 mb-6">Accept your first order to see it here</p>
              <Link href="/deliverymate/earn" className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Find Orders
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((order) => {
                const coins = getCoinsForOrder(order);
                const totalCoins = coins.base + coins.asapBonus + coins.onTimeBonus;
                
                return (
                  <div key={order.id} className="bg-gray-900 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${order.status === 'accepted' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                        <span className={`font-semibold ${getStatusColor(order.status)}`}>
                          <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                          {order.status === 'accepted' ? 'In Progress' : 'Delivered'}
                        </span>
                        {order.paidWithCoins && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg text-xs">
                            <i className="ri-copper-coin-line mr-1"></i>
                            Paid with DuoCoins
                          </span>
                        )}
                      </div>
                      <div className="text-right text-gray-400 text-sm">
                        <div>{new Date(order.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(order.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-white font-semibold mb-2">Order Details:</h3>
                      <p className="text-gray-300 bg-gray-800 rounded-lg p-3">{order.details}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-400">Destination: </span>
                        <span className="text-white font-semibold">{order.destination}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Landmark: </span>
                        <span className="text-white">{order.landmark}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Delivery Type: </span>
                        <span className={`font-semibold ${order.type === 'asap' ? 'text-blue-400' : 'text-green-400'}`}>
                          {order.type.toUpperCase()}
                          {order.type === 'asap' && ' (Bonus!)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          {order.status === 'delivered' ? 'Earned:' : 'Potential Earning:'}
                        </span>
                        <span className="text-yellow-400 font-semibold text-lg ml-2">
                          <i className="ri-copper-coin-line mr-1"></i>
                          {totalCoins} DuoCoins
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => openChat(order)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-chat-1-line mr-2"></i>
                        Chat with Customer
                      </button>
                      
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => markAsDelivered(order.id)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                        >
                          <i className="ri-copper-coin-line mr-2"></i>
                          Complete & Earn Coins
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showChat && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Chat with Customer</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-4 h-40 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-blue-600 text-white p-3 rounded-lg text-sm">
                    Hi! I've accepted your order for: {selectedOrder.details.substring(0, 50)}...
                  </div>
                  <div className="bg-gray-700 text-white p-3 rounded-lg text-sm ml-6">
                    Great! Thank you for accepting. Delivering to {selectedOrder.destination}.
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-lg text-sm">
                    I'm on my way! Should reach in 15-20 minutes.
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 cursor-pointer">
                  <i className="ri-send-plane-line"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
