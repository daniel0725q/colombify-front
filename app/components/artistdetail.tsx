import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';

interface Genre {
  id: number;
  name: string;
  description: string;
  colorInHex: string;
}

interface Song {
  id: number;
  title: string;
  audioUrl: string;
  artwork: string;
  description: string;
  genre: Genre;
  artist: Artist;

}

interface Artist {
  id: number;
  stageName: string;
  bio: string;
  songs: Song[];
}

const ArtistDetail = ({ artistId }: { artistId: number }) => {
const local = useLocalSearchParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`http://localhost:8080/artists/${local.artistId}`);
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!artist) {
    return <Text>No se encontró el artista.</Text>;
  }

/*
onPress={() => {
    router.push({ pathname: `../components/artistdetail`, params: { artistId: item.id } })}
}
*/

  return (
    <View style={styles.container}>
       <ImageBackground source={{ uri: 'https://via.placeholder.com/500x200' }} style={styles.backgroundImage}>
        <Text style={styles.stageName}>{artist.stageName}</Text>
        <Text style={styles.bio}>{artist.bio}</Text>
      </ImageBackground>
      <Text style={styles.songTitle}>Canciones</Text>

      <FlatList
        data={artist.songs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
                router.push({ pathname: `../components/songdetail`, params: { songId: item.id } })
            }}>
            <View style={styles.songContainer}>
             {/* <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.artwork} /> */}
              <Image source={{ uri: item.artwork }} style={styles.artwork} />

              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songDescription}>{item.description}</Text>
                <Text style={[styles.genre, { color: item.genre.colorInHex }]}>
                  {item.genre.name}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  stageName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    marginBottom: 16,
  },
  songContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  artwork: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songDescription: {
    fontSize: 14,
    color: 'gray',
  },
  genre: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ArtistDetail;