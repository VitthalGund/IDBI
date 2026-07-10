import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const QUEUE_KEY = '@trustbank/offline-queue';

export let isSimulatedOffline = false;
let authToken: string | null = null;

export const setSimulatedOffline = (offline: boolean) => {
  isSimulatedOffline = offline;
};

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: any;
  timestamp: number;
}

export const enqueueRequest = async (request: Omit<QueuedRequest, 'id' | 'timestamp'>) => {
  const currentQueueStr = await AsyncStorage.getItem(QUEUE_KEY);
  const queue: QueuedRequest[] = currentQueueStr ? JSON.parse(currentQueueStr) : [];
  
  const newRequest: QueuedRequest = {
    ...request,
    id: uuidv4(),
    timestamp: Date.now(),
  };

  queue.push(newRequest);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return newRequest;
};

export const syncQueue = async (baseUrl: string) => {
  const currentQueueStr = await AsyncStorage.getItem(QUEUE_KEY);
  if (!currentQueueStr) return;
  
  const queue: QueuedRequest[] = JSON.parse(currentQueueStr);
  if (queue.length === 0) return;

  const newQueue: QueuedRequest[] = [];
  
  for (const req of queue) {
    if (isSimulatedOffline) {
      newQueue.push(req);
      continue;
    }
    
    try {
      const headers: any = {
        'Content-Type': 'application/json',
        'Idempotency-Key': req.id,
      };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      
      await fetch(`${baseUrl}${req.url}`, {
        method: req.method,
        headers,
        body: req.body ? JSON.stringify(req.body) : undefined,
      });
      // If success, we don't push to newQueue (it's resolved)
    } catch (e) {
      // If failed due to real network error, keep it in queue
      newQueue.push(req);
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
};

export const apiClient = {
  async request(url: string, method: string, body?: any, baseUrl: string = 'http://127.0.0.1:3000') {
    const CACHE_KEY = `@trustbank/cache:${url}`;

    if (isSimulatedOffline) {
      if (method === 'GET') {
        const cachedDataStr = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr);
          return cachedData.data;
        }
        throw new Error('Offline: No cached data available');
      }
      return enqueueRequest({ url, method, body });
    }

    const idempotencyKey = uuidv4();
    const headers: any = {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();

      if (method === 'GET') {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data
        }));
      }

      return data;
    } catch (error) {
      if (method !== 'GET') {
        // Enqueue if the network failed unexpectedly
        return enqueueRequest({ url, method, body });
      }
      
      // If GET fails due to network, try to serve from cache
      const cachedDataStr = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedDataStr) {
        const cachedData = JSON.parse(cachedDataStr);
        return cachedData.data;
      }
      
      throw error;
    }
  },

  async getCacheTimestamp(url: string): Promise<number | null> {
    const CACHE_KEY = `@trustbank/cache:${url}`;
    const cachedDataStr = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedDataStr) {
      const cachedData = JSON.parse(cachedDataStr);
      return cachedData.timestamp;
    }
    return null;
  }
};
