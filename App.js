import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importar las pantallas
import Mostrar_jugadores from "./screens/Mostrar_jugadores";
import Jugadores from "./screens/Jugadores";
import Editar_jugadores from "./screens/Editar_jugadores";
import Login from "./screens/Login";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false, // Oculta completamente el encabezado
          }}
        />
        <Stack.Screen
          name="Mostrar Jugadores"
          component={Mostrar_jugadores}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Crear Jugadores"
          component={Jugadores}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Editar Jugador"
          component={Editar_jugadores}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

