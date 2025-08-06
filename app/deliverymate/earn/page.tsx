
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
  paidWithCoins?: boolean;
}

export default function EarnPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedBlock, setSelectedBlock] = useState('');

  const blocks = ['All', 'Block A', 'Block B', 'Block C', 'Block E', 'Block F', 'Block G', 'Block H'];

  useEffect(() => {
    const loadOrders = () => {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const pendingOrders = allOrders.filter((order: Order) => order.status === 'pending');
      setOrders(pendingOrders);
      setFilteredOrders(pendingOrders);
    };
    
    loadOrders();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedBlock === '' || selectedBlock === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.destination === selectedBlock));
    }
  }, [selectedBlock, orders]);

  const getOrderValue = (order: Order) => {
    const details = order.details.toLowerCase();
    if (details.includes('biryani') || details.includes('meal') || details.includes('food') || 
        details.includes('pizza') || details.includes('burger') || details.includes('canteen')) {
      return Math.random() > 0.5 ? 'high' : 'medium'; // Food orders tend to be higher value
    }
    return Math.random() > 0.7 ? 'high' : 'low'; // Other items usually lower value
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

  const acceptOrder = (orderId: number) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map((order: Order) => 
      order.id === orderId ? { ...order, status: 'accepted', deliveryPartner: 'You' } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    const acceptedOrder = updatedOrders.find((order: Order) => order.id === orderId);
    if (acceptedOrder) {
      const myDeliveries = JSON.parse(localStorage.getItem('myDeliveries') || '[]');
      myDeliveries.push(acceptedOrder);
      localStorage.setItem('myDeliveries', JSON.stringify(myDeliveries));
      
      const myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      const updatedMyOrders = myOrders.map((order: Order) => 
        order.id === orderId ? { ...order, status: 'accepted', deliveryPartner: 'Partner assigned' } : order
      );
      localStorage.setItem('myOrders', JSON.stringify(updatedMyOrders));
    }
    
    setOrders(prev => prev.filter(order => order.id !== orderId));
    alert('Order accepted! Complete delivery to earn coins.');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/deliverymate" className="text-white hover:text-blue-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">Earn DuoCoins</h1>
          <Link href="/deliverymate/earn/mydeliveries" className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer">
            My Deliveries
          </Link>
        </div>

        <div className="mb-6">
          <div className="bg-gray-900 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-3">Filter by destination:</h3>
            <div className="flex flex-wrap gap-2">
              {blocks.map((block) => (
                <button
                  key={block}
                  onClick={() => setSelectedBlock(block === 'All' ? '' : block)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    (selectedBlock === '' && block === 'All') || selectedBlock === block
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {block}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-notification-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Orders Available</h3>
              <p className="text-gray-400">
                {selectedBlock ? `No orders for ${selectedBlock}` : 'Waiting for new orders...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-blue-400 font-semibold">
                  <i className="ri-notification-badge-line mr-2"></i>
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} available
                </p>
              </div>
              
              {filteredOrders.map((order) => {
                const coins = getCoinsForOrder(order);
                const totalCoins = coins.base + coins.asapBonus + coins.onTimeBonus;
                
                return (
                  <div key={order.id} className="bg-gray-900 rounded-2xl p-6 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-yellow-400 font-semibold">
                          <i className="ri-time-line mr-1"></i>
                          New Order
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

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                          {order.type === 'asap' && ' (Bonus coins!)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Earning: </span>
                        <span className="text-yellow-400 font-semibold text-lg">
                          <i className="ri-copper-coin-line mr-1"></i>
                          {totalCoins} DuoCoins
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 mb-4">
                      <div className="text-yellow-400 font-semibold mb-3">
                        <i className="ri-copper-coin-line mr-2"></i>
                        DuoCoin Breakdown:
                      </div>
                      <div className="text-sm space-y-2 text-gray-300">
                        <div className="flex justify-between">
                          <span>Base delivery coins:</span>
                          <span className="text-yellow-400">{coins.base} coins</span>
                        </div>
                        {order.type === 'asap' && (
                          <div className="flex justify-between">
                            <span>ASAP bonus (if on time):</span>
                            <span className="text-blue-400">+{coins.asapBonus} coins</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>On-time delivery bonus:</span>
                          <span className="text-green-400">+{coins.onTimeBonus} coins</span>
                        </div>
                        <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold text-yellow-400">
                          <span>Maximum total:</span>
                          <span>{totalCoins} coins</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-copper-coin-line mr-2"></i>
                      Accept Order & Earn Coins
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
