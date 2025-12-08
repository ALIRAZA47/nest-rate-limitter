export interface RateLimitStrategy {
  /**
   * Check if a request should be allowed based on the strategy
   * @param key - Unique identifier for the rate limit (e.g., IP address, user ID)
   * @param storage - Storage adapter for persisting rate limit data
   * @returns Promise<boolean> - true if request is allowed, false if rate limit exceeded
   */
  check(key: string, storage: RateLimitStorage): Promise<boolean>;

  /**
   * Get the remaining requests/tokens for a given key
   * @param key - Unique identifier for the rate limit
   * @param storage - Storage adapter for persisting rate limit data
   * @returns Promise<number> - Number of remaining requests/tokens
   */
  getRemaining(key: string, storage: RateLimitStorage): Promise<number>;

  /**
   * Get the reset time for the rate limit (when it will be available again)
   * @param key - Unique identifier for the rate limit
   * @param storage - Storage adapter for persisting rate limit data
   * @returns Promise<number> - Unix timestamp in seconds
   */
  getResetTime(key: string, storage: RateLimitStorage): Promise<number>;
}

export interface RateLimitStorage {
  /**
   * Get a value from storage
   */
  get(key: string): Promise<string | null>;

  /**
   * Set a value in storage with optional expiration
   */
  set(key: string, value: string, ttl?: number): Promise<void>;

  /**
   * Increment a value in storage
   */
  increment(key: string, ttl?: number): Promise<number>;

  /**
   * Delete a key from storage
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a key exists
   */
  exists(key: string): Promise<boolean>;
}

