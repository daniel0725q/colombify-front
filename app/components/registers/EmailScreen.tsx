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
        <TextInput placeholder='Ingrese su email' onChangeText={setEmail}>
        </TextInput>
      </ThemedView>

      <Button
        title="Siguiente"
        onPress={async () => {
          router.navigate('./PassWordScreen');
          await AsyncStorage.setItem("Email", email);

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
