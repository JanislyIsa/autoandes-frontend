import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { rutaInterna } from '../../core/auth/session-utils';
import { errorApi } from '../../core/utils/api-error';
import { FieldErrorComponent } from '../../shared/components/field-error';
import { IconComponent } from '../../shared/components/icon';
@Component({ standalone: true, imports: [ReactiveFormsModule, FieldErrorComponent, IconComponent], templateUrl: './login.html' })
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly ocupado = signal(false);
  readonly error = signal('');
  readonly verClave = signal(false);
  readonly motivo = this.route.snapshot.queryParamMap.get('motivo');
  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(30)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
  });
  ingresar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.ocupado()) return;
    this.ocupado.set(true); this.error.set('');
    const r = this.form.getRawValue();
    this.auth.login(r.username.trim(), r.password).subscribe({
      next: () => void this.router.navigateByUrl(rutaInterna(this.route.snapshot.queryParamMap.get('returnUrl'))),
      error: e => { this.error.set(errorApi(e).mensaje); this.ocupado.set(false); },
    });
  }
}
