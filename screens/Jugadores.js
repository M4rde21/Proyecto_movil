import 'react-native-get-random-values';
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Image, 
  Alert, 
  StyleSheet, 
  ImageBackground, 
  Platform,
  Modal 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { db, storage, collection, addDoc } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const fondo = require('../assets/Fondo.png');

export default function Jugadores({ navigation }) {
  const [imagen, setImagen] = useState(null);
  const [apellido, setApellido] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal para advertencia
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal para éxito
  const jugadoresCollectionRef = collection(db, 'jugadores');

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
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const subirImagenAFirebase = async (uri) => {
    try {
      const blob = await (await fetch(uri)).blob();
      const imageRef = ref(storage, `jugadores/${uuidv4()}`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error subiendo imagen: ', error);
      Alert.alert('Error', 'No se pudo subir la imagen');
      return null;
    }
  };

  const agregarJugador = async () => {
    // Validar campos antes de continuar
    if (!nombre || !apellido || !dni || !fechaNacimiento) {
      setShowModal(true); // Mostrar modal si falta algún campo
      return;
    }

    try {
      let imageUrl = '';
      if (imagen) {
        imageUrl = await subirImagenAFirebase(imagen);
      }

      await addDoc(jugadoresCollectionRef, {
        imagen: imageUrl,
        apellido,
        nombre,
        dni,
        fechaNacimiento: fechaNacimiento.toISOString().split('T')[0],
      });

      // Limpiar los estados después de agregar
      setImagen(null);
      setApellido('');
      setNombre('');
      setDni('');
      setFechaNacimiento(new Date());

      // Mostrar modal de éxito
      setShowSuccessModal(true);

      // Ocultar modal de éxito después de 1 segundo
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Mostrar Jugadores'); // Navegar a la pantalla de mostrar jugadores
      }, 1000); // 1000 milisegundos = 1 segundo
    } catch (e) {
      console.error('Error agregando jugador: ', e);
      Alert.alert('Error', 'Hubo un error al crear el jugador');
    }
  };

  const mostrarCalendario = () => setShowDatePicker(true);

  const onChangeFecha = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
    }
  };

  // Función para validar y permitir cualquier carácter excepto números
  const handleNombreChange = (text) => {
    // Filtrar solo caracteres que no sean números
    const caracteresPermitidos = /^[^\d]*$/; // Permitir cualquier cosa excepto dígitos
    if (caracteresPermitidos.test(text)) {
      setNombre(text);
    }
  };

  const handleApellidoChange = (text) => {
    // Filtrar solo caracteres que no sean números
    const caracteresPermitidos = /^[^\d]*$/; // Permitir cualquier cosa excepto dígitos
    if (caracteresPermitidos.test(text)) {
      setApellido(text);
    }
  };

  const manejarCancelar = () => {
    // Navegar hacia atrás en la pila de navegación
    navigation.goBack();
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
          placeholder="Nombre"
          value={nombre}
          onChangeText={handleNombreChange} // Cambiar aquí
          placeholderTextColor="white"
          style={styles.input}
        />
        <TextInput
          placeholder="Apellido"
          value={apellido}
          onChangeText={handleApellidoChange} // Cambiar aquí
          placeholderTextColor="white"
          style={styles.input}
        />
        <TextInput
          placeholder="DNI"
          value={dni}
          onChangeText={(text) => setDni(text.replace(/[^0-9]/g, '').slice(0, 8))}
          placeholderTextColor="white"
          style={styles.input}
          keyboardType="numeric"
        />

        {/* Campo de Fecha como Touchable */}
        <TouchableOpacity onPress={mostrarCalendario} style={styles.input}>
          <Text style={{ color: 'white' }}>
            {fechaNacimiento ? fechaNacimiento.toLocaleDateString('es-ES') : 'Fecha de Nacimiento'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeFecha}
          />
        )}

        <TouchableOpacity onPress={agregarJugador} style={styles.addButton}>
          <Text style={styles.addButtonText}>Agregar Jugador</Text>
        </TouchableOpacity>

        {/* Botón Cancelar */}
        <TouchableOpacity onPress={manejarCancelar} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Modal para mostrar advertencia */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)} // Permitir cerrar el modal
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Por favor, completa todos los campos.</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para mostrar mensaje de éxito */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)} // No necesario, ya que no habrá botón para cerrar
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Jugador creado exitosamente.</Text>
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
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para el modal
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
