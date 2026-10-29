import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { esUrlApi } from '../auth/session-utils';
import { environment } from '../../../environments/environment';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!esUrlApi(req.url, environment.apiUrl)) return next(req);
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : req);
};
