import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const NotificationSettingsScreen = () => {
  const [noticeAlert, setNoticeAlert] = useState(false);
  const [commentAlert, setCommentAlert] = useState(false);
  const [marketingAlert, setMarketingAlert] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 설정</Text>
      
      <View style={styles.setting}>
        <Text style={styles.settingText}>공지 알림</Text>
        <Switch
          value={noticeAlert}
          onValueChange={(value) => setNoticeAlert(value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>댓글 알림</Text>
        <Switch
          value={commentAlert}
          onValueChange={(value) => setCommentAlert(value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>혜택 및 마케팅 정보 알림</Text>
        <Switch
          value={marketingAlert}
          onValueChange={(value) => setMarketingAlert(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  settingText: {
    fontSize: 18,
  },
});

export default NotificationSettings;
