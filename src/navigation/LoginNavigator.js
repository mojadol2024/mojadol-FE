import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import Home from '../screens/Home';
import Board from '../screens/Board';
import BoardDetail from '../screens/BoardClick';
import BoardUpdate from '../screens/BoardUpdate';
import DogRegistration from '../screens/DogRegistration';
import PaymentScreen from '../screens/Payment';
import MyPage from '../screens/MyPage';
import MissingDogRegistration from '../screens/MissingDogRegistration';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import StartLogin from '../screens/StartLogin';
const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="StartLogin" component={StartLogin} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Board" component={Board} />
      <Stack.Screen name="BoardDetail" component={BoardDetail} />
      <Stack.Screen name="BoardUpdate" component={BoardUpdate} />
      <Stack.Screen name="DogRegistration" component={DogRegistration} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="MyPage" component={MyPage} />
      <Stack.Screen name="MissingDogRegistration" component={MissingDogRegistration} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
