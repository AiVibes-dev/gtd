import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/components/Login';
import { Register } from './src/components/Register';
import { Dashboard } from './src/components/Dashboard';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={Login}
        />
        <Stack.Screen 
          name="Register" 
          component={Register}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 