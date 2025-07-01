import NavBar from "./NavBar";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import imagefac from "../../assets/images/factory.jpg";

function Tutorial() {
  return (
    <>
        <Header />
        <NavBar />
            <main className="rule-content">
        <div
          style={{
            background: "#fff",
            borderRadius: "6px",
            padding: "32px",
            maxWidth: "1200px",
            margin: "40px auto",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "48px", fontWeight: 400, marginBottom: "16px" }}>Contact</h1>
              <h2 style={{ fontSize: "32px", fontWeight: 400, marginBottom: "32px" }}>
                Partron Vina Co., Ltd.
              </h2>
              <div style={{ fontSize: "16px", color: "#222", lineHeight: "2" }}>
                <div>
                  <span style={{ fontWeight: 400 }}>Address :</span> Lô 11, Khu công nghiệp Khai Quang, Phường Khai Quang, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc, Việt Nam
                </div>
                <div>
                  <span style={{ fontWeight: 400 }}>Phone number :</span> 012 345 6789
                </div>
                <div>
                  <span style={{ fontWeight: 400 }}>Fax :</span> 012 345 6789
                </div>
                <div>
                  <span style={{ fontWeight: 400 }}>Email :</span> partronvina@gmail.com
                </div>
              </div>
            </div>
            <img
              src={imagefac}
              alt="Liên hệ"
              style={{
                width: "40%",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        </div>
      </main>
        <Footer />
        </>
    );
}
export default Tutorial;