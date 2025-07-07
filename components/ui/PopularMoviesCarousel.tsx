// components/ui/PopularMoviesCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../../types/movie'; // <--- PASTIKAN INI BENAR
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface PopularMoviesCarouselProps {
  movies: Movie[]; // <--- PASTIKAN INI Movie[]
  loading: boolean;
}

const PopularMoviesCarousel: React.FC<PopularMoviesCarouselProps> = ({ movies, loading }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Movie>>(null);
    const autoPlayIntervalRef = useRef<number | null>(null);

  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // Auto-play functionality (kembali ke loop sederhana)
  useEffect(() => {
    if (movies.length > 0) {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % movies.length;
          const itemWidth = screenWidth - (styles.carouselContainer.paddingHorizontal * 2);
          const itemFullWidth = itemWidth + styles.cardWrapper.marginRight;
          flatListRef.current?.scrollToOffset({ offset: nextIndex * itemFullWidth, animated: true });
          return nextIndex;
        });
      }, 4000);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    }
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [movies.length]);

  const getItemLayout = (data: any, index: number) => ({
    length: (screenWidth - (styles.carouselContainer.paddingHorizontal * 2)) + styles.cardWrapper.marginRight,
    offset: index * ((screenWidth - (styles.carouselContainer.paddingHorizontal * 2)) + styles.cardWrapper.marginRight),
    index,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  const getBackgroundColor = (index: number) => {
    const colors = [
      '#2dd4bf', '#f59e0b', '#3b82f6', '#dc2626', '#374151',
      '#84cc16', '#ef4444', '#a855f7', '#ec4899', '#10b981',
    ];
    return colors[index % colors.length];
  };

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const itemFullWidth = (screenWidth - (styles.carouselContainer.paddingHorizontal * 2)) + styles.cardWrapper.marginRight;
    const newIndex = Math.round(contentOffsetX / itemFullWidth);
    setCurrentIndex(newIndex % movies.length);
  };

  const handleDetailPress = (imdbID: string) => {
    router.push(`/movie/${imdbID}`);
  };

  const handleFavoritePress = (movieId: string) => {
    setFavorites(prev => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Popular</Text>
      </View>

      {/* Carousel Container (Kembali ke struktur asli, tinggi diperkecil) */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={movies} // Gunakan array movies asli
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.imdbID} // <--- PASTIKAN item.imdbID ADA
          renderItem={({ item, index }) => {
            const isFavorite = favorites[item.imdbID || ''] || false;
            return (
              <View
                key={item.imdbID}
                style={[
                  styles.cardWrapper,
                  { width: screenWidth - (styles.carouselContainer.paddingHorizontal * 2) },
                ]}
              >
                <View
                  style={[
                    styles.cardContent,
                    { backgroundColor: getBackgroundColor(index) },
                  ]}
                >
                  <Image
                    source={{ uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450?text=No+Image' }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                    blurRadius={5}
                  />

                  <View style={styles.mainContent}>
                    <View style={styles.posterSection}>
                      <View style={styles.moviePosterWrapper}>
                        <Image
                          source={{ uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450?text=No+Image' }}
                          style={styles.moviePoster}
                          resizeMode="cover"
                        />
                      </View>
                    </View>

                    <View style={styles.infoSection}>
                      <Text style={styles.movieTitle} numberOfLines={2}>
                        {item.Title}
                      </Text>
                      <Text style={styles.movieYear}>{item.Year}</Text>
                      <Text style={styles.movieType}>{item.Type}</Text>

                      <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                          style={styles.detailButton}
                          onPress={() => handleDetailPress(item.imdbID)}
                        >
                          <Ionicons name="information-circle-outline" size={20} color="white" />
                          <Text style={styles.detailButtonText}>Detail</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.heartButton}
                          onPress={() => handleFavoritePress(item.imdbID)}
                        >
                          <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={20}
                            color={isFavorite ? 'red' : 'white'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={getItemLayout}
        />

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {movies.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentIndex(index);
                const itemWidth = screenWidth - (styles.carouselContainer.paddingHorizontal * 2);
                const itemFullWidth = itemWidth + styles.cardWrapper.marginRight;
                flatListRef.current?.scrollToOffset({ offset: index * itemFullWidth, animated: true });
              }}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  viewAll: {
    color: '#3B82F6',
    fontSize: 14,
  },
  carouselContainer: {
    height: 380,
    position: 'relative',
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  cardWrapper: {
    width: screenWidth - (16 * 2),
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  posterSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  moviePosterWrapper: {
    width: 160,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  moviePoster: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  genreContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9999,
    fontSize: 14,
    color: 'white',
  },
  movieYear: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  movieType: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
  },
  heartButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9999,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 380,
  },
});

export default PopularMoviesCarousel;