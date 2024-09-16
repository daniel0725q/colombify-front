import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function DuplicatePasswordScreen() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  AsyncStorage.getItem("Email").then((value) => { setEmail(value) })

  // Obtener los valores almacenados en AsyncStorage
  useEffect(() => {
    const fetchData = async () => {
      const storedName = await AsyncStorage.getItem('Name');
      const storedEmail = await AsyncStorage.getItem('Email');
      const storedPassword = await AsyncStorage.getItem('Password');
      
      setName(storedName);
      setEmail(storedEmail);
      setPassword(storedPassword);
    };

    fetchData();
  }, []);

  const handleRegister = async () => {
    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Enviar datos al servidor
    try {
      const response = await fetch(`http://ec2-54-164-66-106.compute-1.amazonaws.com:8080/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Navegar a la pantalla de inicio de sesión después del registro exitoso
        router.navigate('/components/login');
        // Limpiar AsyncStorage
        await AsyncStorage.removeItem('Name');
        await AsyncStorage.removeItem('Email');
        await AsyncStorage.removeItem('Password');
      } else {
        Alert.alert('Error', 'No se pudo completar el registro');
      }
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un problema con la solicitud');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.stepContainer}>
      <ThemedText type="title">Paso 4: Confirma tu clave</ThemedText>
          <TextInput secureTextEntry={true} placeholder='Confirme su contraseña' onChangeText={setPasswordConfirm}>
          </TextInput>
      </ThemedView>

      <Button title="Registrarse" onPress={handleRegister} />

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
});
