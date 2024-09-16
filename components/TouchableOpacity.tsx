import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function BotonPress() {  // Export function
  const [count, setCount] = useState(0);
  const onPress = () => setCount(prevCount => prevCount + 1);
  console.log("BotonPress rendered");

  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>
        <Text>Count: {count}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {/* Texto personalizado para el botón */}
        <Text style={styles.buttonText}>¡Haz clic aquí para aumentar el contador!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'lightgray',  // Añadir color de fondo temporal para ver si el botón está allí
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
  });
  
