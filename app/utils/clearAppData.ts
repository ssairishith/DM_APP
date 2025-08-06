export function clearAppData() {
  const keysToClear = ['rides', 'myRides', 'rideRequests', 'myBookings'];
  keysToClear.forEach(key => {
    localStorage.removeItem(key);
  });
}
