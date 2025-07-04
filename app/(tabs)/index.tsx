import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Movie } from '../../types/movie';
import omdbApi from '../../services/omdbApi';
import { MovieCard } from '../../components/ui/MovieCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentSearch, setCurrentSearch] = useState('iron');

  useEffect(() => {
    loadDefaultMovies();
  }, []);

  const loadDefaultMovies = async () => {
    setLoading(true);
    try {
      const results = await omdbApi.searchMovies('iron');
      setMovies(results);
      setCurrentSearch('iron');
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await omdbApi.searchMovies(searchQuery);
      setMovies(results);
      setCurrentSearch(searchQuery);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Movie App</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Movies, Shows etc"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <Text style={styles.categoryTitle}>Categories</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => <MovieCard movie={item} />}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      ) : (
        <View style={styles.noResult}>
          <Text style={styles.noResultText}>Movie Not Found</Text>
          <Text style={styles.noResultSubtext}>
            Sorry, we couldn't find any movies matching your search.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: '#fff',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  noResult: {
    marginTop: 40,
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  noResultSubtext: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default Home;
