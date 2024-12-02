import React from "react";
import { Link } from "react-router-dom";

const Terms2 = () => (
  <div style={{ padding: "20px", fontFamily: "Arial" }}>
    <h2>개인정보 처리방침</h2>
    <p>
      사용자의 개인정보는 관련 법률에 따라 보호되며, 명시된 목적으로만 사용됩니다.
      수집된 개인정보는 사용자 경험 향상 및 서비스 개선을 위해 사용됩니다.
    </p>
    <p>
      사용자는 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다. 개인정보는 제3자와 공유되지 않으며,
      사용자가 동의한 경우에만 제한적으로 사용됩니다.
    </p>
    <Link to="/terms-agreement" style={{ color: "#4CAF50" }}>
      돌아가기
    </Link>
  </div>
);

export default Terms2;
