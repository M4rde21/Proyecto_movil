import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function Jugadores({ navigation }) { 
  const [imagen, setImagen] = useState(null);
  const [apellido, setApellido] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const jugadoresCollectionRef = collection(db, "jugadores");

  const elegirImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 1,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const agregarJugador = async () => {
    try {
      await addDoc(jugadoresCollectionRef, {
        imagen,
        apellido,
        nombre,
        dni,
        fechaNacimiento
      });
      setImagen(null);
      setApellido('');
      setNombre('');
      setDni('');
      setFechaNacimiento('');

      navigation.navigate('Mostrar Jugadores');  
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert('Error', 'Hubo un error al crear el jugador');
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
      <TouchableOpacity onPress={elegirImagen} style={styles.imagePicker}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Seleccionar Foto</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="DNI"
        value={dni}
        onChangeText={handleDniChange} // Usar la nueva función
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Fecha de Nacimiento (DD/MM/YYYY)"
        value={fechaNacimiento}
        onChangeText={handleFechaNacimientoChange} // Usar la nueva función
        style={styles.input}
      />

      <TouchableOpacity onPress={agregarJugador} style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar Jugador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 100,
    width: 150,
    height: 150,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#888',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  }
});
