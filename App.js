import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginNavigator from './src/navigation/LoginNavigator';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <LoginNavigator/>
    </NavigationContainer>
  );
};

export default App;
