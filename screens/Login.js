import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

const logo = require('../assets/Logo.png'); // Asegúrate de la ruta correcta

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Usa el hook para la navegación

  // Validación básica y simulación de login
  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    } else if (username === 'Martincito' && password === '123456') {
      Alert.alert('Login Exitoso', `Bienvenido ${username}`);
      // Navega a la pantalla Mostrar Jugadores
      navigation.navigate('Mostrar Jugadores'); 
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={logo} 
        style={styles.logo} 
      />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          accessible={true}
          accessibilityLabel="Campo para ingresar tu nombre de usuario"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          accessible={true}
          accessibilityLabel="Campo para ingresar tu contraseña"
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          accessible={true} 
          accessibilityLabel="Botón para iniciar sesión"
        >
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupButton}
          accessible={true} 
          accessibilityLabel="Botón para recuperar usuario o contraseña"
        >
          <Text style={styles.signupButtonText}>
            ¿Olvidaste tu Usuario y/o Contraseña?
          </Text>
          <Text style={styles.signupButtonText}>Ingrese Aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    width: '100%',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'blue',
    fontSize: 14,
  },
});

export default LoginScreen;
