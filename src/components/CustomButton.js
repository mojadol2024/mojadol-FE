import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C78C30',
    padding: 15,
    borderRadius: 22.375,
    alignItems: 'center',
    marginTop: 10,
    width: 220
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomButton;
 //컴포먼트에서 css,버튼 input css ui 파dlf  개발은 스크린스에서
 //컴포먼트는 함수같은 느낌. css저장해두고 사용
 //utils는 기능함수
 //도커허브 로그인하고 도커토큰만들고 도커이미지 도커허브 cicd gitaction aws docker
 //app.js에서 내가 만들고 있는 파일 이름만 컴포먼트에 넣으면 그 화면이 안드로이드에 뜨게 됨