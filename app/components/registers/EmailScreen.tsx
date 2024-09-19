import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

type RootStackParamList = {
  PasswordScreen: { email: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'PasswordScreen'>;


export default function EmailScreen({ route }: { route: any }) {
  const [name, setName] = useState<string | null>('');
  const [email, setEmail] = useState<string>('');
  AsyncStorage.getItem("Name").then((value) => { setName(value) })

  return (
    <View style={styles.container}>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Paso 2: Ingresa tu email</ThemedText>
        <ThemedText type="subtitle">Hola, {name} Ingresa tu email</ThemedText>
        <TextInput style={styles.stepInput} placeholder='Ingrese su email' onChangeText={setEmail}>
        </TextInput>
      </ThemedView>

      {/* <Button
        title="Siguiente"
        onPress={async () => {
          router.navigate('./PassWordScreen');
          await AsyncStorage.setItem("Email", email);

        }}
      /> */}
      <Pressable
        onPress={async () => {
          router.navigate("./PassWordScreen");
          await AsyncStorage.setItem("Email", email);
        }}
        style={[
          styles.roundedButton,
          styles.blueButton,
          { opacity: email  ? 1 : 0.5 }  // Cambia la opacidad si no están completos
        ]}
        disabled={!email}  // Deshabilita el botón si alguno está vacío
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
