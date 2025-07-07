// components/ui/MovieCard.tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '../../types/movie'; // Assuming Movie type is here

interface MovieCardProps {
  movie: Movie;
  horizontal?: boolean; // New prop to adjust layout for horizontal list
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, horizontal = false }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/movie/${movie.imdbID}`);
  };

  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        horizontal ? styles.horizontalCard : styles.gridCard,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
        {/* You can add a subtle overlay or gradient if needed, but keeping it simple as per request */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.yearType}>
          {movie.Year} • {movie.Type}
        </Text>
        {/* If you specifically want imdbID visible, uncomment the line below */}
        {/* <Text style={styles.imdbID}>ID: {movie.imdbID}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle background for the card
    borderRadius: 8,
    overflow: 'hidden', // Ensures content stays within rounded corners
  },
  horizontalCard: {
    width: 120, // Fixed width for horizontal items
    marginRight: 15,
    marginBottom: 10, // Add some bottom margin for spacing
  },
  gridCard: {
    flex: 1, // Allows it to expand within a column
    maxWidth: '48%', // For two columns with some spacing
    marginVertical: 8, // Vertical spacing between rows
  },
  imageWrapper: {
    width: '100%',
    height: 180, // Fixed height for posters
    backgroundColor: '#333', // Placeholder background for images
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // Apply border radius to the image itself
  },
  infoContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  yearType: {
    color: '#A0A0A0', // Lighter gray for year and type
    fontSize: 12,
    textAlign: 'center',
  },
  // imdbID: { // Uncomment if you want to show IMDb ID
  //   color: '#808080',
  //   fontSize: 10,
  //   textAlign: 'center',
  // },
});

export default MovieCard;