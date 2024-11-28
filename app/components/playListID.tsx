import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
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

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Obtener token
        const response = await fetch('http://localhost:8080/playlists', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('token').then((value) => value)}`,
        },
        });
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '../components/playlistdetail',
                params: {
                  playlistId: item.id,
                },
              });
            }}
          >
            <View style={styles.playlistContainer}>
              <Text style={styles.playlistName}>{item.name}</Text>
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
  playlistContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  playlistName: {
    fontSize: 18,
  },
});

export default Playlists;
