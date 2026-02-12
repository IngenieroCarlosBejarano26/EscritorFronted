import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Libro } from '../../entities/libro.entity';
import { Autor } from '../../../autores/entities/autor.entity';
import { Genero } from '../../../generos/entities/genero.entity';
import { LibroService } from '../../services/libro.service';
import { GeneroService } from '../../../generos/services/genero.service';
import { NotificationService } from '../../../../core/services/notifications/notification.service';
import { CreateLibroDto } from '../../dtos/create-libro.dto';

@Component({
  selector: 'app-libros-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
  ],
  template: `
    <form nz-form [formGroup]="libroForm" class="libro-form">
      <nz-form-item>
        <nz-form-label nzRequired>Título *</nz-form-label>
        <nz-form-control nzErrorTip="El título es obligatorio (máximo 50 caracteres).">
          <input
            nz-input
            formControlName="titulo"
            placeholder="Título del libro"
            maxlength="50"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Año *</nz-form-label>
        <nz-form-control nzErrorTip="Ingresa un año válido.">
          <input
            nz-input
            formControlName="anio"
            type="number"
            placeholder="Año de publicación"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Género *</nz-form-label>
        <nz-form-control nzErrorTip="El género es obligatorio.">
          <nz-select
            formControlName="generoId"
            nzPlaceHolder="Selecciona un género"
          >
            <nz-option
              *ngFor="let genero of generos"
              [nzLabel]="genero.name"
              [nzValue]="genero.id"
            ></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Número de páginas *</nz-form-label>
        <nz-form-control nzErrorTip="Ingresa un número válido.">
          <input
            nz-input
            formControlName="numeroPaginas"
            type="number"
            min="1"
            placeholder="Número de páginas"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Autor *</nz-form-label>
        <nz-form-control nzErrorTip="Debes seleccionar un autor.">
          <nz-select
            formControlName="autorId"
            nzPlaceHolder="Selecciona un autor"
          >
            <nz-option
              *ngFor="let autor of autores"
              [nzLabel]="autor.fullName"
              [nzValue]="autor.id"
            ></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <div class="form-actions">
        <button
          nz-button
          nzType="primary"
          (click)="submitForm()"
          [disabled]="libroForm.invalid || loading"
        >
          {{ loading ? 'Guardando...' : 'Guardar libro' }}
        </button>
        <button nz-button (click)="cancel()">Cancelar</button>
      </div>
    </form>
  `,
  styles: `
    .libro-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  `,
})
export class LibrosFormModalComponent implements OnInit {
  @Input() autores: Autor[] = [];
  @Input() onSuccess?: (libro: Libro) => void;

  libroForm!: FormGroup;
  loading = false;
  generos: Genero[] = [];

  private modalRef = inject(NzModalRef);
  private fb = inject(NonNullableFormBuilder);
  private libroService = inject(LibroService);
  private generoService = inject(GeneroService);
  private notification = inject(NotificationService);

  ngOnInit(): void {
    this.setupForm();
    this.loadGeneros();
  }

  private loadGeneros(): void {
    this.generoService.getGeneros().subscribe({
      next: (generos) => {
        this.generos = generos;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.notification.createNotification(
          'error',
          'Error',
          'No fue posible cargar los géneros.'
        );
      },
    });
  }

  private setupForm(): void {
    const currentYear = new Date().getFullYear();

    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      anio: [
        null,
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(currentYear),
        ],
      ],
      generoId: [null, [Validators.required]],
      numeroPaginas: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
      autorId: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.libroForm.invalid) {
      Object.values(this.libroForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });

      this.notification.createNotification(
        'error',
        'Error de validación',
        'Por favor completa todos los campos obligatorios.'
      );
      return;
    }

    this.loading = true;

    const autorId = this.libroForm.value.autorId;
    const autor = this.autores.find((a) => a.id === autorId);

    if (!autor) {
      this.notification.createNotification(
        'error',
        'Autor no registrado',
        'El autor no está registrado.'
      );
      return;
    }

    this.loading = true;

    const payload: CreateLibroDto = {
      title: this.libroForm.value.titulo,
      year: Number(this.libroForm.value.anio),
      genreId: this.libroForm.value.generoId,
      numberOfPages: Number(this.libroForm.value.numeroPaginas),
      authorId: autorId,
    };

    this.libroService.createLibro(payload).subscribe({
      next: (libroCreado) => {
        this.loading = false;
        this.onSuccess?.(libroCreado);
        this.modalRef.close();
      },
      error: (error) => {
        this.loading = false;
        const message = error?.error?.detail || 'No fue posible registrar el libro. Intenta nuevamente.';

        this.notification.createNotification(
          'error',
          'Error',
          message
        );
      },
    });
  }

  cancel(): void {
    this.modalRef.close();
  }
}
