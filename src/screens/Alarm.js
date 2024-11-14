import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const Alarm = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [commentAlert, setCommentAlert] = useState(true);
  const [chatAlert, setChatAlert] = useState(true);
  const [newPostAlert, setNewPostAlert] = useState(false);
  const [dogRegistrationAlert, setDogRegistrationAlert] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 설정</Text>

      {/* Push Notifications */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>푸시 알림</Text>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
      </View>

      {/* Comment Alert */}
      <TouchableOpacity style={styles.optionItem} onPress={() => setCommentAlert(!commentAlert)}>
        <Text style={styles.optionText}>댓글 알림</Text>
        <Text style={[styles.optionStatus, commentAlert ? styles.on : styles.off]}>
          {commentAlert ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      {/* Chat Alert */}
      <TouchableOpacity style={styles.optionItem} onPress={() => setChatAlert(!chatAlert)}>
        <Text style={styles.optionText}>채팅 알림</Text>
        <Text style={[styles.optionStatus, chatAlert ? styles.on : styles.off]}>
          {chatAlert ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      {/* New Post Alert */}
      <TouchableOpacity style={styles.optionItem} onPress={() => setNewPostAlert(!newPostAlert)}>
        <Text style={styles.optionText}>새글 알림</Text>
        <Text style={[styles.optionStatus, newPostAlert ? styles.on : styles.off]}>
          {newPostAlert ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      {/* Dog Registration Alert */}
      <TouchableOpacity style={styles.optionItem} onPress={() => setDogRegistrationAlert(!dogRegistrationAlert)}>
        <Text style={styles.optionText}>등록견 알림</Text>
        <Text style={[styles.optionStatus, dogRegistrationAlert ? styles.on : styles.off]}>
          {dogRegistrationAlert ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 18,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
  },
  optionStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  on: {
    color: '#1A73E8',
  },
  off: {
    color: '#888',
  },
});

export default Alarm;
