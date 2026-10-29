import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { debeCerrarSesion } from '../auth/session-utils';
import { environment } from '../../../environments/environment';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && debeCerrarSesion(error.status, req.url, environment.apiUrl)) {
      auth.cerrar('invalida', router.url);
    }
    return throwError(() => error);
  }));
};
