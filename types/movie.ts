// types/movie.ts

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;   // Tambahan baru
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];  // Tambahan baru (array of Rating objects)
  Metascore: string;  // Tambahan baru
  imdbRating: string;
  imdbVotes: string;  // Tambahan baru
  imdbID: string;
  Type: string;
  DVD: string;        // Tambahan baru
  BoxOffice: string;  // Tambahan baru
  Production: string; // Tambahan baru
  Website: string;    // Tambahan baru
  Response: string;
}

export interface OMDbResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}
