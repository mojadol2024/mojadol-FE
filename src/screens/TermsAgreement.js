import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const TermsAgreement = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [allChecked, setAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState({
    termsOfService: false,
    privacyPolicy: false,
    dataCollection: false,
    dataSharing: false,
    marketingConsent: false,
  });

  const [modalVisible, setModalVisible] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  });

  const termsDetails = [
    {
      title: "(필수) 서비스 이용 약관 동의",
      content: `본 약관은 사용자가 제공되는 서비스 이용 시 준수해야 할 규정을 명시합니다.
사용자는 서비스를 오용하거나, 불법적인 활동에 서비스를 이용해서는 안 됩니다.
서비스는 사전 공지 없이 변경될 수 있으며, 사용자는 변경된 약관에 동의하는 것으로 간주됩니다.

서비스 제공자는 사용자에게 사전 동의 없이 서비스 운영을 중단하거나 이용을 제한할 권리가 있습니다.`,
    },
    {
      title: "(필수) 개인정보 처리방침 동의",
      content: `사용자의 개인정보는 관련 법률에 따라 보호되며, 명시된 목적으로만 사용됩니다.
수집된 개인정보는 사용자 경험 향상 및 서비스 개선을 위해 사용됩니다.

사용자는 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
개인정보는 제3자와 공유되지 않으며, 사용자가 동의한 경우에만 제한적으로 사용됩니다.`,
    },
    {
      title: "(필수) 개인정보 수집 및 이용 동의",
      content: `수집항목: 이름, 이메일 주소, 전화번호, 서비스 이용 기록 등.
이용목적: 맞춤형 서비스 제공, 고객 지원, 마케팅 분석.

보유기간: 이용 목적 달성 후 즉시 삭제하거나 관련 법률에 따라 보관됩니다.
사용자는 개인정보 제공을 거부할 수 있으며, 이 경우 서비스 이용이 제한될 수 있습니다.`,
    },
    {
      title: "(필수) 개인정보 제3자 제공 동의",
      content: `제공목적: 서비스 운영에 필요한 협력사와의 협력.
제공대상: 결제 대행사, 물류 서비스 업체 등.

제공되는 정보: 최소한의 필수 정보 (예: 이름, 주소, 연락처 등).
사용자는 제3자 제공 동의를 거부할 권리가 있으며, 이에 따라 일부 서비스 이용이 제한될 수 있습니다.`,
    },
  ];

  const termsList = [
    {
      key: "termsOfService",
      label: "(필수) 서비스 이용 약관 동의",
      modal: "terms1",
      buttonLabel: "서비스 이용 약관 보기",
    },
    {
      key: "privacyPolicy",
      label: "(필수) 개인정보 처리방침 동의",
      modal: "terms2",
      buttonLabel: "개인정보 처리방침 보기",
    },
    {
      key: "dataCollection",
      label: "(필수) 개인정보 수집 및 이용 동의",
      modal: "terms3",
      buttonLabel: "개인정보 수집 및 이용 약관 보기",
    },
    {
      key: "dataSharing",
      label: "(필수) 개인정보 제3자 제공 동의",
      modal: "terms4",
      buttonLabel: "개인정보 제3자 제공 약관 보기",
    },
  ];

  const handleAllCheck = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setIndividualChecks({
      termsOfService: newCheckedState,
      privacyPolicy: newCheckedState,
      dataCollection: newCheckedState,
      dataSharing: newCheckedState,
      marketingConsent: newCheckedState,
    });
  };

  const handleIndividualCheck = (key) => {
    setIndividualChecks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const allRequiredChecked =
        updated.termsOfService &&
        updated.privacyPolicy &&
        updated.dataCollection &&
        updated.dataSharing;

      setAllChecked(allRequiredChecked);
      return updated;
    });
  };

  const handleSubmit = () => {
    const allRequiredAgreed =
      individualChecks.termsOfService &&
      individualChecks.privacyPolicy &&
      individualChecks.dataCollection &&
      individualChecks.dataSharing;

    if (allRequiredAgreed) {
      // Ensure the setAgreementChecked method exists before calling
      if (route.params?.setAgreementChecked) {
        route.params.setAgreementChecked(true);
      }
      Alert.alert("Success", "약관 동의가 완료되었습니다.");
      navigation.goBack(); // 회원가입 페이지로 이동
    } else {
      Alert.alert("Error", "필수 약관에 동의해주세요.");
    }
  };

  const toggleModal = (modalKey) => {
    setModalVisible(prev => ({
      ...Object.fromEntries(Object.keys(prev).map(key => [key, false])),
      [modalKey]: !prev[modalKey]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        {/* 로고 이미지 삽입 */}
        <Image
          source={require("../assets/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        {/* 환영 메시지 */}
        <Text style={styles.welcome}>고객님 환영합니다!</Text>
        <Text style={styles.description}>
          아래 약관에 동의하시면 추견 60분이 시작됩니다!
        </Text>
      </View>

      {/* 전체 동의 */}
      <View style={styles.section}>
        <TouchableOpacity onPress={handleAllCheck} style={styles.checkboxContainer}>
          <Text style={styles.checkbox}>{allChecked ? "☑️" : "⬜"}</Text>
          <Text style={styles.textBold}>약관 전체 동의</Text>
        </TouchableOpacity>
      </View>

      {/* 약관 목록 */}
      {termsList.map((item, index) => (
        <View key={index} style={styles.section}>
          <TouchableOpacity
            onPress={() => handleIndividualCheck(item.key)}
            style={styles.checkboxContainer}
          >
            <Text style={styles.checkbox}>
              {individualChecks[item.key] ? "✔️" : "⬜"}
            </Text>
            <Text>{item.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleModal(item.modal)}
          >
            <Text style={styles.link}>{item.buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* 약관 모달 */}
      {termsDetails.map((term, index) => (
        <Modal
          key={`terms${index + 1}`}
          visible={modalVisible[`terms${index + 1}`]}
          transparent={true}
          animationType="slide"
          onRequestClose={() => toggleModal(`terms${index + 1}`)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{term.title}</Text>
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalText}>{term.content}</Text>
              </ScrollView>
              <TouchableOpacity
                onPress={() => toggleModal(`terms${index + 1}`)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ))}

      {/* 제출 버튼 */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>동의하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 30,
    marginTop: 10, // 추가: 화면 상단에서 더 내려오도록 설정
  },
  logoImage: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 10, // 추가: 텍스트를 조금 더 아래로 이동
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    color: "#888",
    marginTop: 10,
    marginBottom: 10, // 추가: 설명과 다음 섹션 사이 간격 증가
  },
  section: {
    marginBottom: 20, // 기존: 20 → 간격을 늘려서 각 섹션을 아래로 이동
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // 추가: 체크박스와 텍스트 사이 간격 설정
  },
  checkbox: {
    marginRight: 10,
    fontSize: 20,
  },
  textBold: {
    fontWeight: "bold",
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "underline",
    marginTop: 10, // 추가: 링크 간격 조정
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalContent: {
    maxHeight: 300,
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
    color: "#333",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F1c0ba",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20, // 버튼을 아래로 이동
    padding: 15,
    backgroundColor: "#F1c0ba",
    borderRadius: 22.375,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TermsAgreement;