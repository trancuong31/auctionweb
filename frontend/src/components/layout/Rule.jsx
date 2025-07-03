import NavBar from "./NavBar";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
function Rule() {
  return (
    <>
        {/* <Header /> */}
        {/* <NavBar /> */}
        <main className="rule-content">
        <div style={{
            background: "#fff",
            borderRadius: "6px",
            padding: "32px",
            maxWidth: "1200px",
            margin: "40px auto",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)"
        }}>
            <h3 style={{fontStyle: "italic", fontWeight: "bold", marginBottom: "24px"}}>Nguyên tắc đấu giá trực tuyến</h3>
            <ol style={{fontSize: "18px", color: "#222", fontStyle: "italic", lineHeight: "2"}}>
            <li>1. Tuân thủ quy định của pháp luật về đấu giá tài sản.</li>
            <li>2. Bảo mật về tài khoản truy cập, thông tin về người tham gia đấu giá và các thông tin khác theo quy định của pháp luật.</li>
            <li>3. Bảo đảm tính khách quan, minh bạch, an toàn, an ninh mạng.</li>
            <li>4. Bảo vệ quyền và lợi ích hợp pháp của người có tài sản, người tham gia đấu giá và cá nhân, tổ chức có liên quan.</li>
            </ol>
        </div>
        </main>
        {/* <Footer /> */}
        </>
    );
}
export default Rule;