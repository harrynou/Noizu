import redisClient from '../config/redis-config';

/**
 * Centralized caching service for the MusicProject application
 * Provides high-level caching abstractions for different data types
 */

export enum CacheKeys {
  // Search results
  SEARCH_RESULTS = 'search:results',
  
  // Track data
  TRACK_DATA = 'track:data',
  TRACK_NORMALIZED = 'track:normalized',
  
  // User data
  USER_FAVORITES = 'user:favorites',
  USER_PROFILE = 'user:profile',
  USER_CONNECTIONS = 'user:connections',
  
  // Playlist data
  PLAYLIST_DATA = 'playlist:data',
  PLAYLIST_TRACKS = 'playlist:tracks',
  
  // Provider tokens (already handled but included for completeness)
  SPOTIFY_TOKEN = 'spotify:token',
  SOUNDCLOUD_TOKEN = 'soundcloud:token',
}

export enum CacheTTL {
  // Short-term caching (5 minutes)
  SHORT = 300,
  
  // Medium-term caching (30 minutes)
  MEDIUM = 1800,
  
  // Long-term caching (2 hours)
  LONG = 7200,
  
  // Very long-term caching (24 hours)
  VERY_LONG = 86400,
  
  // Search results (15 minutes - balance between freshness and performance)
  SEARCH_RESULTS = 900,
  
  // Track metadata (1 hour - relatively stable)
  TRACK_DATA = 3600,
  
  // User favorites (10 minutes - can change frequently)
  USER_FAVORITES = 600,
  
  // Playlist data (30 minutes - moderate change frequency)
  PLAYLIST_DATA = 1800,
}

/**
 * Generate a cache key with consistent formatting
 */
export function generateCacheKey(type: CacheKeys, ...identifiers: (string | number)[]): string {
  return `${type}:${identifiers.join(':')}`;
}

/**
 * High-level caching service with typed methods
 */
export class CacheService {
  
