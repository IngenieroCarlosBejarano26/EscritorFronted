import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../entities/libro.entity';
import { CreateLibroDto } from '../dtos/create-libro.dto';
import { ILibroService } from '../interfaces/libro-service.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibroService implements ILibroService {
  private readonly apiUrl = `${environment.apiBaseUrl}/Books`;

  constructor(private http: HttpClient) {}

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  createLibro(payload: CreateLibroDto): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, payload);
  }
}

