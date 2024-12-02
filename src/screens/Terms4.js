import React from "react";
import { Link } from "react-router-dom";

const Terms4 = () => (
  <div style={{ padding: "20px", fontFamily: "Arial" }}>
    <h2>개인정보 제3자 제공 동의</h2>
    <p>
      제공 목적: 서비스 운영에 필요한 협력사와의 협력.
      제공 대상: 결제 대행사, 물류 서비스 업체 등.
    </p>
    <p>
      제공되는 정보: 최소한의 필수 정보 (예: 이름, 주소, 연락처 등).
      사용자는 제3자 제공 동의를 거부할 권리가 있으며, 이에 따라 일부 서비스 이용이 제한될 수 있습니다.
    </p>
    <Link to="/terms-agreement" style={{ color: "#4CAF50" }}>
      돌아가기
    </Link>
  </div>
);

export default Terms4;
