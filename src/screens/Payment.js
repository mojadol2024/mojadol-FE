import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Bootpay } from 'react-native-bootpay-api'; 

export default function App() {
  const bootpay = useRef(null);

  const goBootpayTest = () => {   
    const payload = {
      pg: '나이스페이',
      method: '카드',
      order_name: '후원금',
      order_id: '1234_1235',
      price: 9900,
    };

    const items = [
      {
        name: '후원금',
        qty: 1,
        id: 'ITEM_CODE_SUPPORT',
        price: 9900,
        cat1: '후원',
        cat2: '유기견 지원',
        cat3: '기타',
      }
    ];

    const user = {
      id: 'user_id_1234',
      username: '홍길동',
      email: 'user1234@gmail.com',
      gender: 0,
      birth: '1986-10-14',
      phone: '01012345678',
      area: '서울',
      addr: '서울시 동작구 상도로',
    };

    const extra = {
      card_quota: "0,2,3",
      app_scheme: "bootpayrnapi",
      show_close_button: false,
    };

    if (bootpay.current) {
      bootpay.current.requestPayment(payload, items, user, extra);
    }
  };

  const onCancel = (data) => {
    console.log('-- cancel', data); 
  };

  const onError = (data) => {
    console.log('-- error', data);
  };

  const onIssued = (data) => {
    console.log('-- issued', data);
  };

  const onConfirm = (data) => {
    console.log('-- confirm', data);
    if (bootpay.current) {
      bootpay.current.transactionConfirm(data);
    }
  };

  const onDone = (data) => {
    console.log('-- done', data);
  };

  const onClose = () => {
    console.log('-- closed');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.description}>추견60분을 후원해주셔서 감사합니다.❤️{'\n'}후원금 일부는 유기견 지원 사업에 사용됩니다.{'\n'}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={goBootpayTest}
      >
        <Text style={styles.buttonText}>후원하기</Text>
      </TouchableOpacity> 

      <Text style={styles.price}>￦9,900</Text>

      <Bootpay 
        ref={bootpay}
        ios_application_id={'5b8f6a4d396fa665fdc2b5e9'}
        android_application_id={'5b8f6a4d396fa665fdc2b5e8'} 
        onCancel={onCancel}
        onError={onError}
        onIssued={onIssued}
        onConfirm={onConfirm}
        onDone={onDone}
        onClose={onClose} 
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F1c0ba',
    padding: 10,
    marginTop: 30,
    width: '60%',
    borderRadius: 22.375,
  },
  buttonText: {
    color: '#FFFFFF',  
    fontWeight: 'bold', 
    fontSize: 20,  
  },
  price: {
    fontSize: 14,
    color: '#F1c0ba', 
    fontWeight: 'bold', 
    marginTop: 5, 
  }
});
