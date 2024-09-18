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
import { BotonPress } from '@/components/TouchableOpacity';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginComponent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
          <ThemedText type="title">Iniciar sesión!</ThemedText>
          
        </ThemedView>


        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Paso 1: Ingresa tu email</ThemedText>
          <TextInput style={styles.stepInput} placeholder='Ingrese su email' onChangeText={setEmail}>
          </TextInput>


          <ThemedText type="subtitle">Paso 2: Ingresa tu clave</ThemedText>
          <TextInput style={styles.stepInput} secureTextEntry={true} placeholder='Ingrese su contraseña' onChangeText={setPassword}>
          </TextInput>
          <ThemedText type="subtitle">Paso 3: Ingresa!</ThemedText>
          <Pressable
            onPress={() => {
              fetch(`http://ec2-54-164-66-106.compute-1.amazonaws.com:8080/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              })
                .then((r) => r.json())
                .then(async (r) => {
                  if (r.data && r.data.token) {
                    await AsyncStorage.setItem("token", r.data.token)
                    alert(r.data.token)
                    router.navigate("../(tabs)/explore")
                  }
                })
                .catch(err => alert("Error"))
            }}
            style={[styles.roundedButton, styles.redButton]}
            ><Text style={styles.buttonText}>Login</Text>
            </Pressable>
          {/*  <Button onPress={() => {
            router.navigate("/components/register")
          }}
          title='¿No tienes cuenta? Regístrate aquí'
          color={"#1000BF"}
          />
           */}
         <Pressable
            onPress={() => router.navigate("/components/registers/NameScreen")}
            style={[styles.roundedButton, styles.blueButton]} // Estilo para el botón rojo
            >
            <Text style={styles.buttonText}>¿No tienes cuenta? Regístrate aquí</Text>
          </Pressable>
        </ThemedView>
      </View>
    </ThemeProvider>
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
  },
  redButton: {
    backgroundColor: '#D1001f', // Rojo
  },
  buttonText: {
    color: '#FFFFFF', // Color del texto
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 16,
    backgroundColor: '#000000',  // Color de fondo aquí (puedes cambiar el código hexadecimal)
    gap: 8,
  },
  titleContainer: {
    alignItems: 'center',
    margin: 8,
    
    
  }, 
  stepInput: {
    gap: 8,
    marginBottom: 2,
    backgroundColor: '#9C9C9C',  // Color de fondo aquí (puedes cambiar el código hexadecimal)
    padding: 16,
    
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    marginTop: 90,  // Agregar margen superior para bajarlo
    backgroundColor: '#000000',  // Color de fondo aquí (puedes cambiar el código hexadecimal)

  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    
  },
});
