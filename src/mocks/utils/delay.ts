/**
 * Delay Utility
 * 
 * This file provides utilities for simulating network delays in API responses.
 */

// Default delay range in milliseconds
const DEFAULT_MIN_DELAY = 200;
const DEFAULT_MAX_DELAY = 800;

/**
 * Returns a promise that resolves after a random delay
 * @param minDelay Minimum delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 */
export const randomDelay = (
  minDelay: number = DEFAULT_MIN_DELAY,
  maxDelay: number = DEFAULT_MAX_DELAY
): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Wraps a function with a random delay
 * @param fn Function to wrap
 * @param minDelay Minimum delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 */
export const withDelay = <T, Args extends any[]>(
  fn: (...args: Args) => T,
  minDelay: number = DEFAULT_MIN_DELAY,
  maxDelay: number = DEFAULT_MAX_DELAY
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args): Promise<T> => {
    await randomDelay(minDelay, maxDelay);
    return fn(...args);
  };
};

/**
 * Wraps an async function with a random delay
 * @param fn Async function to wrap
 * @param minDelay Minimum delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 */
export const withAsyncDelay = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  minDelay: number = DEFAULT_MIN_DELAY,
  maxDelay: number = DEFAULT_MAX_DELAY
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args): Promise<T> => {
    await randomDelay(minDelay, maxDelay);
    return await fn(...args);
  };
};

export default {
  randomDelay,
  withDelay,
  withAsyncDelay
};
