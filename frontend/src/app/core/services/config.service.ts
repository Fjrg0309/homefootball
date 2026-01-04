import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = {
    apiUrl: environment.apiUrl
  };

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuración desde el archivo JSON (en producción)
   * En desarrollo usa environment.ts directamente
   */
  async loadConfig(): Promise<void> {
    if (environment.production) {
      try {
        const config = await firstValueFrom(
          this.http.get<AppConfig>('/assets/config.json')
        );
        if (config?.apiUrl) {
          this.config = config;
          console.log('Config loaded from config.json:', this.config.apiUrl);
        }
      } catch (error) {
        console.warn('Could not load config.json, using default:', this.config.apiUrl);
      }
    }
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}
