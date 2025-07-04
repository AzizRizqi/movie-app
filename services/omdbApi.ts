import axios, { AxiosResponse } from 'axios';
import { Movie, MovieDetails, OMDbResponse } from '../types/movie';

const API_KEY = 'b45dad4f';
const BASE_URL = 'http://www.omdbapi.com/';

class OMDbAPI {
  async searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    try {
      const response: AxiosResponse<OMDbResponse> = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          s: query,
          page,
          type: 'movie',
        },
        timeout: 10000,
      });

      if (response.data.Response === 'True') {
        return response.data.Search || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  async getMovieDetails(imdbID: string): Promise<MovieDetails | null> {
    try {
      const response: AxiosResponse<MovieDetails> = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          i: imdbID,
          plot: 'full',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
}

export default new OMDbAPI();
