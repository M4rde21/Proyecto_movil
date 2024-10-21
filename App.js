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
  const Stack = createStackNavigator(); // Inicializar el stack

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "LIGA DE ESTRELLAS",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#2626ff" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Mostrar Jugadores"
          component={Mostrar_jugadores}
          options={{
            title: "MOSTRAR JUGADORES",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#2626ff" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Crear Jugadores"
          component={Jugadores}
          options={{
            title: "CREAR JUGADORES",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#2626ff" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Editar Jugador"
          component={Editar_jugadores}
          options={{
            title: "EDITAR JUGADOR",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#2626ff" },
            headerTintColor: "#fff",
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
