import { Injectable } from '@angular/core';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Servicio de caché persistente usando localStorage
 * Guarda peticiones de API para navegación offline
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_PREFIX = 'hf_cache_';
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutos por defecto
  private readonly MAX_CACHE_SIZE = 50; // Máximo número de entradas en caché

  constructor() {
    console.log('💾 CacheService initialized - Persistent cache enabled');
    this.cleanExpiredEntries();
  }

  /**
   * Guarda datos en caché con TTL personalizable
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };
      
      const cacheKey = this.CACHE_PREFIX + key;
      localStorage.setItem(cacheKey, JSON.stringify(entry));
      
      // Verificar tamaño de caché y limpiar si es necesario
      this.enforceMaxSize();
      
      console.log(`💾 Cache SET: ${key.substring(0, 40)}...`);
    } catch (error) {
      console.warn('❌ Error saving to cache:', error);
      // Si falla (quota exceeded), limpiar caché antigua
      this.clearOldestEntries(10);
    }
  }

  /**
   * Obtiene datos de caché si existen y no han expirado
   */
  get<T>(key: string): T | null {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const stored = localStorage.getItem(cacheKey);
      
      if (!stored) {
        console.log(`📭 Cache MISS: ${key.substring(0, 40)}...`);
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(stored);
      
      // Verificar si ha expirado
      if (Date.now() > entry.expiresAt) {
        console.log(`⏰ Cache EXPIRED: ${key.substring(0, 40)}...`);
        localStorage.removeItem(cacheKey);
        return null;
      }

      console.log(`✅ Cache HIT: ${key.substring(0, 40)}...`);
      return entry.data;
    } catch (error) {
      console.warn('❌ Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Verifica si existe una entrada válida en caché
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Elimina una entrada específica de caché
   */
  remove(key: string): void {
    const cacheKey = this.CACHE_PREFIX + key;
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cache REMOVED: ${key.substring(0, 40)}...`);
  }

  /**
   * Limpia toda la caché de la aplicación
   */
  clear(): void {
    const keys = this.getAllCacheKeys();
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`🧹 Cache CLEARED: ${keys.length} entries removed`);
  }

  /**
   * Limpia entradas expiradas
   */
  cleanExpiredEntries(): void {
    const keys = this.getAllCacheKeys();
    let cleaned = 0;
    
    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const entry: CacheEntry<any> = JSON.parse(stored);
          if (Date.now() > entry.expiresAt) {
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      } catch {
        localStorage.removeItem(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getStats(): { entries: number; totalSize: number; oldestEntry: number | null } {
    const keys = this.getAllCacheKeys();
    let totalSize = 0;
    let oldestTimestamp: number | null = null;

    keys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        totalSize += stored.length;
        try {
          const entry: CacheEntry<any> = JSON.parse(stored);
          if (!oldestTimestamp || entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
          }
        } catch {}
      }
    });

    return {
      entries: keys.length,
      totalSize,
      oldestEntry: oldestTimestamp
    };
  }

  /**
   * Genera una clave de caché para peticiones HTTP
   */
  generateKey(url: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : '';
    // Crear hash simple para la clave
    return btoa(url + paramStr).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private getAllCacheKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.CACHE_PREFIX)) {
        keys.push(key);
      }
    }
    return keys;
  }

  private enforceMaxSize(): void {
    const keys = this.getAllCacheKeys();
    if (keys.length > this.MAX_CACHE_SIZE) {
      this.clearOldestEntries(keys.length - this.MAX_CACHE_SIZE + 5);
    }
  }

  private clearOldestEntries(count: number): void {
    const entries: { key: string; timestamp: number }[] = [];

    this.getAllCacheKeys().forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const entry: CacheEntry<any> = JSON.parse(stored);
          entries.push({ key, timestamp: entry.timestamp });
        }
      } catch {
        // Si no se puede parsear, eliminarlo
        localStorage.removeItem(key);
      }
    });

    // Ordenar por timestamp (más antiguos primero)
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Eliminar los más antiguos
    entries.slice(0, count).forEach(e => {
      localStorage.removeItem(e.key);
    });

    console.log(`🧹 Cleared ${count} oldest cache entries`);
  }
}
