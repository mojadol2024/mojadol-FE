import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import Board from '../screens/Board';
import BoardDetail from '../screens/BoardClick';
import BoardUpdate from '../screens/BoardUpdate';
import DogRegistration from '../screens/DogRegistration';
import PaymentScreen from '../screens/Payment';
import MyPage from '../screens/MyPage';
import MissingDogRegistration from '../screens/MissingDogRegistration';

import SignUpScreen from '../screens/SignUpScreen';
import StartLogin from '../screens/StartLogin';
import ForgetAccount from '../screens/ForgetAccount';
import ResetPassword from '../screens/ResetPassword';
import MyActive from '../screens/MyActive';
import EditProfileScreen from '../screens/EditProfileScreen';
import InquiryList from '../screens/InquiryList';
import Alarm from '../screens/Alarm';
import NoticeScreen from '../screens/NoticeScreen';
import Payment from '../screens/Payment';
const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="StartLogin" component={StartLogin} />
      <Stack.Screen name="ForgetAccount" component={ForgetAccount} />
      <Stack.Screen name="Board" component={Board} />
      <Stack.Screen name="BoardDetail" component={BoardDetail} />
      <Stack.Screen name="BoardUpdate" component={BoardUpdate} />
      <Stack.Screen name="DogRegistration" component={DogRegistration} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="MyPage" component={MyPage} />
      <Stack.Screen name="MyActive" component={MyActive} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="MissingDogRegistration" component={MissingDogRegistration} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="InquiryList" component={InquiryList} />
      <Stack.Screen name="Alarm" component={Alarm} />
      <Stack.Screen name="NoticeScreen" component={NoticeScreen} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
