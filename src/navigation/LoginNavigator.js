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
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import StartLogin from '../screens/StartLogin';
import ForgetAccount from '../screens/ForgetAccount';
import MyActive from '../screens/MyActive';
import TermsAgreement from '../screens/TermsAgreement';
import Terms1 from '../screens/Terms1'; // 서비스 이용 약관 화면
import Terms2 from '../screens/Terms2'; // 개인정보 처리방침 화면
import Terms3 from '../screens/Terms3'; // 개인정보 수집 및 이용 동의 화면
import Terms4 from '../screens/Terms4'; // 개인정보 제3자 제공 동의 화면
const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
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
      <Stack.Screen name="MissingDogRegistration" component={MissingDogRegistration} />
      <Stack.Screen name="TermsAgreement" component={TermsAgreement} /> {/* TermsAgreement 추가 */}
      <Stack.Screen name="Terms1" component={Terms1} /> {/* 서비스 이용 약관 */}
      <Stack.Screen name="Terms2" component={Terms2} /> {/* 개인정보 처리방침 */}
      <Stack.Screen name="Terms3" component={Terms3} /> {/* 개인정보 수집 및 이용 동의 */}
      <Stack.Screen name="Terms4" component={Terms4} /> {/* 개인정보 제3자 제공 동의 */}
    </Stack.Navigator>
  );
};

export default LoginNavigator;
