import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import dateFormat from 'dateformat';
import {getMovieDetail} from '../services/services';

const {height} = Dimensions.get('screen');
const placeholderImage = require('../assets/images/placeholder.png');

const Detail = ({route}) => {
  const [movieDetail, setMovieDetail] = useState({});
  const [loaded, setLoaded] = useState(false);

  const {movieId} = route.params;

  useEffect(() => {
    getMovieDetail(movieId)
      .then(movieData => setMovieDetail(movieData))
      .catch(err => console.log(err))
      .finally(() => {
        setLoaded(true);
      });
  }, [movieId]);

  return (
    <>
      {loaded && (
        <ScrollView>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={
              movieDetail?.poster_path
                ? {
                    uri: `https://image.tmdb.org/t/p/w500/${movieDetail.poster_path}`,
                  }
                : placeholderImage
            }
          />
          <View style={styles.container}>
            <Text style={styles.title}>{movieDetail?.title}</Text>
            <View style={styles.genreContainer}>
              {movieDetail?.genres?.map(genre => (
                <Text key={genre.id} style={styles.genre}>
                  {genre.name}
                </Text>
              ))}
            </View>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={movieDetail?.vote_average / 2}
              fullStarColor="gold"
              starSize={30}
            />

            <Text style={styles.overview}>{movieDetail?.overview}</Text>
            <Text style={styles.release}>
              Release date:{' '}
              {dateFormat(movieDetail?.release_date, 'dd mmmm, yyyy')}
            </Text>
          </View>
        </ScrollView>
      )}
      {!loaded && <ActivityIndicator size="large" />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: height / 2.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  genreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  genre: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  overview: {
    padding: 15,
    textAlign: 'justify',
  },
  release: {
    fontWeight: 'bold',
  },
});

export default Detail;
