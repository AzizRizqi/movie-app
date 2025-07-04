import { useEffect, useState } from 'react';
import { View, Text, ImageBackground, ScrollView, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import omdbApi from '../../../services/omdbApi';
import { MovieDetails } from '../../../types/movie';

const MovieDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMovieDetails(id);
    }
  }, [id]);

  const loadMovieDetails = async (movieId: string) => {
    setLoading(true);
    try {
      const data = await omdbApi.getMovieDetails(movieId);
      setMovie(data);
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating: string): string => {
    const numRating = parseFloat(rating);
    const stars = Math.round(numRating / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading movie details...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Movie not found</Text>
        <Button title="Back to Home" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
          uri: movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/800x600/667eea/ffffff?text=No+Image',
        }}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.subTitle}>
            {movie.Runtime} • {movie.Genre}
          </Text>
          <Text style={styles.rating}>
            {getRatingStars(movie.imdbRating)} ({movie.imdbRating}/10)
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Information</Text>
        <Text style={styles.text}><Text style={styles.label}>Director:</Text> {movie.Director}</Text>
        <Text style={styles.text}><Text style={styles.label}>Writer:</Text> {movie.Writer}</Text>
        <Text style={styles.text}><Text style={styles.label}>Actors:</Text> {movie.Actors}</Text>
        <Text style={styles.text}><Text style={styles.label}>Language:</Text> {movie.Language}</Text>
        <Text style={styles.text}><Text style={styles.label}>Country:</Text> {movie.Country}</Text>
        <Text style={styles.text}><Text style={styles.label}>Rating:</Text> {movie.Rated}</Text>

        {movie.Awards && movie.Awards !== 'N/A' && (
          <>
            <Text style={styles.sectionTitle}>Awards</Text>
            <Text style={styles.text}>{movie.Awards}</Text>
          </>
        )}

        {movie.Plot && (
          <>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.text}>{movie.Plot}</Text>
          </>
        )}

        <View style={{ marginTop: 20 }}>
          <Button title="← Back" onPress={() => router.back()} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#667eea',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 20,
  },
  hero: {
    height: 400,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitle: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 4,
  },
  rating: {
    fontSize: 18,
    color: '#ffeb3b',
    marginTop: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default MovieDetail;
