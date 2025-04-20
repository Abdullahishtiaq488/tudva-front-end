/**
 * Mock System Initialization
 * 
 * This file initializes the mock system for API routes.
 */

import { initMockSystem } from '@/mocks';

// Initialize the mock system
let initialized = false;

export const ensureMockSystemInitialized = () => {
  if (!initialized) {
    initMockSystem();
    initialized = true;
    console.log('Mock system initialized for API routes');
  }
};

export default ensureMockSystemInitialized;
