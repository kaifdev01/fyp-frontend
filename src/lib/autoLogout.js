import { toast } from 'react-hot-toast';

// Auto logout utility
export const handleAutoLogout = (error, router) => {
  if (error.response?.data?.code === 'INACTIVE_LOGOUT') {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authFlow');
    localStorage.removeItem('selectedRole');
    
    // Show logout message
    toast.error('You have been logged out due to inactivity');
    
    // Redirect to login
    router.push('/login');
    return true;
  }
  return false;
};

// Check if user should be logged out (client-side check)
export const checkInactivity = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Decode JWT to get expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    // If token is expired, logout
    if (payload.exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      return true;
    }
  } catch (error) {
    // Invalid token, logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    return true;
  }
  
  return false;
};

// Activity tracker - call this on user interactions
export const trackActivity = () => {
  const token = localStorage.getItem('token');
  if (token) {
    localStorage.setItem('lastActivity', Date.now().toString());
  }
};

// Setup activity listeners
export const setupActivityTracking = () => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  const throttledTrackActivity = throttle(trackActivity, 30000); // Track every 30 seconds max
  
  events.forEach(event => {
    document.addEventListener(event, throttledTrackActivity, true);
  });
  
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, throttledTrackActivity, true);
    });
  };
};

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}