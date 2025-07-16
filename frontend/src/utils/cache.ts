/**
 * Frontend caching utilities for the MusicProject application
 * Provides in-memory and localStorage caching capabilities
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class FrontendCache {
  private static memoryCache = new Map<string, CacheItem<any>>();
  
  // Expose memory cache for specialized classes (public access for static methods)
  static getMemoryCache() {
    return this.memoryCache;
  }
  
  // TTL constants (in milliseconds)
  static readonly TTL = {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 15 * 60 * 1000,    // 15 minutes
    LONG: 30 * 60 * 1000,      // 30 minutes
    VERY_LONG: 60 * 60 * 1000, // 1 hour
  };

  /**
   * Generate a cache key with consistent formatting
   */
  static generateKey(...identifiers: (string | number)[]): string {
    return identifiers.join(':');
  }

  /**
   * Check if an item is expired
   */
  private static isExpired<T>(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * Set data in memory cache
   */
  static setMemory<T>(key: string, data: T, ttl: number = this.TTL.MEDIUM): void {
    try {
      this.memoryCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
    } catch (error) {
      console.warn('Failed to set memory cache:', error);
    }
  }

  /**
   * Get data from memory cache
   */
  static getMemory<T>(key: string): T | null {
    try {
      const item = this.memoryCache.get(key);
      if (!item) return null;

      if (this.isExpired(item)) {
        this.memoryCache.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get memory cache:', error);
      return null;
    }
  }

  /**
   * Delete item from memory cache
   */
  static deleteMemory(key: string): void {
    this.memoryCache.delete(key);
  }

  /**
   * Clear all memory cache
   */
  static clearMemory(): void {
    this.memoryCache.clear();
  }

  /**
   * Set data in localStorage with TTL
   */
  static setLocal<T>(key: string, data: T, ttl: number = this.TTL.LONG): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache:${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  }

  /**
   * Get data from localStorage
   */
  static getLocal<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(`cache:${key}`);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);
      if (this.isExpired(item)) {
        localStorage.removeItem(`cache:${key}`);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  }

  /**
   * Delete item from localStorage
   */
  static deleteLocal(key: string): void {
    try {
      localStorage.removeItem(`cache:${key}`);
    } catch (error) {
      console.warn('Failed to delete localStorage cache:', error);
    }
  }

  /**
   * Clear all cache items from localStorage
   */
  static clearLocal(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { memory: number; local: number } {
    let localCount = 0;
    try {
      const keys = Object.keys(localStorage);
      localCount = keys.filter(key => key.startsWith('cache:')).length;
    } catch (error) {
      console.warn('Failed to get localStorage stats:', error);
    }

    return {
      memory: this.memoryCache.size,
      local: localCount
    };
  }

  /**
   * Clean up expired items from memory cache
   */
  static cleanupMemory(): number {
    let cleaned = 0;
    const now = Date.now();
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }
    
    return cleaned;
  }

  /**
   * Clean up expired items from localStorage
   */
  static cleanupLocal(): number {
    let cleaned = 0;
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('cache:'));
      
      cacheKeys.forEach(key => {
        try {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            const item = JSON.parse(itemStr);
            if (this.isExpired(item)) {
              localStorage.removeItem(key);
              cleaned++;
            }
          }
        } catch (error) {
          // If we can't parse the item, remove it
          localStorage.removeItem(key);
          cleaned++;
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup localStorage cache:', error);
    }
    
    return cleaned;
  }

  /**
   * Automatic cleanup - run periodically
   */
  static performCleanup(): void {
    const memoryCleanup = this.cleanupMemory();
    const localCleanup = this.cleanupLocal();
    
    if (memoryCleanup > 0 || localCleanup > 0) {
      console.log(`Cache cleanup completed: ${memoryCleanup} memory items, ${localCleanup} localStorage items removed`);
    }
  }
}

// Specialized cache classes for different data types

/**
 * Search result caching
 */
export class SearchCache {
  static getCacheKey(query: string, provider: string, limit: number, offset: number): string {
    return FrontendCache.generateKey('search', provider, query.toLowerCase(), limit, offset);
  }

  static set(query: string, provider: string, limit: number, offset: number, results: any[]): void {
    const key = this.getCacheKey(query, provider, limit, offset);
    FrontendCache.setMemory(key, results, FrontendCache.TTL.MEDIUM);
  }

