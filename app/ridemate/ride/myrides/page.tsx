
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Ride {
  id: number;
  destination: string;
  landmarks: string[];
  vehicleNumber: string;
  vehicleType: string;
  availableSeats: number;
  departureTime: string;
  notes: string;
  timestamp: string;
  status: string;
  riders: any[];
}

export default function MyRides() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    let myRides = JSON.parse(localStorage.getItem('myRides') || '[]');
    if (!Array.isArray(myRides)) {
      myRides = [];
    }
    setRides(myRides.reverse());
  }, []);

  const cancelRide = (rideId: number) => {
    if (confirm('Are you sure you want to cancel this ride?')) {
      // Update in main rides list
      const allRides = JSON.parse(localStorage.getItem('rides') || '[]');
      const updatedRides = allRides.map((ride: Ride) => 
        ride.id === rideId ? { ...ride, status: 'cancelled' } : ride
      );
      localStorage.setItem('rides', JSON.stringify(updatedRides));

      // Update in myRides list
      const myRides = JSON.parse(localStorage.getItem('myRides') || '[]');
      const updatedMyRides = myRides.map((ride: Ride) => 
        ride.id === rideId ? { ...ride, status: 'cancelled' } : ride
      );
      localStorage.setItem('myRides', JSON.stringify(updatedMyRides));

      // Cancel all pending requests for this ride
      const allRequests = JSON.parse(localStorage.getItem('rideRequests') || '[]');
      const updatedRequests = allRequests.map((req: any)=>{
        return req.rideId === rideId ? { ...req, status: 'cancelled' } : req
      });
      localStorage.setItem('rideRequests', JSON.stringify(updatedRequests));

      // Update passenger bookings
      const allBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      const updatedBookings = allBookings.map((booking: any)=>
        booking.rideId === rideId ? { ...booking, status: 'ride_cancelled' } : booking
      );
      localStorage.setItem('myBookings', JSON.stringify(updatedBookings));

      setRides(updatedMyRides.reverse());
      alert('Ride cancelled successfully! All passenger requests have been cancelled.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'ri-car-line';
      case 'completed': return 'ri-check-double-line';
      case 'cancelled': return 'ri-close-line';
      default: return 'ri-question-line';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return 'ri-motorbike-fill';
      case 'car': return 'ri-car-fill';
      case 'auto': return 'ri-taxi-fill';
      default: return 'ri-car-fill';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/ridemate/ride" className="text-white hover:text-blue-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">My Rides</h1>
          <div></div>
        </div>

          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all your ride history? This action cannot be undone.')) {
                  // Clear all ride-related data
                  localStorage.removeItem('rides');
                  localStorage.removeItem('myRides');
                  localStorage.removeItem('rideRequests');
                  localStorage.removeItem('myBookings');
                  // Update state
                  setRides([]);
                  alert('All ride history cleared.');
                  // Notify join page to refresh
                  window.dispatchEvent(new CustomEvent('rideUpdated'));
                }
              }}
              className="mb-6 w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Clear All History
            </button>
          {rides.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-car-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Rides Posted</h3>
              <p className="text-gray-400 mb-6">Post your first ride to see it here</p>
              <Link href="/ridemate/ride" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Post Ride
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <div key={ride.id} className="bg-gray-900 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center`}>
                        <i className={`${getVehicleIcon(ride.vehicleType)} text-xl text-white`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{ride.destination}</h3>
                        <span className={`font-semibold ${getStatusColor(ride.status)}`}>
                          <i className={`${getStatusIcon(ride.status)} mr-1`}></i>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-gray-400 text-sm">
                      <div>{new Date(ride.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(ride.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400">Vehicle: </span>
                      <span className="text-white">{ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1)} - {ride.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Available Seats: </span>
                      <span className="text-white">{ride.availableSeats}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Departure: </span>
                      <span className="text-white">{new Date(ride.departureTime).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status: </span>
                      <span className={getStatusColor(ride.status)}>
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {ride.landmarks.length > 0 && (
                    <div className="mb-4">
                      <span className="text-gray-400 block mb-2">Route Landmarks:</span>
                      <div className="flex flex-wrap gap-2">
                        {ride.landmarks.map((landmark, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm">
                            <i className="ri-map-pin-line mr-1"></i>
                            {landmark}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {ride.notes && ride.notes !== 'No additional notes' && (
                    <div className="bg-gray-800 rounded-lg p-3 mb-4">
                      <span className="text-gray-400">Notes: </span>
                      <span className="text-white">{ride.notes}</span>
                    </div>
                  )}

                  {ride.status === 'active' && (
                    <>
                      <button
                        onClick={() => cancelRide(ride.id)}
                        className="w-full px-6 py-3 mb-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-close-line mr-2"></i>
                        Cancel Ride
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Confirm you have reached your destination? This will mark the ride as completed and remove it from your list.')) {
                            // Remove ride from myRides and rides
                            let myRides = JSON.parse(localStorage.getItem('myRides') || '[]');
                            myRides = myRides.filter((r: any) => r.id !== ride.id);
                            localStorage.setItem('myRides', JSON.stringify(myRides));

                            let allRides = JSON.parse(localStorage.getItem('rides') || '[]');
                            allRides = allRides.filter((r: any) => r.id !== ride.id);
                            localStorage.setItem('rides', JSON.stringify(allRides));

                            // Remove related bookings from myBookings
                            let myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
                            myBookings = myBookings.filter((b: any) => b.rideId !== ride.id);
                            localStorage.setItem('myBookings', JSON.stringify(myBookings));

                            // Dispatch event to notify join page to refresh
                            window.dispatchEvent(new CustomEvent('rideUpdated'));

                            // Update state to reflect changes
                            setRides(myRides.reverse());
                            alert('Ride marked as completed and removed. Thank you for using RideMate!');
                          }
                        }}
                        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-check-double-line mr-2"></i>
                        Reached Destination
                      </button>
                    </>
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
