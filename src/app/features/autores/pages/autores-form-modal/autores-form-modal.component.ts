import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Autor } from '../../entities/autor.entity';
import { AutorService } from '../../services/autor.service';
import { NotificationService } from '../../../../core/services/notifications/notification.service';
import { CreateAutorDto } from '../../dtos/create-autor.dto';

function maxDateValidator(): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today ? null : { maxDate: true };
  };
}

@Component({
  selector: 'app-autores-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzButtonModule,
  ],
  template: `
    <form nz-form [formGroup]="autorForm" class="autor-form">
      <nz-form-item>
        <nz-form-label nzRequired>Nombre completo *</nz-form-label>
        <nz-form-control nzErrorTip="El nombre es obligatorio (máximo 50 caracteres).">
          <input
            nz-input
            formControlName="nombreCompleto"
            placeholder="Nombre completo del autor"
            maxlength="50"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Fecha de nacimiento *</nz-form-label>
        <nz-form-control 
          nzErrorTip="La fecha de nacimiento es obligatoria y no puede ser mayor que hoy."
        >
          <nz-date-picker
            formControlName="fechaNacimiento"
            nzFormat="dd/MM/yyyy"
            nzPlaceHolder="Selecciona una fecha"
            [nzDisabledDate]="disabledDate"
          ></nz-date-picker>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Ciudad de procedencia *</nz-form-label>
        <nz-form-control nzErrorTip="La ciudad de procedencia es obligatoria (máximo 50 caracteres).">
          <input
            nz-input
            formControlName="ciudadProcedencia"
            placeholder="Ciudad de procedencia"
            maxlength="50"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Correo electrónico *</nz-form-label>
        <nz-form-control nzErrorTip="Ingresa un correo electrónico válido (máximo 50 caracteres).">
          <input
            nz-input
            formControlName="correoElectronico"
            placeholder="correo@ejemplo.com"
            maxlength="50"
          />
        </nz-form-control>
      </nz-form-item>

      <div class="form-actions">
        <button
          nz-button
          nzType="primary"
          (click)="submitForm()"
          [disabled]="autorForm.invalid || loading"
        >
          {{ loading ? 'Guardando...' : 'Guardar autor' }}
        </button>
        <button nz-button (click)="cancel()">Cancelar</button>
      </div>
    </form>
  `,
  styles: `
    .autor-form {
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
export class AutoresFormModalComponent implements OnInit {
  @Input() onSuccess?: (autor: Autor) => void;

  autorForm!: FormGroup;
  loading = false;
  private modalRef = inject(NzModalRef);
  private fb = inject(NonNullableFormBuilder);
  private autorService = inject(AutorService);
  private notification = inject(NotificationService);

  disabledDate = (current: Date): boolean => {
    return current > new Date();
  };

  ngOnInit(): void {
    this.setupForm();
  }

  private setupForm(): void {
    this.autorForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(50)]],
      fechaNacimiento: [null, [Validators.required, maxDateValidator()]],
      ciudadProcedencia: ['', [Validators.required, Validators.maxLength(50)]],
      correoElectronico: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
    });
  }

  submitForm(): void {
    if (this.autorForm.invalid) {
      Object.values(this.autorForm.controls).forEach((control) => {
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
    const birthDateControl = this.autorForm.value.fechaNacimiento as
      | Date
      | string
      | null;

    const payload: CreateAutorDto = {
      fullName: this.autorForm.value.nombreCompleto,
      birthDate:
        birthDateControl instanceof Date
          ? birthDateControl.toISOString()
          : (birthDateControl as string),
      cityOfOrigin: this.autorForm.value.ciudadProcedencia,
      email: this.autorForm.value.correoElectronico,
    };

    this.autorService.createAutor(payload).subscribe({
      next: (autorCreado) => {
        this.loading = false;
        this.onSuccess?.(autorCreado);
        this.modalRef.close();
      },
      error: (error) => {
        this.loading = false;
        const message = error?.error?.detail || 'No fue posible registrar el autor. Intenta nuevamente.';

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
