import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
  const navigation = useNavigation<NavigationProp>();
  const [name,setName] = useState<string|null>('');
  const [email, setEmail] = useState<string | null>('');
  const [password, setPassword] = useState<string>('');
  AsyncStorage.getItem("Name").then((value) => { setName(value) })


  return (
    <View style={styles.container}>
       <ThemedView style={styles.stepContainer}>
           <ThemedText type="title">Paso 3: Ingresa tu clave</ThemedText>
           <ThemedText type="subtitle">Hola, {name} Ingresa tu contraseña</ThemedText>

          <TextInput secureTextEntry={true} placeholder='Ingrese su contraseña' onChangeText={setPassword}>
          </TextInput>
       </ThemedView>
       
       <Button
        title="Siguiente"
        onPress={async() => {
          router.navigate('./DuplicatePasswordScreen');
          await AsyncStorage.setItem("Password", password);

        }}
      />
      
     </View> 
 
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     padding: 16,
   },
   label: {
     fontSize: 18,
     marginBottom: 8,
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
 