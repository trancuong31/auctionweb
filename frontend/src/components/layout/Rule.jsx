import React from "react";
import AnimatedContent from "../ui/animatedContent";

function Rule() {
  const ruleTitle = "Nguyên tắc đấu giá trực tuyến";

  const ruleList = [
    "1. Tuân thủ quy định của pháp luật về đấu giá tài sản.",
    "2. Bảo mật về tài khoản truy cập, thông tin về người tham gia đấu giá và các thông tin khác theo quy định của pháp luật.",
    "3. Bảo đảm tính khách quan, minh bạch, an toàn, an ninh mạng.",
    "4. Bảo vệ quyền và lợi ích hợp pháp của người có tài sản, người tham gia đấu giá và cá nhân, tổ chức có liên quan.",
  ];

  return (
    <AnimatedContent>
      <main className="rule-content" translate="yes">
        <div
          style={{
            background: "#fff",
            borderRadius: "6px",
            padding: "32px",
            maxWidth: "1200px",
            margin: "40px auto",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            {ruleTitle}
          </h3>
          <ol
            className="google-translate-section"
            style={{
              fontSize: "18px",
              color: "#222",
              fontStyle: "italic",
              lineHeight: "2",
            }}
          >
            {ruleList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      </main>
    </AnimatedContent>
  );
}

export default Rule;
