import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Permiso } from '../../core/models/api.models';
@Directive({ selector: '[siPermiso]', standalone: true })
export class SiPermisoDirective {
  readonly siPermiso = input.required<Permiso>();
  private readonly auth = inject(AuthService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private visible = false;
  constructor() {
    effect(() => {
      const permitido = this.auth.tiene(this.siPermiso());
      if (permitido && !this.visible) { this.container.createEmbeddedView(this.template); this.visible = true; }
      else if (!permitido && this.visible) { this.container.clear(); this.visible = false; }
    });
  }
}
