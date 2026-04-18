// Notification refresh event system
export const notificationEvents = {
  refresh: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
    }
  }
};
