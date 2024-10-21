import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function MostrarJugadores({ navigation }) {
  const [jugadores, setJugadores] = useState([]);
  const [visible, setVisible] = useState(null);
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

  const eliminarJugador = async (id) => {
    const jugadorDoc = doc(db, 'jugadores', id);
    await deleteDoc(jugadorDoc);
    obtenerJugadores(); // Refrescar lista tras eliminación
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
      <View style={styles.container}>
        <FlatList
          data={jugadores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {/* Foto del jugador */}
              <Image
                source={{ uri: item.imagen }}
                style={styles.image}
              />

              {/* Información del jugador */}
              <View style={styles.infoContainer}>
                <Text style={styles.nameText}>
                  {item.nombre} {item.apellido}
                </Text>
                <Text style={styles.subText}>DNI: {item.dni}</Text>
                <Text style={styles.subText}>Fecha Nacimiento: {item.fechaNacimiento}</Text>
              </View>

              {/* Menú de opciones */}
              <Menu
                visible={visible === item.id}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={() => openMenu(item.id)}>
                    <Icon name="more-vert" size={24} color="black" />
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
                    eliminarJugador(item.id);
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
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
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
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#2626ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
