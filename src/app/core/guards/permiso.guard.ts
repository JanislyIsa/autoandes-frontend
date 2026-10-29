import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Permiso } from '../models/api.models';
export const permisoGuard: CanActivateFn = (route) => inject(AuthService).tiene(route.data['permiso'] as Permiso)
  ? true : inject(Router).createUrlTree(['/acceso-denegado']);
