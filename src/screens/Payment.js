import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Bootpay, Extra } from 'react-native-bootpay-api'; 

export default function App() {
  const bootpay = useRef(null);

  const goBootpayTest = () => {   
    const payload = {
      pg: '나이스페이',  // ['kcp', 'danal', 'inicis', 'nicepay', 'lgup', 'toss', 'payapp', 'easypay', 'jtnet', 'tpay', 'mobilians', 'payletter', 'onestore', 'welcome'] 중 택 1
      method: '카드',  // ['카드', '휴대폰', '계좌이체', '가상계좌', '카카오페이', '네이버페이', '페이코', '카드자동'] 중 택 1 
      order_name: '마스카라', // 결제창에 보여질 상품명
      order_id: '1234_1234', // 개발사에 관리하는 주문번호
      price: 1000, // 결제금액
    };

    const items = [
      {
        name: '키보드',
        qty: 1,
        id: 'ITEM_CODE_KEYBOARD',
        price: 1000,
        cat1: '패션',
        cat2: '여성상의',
        cat3: '블라우스',
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

  const goBootpaySubscriptionTest = () => {   
    const payload = {
      pg: '나이스페이',
      method: '카드자동',
      order_name: '마스카라',
      subscription_id: '12345_21345',
      price: 1000,
    };

    const items = [
      {
        name: '키보드',
        qty: 1,
        id: 'ITEM_CODE_KEYBOARD',
        price: 1000,
        cat1: '패션',
        cat2: '여성상의',
        cat3: '블라우스',
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
      app_scheme: "bootpayrnapi2",
      show_close_button: false,
    };

    if (bootpay.current) {
      bootpay.current.requestSubscription(payload, items, user, extra);
    }
  };

  const goBootpayAuthTest = () => {
    const payload = {
      pg: '다날',
      method: '본인인증',
      order_name: '마스카라',
      authentication_id: '12345_21345',
    };

    const extra = {
      app_scheme: "bootpayrnapi",
      show_close_button: true,
    };

    if (bootpay.current) {
      bootpay.current.requestAuthentication(payload, [], {}, extra);
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
      <TouchableOpacity
        style={styles.button}
        onPress={goBootpayTest}
      >
        <Text>일반결제 결제테스트</Text>
      </TouchableOpacity> 

      <Bootpay 
        ref={bootpay}
        ios_application_id={'5b8f6a4d396fa665fdc2b5e9'}
        android_application_id={'6742cf8031d38115ba3fc7d2'} 
        onCancel={onCancel}
        onError={onError}
        onIssued={onIssued}
        onConfirm={onConfirm}
        onDone={onDone}
        onClose={onClose} 
      /> 

      <TouchableOpacity
        style={styles.button}
        onPress={goBootpaySubscriptionTest}
      >
        <Text>정기결제 테스트</Text>
      </TouchableOpacity> 

      <TouchableOpacity
        style={styles.button}
        onPress={goBootpayAuthTest}
      >
        <Text>본인인증 테스트</Text>
      </TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 10,
  },
});
