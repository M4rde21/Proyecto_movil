import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig'; 
import { updateDoc, doc } from 'firebase/firestore';

export default function Editar_jugadores({ route, navigation }) {
  const { jugador } = route.params; // Recibimos los datos del jugador
  const [nombre, setNombre] = useState(jugador.nombre);
  const [apellido, setApellido] = useState(jugador.apellido);
  const [dni, setDni] = useState(jugador.dni);
  const [fechaNacimiento, setFechaNacimiento] = useState(jugador.fechaNacimiento);

  const handleGuardar = async () => {
    try {
      const jugadorRef = doc(db, "jugadores", jugador.id);
      await updateDoc(jugadorRef, {
        nombre,
        apellido,
        dni,
        fechaNacimiento,
      });
      Alert.alert('Éxito', 'Jugador actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el jugador.');
    }
  };

  // Función para manejar el cambio de texto en el campo DNI
  const handleDniChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ''); // Elimina caracteres que no sean números
    if (numericText.length <= 8) {
      setDni(numericText);
    }
  };

  // Función para manejar el cambio de texto en el campo Fecha de Nacimiento
  const handleFechaNacimientoChange = (text) => {
    // Eliminar caracteres que no sean números
    const numericText = text.replace(/[^0-9]/g, ''); 
    let formattedText = '';

    // Insertar barras automáticamente
    for (let i = 0; i < numericText.length; i++) {
      if (i === 2 || i === 4) {
        formattedText += '/';
      }
      formattedText += numericText[i];
    }

    // Limitar longitud a 10 caracteres (DD/MM/YYYY)
    if (formattedText.length <= 10) {
      setFechaNacimiento(formattedText);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        value={apellido}
        onChangeText={setApellido}
        placeholder="Apellido"
      />
      <TextInput
        style={styles.input}
        value={dni}
        onChangeText={handleDniChange} // Usar la nueva función para manejar DNI
        placeholder="DNI"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={fechaNacimiento}
        onChangeText={handleFechaNacimientoChange} // Usar la nueva función para manejar fecha
        placeholder="Fecha de Nacimiento (DD/MM/YYYY)"
      />
      <Button title="Guardar Cambios" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});
