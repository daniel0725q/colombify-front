import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, TextInput, Text, View, Pressable, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RegisterComponent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Regístrese aquí!</ThemedText>
            <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Paso 1: Ingresa tu nombre</ThemedText>
          <TextInput placeholder='Ingrese su nombre' onChangeText={setName}>
          </TextInput>
          <ThemedText type="subtitle">Paso 2: Ingresa tu email</ThemedText>
          <TextInput placeholder='Ingrese su email' onChangeText={setEmail}>
          </TextInput>
          <ThemedText type="subtitle">Paso 3: Ingresa tu clave</ThemedText>
          <TextInput secureTextEntry={true} placeholder='Ingrese su contraseña' onChangeText={setPassword}>
          </TextInput>
          <ThemedText type="subtitle">Paso 4: Confirma tu clave</ThemedText>
          <TextInput secureTextEntry={true} placeholder='Confirme su contraseña' onChangeText={setPasswordConfirm}>
          </TextInput>
          <ThemedText type="subtitle">Paso 4: Regístrate!</ThemedText>
          <Button
            onPress={() => {
              if (password != passwordConfirm) {
                alert("Contraseña y confirmar contraseña no coinciden")
                return;
              }
              fetch(`http://ec2-54-235-50-246.compute-1.amazonaws.com:8080/signup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
              })
                .then((r) => {
                    router.navigate("/components/login")
                })
                .catch(err => alert("Error"))
            }}
            title="Registrarse"
          />
          <Button onPress={() => {
            router.navigate("/components/login")
          }}
          title='¿Tienes cuenta? Iniciar sesión'
          color={"#1000BF"}
          />
        </ThemedView>
    </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  });
