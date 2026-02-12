import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Libro } from '../entities/libro.entity';
import { LibroService } from '../services/libro.service';
import { Autor } from '../../autores/entities/autor.entity';
import { AutorService } from '../../autores/services/autor.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { LibrosFormModalComponent } from './libros-form-modal/libros-form-modal.component';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzIconModule,
  ],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css',
})
export class LibrosComponent implements OnInit {
  libros: Libro[] = [];
  dataFiltrada: Libro[] = [];
  autores: Autor[] = [];
  searchGlobal = '';
  pagesize = 10;
  private modalService = inject(NzModalService);

  constructor(
    private fb: NonNullableFormBuilder,
    private libroService: LibroService,
    private autorService: AutorService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarAutores();
    this.cargarLibros();
  }

  filtrarTabla(): void {
    if (!this.searchGlobal.trim()) {
      this.dataFiltrada = [...this.libros];
      return;
    }

    const search = this.searchGlobal.toLowerCase();
    this.dataFiltrada = this.libros.filter((libro) =>
      libro.title.toLowerCase().includes(search) ||
      libro.genre.toLowerCase().includes(search) ||
      this.getAutorNombre(libro).toLowerCase().includes(search)
    );
  }

  private cargarAutores(): void {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data ?? [];
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

  private cargarLibros(): void {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data ?? [];
        this.filtrarTabla();
      },
      error: () => {
        this.libros = [];
        this.dataFiltrada = [];
      },
    });
  }

  openCreateModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear nuevo libro',
      nzContent: LibrosFormModalComponent,
      nzFooter: null,
      nzWidth: 600,
    });

    const instance = modal.getContentComponent() as LibrosFormModalComponent;
    if (instance) {
      instance.autores = this.autores;
      instance.onSuccess = (libroCreado: Libro) => {
        this.libros = [...this.libros, libroCreado];
        this.filtrarTabla();
        this.notification.createNotification(
          'success',
          'Libro registrado',
          'El libro se ha registrado correctamente.'
        );
      };
    }
  }

  getAutorNombre(libro: Libro): string {
    if (libro.authorName) {
      return libro.authorName;
    }

    const autor = this.autores.find((a) => a.id === libro.authorId);
    return autor ? autor.fullName : 'N/D';
  }
}

