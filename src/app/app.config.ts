import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
export const appConfig: ApplicationConfig = { providers: [
  provideBrowserGlobalErrorListeners(), { provide: LOCALE_ID, useValue: 'es-PE' },
  provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
  provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
] };