  /**
   * Get data from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set data in cache with TTL
   */
  static async set(key: string, value: any, ttl: number = CacheTTL.MEDIUM): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setex(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete data from cache
   */
  static async del(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys with pattern matching
   */
  static async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        return await redisClient.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error(`Cache delete pattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get or set pattern - retrieves from cache or executes function and caches result
   */
  static async getOrSet<T>(
    key: string, 
    fetchFunction: () => Promise<T>, 
    ttl: number = CacheTTL.MEDIUM
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, execute function and cache result
      const result = await fetchFunction();
      await this.set(key, result, ttl);
      return result;
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error);
      // If caching fails, still return the function result
      return await fetchFunction();
    }
  }

  // Specialized methods for different data types

  /**
   * Cache search results
   */
  static async cacheSearchResults(
    query: string, 
    provider: string, 
    limit: number, 
    offset: number, 
    results: any[]
  ): Promise<void> {
    const key = generateCacheKey(CacheKeys.SEARCH_RESULTS, provider, query, limit, offset);
    await this.set(key, results, CacheTTL.SEARCH_RESULTS);
  }

  /**
   * Get cached search results
   */
  static async getCachedSearchResults(
    query: string, 
    provider: string, 
    limit: number, 
    offset: number
  ): Promise<any[] | null> {
    const key = generateCacheKey(CacheKeys.SEARCH_RESULTS, provider, query, limit, offset);
    return await this.get<any[]>(key);
  }

  /**
   * Cache track data
   */
  static async cacheTrackData(trackId: string, provider: string, trackData: any): Promise<void> {
    const key = generateCacheKey(CacheKeys.TRACK_DATA, provider, trackId);
    await this.set(key, trackData, CacheTTL.TRACK_DATA);
  }

  /**
   * Get cached track data
   */
  static async getCachedTrackData(trackId: string, provider: string): Promise<any | null> {
    const key = generateCacheKey(CacheKeys.TRACK_DATA, provider, trackId);
    return await this.get<any>(key);
  }

  /**
   * Cache normalized track data
   */
  static async cacheNormalizedTrackData(trackId: string, provider: string, normalizedData: any): Promise<void> {
    const key = generateCacheKey(CacheKeys.TRACK_NORMALIZED, provider, trackId);
    await this.set(key, normalizedData, CacheTTL.TRACK_DATA);
  }

  /**
   * Get cached normalized track data
   */
  static async getCachedNormalizedTrackData(trackId: string, provider: string): Promise<any | null> {
    const key = generateCacheKey(CacheKeys.TRACK_NORMALIZED, provider, trackId);
    return await this.get<any>(key);
  }

  /**
   * Cache user favorites
   */
  static async cacheUserFavorites(userId: string, provider: string, favorites: any[]): Promise<void> {
    const key = generateCacheKey(CacheKeys.USER_FAVORITES, userId, provider);
    await this.set(key, favorites, CacheTTL.USER_FAVORITES);
  }

  /**
   * Get cached user favorites
   */
  static async getCachedUserFavorites(userId: string, provider: string): Promise<any[] | null> {
    const key = generateCacheKey(CacheKeys.USER_FAVORITES, userId, provider);
    return await this.get<any[]>(key);
  }

  /**
   * Invalidate user favorites cache
   */
  static async invalidateUserFavorites(userId: string, provider?: string): Promise<void> {
    if (provider) {
      const key = generateCacheKey(CacheKeys.USER_FAVORITES, userId, provider);
      await this.del(key);
    } else {
      // Invalidate all providers for user
      const pattern = generateCacheKey(CacheKeys.USER_FAVORITES, userId, '*');
      await this.delPattern(pattern);
    }
  }

  /**
   * Cache playlist data
   */
  static async cachePlaylistData(userId: string, playlists: any[]): Promise<void> {
    const key = generateCacheKey(CacheKeys.PLAYLIST_DATA, userId);
    await this.set(key, playlists, CacheTTL.PLAYLIST_DATA);
  }

  /**
   * Get cached playlist data
   */
  static async getCachedPlaylistData(userId: string): Promise<any[] | null> {
    const key = generateCacheKey(CacheKeys.PLAYLIST_DATA, userId);
    return await this.get<any[]>(key);
  }

  /**
   * Cache playlist tracks
   */
  static async cachePlaylistTracks(playlistId: string, tracks: any): Promise<void> {
    const key = generateCacheKey(CacheKeys.PLAYLIST_TRACKS, playlistId);
    await this.set(key, tracks, CacheTTL.PLAYLIST_DATA);
  }

  /**
   * Get cached playlist tracks
   */
  static async getCachedPlaylistTracks(playlistId: string): Promise<any | null> {
    const key = generateCacheKey(CacheKeys.PLAYLIST_TRACKS, playlistId);
    return await this.get<any>(key);
  }

  /**
   * Invalidate playlist cache for user
   */
  static async invalidateUserPlaylists(userId: string): Promise<void> {
    const key = generateCacheKey(CacheKeys.PLAYLIST_DATA, userId);
    await this.del(key);
  }

  /**
   * Invalidate specific playlist tracks cache
   */
  static async invalidatePlaylistTracks(playlistId: string): Promise<void> {
    const key = generateCacheKey(CacheKeys.PLAYLIST_TRACKS, playlistId);
    await this.del(key);
  }

  /**
   * Cache user profile data
   */
  static async cacheUserProfile(userId: string, profile: any): Promise<void> {
    const key = generateCacheKey(CacheKeys.USER_PROFILE, userId);
    await this.set(key, profile, CacheTTL.LONG);
  }

  /**
   * Get cached user profile
   */
  static async getCachedUserProfile(userId: string): Promise<any | null> {
    const key = generateCacheKey(CacheKeys.USER_PROFILE, userId);
    return await this.get<any>(key);
  }

  /**
   * Cache user connections
   */
  static async cacheUserConnections(userId: string, connections: any): Promise<void> {
    const key = generateCacheKey(CacheKeys.USER_CONNECTIONS, userId);
    await this.set(key, connections, CacheTTL.LONG);
  }

  /**
   * Get cached user connections
   */
  static async getCachedUserConnections(userId: string): Promise<any | null> {
    const key = generateCacheKey(CacheKeys.USER_CONNECTIONS, userId);
    return await this.get<any>(key);
  }

  /**
   * Invalidate user-related caches
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    await Promise.all([
      this.del(generateCacheKey(CacheKeys.USER_PROFILE, userId)),
      this.del(generateCacheKey(CacheKeys.USER_CONNECTIONS, userId)),
      this.delPattern(generateCacheKey(CacheKeys.USER_FAVORITES, userId, '*')),
      this.del(generateCacheKey(CacheKeys.PLAYLIST_DATA, userId))
    ]);
  }

  /**
   * Get cache statistics (useful for monitoring)
   */
  static async getCacheStats(): Promise<{ keys: number; memory: string } | null> {
    try {
      const info = await redisClient.info('memory');
      const dbsize = await redisClient.dbsize();
      
      const memoryMatch = info.match(/used_memory_human:(.+)\r/);
      const memory = memoryMatch ? memoryMatch[1] : 'unknown';
      
      return {
        keys: dbsize,
        memory: memory
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }
}

export default CacheService;