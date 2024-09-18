import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View, Pressable, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type RootStackParamList = {
  EmailScreen: { name: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'EmailScreen'>;

export default function NameScreen() {
  const [name, setName] = useState<string>('');

  return (
    <View style={styles.container}>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Paso 1: Ingresa tu nombre</ThemedText>
        <ThemedText type="subtitle">Hola, {name} Ingresa tu nombre</ThemedText>

        <TextInput style={styles.stepInput} placeholder='Ingrese su nombre' onChangeText={setName}>
        </TextInput>
      </ThemedView>
      {/*  <Button
        title="Siguiente"
        onPress={async() => {
          router.navigate('./EmailScreen');
          await AsyncStorage.setItem("Name", name);

        }}
      /> */}
      <Pressable
        onPress={async () => {
          router.navigate("./EmailScreen");
          await AsyncStorage.setItem("Name", name);
        }}
        style={[styles.roundedButton, styles.blueButton]} // Estilo para el botón azul
      >
        <Text style={styles.buttonText}>Siguiente</Text>
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
});
