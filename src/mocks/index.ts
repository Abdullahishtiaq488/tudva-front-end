/**
 * Mock System Index
 * 
 * This file is the main entry point for the mock system.
 * It initializes the mock database and exports all mock data and services.
 */

import { mockDb } from './utils/mockDb';
import { initMockData } from './data';
import mockServices from './services';
import mockUtils from './utils';

// Initialize the mock database with data
export const initMockSystem = () => {
  const mockData = initMockData();
  
  // Initialize each collection with its data
  Object.entries(mockData).forEach(([collection, data]) => {
    if (Array.isArray(data) && data.length > 0) {
      mockDb.initCollection(collection, data);
    }
  });
  
  console.log('Mock system initialized with data');
};

// Export all mock data, services, and utilities
export * from './data';
export * from './services';
export * from './utils';

export default {
  initMockSystem,
  data: initMockData(),
  services: mockServices,
  utils: mockUtils,
};
