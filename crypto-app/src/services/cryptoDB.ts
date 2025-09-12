import { CRYPTO_APP_DB, DB_VERSION, COINS_STORE } from '@/constants' // Interface for stored items
export interface StoredItem<T> {
  id: number | string
  name: string
  data: T
  timestamp: number
}

// Interface for store configuration
interface StoreConfig {
  name: string
  keyPath: string
  indexes?: { name: string; keyPath: string; unique?: boolean }[]
}

// Centralized store configurations
const storeConfigs: StoreConfig[] = [
  {
    name: COINS_STORE,
    keyPath: 'id',
    indexes: [{ name: 'name', keyPath: 'name', unique: false }],
  },
]

let db: IDBDatabase | null = null

// Initialize the database with dynamic store creation
const openDB = async (): Promise<IDBDatabase> => {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CRYPTO_APP_DB, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      storeConfigs.forEach((config) => {
        if (!database.objectStoreNames.contains(config.name)) {
          const objectStore = database.createObjectStore(config.name, {
            keyPath: config.keyPath,
          })
          config.indexes?.forEach((index) => {
            objectStore.createIndex(index.name, index.keyPath, {
              unique: index.unique ?? false,
            })
          })
        }
      })
    }

    request.onsuccess = () => {
      db = request.result
      if (request.transaction) {
        request.transaction.oncomplete = () => resolve(db!)
        request.transaction.onerror = () => reject(request.transaction?.error)
      } else {
        resolve(db!)
      }
    }

    request.onblocked = () => {
      reject(new Error('Database open blocked'))
    }
  })
}

// Check if a store exists
const storeExists = async (storeName: string): Promise<boolean> => {
  const database = await openDB()
  return database.objectStoreNames.contains(storeName)
}

// Add or update an item in the specified store
const addItem = async <T>(
  storeName: string,
  item: T,
  id: string,
  name: string,
): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    store.put({ id, name, data: item, timestamp: Date.now() })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Transaction failed'))
  })
}

// Retrieve all items from the specified store
const getItems = async <T>(storeName: string): Promise<StoredItem<T>[]> => {
  if (!(await storeExists(storeName))) {
    throw new Error(`Store ${storeName} does not exist`)
  }

  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      reject(
        new Error(`Failed to get items from ${storeName}: ${request.error}`),
      )
    }
  })
}

const getItem = async <T>(
  storeName: string,
  id: string,
): Promise<StoredItem<T> | undefined> => {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.get(id)
    tx.oncomplete = () => resolve(request.result as StoredItem<T> | undefined)
    tx.onerror = () => reject(tx.error ?? new Error('Transaction failed'))
  })
}

// Delete an item from the specified store
const deleteItem = async (storeName: string, itemId: number): Promise<void> => {
  if (!(await storeExists(storeName))) {
    throw new Error(`Store ${storeName} does not exist`)
  }

  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(itemId)

    request.onsuccess = () => resolve()
    request.onerror = () => {
      reject(
        new Error(`Failed to delete item from ${storeName}: ${request.error}`),
      )
    }
  })
}

// Clear all items in the specified store
const clearStore = async (storeName: string): Promise<void> => {
  if (!(await storeExists(storeName))) {
    throw new Error(`Store ${storeName} does not exist`)
  }

  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => {
      reject(new Error(`Failed to clear ${storeName}: ${request.error}`))
    }
  })
}

// Close the database connection
const closeDB = async (): Promise<void> => {
  if (db) {
    db.close()
    db = null
  }
}

export {
  addItem,
  getItems,
  deleteItem,
  clearStore,
  storeExists,
  closeDB,
  getItem,
}
