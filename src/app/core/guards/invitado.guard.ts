import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
export const invitadoGuard: CanActivateFn = () => inject(AuthService).token() ? inject(Router).createUrlTree(['/servicios']) : true;
