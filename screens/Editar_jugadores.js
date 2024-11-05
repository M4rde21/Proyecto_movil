import React, { useState } from 'react';
import { 
  View, TextInput, StyleSheet, Image, TouchableOpacity, ImageBackground, Text, Platform, Modal 
} from 'react-native';
import { db } from '../firebaseConfig'; 
import { updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const fondo = require('../assets/Fondo.png');

export default function Editar_jugadores({ route, navigation }) {
  const { jugador } = route.params;
  const [nombre, setNombre] = useState(jugador.nombre);
  const [apellido, setApellido] = useState(jugador.apellido);
  const [dni, setDni] = useState(jugador.dni);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date(jugador.fechaNacimiento.split('/').reverse().join('-') + 'T00:00:00')); 
  const [imagen, setImagen] = useState(jugador.imagen);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const storage = getStorage();

  const subirImagen = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `jugadores/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setModalMessage('No se pudo subir la imagen.'); // Mensaje de error
      setModalVisible(true); // Mostrar modal
      return null;
    }
  };

  const elegirImagenDeGaleria = async () => {
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

  const abrirCamara = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleNombreChange = (text) => {
    const caracteresPermitidos = /^[^\d]*$/; // Permitir cualquier cosa excepto dígitos
    if (caracteresPermitidos.test(text)) {
      setNombre(text);
    }
  };

  const handleApellidoChange = (text) => {
    const caracteresPermitidos = /^[^\d]*$/; // Permitir cualquier cosa excepto dígitos
    if (caracteresPermitidos.test(text)) {
      setApellido(text);
    }
  };

  const handleGuardar = async () => {
    // Validar que todos los campos estén llenos
    if (!nombre || !apellido || !dni || !fechaNacimiento) {
      setModalMessage('Todos los campos deben estar llenos.');
      setWarningModalVisible(true);
      return;
    }

    try {
      let imagenURL = imagen;

      if (imagen && imagen !== jugador.imagen) {
        const url = await subirImagen(imagen);
        if (url) imagenURL = url;
      }

      const jugadorRef = doc(db, "jugadores", jugador.id);

      const fechaFormateada = `${fechaNacimiento.getDate().toString().padStart(2, '0')}/${(fechaNacimiento.getMonth() + 1).toString().padStart(2, '0')}/${fechaNacimiento.getFullYear()}`;

      await updateDoc(jugadorRef, {
        nombre,
        apellido,
        dni,
        fechaNacimiento: fechaFormateada,
        imagen: imagenURL,
      });

      setModalMessage('Jugador actualizado correctamente.');
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error al actualizar el jugador:', error);
      setModalMessage('No se pudo actualizar el jugador.');
      setModalVisible(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  // Función para cerrar el modal de advertencia
  const closeWarningModal = () => {
    setWarningModalVisible(false);
  };

  return (
    <ImageBackground source={fondo} style={styles.background}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={elegirImagenDeGaleria} style={styles.imagePicker}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Seleccionar Foto</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={abrirCamara} style={styles.cameraButton}>
          <Ionicons name="camera" size={30} color="#fff" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={handleNombreChange} // Cambiar aquí
          placeholder="Nombre"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          value={apellido}
          onChangeText={handleApellidoChange} // Cambiar aquí
          placeholder="Apellido"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          value={dni}
          onChangeText={(text) => setDni(text.replace(/[^0-9]/g, '').slice(0, 8))}
          placeholder="DNI"
          keyboardType="numeric"
          placeholderTextColor="white"
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={[styles.input, { justifyContent: 'center' }]}>
            <Text style={{ color: 'white' }}>
              {fechaNacimiento ? fechaNacimiento.toLocaleDateString('es-ES') : 'Fecha de Nacimiento (DD/MM/YYYY)'}
            </Text>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Modal para mensajes */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
            </View>
          </View>
        </Modal>

        {/* Modal de advertencia */}
        <Modal
          transparent={true}
          visible={warningModalVisible}
          animationType="fade"
          onRequestClose={closeWarningModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>Por favor, completa todos los campos</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeWarningModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  cameraButton: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
