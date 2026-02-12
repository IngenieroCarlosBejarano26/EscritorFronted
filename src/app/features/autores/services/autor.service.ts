import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from '../entities/autor.entity';
import { CreateAutorDto } from '../dtos/create-autor.dto';
import { IAutorService } from '../interfaces/autor-service.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutorService implements IAutorService {
  private readonly apiUrl = `${environment.apiBaseUrl}/Authors`;

  constructor(private http: HttpClient) {}

  getAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  createAutor(payload: CreateAutorDto): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, payload);
  }
}

