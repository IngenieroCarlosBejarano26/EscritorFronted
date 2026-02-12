import { Observable } from 'rxjs';
import { Autor } from '../entities/autor.entity';
import { CreateAutorDto } from '../dtos/create-autor.dto';

export interface IAutorService {
  getAutores(): Observable<Autor[]>;
  createAutor(payload: CreateAutorDto): Observable<Autor>;
}

