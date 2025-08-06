
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CoinHistory {
  id: number;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  timestamp: string;
  breakdown?: {
    base: number;
    asapBonus: number;
    onTimeBonus: number;
  };
}

interface Voucher {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  color: string;
}

export default function DuoCoinsPage() {
  const [userCoins, setUserCoins] = useState(0);
  const [coinHistory, setCoinHistory] = useState<CoinHistory[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'history' | 'redeem'>('overview');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const vouchers: Voucher[] = [
    { id: 'cafe-coupon', name: 'Nearby Cafe Coupons', cost: 100, description: 'Coupons worth up to ₹100 at nearby cafes', icon: 'ri-cup-line', color: 'from-brown-600 to-brown-800' },
    { id: 'amazon-50', name: 'Amazon ₹50', cost: 60, description: 'Amazon voucher worth ₹50', icon: 'ri-shopping-bag-line', color: 'from-orange-600 to-orange-800' },
    { id: 'gfg-course', name: 'GFG Course Access', cost: 80, description: 'GeeksforGeeks premium course access', icon: 'ri-code-line', color: 'from-purple-600 to-purple-800' },
    { id: 'event-pass', name: 'College Event Pass', cost: 100, description: 'Free entry to next college event', icon: 'ri-ticket-line', color: 'from-red-600 to-red-800' },
    { id: 'canteen-100', name: 'Canteen Pass ₹100', cost: 150, description: 'College canteen voucher', icon: 'ri-restaurant-line', color: 'from-green-600 to-green-800' },
  ];

  useEffect(() => {
    const coins = parseInt(localStorage.getItem('userCoins') || '0');
    const history = JSON.parse(localStorage.getItem('coinHistory') || '[]');
    setUserCoins(coins);
    setCoinHistory(history.reverse());
  }, []);

  const redeemVoucher = (voucher: Voucher) => {
    if (userCoins >= voucher.cost) {
      const newBalance = userCoins - voucher.cost;
      localStorage.setItem('userCoins', newBalance.toString());

      const newHistory = {
        id: Date.now(),
        type: 'spent' as const,
        amount: voucher.cost,
        reason: `Redeemed: ${voucher.name}`,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = [newHistory, ...coinHistory];
      localStorage.setItem('coinHistory', JSON.stringify(updatedHistory));

      setUserCoins(newBalance);
      setCoinHistory(updatedHistory);
      setShowRedeemModal(false);
      setSelectedVoucher(null);

      alert(`Successfully redeemed ${voucher.name}! 
Check your profile for voucher details.`);
    }
  };

  const totalEarned = coinHistory.filter(h => h.type === 'earned').reduce((sum, h) => sum + h.amount, 0);
  const totalSpent = coinHistory.filter(h => h.type === 'spent').reduce((sum, h) => sum + h.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/deliverymate" className="text-white hover:text-yellow-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            DuoCoins
          </h1>
          <div className="w-8"></div>
        </div>

        {/* Coin Balance Card */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-500 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="ri-copper-coin-line text-4xl text-white"></i>
              </div>
              <h2 className="text-5xl font-bold text-white mb-2" suppressHydrationWarning={true}>
                {userCoins.toLocaleString()}
              </h2>
              <p className="text-yellow-100 text-lg font-medium">DuoCoins Balance</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{totalEarned}</div>
                  <div className="text-yellow-200 text-sm">Total Earned</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{totalSpent}</div>
                  <div className="text-yellow-200 text-sm">Total Spent</div>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 animate-pulse">
              <i className="ri-flashlight-line text-white text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-800 rounded-2xl p-2">
          {['overview', 'history', 'redeem'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && <i className="ri-dashboard-line mr-2"></i>}
              {tab === 'history' && <i className="ri-history-line mr-2"></i>}
              {tab === 'redeem' && <i className="ri-gift-line mr-2"></i>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Earn More Coins</h3>
                  <i className="ri-add-circle-line text-3xl text-blue-300"></i>
                </div>
                <p className="text-blue-200 mb-4">Complete deliveries to earn DuoCoins</p>
                <Link href="/deliverymate/earn" className="inline-block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap">
                  Start Earning
                </Link>
              </div>

              <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Cafe Coupons</h3>
                  <i className="ri-cup-line text-3xl text-green-300"></i>
                </div>
                <p className="text-green-200 mb-4">Use 100 coins for nearby cafe coupons</p>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    userCoins >= 100
                      ? 'bg-green-600 hover:bg-green-500'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                  disabled={userCoins < 100}
                >
                  {userCoins >= 100 ? 'Available' : `Need ${100 - userCoins} more`}
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Redeem Rewards</h3>
                  <i className="ri-gift-line text-3xl text-purple-300"></i>
                </div>
                <p className="text-purple-200 mb-4">Exchange coins for amazing rewards</p>
                <button
                  onClick={() => setSelectedTab('redeem')}
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  View Rewards
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">How to Earn DuoCoins</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                      <i className="ri-copper-coin-line text-white"></i>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Standard Orders</div>
                      <div className="text-gray-400 text-sm">Earn 10-15 coins per delivery</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                      <i className="ri-copper-coin-line text-white"></i>
                    </div>
                    <div>
                      <div className="text-white font-semibold">High Value Orders</div>
                      <div className="text-gray-400 text-sm">Earn 20+ coins for large orders</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <i className="ri-time-line text-white"></i>
                    </div>
                    <div>
                      <div className="text-white font-semibold">On-Time Delivery</div>
                      <div className="text-gray-400 text-sm">Bonus +5 coins for punctuality</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <i className="ri-flashlight-line text-white"></i>
                    </div>
                    <div>
                      <div className="text-white font-semibold">ASAP Orders</div>
                      <div className="text-gray-400 text-sm">Extra +5 coins for express delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'history' && (
          <div className="space-y-4">
            {coinHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <i className="ri-history-line text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No History Yet</h3>
                <p className="text-gray-400">Start earning coins to see your history here</p>
              </div>
            ) : (
              coinHistory.map((entry) => (
                <div key={entry.id} className="bg-gray-900 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        entry.type === 'earned' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        <i className={`${entry.type === 'earned' ? 'ri-add-line' : 'ri-subtract-line'} text-white text-xl`}></i>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{entry.reason}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(entry.timestamp).toLocaleDateString()} • {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                        {entry.breakdown && (
                          <div className="text-xs text-gray-500 mt-1">
                            Base: {entry.breakdown.base} • ASAP: +{entry.breakdown.asapBonus} • On-time: +{entry.breakdown.onTimeBonus}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      entry.type === 'earned' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.type === 'earned' ? '+' : '-'}{entry.amount}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'redeem' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher) => (
              <div key={voucher.id} className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-colors">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${voucher.color} rounded-full flex items-center justify-center`}>
                  <i className={`${voucher.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-white font-bold text-xl text-center mb-2">{voucher.name}</h3>
                <p className="text-gray-400 text-center text-sm mb-4">{voucher.description}</p>
                <div className="text-center mb-4">
                  <span className="text-yellow-400 font-bold text-2xl">
                    <i className="ri-copper-coin-line mr-1"></i>
                    {voucher.cost}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedVoucher(voucher);
                    setShowRedeemModal(true);
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    userCoins >= voucher.cost
                      ? `bg-gradient-to-r ${voucher.color} text-white hover:opacity-90`
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={userCoins < voucher.cost}
                >
                  {userCoins >= voucher.cost ? 'Redeem Now' : `Need ${voucher.cost - userCoins} more`}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Redeem Modal */}
        {showRedeemModal && selectedVoucher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${selectedVoucher.color} rounded-full flex items-center justify-center`}>
                  <i className={`${selectedVoucher.icon} text-white text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Redemption</h3>
                <p className="text-gray-400">{selectedVoucher.description}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Current Balance:</span>
                  <span className="text-yellow-400 font-bold">{userCoins} coins</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-red-400 font-bold">-{selectedVoucher.cost} coins</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Remaining:</span>
                    <span className="text-green-400 font-bold">{userCoins - selectedVoucher.cost} coins</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRedeemModal(false);
                    setSelectedVoucher(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={() => redeemVoucher(selectedVoucher)}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r ${selectedVoucher.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer whitespace-nowrap`}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
