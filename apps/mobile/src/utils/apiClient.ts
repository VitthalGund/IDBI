import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const QUEUE_KEY = '@trustbank/offline-queue';

export let isSimulatedOffline = false;

export const setSimulatedOffline = (offline: boolean) => {
  isSimulatedOffline = offline;
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
      await fetch(`${baseUrl}${req.url}`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': req.id,
        },
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
  async request(url: string, method: string, body?: any, baseUrl: string = 'http://localhost:3000') {
    if (isSimulatedOffline) {
      if (method === 'GET') {
        throw new Error('Offline: Cannot fetch new data');
      }
      return enqueueRequest({ url, method, body });
    }

    const idempotencyKey = uuidv4();
    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      return await response.json();
    } catch (error) {
      if (method !== 'GET') {
        // Enqueue if the network failed unexpectedly
        return enqueueRequest({ url, method, body });
      }
      throw error;
    }
  }
};
