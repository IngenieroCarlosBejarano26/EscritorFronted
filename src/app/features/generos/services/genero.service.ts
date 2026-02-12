import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genero } from '../entities/genero.entity';
import { CreateGeneroDto } from '../dtos/create-genero.dto';
import { IGeneroService } from '../interfaces/genero-service.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneroService implements IGeneroService {
  private readonly apiUrl = `${environment.apiBaseUrl}/Genres`;

  constructor(private http: HttpClient) {}

  getGeneros(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.apiUrl);
  }

  createGenero(payload: CreateGeneroDto): Observable<Genero> {
    return this.http.post<Genero>(this.apiUrl, payload);
  }
}
