import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function DuplicatePasswordScreen() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);

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

  // Verificar si las contraseñas coinciden
  useEffect(() => {
    if (password && passwordConfirm) {
      setIsPasswordMatch(password === passwordConfirm);
    } else {
      setIsPasswordMatch(false);
    }
  }, [password, passwordConfirm]);

  const handleRegister = async () => {
    if (!isPasswordMatch) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Enviar datos al servidor
    try {
      //const response = await fetch(`http://ec2-54-164-66-106.compute-1.amazonaws.com:8080/signup`, {
        const response = await fetch(`http://localhost:8080/signup`, {
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
        <ThemedText type="subtitle">Hola, {name}, confirma tu contraseña</ThemedText>
        <TextInput
          style={styles.stepInput}
          secureTextEntry={true}
          placeholder="Confirme su contraseña"
          onChangeText={setPasswordConfirm}
          value={passwordConfirm}
        />
      </ThemedView>

      <Pressable
        onPress={handleRegister}
        style={[
          styles.roundedButton,
          styles.blueButton,
          { opacity: isPasswordMatch ? 1 : 0.5 }, // Cambia la opacidad según si coinciden las contraseñas
        ]}
        disabled={!isPasswordMatch} // Deshabilita si las contraseñas no coinciden
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  roundedButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25, // Esto hace que los bordes sean redondeados
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Para bajarlo más
  },
  blueButton: {
    backgroundColor: '#1E90FF', // Azul
  }, buttonText: {
    color: '#FFFFFF', // Color del texto
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#000000',  // Color de fondo aquí (puedes cambiar el código hexadecimal)
    gap: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  stepInput: {
    gap: 8,
    marginBottom: 2,
    backgroundColor: '#9C9C9C',  // Color de fondo aquí (puedes cambiar el código hexadecimal)
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 33,
    marginTop: -300,  // Agregar margen superior para bajarlo

  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
});
