import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 각 화면 컴포넌트를 생성
const MyPage = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>My Page</Text>
  </View>
);

const Board = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Board</Text>
  </View>
);

const DogRegistration = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Dog Registration</Text>
  </View>
);

const MissingDogRegistration = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Missing Dog Registration</Text>
  </View>
);

// 중앙 메뉴 컴포넌트
function GooeyMenu({ navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: menuOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const menuStyle = (index) => {
    const distance = 80;
    const direction = index % 2 === 0 ? 1 : -1;
    const x = distance * Math.ceil((index + 1) / 2) * direction;
    const y = -10;

    return {
      opacity: menuAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateX: menuAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, x],
          }),
        },
        {
          translateY: menuAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, y],
          }),
        },
      ],
    };
  };

  return (
    <View style={styles.container}>
      {[
        { text: 'MY', target: 'MyPage' },
        { text: '게시판', target: 'Board' },
        { text: '제보', target: 'DogRegistration' },
        { text: '실종', target: 'MissingDogRegistration' },
      ].map((item, index) => (
        <Animated.View key={index} style={[styles.menuItem, menuStyle(index)]}>
          <TouchableOpacity onPress={() => navigation.navigate(item.target)}>
            <Text style={styles.menuText}>{item.text}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <TouchableOpacity style={styles.centerButton} onPress={toggleMenu}>
        <Text style={styles.menuText}>{menuOpen ? 'X' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// 스택 네비게이터 설정
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={GooeyMenu} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="Board" component={Board} />
        <Stack.Screen name="DogRegistration" component={DogRegistration} />
        <Stack.Screen
          name="MissingDogRegistration"
          component={MissingDogRegistration}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  centerButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFC107',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    position: 'absolute',
    bottom: 10,
    zIndex: 2,
  },
  menuItem: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#FFC107',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
  menuText: {
    color: '#444',
    fontWeight: 'bold',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  screenText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
