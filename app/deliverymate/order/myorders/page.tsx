
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

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const userOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
    setOrders(userOrders.reverse());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-blue-400';
      case 'delivered': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'ri-time-line';
      case 'accepted': return 'ri-check-line';
      case 'delivered': return 'ri-check-double-line';
      case 'cancelled': return 'ri-close-line';
      default: return 'ri-question-line';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/deliverymate/order" className="text-white hover:text-red-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-shopping-cart-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-400 mb-6">Place your first order to see it here</p>
              <Link href="/deliverymate/order" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Place Order
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-900 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${order.status === 'pending' ? 'bg-yellow-400' : order.status === 'accepted' ? 'bg-blue-400' : order.status === 'delivered' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className={`font-semibold ${getStatusColor(order.status)}`}>
                        <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                      <span className="text-white">{order.destination}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Landmark: </span>
                      <span className="text-white">{order.landmark}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Delivery Type: </span>
                      <span className={`${order.type === 'asap' ? 'text-blue-400' : 'text-green-400'}`}>
                        {order.type.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Payment: </span>
                      <span className={order.paidWithCoins ? "text-yellow-400" : "text-green-400"}>
                        {order.paidWithCoins ? "100 DuoCoins" : "Direct payment to partner"}
                      </span>
                    </div>
                  </div>

                  {order.deliveryPartner && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <span className="text-gray-400">Delivery Partner: </span>
                      <span className="text-blue-400">{order.deliveryPartner}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
