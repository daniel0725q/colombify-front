import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { Audio } from 'expo-av';
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType
} from 'expo-file-system';
import PlaylistModal from './playlistpicker';

interface Genre {
  id: number;
  name: string;
  description: string;
  colorInHex: string;
}

interface Artist {
  id: number;
  stageName: string;
  bio: string;
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

const SongDetail = ({ route }: { route: any }) => {
  const local = useLocalSearchParams();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);

  const playSound = async (audioUrl: string) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
    setSound(newSound);
    await newSound.playAsync();
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(`http://localhost:8080/songs/${local.songId}`);
        const data = await response.json();
        setSong(data);
      } catch (error) {
        console.error('Error fetching song:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!song) {
    return <Text>No se encontró la canción.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Image source={{ uri: song.artwork }} style={styles.artwork} />
      <Text style={styles.description}>{song.description}</Text>
      <Text style={[styles.genre, { color: song.genre.colorInHex }]}>
        {song.genre.name}
      </Text>
      <Text style={styles.artist}>Artista: {song.artist.stageName}</Text>
      <Text style={styles.bio}>{song.artist.bio}</Text>
      <Button title="Reproducir" onPress={() => playSound(song.audioUrl)} />
      <Text> </Text>
      <Button title="Pausar" color={"orange"} onPress={() => sound?.pauseAsync()} />
      <Text> </Text>
      <Button title="Detener" color={"red"} onPress={() => setVisible(true)} />
      <Text> </Text>
      <Button title="Añadir a playlist" color={"green"} onPress={() => setVisible(true)} />
        <PlaylistModal songId={song.id} isVisible={visible} onClose={() => setVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artwork: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  genre: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  artist: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SongDetail;