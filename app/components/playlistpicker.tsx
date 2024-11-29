import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Playlist {
  id: number;
  name: string;
}

interface PlaylistModalProps {
  songId: number;
  isVisible: boolean;
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ songId, isVisible, onClose }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<number>(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Obtener token
        const response = await fetch('http://localhost:8080/playlists', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        });
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSelect = () => {
    if (selectedPlaylist != 0) {
        const addSongToPlaylist = async () => {
            const playlist = playlists.find((playlist) => playlist.id === Number(selectedPlaylist));
            if (playlist) {
              const response = await fetch(`http://localhost:8080/playlists/${selectedPlaylist}/${songId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${await AsyncStorage.getItem('token').then((value) => value)}`,
                },
              });
              if (response.ok) {
                console.log('Canción agregada a la playlist');
              } else {
                console.error('Error al agregar canción a la playlist');
              }
            }
          };
        
          addSongToPlaylist();
          onClose();
    } else {
      alert('Please select a playlist');
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Select a Playlist</Text>
        <Picker
          selectedValue={selectedPlaylist}
          onValueChange={(itemValue) => {
            setSelectedPlaylist(itemValue)
            console.log(itemValue)
          }}
          style={styles.picker}
        >
          <Picker.Item key={0} label={"Seleccione una playlist"} value={0} />
          {playlists.map((playlist) => (
            <Picker.Item key={playlist.id} label={playlist.name} value={playlist.id} />
          ))}
        </Picker>
        <Button title="Select" color={"green"} onPress={handleSelect} />
        <Text> </Text>
        <Button title="Close" color={"orange"} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default PlaylistModal;