  static get(query: string, provider: string, limit: number, offset: number): any[] | null {
    const key = this.getCacheKey(query, provider, limit, offset);
    return FrontendCache.getMemory<any[]>(key);
  }

  static clear(query?: string, provider?: string): void {
    if (query && provider) {
      // Clear specific query
      const pattern = FrontendCache.generateKey('search', provider, query.toLowerCase());
      const memoryCache = FrontendCache.getMemoryCache();
      memoryCache.forEach((_, key) => {
        if (key.startsWith(pattern)) {
          FrontendCache.deleteMemory(key);
        }
      });
    } else {
      // Clear all search results
      const memoryCache = FrontendCache.getMemoryCache();
      memoryCache.forEach((_, key) => {
        if (key.startsWith('search:')) {
          FrontendCache.deleteMemory(key);
        }
      });
    }
  }
}

/**
 * User preference caching
 */
export class PreferenceCache {
  static set(key: string, value: any): void {
    FrontendCache.setLocal(FrontendCache.generateKey('pref', key), value, FrontendCache.TTL.VERY_LONG);
  }

  static get(key: string): any | null {
    return FrontendCache.getLocal(FrontendCache.generateKey('pref', key));
  }

  static delete(key: string): void {
    FrontendCache.deleteLocal(FrontendCache.generateKey('pref', key));
  }
}

/**
 * Track metadata caching
 */
export class TrackCache {
  static getCacheKey(trackId: string, provider: string): string {
    return FrontendCache.generateKey('track', provider, trackId);
  }

  static set(trackId: string, provider: string, track: any): void {
    const key = this.getCacheKey(trackId, provider);
    FrontendCache.setMemory(key, track, FrontendCache.TTL.LONG);
  }

  static get(trackId: string, provider: string): any | null {
    const key = this.getCacheKey(trackId, provider);
    return FrontendCache.getMemory(key);
  }

  static clear(provider?: string): void {
    if (provider) {
      const pattern = FrontendCache.generateKey('track', provider);
      const memoryCache = FrontendCache.getMemoryCache();
      memoryCache.forEach((_, key) => {
        if (key.startsWith(pattern)) {
          FrontendCache.deleteMemory(key);
        }
      });
    } else {
      const memoryCache = FrontendCache.getMemoryCache();
      memoryCache.forEach((_, key) => {
        if (key.startsWith('track:')) {
          FrontendCache.deleteMemory(key);
        }
      });
    }
  }
}

/**
 * User data caching
 */
export class UserCache {
  static setFavorites(provider: string, favorites: any[]): void {
    const key = FrontendCache.generateKey('user', 'favorites', provider);
    FrontendCache.setMemory(key, favorites, FrontendCache.TTL.SHORT);
  }

  static getFavorites(provider: string): any[] | null {
    const key = FrontendCache.generateKey('user', 'favorites', provider);
    return FrontendCache.getMemory<any[]>(key);
  }

  static setPlaylists(playlists: any[]): void {
    const key = FrontendCache.generateKey('user', 'playlists');
    FrontendCache.setMemory(key, playlists, FrontendCache.TTL.MEDIUM);
  }

  static getPlaylists(): any[] | null {
    const key = FrontendCache.generateKey('user', 'playlists');
    return FrontendCache.getMemory<any[]>(key);
  }

  static setProfile(profile: any): void {
    const key = FrontendCache.generateKey('user', 'profile');
    FrontendCache.setMemory(key, profile, FrontendCache.TTL.LONG);
  }

  static getProfile(): any | null {
    const key = FrontendCache.generateKey('user', 'profile');
    return FrontendCache.getMemory(key);
  }

  static clearUserData(): void {
    const memoryCache = FrontendCache.getMemoryCache();
    memoryCache.forEach((_, key) => {
      if (key.startsWith('user:')) {
        FrontendCache.deleteMemory(key);
      }
    });
  }
}

// Initialize periodic cleanup
if (typeof window !== 'undefined') {
  // Clean up cache every 10 minutes
  setInterval(() => {
    FrontendCache.performCleanup();
  }, 10 * 60 * 1000);
}

export default FrontendCache;