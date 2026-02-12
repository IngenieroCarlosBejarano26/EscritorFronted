import { Observable } from 'rxjs';
import { Genero } from '../entities/genero.entity';
import { CreateGeneroDto } from '../dtos/create-genero.dto';

export interface IGeneroService {
  getGeneros(): Observable<Genero[]>;
  createGenero(payload: CreateGeneroDto): Observable<Genero>;
}
