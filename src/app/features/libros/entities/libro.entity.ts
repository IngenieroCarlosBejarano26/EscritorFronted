export interface Libro {
  id: string;
  title: string;
  year: number;
  genre: string;
  numberOfPages: number;
  authorId: string;
  authorName?: string;
  createdAt: string;
}

