import React from "react";
import { Link } from "react-router-dom";

const Terms3 = () => (
  <div style={{ padding: "20px", fontFamily: "Arial" }}>
    <h2>개인정보 수집 및 이용 동의</h2>
    <p>
      수집 항목: 이름, 이메일 주소, 전화번호, 서비스 이용 기록 등.
      이용 목적: 맞춤형 서비스 제공, 고객 지원, 마케팅 분석.
    </p>
    <p>
      보유 기간: 이용 목적 달성 후 즉시 삭제하거나 관련 법률에 따라 보관됩니다.
      사용자는 개인정보 제공을 거부할 수 있으며, 이 경우 서비스 이용이 제한될 수 있습니다.
    </p>
    <Link to="/terms-agreement" style={{ color: "#4CAF50" }}>
      돌아가기
    </Link>
  </div>
);

export default Terms3;
