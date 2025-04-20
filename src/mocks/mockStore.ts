/**
 * Centralized Mock Data Store
 * 
 * This file provides a centralized store for all mock data in the application.
 * It uses localStorage for persistence and provides methods for CRUD operations.
 */

import { 
  mockUsers, 
  mockCourses, 
  mockModules, 
  mockLectures, 
  mockFAQs,
  mockBookings,
  mockBookingSlots,
  mockSlots,
  mockSeminarDays,
  mockReviews,
  mockReviewHelpful,
  mockNotifications,
  mockNotificationPreferences,
  mockWishlist,
  mockLectureAccess,
  mockLectureSchedules
} from './data';

// Define the structure of our mock database
interface MockDatabase {
  users: Record<string, any>;
  courses: Record<string, any>;
  modules: Record<string, any>;
  lectures: Record<string, any>;
  faqs: Record<string, any>;
  bookings: Record<string, any>;
  bookingSlots: Record<string, any>;
  slots: Record<string, any>;
  seminarDays: Record<string, any>;
  reviews: Record<string, any>;
  reviewHelpful: Record<string, any>;
  notifications: Record<string, any>;
  notificationPreferences: Record<string, any>;
  wishlist: Record<string, any>;
  lectureAccess: Record<string, any>;
  lectureSchedules: Record<string, any>;
  [key: string]: Record<string, any>; // Allow any collection
}

// Initialize empty database
const initialDb: MockDatabase = {
  users: {},
  courses: {},
  modules: {},
  lectures: {},
  faqs: {},
  bookings: {},
  bookingSlots: {},
  slots: {},
  seminarDays: {},
  reviews: {},
  reviewHelpful: {},
  notifications: {},
  notificationPreferences: {},
  wishlist: {},
  lectureAccess: {},
  lectureSchedules: {},
};

// Storage key for localStorage
const STORAGE_KEY = 'mockDb';

/**
 * MockStore class for managing mock data
 */
class MockStore {
  private db: MockDatabase;
  private initialized: boolean = false;

  constructor() {
    this.db = this.loadDb();
  }

  /**
   * Initialize the mock store with data
   */
  initialize(): void {
    if (this.initialized) {
      console.log('Mock store already initialized');
      return;
    }

    // Convert arrays to records
    const usersRecord = this.arrayToRecord(mockUsers);
    const coursesRecord = this.arrayToRecord(mockCourses);
    const modulesRecord = this.arrayToRecord(mockModules);
    const lecturesRecord = this.arrayToRecord(mockLectures);
    const faqsRecord = this.arrayToRecord(mockFAQs);
    const bookingsRecord = this.arrayToRecord(mockBookings);
    const bookingSlotsRecord = this.arrayToRecord(mockBookingSlots);
    const slotsRecord = this.arrayToRecord(mockSlots);
    const seminarDaysRecord = this.arrayToRecord(mockSeminarDays);
    const reviewsRecord = this.arrayToRecord(mockReviews);
    const reviewHelpfulRecord = this.arrayToRecord(mockReviewHelpful);
    const notificationsRecord = this.arrayToRecord(mockNotifications);
    const notificationPreferencesRecord = this.arrayToRecord(mockNotificationPreferences);
    const wishlistRecord = this.arrayToRecord(mockWishlist);
    const lectureAccessRecord = this.arrayToRecord(mockLectureAccess);
    const lectureSchedulesRecord = this.arrayToRecord(mockLectureSchedules);

    // Initialize database with records
    this.db = {
      users: usersRecord,
      courses: coursesRecord,
      modules: modulesRecord,
      lectures: lecturesRecord,
      faqs: faqsRecord,
      bookings: bookingsRecord,
      bookingSlots: bookingSlotsRecord,
      slots: slotsRecord,
      seminarDays: seminarDaysRecord,
      reviews: reviewsRecord,
      reviewHelpful: reviewHelpfulRecord,
      notifications: notificationsRecord,
      notificationPreferences: notificationPreferencesRecord,
      wishlist: wishlistRecord,
      lectureAccess: lectureAccessRecord,
      lectureSchedules: lectureSchedulesRecord,
    };

    // Save to localStorage
    this.saveDb();
    this.initialized = true;
    console.log('Mock store initialized with data');
  }

  /**
   * Convert an array of objects to a record
   */
  private arrayToRecord<T extends { id: string }>(array: T[]): Record<string, T> {
    return array.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, T>);
  }

  /**
   * Load database from localStorage
   */
  private loadDb(): MockDatabase {
    if (typeof window === 'undefined') {
      return initialDb;
    }
    
    const storedDb = localStorage.getItem(STORAGE_KEY);
    if (!storedDb) {
      return initialDb;
    }
    
    try {
      return JSON.parse(storedDb);
    } catch (error) {
      console.error('Error parsing stored database:', error);
      return initialDb;
    }
  }

  /**
   * Save database to localStorage
   */
  private saveDb(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    } catch (error) {
      console.error('Error saving database to localStorage:', error);
    }
  }

  /**
   * Get all items from a collection
   */
  getAll<T>(collection: string): T[] {
    return Object.values(this.db[collection] || {}) as T[];
  }

  /**
   * Get a single item by ID
   */
  getById<T>(collection: string, id: string): T | null {
    return (this.db[collection]?.[id] as T) || null;
  }

  /**
   * Create a new item in a collection
   */
  create<T extends { id: string }>(collection: string, item: T): T {
    this.db[collection] = this.db[collection] || {};
    this.db[collection][item.id] = item;
    this.saveDb();
    return item;
  }

  /**
   * Update an item in a collection
   */
  update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
    const item = this.getById<T>(collection, id);
    if (!item) {
      return null;
    }
    
    const updatedItem = { ...item, ...updates } as T;
    this.db[collection][id] = updatedItem;
    this.saveDb();
    return updatedItem;
  }

  /**
   * Delete an item from a collection
   */
  delete(collection: string, id: string): boolean {
    if (!this.db[collection]?.[id]) {
      return false;
    }
    
    delete this.db[collection][id];
    this.saveDb();
    return true;
  }

  /**
   * Query items in a collection
   */
  query<T>(collection: string, predicate: (item: T) => boolean): T[] {
    const items = this.getAll<T>(collection);
    return items.filter(predicate);
  }

  /**
   * Clear a collection
   */
  clearCollection(collection: string): void {
    this.db[collection] = {};
    this.saveDb();
  }

  /**
   * Clear the entire database
   */
  clearDb(): void {
    this.db = initialDb;
    this.saveDb();
    this.initialized = false;
  }

  /**
   * Generate a unique ID
   */
  generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Create a singleton instance
export const mockStore = new MockStore();

// Export default
export default mockStore;
