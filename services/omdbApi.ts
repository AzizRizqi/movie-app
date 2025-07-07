import axios from 'axios';
import { Movie, MovieDetail } from '../types/movie';

const API_KEY = 'b45dad4f';
const BASE_URL = 'http://www.omdbapi.com/';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
    if (response.data.Response === 'True') {
      return response.data.Search || [];
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetail = async (imdbID: string): Promise<MovieDetail | null> => {
  try {
    const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    return null;
  }
};