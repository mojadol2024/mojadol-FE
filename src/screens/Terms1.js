import React from "react";
import { Link } from "react-router-dom";

const Terms1 = () => (
  <div style={{ padding: "20px", fontFamily: "Arial" }}>
    <h2>서비스 이용 약관</h2>
    <p>
      본 약관은 사용자가 제공되는 서비스 이용 시 준수해야 할 규정을 명시합니다.
      사용자는 서비스를 오용하거나, 불법적인 활동에 서비스를 이용해서는 안 됩니다.
      서비스는 사전 공지 없이 변경될 수 있으며, 사용자는 변경된 약관에 동의하는 것으로 간주됩니다.
    </p>
    <p>
      서비스 제공자는 사용자에게 사전 동의 없이 서비스 운영을 중단하거나 이용을 제한할 권리가 있습니다.
    </p>
    <Link to="/terms-agreement" style={{ color: "#4CAF50" }}>
      돌아가기
    </Link>
  </div>
);

export default Terms1;
