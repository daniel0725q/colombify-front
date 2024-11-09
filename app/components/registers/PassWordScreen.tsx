import React, { useState, useEffect} from 'react';
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
  DuplicatePasswordScreen: { password: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'DuplicatePasswordScreen'>;

export default function PassWordScreen() {
  const [name, setName] = useState<string | null>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordValid,setPasswordValid] = useState<boolean>(false);

  // Obtener el nombre almacenado en AsyncStorage
  useEffect(() => {
    const getName = async () => {
      const storedName = await AsyncStorage.getItem('Name');
      if (storedName) {
        setName(storedName);
        
      }
    };
    getName();
  }, []);

  // Función para validar el formato del password
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/; // Expresión regular corregida
    return passwordRegex.test(password);
  };

  // Validar password cada vez que cambia el valor
  useEffect(() => {
    setPasswordValid(validatePassword(password));
  }, [password]);


  return (
    <View style={styles.container}>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Paso 3: Ingresa tu clave</ThemedText>
        <ThemedText type="subtitle">Hola, {name} Ingresa tu contraseña</ThemedText>

        <TextInput style={styles.stepInput}  secureTextEntry={true} placeholder='Ingrese su contraseña' onChangeText={setPassword}>
        </TextInput>
      </ThemedView>

      {/*  <Button
        title="Siguiente"
        onPress={async() => {
          router.navigate('./DuplicatePasswordScreen');
          await AsyncStorage.setItem("Password", password);

        }}
      /> */}
       <Pressable
        onPress={async () => {
          await AsyncStorage.setItem('Password', password);
          router.navigate('./DuplicatePasswordScreen');
        }}
        style={[
          styles.roundedButton,
          styles.blueButton,
          { opacity: isPasswordValid ? 1 : 0.5 }, // Cambia la opacidad según la validez del password
        ]}
        disabled={!isPasswordValid} // Deshabilita si la contraseña no es válida
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
