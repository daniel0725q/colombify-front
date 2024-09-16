import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
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
           <TextInput placeholder='Ingrese su nombre' onChangeText={setName}>
           </TextInput>
       </ThemedView>
      <Button
        title="Siguiente"
        onPress={async() => {
          router.navigate('./EmailScreen');
          await AsyncStorage.setItem("Name", name);

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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
