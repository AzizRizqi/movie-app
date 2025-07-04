// components/MovieCard.tsx

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const router = useRouter();

  const onPress = () => {
    router.push(`/movie/${movie.imdbID}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/120x180/667eea/ffffff?text=No+Image' }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.tag}>Movie</Text>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#764ba2',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  tag: {
    fontSize: 12,
    backgroundColor: '#ffffff40',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: 'white',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    color: '#eee',
  },
});
