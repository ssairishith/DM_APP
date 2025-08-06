
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Ride {
  id: number;
  startPlace?: string;
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

// Enhanced database functions for better sync
const getFromDatabase = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    // Handle both old format and new database format
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return parsed.data;
    } else if (parsed && typeof parsed === 'object' && 'lastUpdated' in parsed && 'syncId' in parsed) {
      // Handle legacy format with metadata wrapper
      return parsed.data || [];
    }
    return [];
  } catch (error) {
    console.error('Database read error:', error);
    return [];
  }
};

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

export default function JoinPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [passengerDestination, setPassengerDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [isClient, setIsClient] = useState(false);

  const getFareByDistance = (distance: number, vehicleType: string) => {
    let rate = 0;
    if (distance <= 3) rate = 7;
    else if (distance <= 7) rate = 6;
    else if (distance <= 12) rate = 4.5;
    else rate = 3.5;

    return Math.round(distance * rate);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadRides = () => {
      try {
        // Use enhanced database function
        const allRides = getFromDatabase('rides');
        console.log('All rides from database:', allRides);

        // Better filtering with debug info
        // Remove completed rides from the database
        const filteredRides = allRides.filter((ride: Ride) => ride.status !== 'completed');
        if (filteredRides.length !== allRides.length) {
          localStorage.setItem('rides', JSON.stringify(filteredRides));
        }

        const activeRides = filteredRides.filter((ride: Ride) => {
          const isActive = ride.status === 'active';
          const hasSeats = ride.availableSeats > 0;
          const departureDate = new Date(ride.departureTime);
          const now = new Date();
          const timeDiff = departureDate.getTime() - now.getTime();
          // Show rides up to 2 hours after departure time (more flexible)
          const isFuture = timeDiff > -120 * 60 * 1000;

          // Additional check: ensure departureTime is valid date
          if (isNaN(departureDate.getTime())) {
            console.warn(`Ride ${ride.id} has invalid departureTime: ${ride.departureTime}`);
            return false;
          }

          console.log(`Ride ${ride.id}:`, {
            active: isActive,
            seats: hasSeats,
            departure: ride.departureTime,
            future: isFuture,
            timeDiffMinutes: Math.round(timeDiff / (1000 * 60))
          });

          return isActive && hasSeats && isFuture;
        });

        console.log('Active rides after filtering:', activeRides);
        setRides(activeRides);
        setFilteredRides(activeRides);
      } catch (error) {
        console.error('Error loading rides:', error);
        setRides([]);
        setFilteredRides([]);
      }
    };

    const loadRideRequests = () => {
      try {
        const requests = getFromDatabase('rideRequests');
        setRideRequests(requests);
      } catch (error) {
        console.error('Error loading ride requests:', error);
        setRideRequests([]);
      }
    };

    // Initial load
    loadRides();
    loadRideRequests();

    // Enhanced real-time sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rides' || e.key === 'rideRequests') {
        console.log('Storage changed, reloading...');
        loadRides();
        loadRideRequests();
      }
    };

    const handleCustomRideUpdate = (e: CustomEvent) => {
      console.log('Custom ride update event received:', e.detail);
      loadRides();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rideUpdated', handleCustomRideUpdate as EventListener);

    // Faster interval for better sync
    const interval = setInterval(() => {
      loadRides();
      loadRideRequests();
    }, 1000); // Every 1 second for better real-time feel

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rideUpdated', handleCustomRideUpdate as EventListener);
    };
  }, [isClient]);

  const handleJoinRide = (ride: Ride) => {
    setSelectedRide(ride);
    setShowJoinForm(true);
  };

  const submitJoinRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClient) return;

    if (selectedRide && passengerDestination && distance) {
      const totalFare = getFareByDistance(parseFloat(distance), selectedRide.vehicleType);

      const joinRequest = {
        id: Date.now(),
        rideId: selectedRide.id,
        riderDestination: selectedRide.destination,
        passengerDestination,
        distance: parseFloat(distance),
        fare: totalFare,
        vehicleType: selectedRide.vehicleType,
        vehicleNumber: selectedRide.vehicleNumber,
        departureTime: selectedRide.departureTime,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      try {
        const rideRequests = getFromDatabase('rideRequests');
        rideRequests.push(joinRequest);
        localStorage.setItem('rideRequests', JSON.stringify(rideRequests));

        const myBookings = getFromDatabase('myBookings');
        myBookings.push(joinRequest);
        localStorage.setItem('myBookings', JSON.stringify(myBookings));

        alert(`Join request sent! Estimated fare: ₹${totalFare}. Wait for rider confirmation.`);
        setShowJoinForm(false);
        setSelectedRide(null);
        setPassengerDestination('');
        setDistance('');
      } catch (error) {
        console.error('Error submitting join request:', error);
        alert('Error submitting request. Please try again.');
      }
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike':
        return 'ri-motorbike-fill';
      case 'car':
        return 'ri-car-fill';
      case 'auto':
        return 'ri-taxi-fill';
      default:
        return 'ri-car-fill';
    }
  };

  const getTimeUntilDeparture = (departureTime: string) => {
    const now = new Date();
    const departure = new Date(departureTime);
    const diff = departure.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff <= -120 * 60 * 1000) {
      return 'Departed';
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/ridemate" className="text-white hover:text-red-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">Find Rides</h1>
          <Link href="/ridemate/join/mybookings" className="text-red-400 hover:text-red-300 text-sm cursor-pointer">
            My Bookings
          </Link>
        </div>

        {rideRequests.filter((req) => req.status === 'confirmed').length > 0 && (
          <div className="bg-green-900/30 rounded-2xl p-4 mb-6 border border-green-500">
            <h3 className="text-green-400 font-semibold mb-2">
              <i className="ri-notification-badge-line mr-2"></i>
              Ride Confirmed!
            </h3>
            {rideRequests
              .filter((request) => request.status === 'confirmed')
              .map((request) => (
                <div key={request.id} className="text-green-300 text-sm">
                  Your ride to {request.passengerDestination} has been confirmed. Fare: ₹{request.fare}
                </div>
              ))}
          </div>
        )}

        <div className="mb-6">
          <div className="bg-gray-900 rounded-2xl p-4">
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Search by destination or landmarks..."
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-4 text-center">
            <p className="text-gray-500 text-sm">
              Database Status: {isClient ? getFromDatabase('rides').length : 0} total rides | Active: {filteredRides.length}
            </p>
          </div>

          {filteredRides.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="ri-car-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Rides Available</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'No rides match your search' : 'No active rides available right now. Check back later!'}
              </p>
              <p className="text-gray-500 text-sm">
                Rides appear here when posted by other users
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-red-400 font-semibold">
                  <i className="ri-car-line mr-2"></i>
                  {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {filteredRides.map((ride) => (
                <div key={ride.id} className="bg-gray-900 rounded-2xl p-6 border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-red-600 rounded-full flex items-center justify-center`}>
                        <i className={`${getVehicleIcon(ride.vehicleType)} text-xl text-white`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {ride.startPlace && `${ride.startPlace} → `}{ride.destination}
                        </h3>
                        <p className="text-gray-400">
                          {ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1)} - {ride.vehicleNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold">
                        Leaves in {getTimeUntilDeparture(ride.departureTime)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(ride.departureTime).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400">Available Seats: </span>
                      <span className="text-white font-semibold">{ride.availableSeats}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fare Rate: </span>
                      <span className="text-green-400 font-semibold">
                        Distance based pricing
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
                    <div className="text-blue-400 font-semibold mb-2">Fare Structure:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      <div>0-3 km: ₹7/km</div>
                      <div>4-7 km: ₹6/km</div>
                      <div>8-12 km: ₹4.5/km</div>
                      <div>12+ km: ₹3.5/km</div>
                    </div>
                  </div>

                  {ride.landmarks.length > 0 && (
                    <div className="mb-4">
                      <span className="text-gray-400 block mb-2">Route Landmarks:</span>
                      <div className="flex flex-wrap gap-2">
                        {ride.landmarks.map((landmark, index) => (
                          <span key={index} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm">
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

                  <button
                    onClick={() => handleJoinRide(ride)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-user-add-line mr-2"></i>
                    Join This Ride
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showJoinForm && selectedRide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Join Ride</h3>
                <button
                  onClick={() => setShowJoinForm(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <div className="text-white font-semibold mb-2">Ride Details:</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Going to: {selectedRide.destination}</div>
                  <div>Vehicle: {selectedRide.vehicleType} - {selectedRide.vehicleNumber}</div>
                  <div>Departure: {new Date(selectedRide.departureTime).toLocaleString()}</div>
                </div>
              </div>

              <form onSubmit={submitJoinRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Destination
                    </label>
                    <input
                      type="text"
                      value={passengerDestination}
                      onChange={(e) => setPassengerDestination(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Where do you want to get off?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="50"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Approximate distance in km"
                      required
                    />
                  </div>

                  {distance && (
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <div className="text-green-400 font-semibold">
                        <i className="ri-money-rupee-circle-line mr-2"></i>
                        Estimated Fare: ₹{getFareByDistance(parseFloat(distance), selectedRide.vehicleType)}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        Based on distance: {distance} km
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  Send Join Request
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
