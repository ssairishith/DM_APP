
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RideRequest {
  id: number;
  rideId: number;
  riderDestination: string;
  passengerDestination: string;
  distance: number;
  fare: number;
  vehicleType: string;
  vehicleNumber: string;
  departureTime: string;
  timestamp: string;
  status: string;
}

export default function NotificationsPage() {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);

  useEffect(() => {
    const loadRequests = () => {
      const requests = JSON.parse(localStorage.getItem('rideRequests') || '[]');
      const pendingRequests = requests.filter((req: RideRequest) => req.status === 'pending');
      setRideRequests(pendingRequests);
    };

    loadRequests();
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRequest = (requestId: number, action: 'accept' | 'reject') => {
    const allRequests = JSON.parse(localStorage.getItem('rideRequests') || '[]');
    const updatedRequests = allRequests.map((req: RideRequest) =>
      req.id === requestId ? { ...req, status: action === 'accept' ? 'confirmed' : 'rejected' } : req
    );
    localStorage.setItem('rideRequests', JSON.stringify(updatedRequests));

    const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
    const updatedBookings = myBookings.map((booking: RideRequest) =>
      booking.id === requestId ? { ...booking, status: action === 'accept' ? 'confirmed' : 'rejected' } : booking
    );
    localStorage.setItem('myBookings', JSON.stringify(updatedBookings));

    if (action === 'accept') {
      const currentRequest = allRequests.find((req: RideRequest) => req.id === requestId);
      if (currentRequest) {
        const allRides = JSON.parse(localStorage.getItem('rides') || '[]');
        const updatedRides = allRides.map((ride: any) =>
          ride.id === currentRequest.rideId ? { ...ride, availableSeats: Math.max(0, ride.availableSeats - 1) } : ride
        );
        localStorage.setItem('rides', JSON.stringify(updatedRides));

        const myRides = JSON.parse(localStorage.getItem('myRides') || '[]');
        const updatedMyRides = myRides.map((ride: any) =>
          ride.id === currentRequest.rideId ? { ...ride, availableSeats: Math.max(0, ride.availableSeats - 1) } : ride
        );
        localStorage.setItem('myRides', JSON.stringify(updatedMyRides));
      }
    }

    setRideRequests(prev => prev.filter(req => req.id !== requestId));

    if (action === 'accept') {
      alert('Ride request accepted! The passenger has been notified.');
    } else {
      alert('Ride request rejected. The passenger has been notified.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/ridemate" className="text-white hover:text-blue-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">Ride Requests</h1>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {rideRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-notification-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
              <p className="text-gray-400">Waiting for passengers to join your rides...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-blue-400 font-semibold">
                  <i className="ri-notification-badge-line mr-2"></i>
                  {rideRequests.length} request{rideRequests.length !== 1 ? 's' : ''} pending
                </p>
              </div>

              {rideRequests.map((request) => (
                <div key={request.id} className="bg-gray-900 rounded-2xl p-6 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 font-semibold">
                        <i className="ri-user-add-line mr-1"></i>
                        New Join Request
                      </span>
                    </div>
                    <div className="text-right text-gray-400 text-sm">
                      <div>{new Date(request.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(request.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-3">Your Ride Details:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Your destination: </span>
                        <span className="text-white">{request.riderDestination}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Vehicle: </span>
                        <span className="text-white">{request.vehicleType} - {request.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Departure: </span>
                        <span className="text-white">{new Date(request.departureTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 rounded-lg p-4 mb-4">
                    <h3 className="text-blue-400 font-semibold mb-3">Passenger Request:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Drop-off at: </span>
                        <span className="text-white font-semibold">{request.passengerDestination}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Distance: </span>
                        <span className="text-white">{request.distance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Fare: </span>
                        <span className="text-green-400 font-semibold">₹{request.fare}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleRequest(request.id, 'reject')}
                      className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-close-line mr-2"></i>
                      Reject
                    </button>
                    <button
                      onClick={() => handleRequest(request.id, 'accept')}
                      className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-check-line mr-2"></i>
                      Accept Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
