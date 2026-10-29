import { Component, input } from '@angular/core';
@Component({ selector: 'app-icon', standalone: true, host: { 'aria-hidden': 'true' }, template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="paths[name()] || paths[\'grid\']" /></svg>' })
export class IconComponent {
  readonly name = input('grid');
  readonly paths: Record<string, string> = {
    wrench: 'M14.5 6.5a5 5 0 0 0-6.6 6.6L3 18a2.1 2.1 0 0 0 3 3l4.9-4.9a5 5 0 0 0 6.6-6.6l-3 3-3-3 3-3Z',
    car: 'm4 9 2-5h12l2 5M3 9h18v9H3V9Zm3 9v3m12-3v3M6 13h2m8 0h2',
    clipboard: 'M9 4H5v17h14V4h-4M9 2h6v5H9V2Zm-1 9h8m-8 5h5',
    chart: 'M4 3v18h17M8 16v-5m5 5V7m5 9V4',
    search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    plus: 'M12 5v14M5 12h14',
    back: 'm12 5-7 7 7 7M5 12h15',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    close: 'm6 6 12 12M18 6 6 18',
    check: 'm5 12 4 4L19 6',
    shield: 'm12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Zm-4 9 3 3 5-6',
    logout: 'M9 4H4v16h5m6-12 4 4-4 4M9 12h10',
    edit: 'm15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z',
    trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
    clock: 'M12 8v5l3 2M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    menu: 'M4 6h16M4 12h16M4 18h16',
    chevron: 'm9 5 7 7-7 7',
    user: 'M20 21v-2a7 7 0 0 0-14 0v2M17 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    alert: 'M12 8v5m0 4h.01M10 3 1 20h22L14 3h-4Z',
    power: 'M12 2v10M6 5a9 9 0 1 0 12 0',
    grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
  };
}
