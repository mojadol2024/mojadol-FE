import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

export default function GooeyMenu({ navigation }) { // navigation props 추가
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
    const angle = (Math.PI / 4) * index;
    const distance = 100;
    const x = Math.cos(angle) * distance;
    const y = -Math.abs(Math.sin(angle) * distance);

    return {
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
      {/* 서브 버튼들 */}
      {[{ text: 'MY', target: 'MyPage' }, { text: '게시판', target: 'Board' }, { text: '발견', target: 'DogRegistration' }, { text: '실종', target: 'MissingDogRegistration' }].map(
        (item, index) => (
          <Animated.View key={index} style={[styles.menuItem, menuStyle(index)]}>
            <TouchableOpacity onPress={() => item.target && navigation.navigate(item.target)}>
              <Text style={styles.menuText}>{item.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        )
      )}
      {/* 중앙 버튼 */}
      <TouchableOpacity style={styles.centerButton} onPress={toggleMenu}>
        <Text style={styles.menuText}>{menuOpen ? 'X' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centerButton: {
    width: 60,
    height: 60,
    backgroundColor: '#E7F3FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 2,
  },
  menuItem: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#E7F3FF',
    borderRadius: 25,
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
}); 