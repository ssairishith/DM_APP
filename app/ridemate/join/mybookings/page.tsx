
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Booking {
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

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
    setBookings(myBookings.reverse());
  }, []);

  const cancelBooking = (bookingId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      // Update myBookings
      const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      const updatedBookings = myBookings.map((booking: Booking) => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      localStorage.setItem('myBookings', JSON.stringify(updatedBookings));

      // Remove from ride requests
      const allRequests = JSON.parse(localStorage.getItem('rideRequests') || '[]');
      const updatedRequests = allRequests.map((req: any) =>
        req.id === bookingId ? { ...req, status: 'cancelled' } : req
      );
      localStorage.setItem('rideRequests', JSON.stringify(updatedRequests));

      setBookings(updatedBookings.reverse());
      alert('Booking cancelled successfully!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'confirmed': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      case 'ride_cancelled': return 'text-orange-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'ri-time-line';
      case 'confirmed': return 'ri-check-line';
      case 'completed': return 'ri-check-double-line';
      case 'cancelled': return 'ri-close-line';
      case 'ride_cancelled': return 'ri-error-warning-line';
      case 'rejected': return 'ri-close-line';
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
          <Link href="/ridemate/join" className="text-white hover:text-red-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-bookmark-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
              <p className="text-gray-400 mb-6">Join your first ride to see it here</p>
              <Link href="/ridemate/join" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Find Rides
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-gray-900 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-red-600 rounded-full flex items-center justify-center`}>
                        <i className={`${getVehicleIcon(booking.vehicleType)} text-xl text-white`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{booking.riderDestination}</h3>
                        <span className={`font-semibold ${getStatusColor(booking.status)}`}>
                          <i className={`${getStatusIcon(booking.status)} mr-1`}></i>
                          {booking.status === 'ride_cancelled' ? 'Ride Cancelled' : 
                           booking.status === 'pending' ? 'Pending' :
                           booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-gray-400 text-sm">
                      <div>{new Date(booking.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(booking.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400">Vehicle: </span>
                      <span className="text-white">{booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)} - {booking.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Your Destination: </span>
                      <span className="text-white">{booking.passengerDestination}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Distance: </span>
                      <span className="text-white">{booking.distance} km</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fare: </span>
                      <span className="text-green-400 font-semibold text-lg">₹{booking.fare}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Departure Time:</span>
                      <span className="text-white font-semibold">
                        {new Date(booking.departureTime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="w-full px-6 py-3 mb-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-close-line mr-2"></i>
                        Cancel Booking
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Confirm you have reached your destination? This will remove the booking from your list.')) {
                            // Remove booking from myBookings and myRides
                            let myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
                            myBookings = myBookings.filter((b: any) => b.id !== booking.id);
                            localStorage.setItem('myBookings', JSON.stringify(myBookings));

                            let myRides = JSON.parse(localStorage.getItem('myRides') || '[]');
                            myRides = myRides.filter((r: any) => r.id !== booking.rideId);
                            localStorage.setItem('myRides', JSON.stringify(myRides));

                            // Update state to remove booking from UI
                            setBookings(myBookings.reverse());
                            alert('Booking marked as completed and removed from your list.');
                          }
                        }}
                        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-check-double-line mr-2"></i>
                        Reached Destination
                      </button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <div className="text-green-400 font-semibold">
                        <i className="ri-check-double-line mr-2"></i>
                        Booking Confirmed! Contact the rider for pickup details.
                      </div>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <div className="bg-blue-900/30 rounded-lg p-3">
                      <div className="text-blue-400 font-semibold">
                        <i className="ri-check-double-line mr-2"></i>
                        Ride Completed. Thank you for using RideMate!
                      </div>
                    </div>
                  )}

                  {booking.status === 'ride_cancelled' && (
                    <div className="bg-orange-900/30 rounded-lg p-3">
                      <div className="text-orange-400 font-semibold">
                        <i className="ri-error-warning-line mr-2"></i>
                        The rider has cancelled this ride. Your booking is automatically cancelled.
                      </div>
                    </div>
                  )}

                  {booking.status === 'rejected' && (
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <div className="text-red-400 font-semibold">
                        <i className="ri-close-line mr-2"></i>
                        Your booking request was rejected by the rider.
                      </div>
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
