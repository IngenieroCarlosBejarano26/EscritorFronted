import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ModalService } from '../../../core/services/modals/modal.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    CommonModule,
    NzToolTipModule,
    NzDividerModule,
    NzAvatarModule,
    NzModalModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  confirmModal?: NzModalRef;

  constructor(private modal: ModalService, private auth: AuthService) {}
  isCollapsed = false;
  menuItems = [
    {
      label: 'Autores',
      route: '/autores',
      icon: 'user',
    },
    {
      label: 'Libros',
      route: '/libros',
      icon: 'book',
    },
  ];

  userInfo = {
    name: 'Carlos Daniel',
    lastname: 'Bejarano Preciado',
    role: 'Administrador',
  };

  ngOnInit(): void {
    this.auth.generateTokenFromApp().subscribe({
      next: () => console.log('Token generado automáticamente'),
      error: (err) => console.error('No se pudo generar token automático', err),
    });
  }

  get obtenerPrefijo() {
    const inicialPrimera = this.userInfo.name[0].charAt(0).toUpperCase();
    const inicialSegunda = this.userInfo.lastname[0].charAt(0).toUpperCase();
    const resultado = `${inicialPrimera}${inicialSegunda}`;
    return resultado;
  }

  get nombreCompleto() {
    const resultado = `${this.userInfo.name} ${this.userInfo.lastname}`;
    return resultado;
  }
}
