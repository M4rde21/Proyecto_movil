import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  Modal 
} from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Ruta de la imagen de fondo
const fondo = require('../assets/Fondo.png');

export default function MostrarJugadores({ navigation }) {
  const [jugadores, setJugadores] = useState([]);
  const [visible, setVisible] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // Estado para el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal de mensaje de eliminación
  const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal
  const [jugadorAEliminar, setJugadorAEliminar] = useState(null); // ID del jugador a eliminar
  const jugadoresCollectionRef = collection(db, 'jugadores');

  // Función para obtener los jugadores desde Firestore
  const obtenerJugadores = async () => {
    const querySnapshot = await getDocs(jugadoresCollectionRef);
    const jugadoresData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJugadores(jugadoresData);
  };

  const confirmarEliminacion = (id) => {
    setJugadorAEliminar(id); // Establece el jugador a eliminar
    setConfirmModalVisible(true); // Muestra el modal de confirmación
  };

  const eliminarJugador = async () => {
    const jugadorDoc = doc(db, 'jugadores', jugadorAEliminar);
    await deleteDoc(jugadorDoc);
    setModalMessage('Jugador eliminado correctamente.'); // Establece el mensaje
    setModalVisible(true); // Muestra el modal
    obtenerJugadores(); // Refrescar lista tras eliminación
    setConfirmModalVisible(false); // Cierra el modal de confirmación

    // Cierra el modal después de 1 segundo
    setTimeout(() => {
      setModalVisible(false);
    }, 1000); // 1000 milisegundos = 1 segundo
  };

  const cancelarEliminacion = () => {
    setConfirmModalVisible(false); // Cierra el modal de confirmación
  };

  // Recarga la lista de jugadores cada vez que se enfoca esta pantalla
  useFocusEffect(
    useCallback(() => {
      obtenerJugadores();
    }, [])
  );

  const openMenu = (id) => setVisible(id);
  const closeMenu = () => setVisible(null);

  return (
    <Provider>
      {/* Fondo con ImageBackground */}
      <ImageBackground source={fondo} style={styles.background}>
        <View style={styles.overlay}>
  
          {/* Título para "Lista de Jugadores" */}
          <Text style={styles.heading}>LISTA DE JUGADORES</Text>
  
          <FlatList
            data={jugadores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                {/* Foto del jugador */}
                <Image
                  source={
                    item.imagen
                      ? { uri: item.imagen }
                      : require('../assets/Usuario.jpg') // Imagen predeterminada si falta la URI
                  }
                  style={styles.image}
                />
  
                {/* Información del jugador */}
                <View style={styles.infoContainer}>
                  <Text style={styles.nameText}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <Text style={styles.subText}>DNI: {item.dni}</Text>
                  <Text style={styles.subText}>
                    Fecha Nacimiento: {item.fechaNacimiento}
                  </Text>
                </View>
  
                {/* Menú de opciones */}
                <Menu
                  visible={visible === item.id}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity onPress={() => openMenu(item.id)}>
                      <Icon name="more-vert" size={24} color="white" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      navigation.navigate('Editar Jugador', { jugador: item });
                    }}
                    title="Editar"
                  />
                  <Menu.Item
                    onPress={() => {
                      closeMenu();
                      confirmarEliminacion(item.id); // Muestra el modal de confirmación
                    }}
                    title="Eliminar"
                  />
                </Menu>
              </View>
            )}
          />
  
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Crear Jugadores')}
          >
            <Text style={styles.addButtonText}>AGREGAR JUGADOR</Text>
          </TouchableOpacity>

          {/* Modal de confirmación */}
          <Modal
            transparent={true}
            animationType="fade"
            visible={confirmModalVisible}
            onRequestClose={cancelarEliminacion} // Cierra el modal
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>¿Está seguro que desea eliminar al jugador?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: '#28a745' }]} // Botón "Sí" en verde
                    onPress={eliminarJugador}
                  >
                    <Text style={styles.buttonText}>Sí</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: '#dc3545' }]} // Botón "No" en rojo
                    onPress={cancelarEliminacion}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal de mensaje de eliminación */}
          <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} // Cierra el modal
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                {/* El botón de cerrar ha sido eliminado */}
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </Provider>
  );  
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen para cubrir toda la pantalla
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo semi-transparente sobre la imagen
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8, // Espacio entre las tarjetas
    backgroundColor: 'rgba(255, 255, 255, 0)', // Fondo transparente para el contenedor
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Sombra sutil
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35, // Hace que la imagen sea circular
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Texto blanco para destacar sobre el fondo
  },
  subText: {
    fontSize: 14,
    color: 'lightgray', // Texto más claro para los detalles secundarios
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40, 
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente para el modal
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center', // Centrar el texto
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ocupar todo el ancho
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5, // Espacio entre los botones
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
