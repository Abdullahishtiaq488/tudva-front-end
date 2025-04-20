/**
 * Mock Database Utility
 * 
 * This file provides a simple in-memory database simulation using localStorage
 * to persist data between sessions. It supports basic CRUD operations and
 * maintains collections of entities.
 */

// Define the structure of our mock database
interface MockDatabase {
  users: Record<string, any>;
  courses: Record<string, any>;
  bookings: Record<string, any>;
  reviews: Record<string, any>;
  notifications: Record<string, any>;
  wishlist: Record<string, any>;
  lectureAccess: Record<string, any>;
  lectureSchedules: Record<string, any>;
  [key: string]: Record<string, any>; // Allow any collection
}

// Initialize empty database
const initialDb: MockDatabase = {
  users: {},
  courses: {},
  bookings: {},
  reviews: {},
  notifications: {},
  wishlist: {},
  lectureAccess: {},
  lectureSchedules: {},
};

// Load database from localStorage or use initial empty database
const loadDb = (): MockDatabase => {
  if (typeof window === 'undefined') {
    return initialDb;
  }
  
  const storedDb = localStorage.getItem('mockDb');
  if (!storedDb) {
    return initialDb;
  }
  
  try {
    return JSON.parse(storedDb);
  } catch (error) {
    console.error('Error parsing stored database:', error);
    return initialDb;
  }
};

// Save database to localStorage
const saveDb = (db: MockDatabase): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('mockDb', JSON.stringify(db));
  } catch (error) {
    console.error('Error saving database to localStorage:', error);
  }
};

// Get all items from a collection
export const getAll = <T>(collection: string): T[] => {
  const db = loadDb();
  return Object.values(db[collection] || {}) as T[];
};

// Get a single item by ID
export const getById = <T>(collection: string, id: string): T | null => {
  const db = loadDb();
  return (db[collection]?.[id] as T) || null;
};

// Create a new item in a collection
export const create = <T extends { id?: string }>(collection: string, item: T): T => {
  const db = loadDb();
  
  // Generate an ID if not provided
  if (!item.id) {
    item.id = generateId();
  }
  
  // Add timestamps
  const now = new Date().toISOString();
  const itemWithTimestamps = {
    ...item,
    createdAt: now,
    updatedAt: now,
  };
  
  // Add to collection
  db[collection] = {
    ...db[collection],
    [item.id]: itemWithTimestamps,
  };
  
  saveDb(db);
  return itemWithTimestamps as T;
};

// Update an existing item
export const update = <T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null => {
  const db = loadDb();
  
  // Check if item exists
  if (!db[collection]?.[id]) {
    return null;
  }
  
  // Update the item
  const updatedItem = {
    ...db[collection][id],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  db[collection][id] = updatedItem;
  saveDb(db);
  
  return updatedItem as T;
};

// Delete an item
export const remove = (collection: string, id: string): boolean => {
  const db = loadDb();
  
  // Check if item exists
  if (!db[collection]?.[id]) {
    return false;
  }
  
  // Remove the item
  delete db[collection][id];
  saveDb(db);
  
  return true;
};

// Query items in a collection
export const query = <T>(
  collection: string,
  predicate: (item: T) => boolean
): T[] => {
  const items = getAll<T>(collection);
  return items.filter(predicate);
};

// Clear a collection
export const clearCollection = (collection: string): void => {
  const db = loadDb();
  db[collection] = {};
  saveDb(db);
};

// Clear the entire database
export const clearDb = (): void => {
  saveDb(initialDb);
};

// Initialize a collection with data
export const initCollection = <T extends { id: string }>(
  collection: string,
  items: T[]
): void => {
  const db = loadDb();
  
  // Convert array to record
  const record = items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, T>);
  
  db[collection] = record;
  saveDb(db);
};

// Helper function to generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Export the database API
export const mockDb = {
  getAll,
  getById,
  create,
  update,
  remove,
  query,
  clearCollection,
  clearDb,
  initCollection,
  generateId,
};

export default mockDb;
