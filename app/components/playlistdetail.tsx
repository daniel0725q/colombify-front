import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Song {
  id: number;
  title: string;
  audioUrl: string | null;
  artwork: string | null;
  description: string | null;
}

interface Playlist {
  id: number;
  name: string;
  userId: number;
  songs: Song[];
}

const PlaylistDetail = () => {
  const { playlistId, songs } = useLocalSearchParams(); // Recibe los parámetros
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const local = useLocalSearchParams();

  useEffect(() => {
    if (!songs) {
      const fetchPlaylist = async () => {
        try {
          const token = await AsyncStorage.getItem('token'); // Obtener token
          const response = await fetch(`http://localhost:8080/playlists/${playlistId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await AsyncStorage.getItem('token').then((value) => value)}`,
            },
          });
          const data = await response.json();
          setPlaylist(data);
        } catch (error) {
          console.error('Error fetching playlist:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPlaylist();
    } else {
      setPlaylist({
        id: Number(playlistId),
        name: 'Favoritos',
        userId: 1,
        songs: JSON.parse(decodeURIComponent(songs as string)),
      });
      setLoading(false);
    }
  }, [playlistId, songs]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!playlist) {
    return <Text>No se encontró la playlist.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{playlist.name}</Text>
      <FlatList
        data={playlist.songs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => console.log('Reproduciendo canción:', item.title)}
          >
            <View style={styles.songContainer}>
              {item.artwork && (
                <Image source={{ uri: item.artwork }} style={styles.artwork} />
              )}
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{item.title}</Text>
                {item.description && <Text>{item.description}</Text>}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  songContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
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
});

export default PlaylistDetail;
