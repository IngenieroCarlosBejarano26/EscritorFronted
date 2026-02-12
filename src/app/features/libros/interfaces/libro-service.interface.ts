import { Observable } from 'rxjs';
import { Libro } from '../entities/libro.entity';
import { CreateLibroDto } from '../dtos/create-libro.dto';

export interface ILibroService {
  getLibros(): Observable<Libro[]>;
  createLibro(payload: CreateLibroDto): Observable<Libro>;
}

