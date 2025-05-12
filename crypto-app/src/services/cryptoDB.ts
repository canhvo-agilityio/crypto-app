import { CRYPTO_APP_DB, DB_VERSION, COINS_STORE } from '@/constants'

// Interface for stored items
export interface StoredItem<T> {
  id: number
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

    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error}`))
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Create all stores based on configurations
      storeConfigs.forEach((config) => {
        if (!database.objectStoreNames.contains(config.name)) {
          const objectStore = database.createObjectStore(config.name, {
            keyPath: config.keyPath,
          })

          // Create indexes for the store
          config.indexes?.forEach((index) => {
            objectStore.createIndex(index.name, index.keyPath, {
              unique: index.unique ?? false,
            })
          })
        }
      })
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
  if (!(await storeExists(storeName))) {
    throw new Error(`Store ${storeName} does not exist`)
  }

  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    const record = {
      id,
      name,
      data: item,
      timestamp: Date.now(),
    }

    const request = store.put(record)

    request.onsuccess = () => resolve()
    request.onerror = () => {
      reject(new Error(`Failed to add item to ${storeName}: ${request.error}`))
    }
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

export { addItem, getItems, deleteItem, clearStore, storeExists, closeDB }
