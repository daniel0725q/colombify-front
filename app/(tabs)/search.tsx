import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';

const SearchComponent = () => {
  const [searchText, setSearchText] = useState('');
  const [searchOption, setSearchOption] = useState('artists');
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState<{ id: number; name: string; description: string; colorInHex: string; songs: any[] }[]>([]);
  const navigation = useNavigation();
  const [showGenres, setShowGenres] = useState(true);   


  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const handleSearchOptionChange = (itemValue: string) => {
    setSearchOption(itemValue);
  };

  const fetchGenres = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch('http://localhost:8080/genres', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGenres(data); // Suponiendo que el backend devuelve un array de géneros
      console.log('Fetched genres:', data);

    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSearch = async () => {
    setShowGenres(false); // Ocultar los botones de géneros al hacer una búsqueda
    let results: any = [];
    if (searchOption === 'artists') {
      // Llamar al endpoint para buscar artistas
      console.log(`Buscando artistas con el término: ${searchText}`);
      fetch(`http://localhost:8080/artists/find?identifier=${searchText}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('token').then((value) => value)}`,
          },
        }
      )
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      // Simulación de resultados
    } else if (searchOption === 'songs') {
      // Llamar al endpoint para buscar canciones
      fetch(`http://localhost:8080/songs/find?identifier=${searchText}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token').then((value) => value)}`,
        },
      }
    )
    .then(response => response.json())
    .then(data => {
      setSearchResults(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    }
  };
 useEffect(() => {
    fetchGenres();
  }, []);
  
  useEffect(() => {
    if (searchResults.length > 0) {
      setShowGenres(false); // Ocultar géneros una vez que se tienen resultados
    }
  }, [searchResults]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        value={searchText}
        onChangeText={handleSearchTextChange}
      />
      <Picker
        selectedValue={searchOption}
        style={styles.picker}
        onValueChange={handleSearchOptionChange}
      >
        <Picker.Item label="Artistas" value="artists" />
        <Picker.Item label="Canciones" value="songs" />
      </Picker>
      <Button title="Buscar" onPress={handleSearch} />

      {showGenres && (
        <View style={styles.genreButtonContainer}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={styles.genreButton}
              onPress={() => router.push({ pathname: '../components/genrelist', params: { genre: genre.name } })}
            >
              <Text style={styles.genreButtonText}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={searchResults}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.resultItem}
            onPress={() => {
              console.log(item);
              if (searchOption === 'songs') {
                router.push({pathname: '../components/songdetail', params: { songId: item.id }});
              } else {
                router.push({ pathname: `../components/artistdetail`, params: { artistId: item.id } })}
              }
            }
          >
            {searchOption === 'artists' ? item.stageName : item.title}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  genreButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  genreButton: {
    backgroundColor: '#6200ad',
    padding: 20, 
    width: 80, 
    height: 80,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultItem: {
    padding: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
});

export default SearchComponent;