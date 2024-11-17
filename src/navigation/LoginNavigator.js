import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import Home from '../screens/Home';
import Board from '../screens/Board';
import BoardDetail from '../screens/BoardClick';
const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Board" component={Board} />
      <Stack.Screen name="BoardDetail" component={BoardDetail} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
