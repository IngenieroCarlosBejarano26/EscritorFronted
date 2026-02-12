import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Autor } from '../entities/autor.entity';
import { AutorService } from '../services/autor.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { CreateAutorDto } from '../dtos/create-autor.dto';
import { AutoresFormModalComponent } from './autores-form-modal/autores-form-modal.component';

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzIconModule,
  ],
  templateUrl: './autores.component.html',
  styleUrl: './autores.component.css',
})
export class AutoresComponent implements OnInit {
  autores: Autor[] = [];
  dataFiltrada: Autor[] = [];
  searchGlobal = '';
  pagesize = 10;
  private modalService = inject(NzModalService);

  constructor(
    private fb: NonNullableFormBuilder,
    private autorService: AutorService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarAutores();
  }

  filtrarTabla(): void {
    if (!this.searchGlobal.trim()) {
      this.dataFiltrada = [...this.autores];
      return;
    }

    const search = this.searchGlobal.toLowerCase();
    this.dataFiltrada = this.autores.filter((autor) =>
      autor.fullName.toLowerCase().includes(search) ||
      autor.email.toLowerCase().includes(search) ||
      autor.cityOfOrigin.toLowerCase().includes(search)
    );
  }

  private cargarAutores(): void {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data ?? [];
        this.filtrarTabla();
      },
      error: () => {
        this.notification.createNotification(
          'error',
          'Error al cargar autores',
          'No fue posible obtener la lista de autores.'
        );
      },
    });
  }

  openCreateModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear nuevo autor',
      nzContent: AutoresFormModalComponent,
      nzFooter: null,
      nzWidth: 600,
    });

    const instance = modal.getContentComponent() as AutoresFormModalComponent;
    if (instance) {
      instance.onSuccess = (autorCreado: Autor) => {
        this.autores = [...this.autores, autorCreado];
        this.filtrarTabla();
        this.notification.createNotification(
          'success',
          'Autor registrado',
          'El autor se ha registrado correctamente.'
        );
      };
    }
  }
}

