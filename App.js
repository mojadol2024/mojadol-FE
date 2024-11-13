import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginNavigator from './src/navigation/LoginNavigator';
import SignUpScreen from './src/screens/dog';  // Board 스크린 import

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SignUpScreen/>
    </NavigationContainer>
  );
};

export default App;