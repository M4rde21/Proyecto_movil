import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ImageBackground, 
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa Ionicons para los íconos
import { useNavigation } from '@react-navigation/native';

const logo = require('../assets/Logo_blanco.png');
const fondo = require('../assets/Fondo.png');

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para mostrar/ocultar contraseña
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar visibilidad del modal
  const [modalMessage, setModalMessage] = useState(''); // Estado para el mensaje del modal
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false); // Estado para tipo de mensaje
  const navigation = useNavigation();

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      setModalMessage('Por favor, completa todos los campos.');
      setIsLoginSuccessful(false); // Error
      setModalVisible(true);
    } else if (username === 'Martincito' && password === '123456') {
      setModalMessage(`Bienvenido ${username}`);
      setIsLoginSuccessful(true); // Éxito
      setModalVisible(true);
      // Cerrar automáticamente el modal y navegar
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Mostrar Jugadores'); 
      }, 1000); // Se cierra después de 1 segundos
    } else {
      setModalMessage('Usuario y/o contraseña incorrectos.');
      setIsLoginSuccessful(false); // Error
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground source={fondo} style={styles.background}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>¡La Mejor Liga del Condado!</Text>

        <View style={styles.form}>
          {/* Contenedor de usuario con ícono */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={24} color="white" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre de Usuario"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Contenedor de contraseña con ícono de candado y visibilidad */}
          <View style={styles.passwordContainer}>
            <Ionicons name="lock-closed" size={24} color="white" style={styles.icon} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible} // Muestra/oculta texto de la contraseña
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons 
                name={isPasswordVisible ? "eye-off" : "eye"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>¿Olvidaste tu Usuario y/o Contraseña?</Text>
            <Text style={styles.signupButtonText}>Ingrese Aquí</Text>
          </TouchableOpacity>
        </View>

        {/* Modal personalizado para alertas centradas */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              {!isLoginSuccessful && ( // Solo mostrar botón de cerrar si el login falla
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              )}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: 'white',
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: 'white',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default LoginScreen;
