import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import Home from '../screens/Home';
import Board from '../screens/Board';

const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Board" component={Board} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
