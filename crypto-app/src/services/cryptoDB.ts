import {
  CRYPTO_APP_DB,
  DB_VERSION,
  TRENDING_COINS_STORE,
  ALL_COINS_STORE,
} from '@/constants';

// Interface for stored items
export interface StoredItem<T> {
  id: number;
  name: string;
  data: T;
  timestamp: number;
}

let db: IDBDatabase | null = null;

// Initialize the database
const initDB = async (): Promise<IDBDatabase> => {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CRYPTO_APP_DB, DB_VERSION);

    request.onerror = (event) => {
      console.error('Failed to perform operation:', (event.target as IDBRequest).error);
      reject(event);
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create trending coins object store if it doesn't exist
      if (!database.objectStoreNames.contains(TRENDING_COINS_STORE)) {
        const objectStore = database.createObjectStore(TRENDING_COINS_STORE, {
          keyPath: 'id',
        });
        objectStore.createIndex('name', 'name', { unique: false });
      }

      // Create all coins object store if it doesn't exist
      if (!database.objectStoreNames.contains(ALL_COINS_STORE)) {
        const objectStore = database.createObjectStore(ALL_COINS_STORE, {
          keyPath: 'id',
        });
        objectStore.createIndex('name', 'name', { unique: false });
      }
    };
  });
};

// Add or update an item in the specified store
const addItem = async <T>(
  storeName: string,
  item: T,
  id: number,
  name: string
): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const record = {
      id,
      name,
      data: item,
      timestamp: Date.now(),
    };

    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

// Retrieve all items from the specified store
const getItems = async <T>(storeName: string): Promise<StoredItem<T>[]> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

// Delete an item from the specified store
const deleteItem = async (storeName: string, itemId: number): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(itemId);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

// Clear all items in the specified store
const clearStore = async (storeName: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

export { addItem, getItems, deleteItem, clearStore };