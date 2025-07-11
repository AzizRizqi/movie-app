// app/(tabs)/movie/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MovieDetail, Rating } from '../../../types/movie';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        const API_KEY = 'b45dad4f';
        const res = await axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);

        if (res.data.Response === 'True') {
          setMovie(res.data);
        } else {
          console.warn('Movie not found or API error:', res.data.Error);
          setMovie(null);
        }
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie Not Found or Error Fetching Data</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  const otherRatings = movie.Ratings?.filter(
    (rating: Rating) => rating.Source !== 'Internet Movie Database'
  ) || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600'
          }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Start: Perubahan untuk tombol Play */}
       
        {/* End: Perubahan untuk tombol Play */}

      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.Title}</Text>

        <View style={styles.metadata}>
          <Text style={styles.metadataText}>{movie.Year}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metadataText}>{movie.Runtime}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metadataText}>{movie.Type === 'movie' ? 'Movie' : movie.Type}</Text>
        </View>

        <View style={styles.rating}>
          <Ionicons name="star" size={16} color="#FCD34D" />
          <Text style={styles.ratingText}>{movie.imdbRating}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Released:</Text>
            <Text style={styles.infoValue}>{movie.Released}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Director:</Text>
            <Text style={styles.infoValue}>{movie.Director}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Writer:</Text>
            <Text style={styles.infoValue}>{movie.Writer}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Actors:</Text>
            <Text style={styles.infoValue}>{movie.Actors}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Language:</Text>
            <Text style={styles.infoValue}>{movie.Language}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country:</Text>
            <Text style={styles.infoValue}>{movie.Country}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Awards:</Text>
            <Text style={styles.infoValue}>{movie.Awards}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rated:</Text>
            <Text style={styles.infoValue}>{movie.Rated}</Text>
          </View>

          {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Box Office:</Text>
              <Text style={styles.infoValue}>{movie.BoxOffice}</Text>
            </View>
          )}
        </View>

        <View style={styles.synopsisSection}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{movie.Plot}</Text>
        </View>

        {otherRatings.length > 0 && (
          <View style={styles.otherRatingsSection}>
            <Text style={styles.sectionTitle}>Other Ratings</Text>
            {otherRatings.map((rating, index) => (
              <View key={index} style={styles.ratingItem}>
                <Text style={styles.ratingSource}>{rating.Source}:</Text>
                <Text style={styles.ratingValue}>{rating.Value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  // Start: Perubahan style untuk tombol Play
  playButtonInner: {
    // Tidak perlu style khusus, karena LinearGradient akan menentukan ukuran dan bentuknya
    // Tombol di dalam gradien akan secara otomatis mengisi
  },
  // End: Perubahan style untuk tombol Play
  content: {
    padding: 20,
    marginTop: -80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metadataText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  dot: {
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    color: '#FCD34D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    width: 90,
    fontWeight: '500',
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  synopsisSection: {
    marginBottom: 24,
  },
  synopsis: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
  },
  otherRatingsSection: {
    marginBottom: 24,
  },
  ratingItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  ratingSource: {
    color: '#9CA3AF',
    fontSize: 14,
    width: 120,
    fontWeight: '500',
  },
  ratingValue: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
});