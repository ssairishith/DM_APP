
'use client';

import { useState } from 'react';
import Link from 'next/link';

const saveToDatabase = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));

    // Trigger storage event for real-time sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: JSON.stringify(data)
    }));

    return true;
  } catch (error) {
    console.error('Database save error:', error);
    return false;
  }
};

const getFromDatabase = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Database read error:', error);
    return null;
  }
};

export default function RidePage() {
  const [startPlace, setStartPlace] = useState('');
  const [destination, setDestination] = useState('');
  const [landmarks, setLandmarks] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('bike');
  const [availableSeats, setAvailableSeats] = useState(1);
  const [departureTime, setDepartureTime] = useState('');
  const [notes, setNotes] = useState('');

  const landmarkOptions = [
    'Metro Station', 'Bus Stop', 'Mall', 'Hospital', 'Market', 
    'Railway Station', 'Airport', 'University Gate', 'Hostel Block'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startPlace && destination && vehicleNumber && departureTime) {
      const ride = {
        id: Date.now(),
        startPlace,
        destination,
        landmarks: landmarks.split(',').map(l => l.trim()).filter(l => l),
        vehicleNumber,
        vehicleType,
        availableSeats,
        departureTime,
        notes: notes || 'No additional notes',
        timestamp: new Date().toISOString(),
        status: 'active',
        riders: []
      };

      // Save to temporary database with better sync
      let existingRides = JSON.parse(localStorage.getItem('rides') || '[]');
      if (!Array.isArray(existingRides)) {
        existingRides = [];
      }
      existingRides.push(ride);

      // Save with database function for better reliability
      saveToDatabase('rides', existingRides);

      let myRides = JSON.parse(localStorage.getItem('myRides') || '[]');
      if (!Array.isArray(myRides)) {
        myRides = [];
      }
      myRides.push(ride);
      saveToDatabase('myRides', myRides);

      // Force update JOIN page data
      window.dispatchEvent(new CustomEvent('rideUpdated', { detail: ride }));

      alert('Ride posted successfully!');

      // Reset form
      setStartPlace('');
      setDestination('');
      setLandmarks('');
      setVehicleNumber('');
      setVehicleType('bike');
      setAvailableSeats(1);
      setDepartureTime('');
      setNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/ridemate" className="text-white hover:text-blue-400 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold text-white">Offer Ride</h1>
          <Link href="/ridemate/ride/myrides" className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer">
            My Rides
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Start Place</h3>
            <input
              type="text"
              value={startPlace}
              onChange={(e) => setStartPlace(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your starting location (e.g., University Gate, Block A, Metro Station)"
              required
            />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Where are you going?</h3>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your destination (e.g., City Center, Airport, Railway Station)"
              required
            />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Landmarks on your route</h3>
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-4">
                {landmarkOptions.map((landmark) => (
                  <button
                    key={landmark}
                    type="button"
                    onClick={() => {
                      const currentLandmarks = landmarks.split(',').map(l => l.trim()).filter(l => l);
                      if (currentLandmarks.includes(landmark)) {
                        setLandmarks(currentLandmarks.filter(l => l !== landmark).join(', '));
                      } else {
                        setLandmarks([...currentLandmarks, landmark].join(', '));
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      landmarks.includes(landmark)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {landmark}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={landmarks}
              onChange={(e) => setLandmarks(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Add landmarks separated by commas (e.g., Metro Station, Mall, Bus Stop)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Vehicle Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors pr-8"
                  >
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto Rickshaw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter vehicle number plate"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Seats</label>
                  <input
                    type="number"
                    min="1"
                    max={vehicleType === 'bike' ? 1 : 4}
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Additional Notes (Optional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Any additional information for passengers (pickup points, contact preferences, etc.)"
              maxLength={300}
            />
            <div className="text-right text-gray-400 text-sm mt-1">
              {notes.length}/300 characters
            </div>
          </div>

          {startPlace && destination && vehicleNumber && departureTime && (
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Ride Summary</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Start Place:</span>
                  <span className="text-white">{startPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="text-white">{destination}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="text-white">{vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} - {vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Seats:</span>
                  <span className="text-blue-400">{availableSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departure:</span>
                  <span className="text-white">{new Date(departureTime).toLocaleString()}</span>
                </div>
                {landmarks && (
                  <div className="border-t border-gray-600 pt-3">
                    <span className="text-gray-400">Route Landmarks:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {landmarks.split(',').map((landmark, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm">
                          {landmark.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold text-lg rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-car-line mr-2"></i>
            Post Ride
          </button>
        </form>
      </div>
    </div>
  );
}
