import { StyleSheet, View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import PopularMoviesCarousel from '../../../components/ui/PopularMoviesCarousel';
import { searchMovies } from '../../../services/omdbApi';
import { Movie } from '../../../types/movie';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoadingPopular(true);
      try {
        const response = await searchMovies('Popular'); // Mengubah keyword untuk contoh populer
        setPopularMovies(response);
      } catch (error) {
        console.error("Gagal mengambil film populer:", error);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopular();
  }, []);
  

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setLoadingSearch(true);
    setSearchError(null);
    try {
      const results = await searchMovies(searchQuery);
      if (results.length > 0) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
        setSearchError(`Tidak ada film ditemukan untuk "${searchQuery}". Coba kata kunci lain.`);
      }
    } catch (error) {
      console.error("Gagal mengambil hasil pencarian:", error);
      setSearchError('Terjadi kesalahan saat mencari. Mohon coba lagi.');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchDetailPress = (imdbID: string) => {
    router.push(`/movie/${imdbID}`);
  };

  return (
    <LinearGradient
      colors={['#111827', '#1E293B', '#3730A3']}
      style={styles.fullScreenBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Header Aplikasi */}
          <View style={styles.appHeader}>
            <Text style={styles.appTitle}>Movie App</Text>
          </View>

          {/* Search Bar Utama (seperti di gambar) */}
          <View style={styles.mainSearchBarContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.mainSearchIcon} />
            <TextInput
              style={styles.mainSearchInput}
              placeholder="Search Movies, Shows, etc"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            
          </View>

          {/* Carousel Film Populer */}
          <PopularMoviesCarousel movies={popularMovies} loading={loadingPopular} />

          {/* Teks "Silahkan cari film yang Anda inginkan!" */}
          <Text style={styles.searchPromptBelowCarousel}>Silahkan cari film yang Anda inginkan!</Text>

          {loadingSearch && (
            <View style={styles.loadingSearchContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingSearchText}>Mencari film...</Text>
            </View>
          )}

          {searchError && (
            <View style={styles.searchErrorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="red" />
              <Text style={styles.searchErrorText}>{searchError}</Text>
            </View>
          )}

          {/* Tampilkan Hasil Pencarian (dengan UI baru) */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsSection}>
              <View style={styles.searchResultsHeader}>
              </View>
              {searchResults.map((movie) => (
                <TouchableOpacity
                  key={movie.imdbID}
                  style={styles.searchResultCardWrapper}
                  onPress={() => handleSearchDetailPress(movie.imdbID)} // Membuat seluruh card bisa diklik
                >
                  <LinearGradient
                    colors={['#8B0000', '#4B0082']} // Warna gradien merah ke ungu gelap
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.searchResultGradient}
                  >
                    <View style={styles.searchResultContent}>
                      <Image
                        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/100x150?text=No+Image' }}
                        style={styles.searchResultPoster}
                        resizeMode="cover"
                      />
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultTypeText}>{movie.Type}</Text>
                        <Text style={styles.searchResultTitleText} numberOfLines={2}>
                          {movie.Title}
                        </Text>
                        <TouchableOpacity
                          style={styles.searchResultDetailButton}
                          onPress={() => handleSearchDetailPress(movie.imdbID)}
                        >
                          <Text style={styles.searchResultDetailButtonText}>Detail</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.searchResultYear}>{movie.Year}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // --- Header Aplikasi ---
  appHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  // --- Search Bar Utama (di atas Carousel) ---
  mainSearchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#374151', // Warna latar belakang sesuai gambar
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
  },
  mainSearchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: '100%',
    marginLeft: 10,
  },
  mainSearchIcon: {
    marginRight: 5,
  },
  mainMicIcon: {
    marginLeft: 5,
  },
  // --- Teks di bawah Carousel ---
  searchPromptBelowCarousel: {
    fontSize: 16,
    color: '#D1D5DB', // Warna abu-abu terang
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  // --- Loading & Error (tetap sama) ---
  loadingSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingSearchText: {
    color: '#D1D5DB',
    marginLeft: 10,
    fontSize: 16,
  },
  searchErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255,0,0,0.1)',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
  },
  searchErrorText: {
    color: 'red',
    marginLeft: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  // --- Hasil Pencarian (UI BARU) ---
  searchResultsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchResultsViewAll: {
    color: '#3B82F6', // Warna biru untuk "See all"
    fontSize: 14,
  },
  searchResultCardWrapper: {
    width: '100%', // Lebar penuh
    height: 180, // Tinggi tetap untuk setiap kartu hasil
    borderRadius: 15,
    overflow: 'hidden', // Penting agar gradien tidak keluar
    marginBottom: 15, // Jarak antar kartu
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  searchResultGradient: {
    flex: 1,
    borderRadius: 15, // Harus sama dengan wrapper
  },
  searchResultContent: {
    flexDirection: 'row',
    flex: 1,
    padding: 15,
    position: 'relative', // Untuk absolute positioning year
  },
  searchResultPoster: {
    width: 100, // Lebar poster
    height: '100%', // Tinggi poster mengisi card
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#6B7280',
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  searchResultTypeText: {
    fontSize: 14,
    color: '#D1D5DB', // Abu-abu terang
    marginBottom: 5,
    marginTop:40,
  },
  searchResultTitleText: {
    fontSize: 22, // Ukuran lebih besar untuk judul
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  searchResultYear: {
    position: 'absolute', // Posisi absolut untuk tahun
    top: 15,
    right: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D1D5DB', // Abu-abu terang
  },
  searchResultDetailButton: {
    backgroundColor: '#3B82F6', // Biru terang
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    alignSelf: 'flex-start', // Agar tombol tidak mengisi seluruh lebar
    marginTop: 5,
  },
  searchResultDetailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});