import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router를 사용한다고 가정

const TermsAgreement = () => {
  const navigate = useNavigate();
  const [allChecked, setAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState({
    termsOfService: false,
    privacyPolicy: false,
    dataCollection: false,
    dataSharing: false,
    marketingConsent: false, // 광고성 정보 수신 동의
  });

  const handleAllCheck = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setIndividualChecks({
      termsOfService: newCheckedState,
      privacyPolicy: newCheckedState,
      dataCollection: newCheckedState,
      dataSharing: newCheckedState,
      marketingConsent: newCheckedState, // 전체 동의 포함
    });
  };

  const handleIndividualCheck = (key) => {
    setIndividualChecks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setAllChecked(Object.values(updated).every((value) => value));
      return updated;
    });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "Arial" }}>
      <div style={{ marginBottom: "40px", textAlign: "left" }}>
        <img
          src="./logo.png"
          alt="Logo"
          style={{ width: "100px", marginBottom: "10px" }}
        />
        <h2 style={{ margin: "10px 0" }}>고객님 환영합니다!</h2>
        <p style={{ margin: "10px 0 30px", fontSize: "14px" }}>
          아래 약관에 동의하시면 추견 60분이 시작됩니다!
        </p>
      </div>
      <div style={{ marginBottom: "0px" }}>
        <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={allChecked}
            onChange={handleAllCheck}
            style={{ marginRight: "10px" }}
          />
          <strong>약관 전체 동의</strong>
        </label>
      </div>
      <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={individualChecks.termsOfService}
            onChange={() => handleIndividualCheck("termsOfService")}
            style={{ marginRight: "10px" }}
          />
          (필수) 서비스 이용 약관 동의
        </label>
        <button
          onClick={() => navigate("/terms1")} // 약관 상세 화면으로 이동
          style={{
            fontSize: "12px",
            color: "#888",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          [서비스 이용 약관 보기]
        </button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={individualChecks.privacyPolicy}
            onChange={() => handleIndividualCheck("privacyPolicy")}
            style={{ marginRight: "10px" }}
          />
          (필수) 개인정보 처리방침 동의
        </label>
        <button
          onClick={() => navigate("/terms2")} // 약관 상세 화면으로 이동
          style={{
            fontSize: "12px",
            color: "#888",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          [개인정보 처리방침 보기]
        </button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={individualChecks.dataCollection}
            onChange={() => handleIndividualCheck("dataCollection")}
            style={{ marginRight: "10px" }}
          />
          (필수) 개인정보 수집 및 이용 동의
        </label>
        <button
          onClick={() => navigate("/terms3")} // 약관 상세 화면으로 이동
          style={{
            fontSize: "12px",
            color: "#888",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          [개인정보 수집 및 이용 약관 보기]
        </button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={individualChecks.dataSharing}
            onChange={() => handleIndividualCheck("dataSharing")}
            style={{ marginRight: "10px" }}
          />
          (필수) 개인정보 제3자 제공 동의
        </label>
        <button
          onClick={() => navigate("/temrs4")} // 약관 상세 화면으로 이동
          style={{
            fontSize: "12px",
            color: "#888",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          [개인정보 제3자 제공 약관 보기]
        </button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={individualChecks.marketingConsent}
            onChange={() => handleIndividualCheck("marketingConsent")}
            style={{ marginRight: "10px" }}
          />
          (선택) E-mail 및 SMS 광고성 정보 수신 동의
        </label>
        <p style={{ fontSize: "12px", color: "#888" }}>
          당신의 소중한 반려견과 관련된 소식을 들을 수 있습니다.
        </p>
      </div>
      <button
        onClick={() => navigate("/sign-up-screen")} // SignUpScreen으로 돌아감
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        이전
      </button>
    </div>
  );
};

export default TermsAgreement;
