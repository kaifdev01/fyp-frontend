'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

// Decode JWT to get user ID
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload.userId || payload._id;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const connectionAttempted = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (connectionAttempted.current) return;

    const initSocket = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No token, retrying in 500ms...');
        setTimeout(initSocket, 500);
        return;
      }

      const userId = getUserIdFromToken();
      
      if (!userId) {
        console.log('❌ No user ID from token, retrying in 500ms...');
        setTimeout(initSocket, 500);
        return;
      }

      connectionAttempted.current = true;

      if (socketInstance && socketInstance.connected) {
        console.log('✅ Reusing existing socket connection');
        setSocket(socketInstance);
        return;
      }

      console.log('🔌 Connecting to Socket.IO server...');
      console.log('👤 User ID from token:', userId);
      console.log('⚠️ Socket will NOT have duplicate notification listener');
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fyp-backend-liard-eight.vercel.app';
      socketInstance = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10
      });

      socketInstance.on('connect', () => {
        console.log('✅ Socket.IO connected:', socketInstance.id);
        socketInstance.emit('register', userId);
        console.log('📝 Registered user:', userId);
        setSocket(socketInstance);
      });

      socketInstance.on('disconnect', () => {
        console.log('❌ Socket.IO disconnected');
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error.message);
      });
    };

    setTimeout(initSocket, 100);

  }, []);

  return socket;
};

export const getSocket = () => socketInstance;
