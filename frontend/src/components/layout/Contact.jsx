import AnimatedContent from "../ui/animatedContent";
import imagefac from "../../assets/images/factory.jpg";

function Contact() {
  return (
    <AnimatedContent>
      {/* <Header />
      <NavBar /> */}
      <main className="rule-content">
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
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: 400,
                }}
              >
                Contact
              </h1>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: 400,
                }}
              >
                Partron Vina Co., Ltd.
              </h2>
              <div style={{ fontSize: "16px", color: "#222", lineHeight: "1.8" }}>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>1. Khai Quang</div>
                <div style={{ marginLeft: "16px" }}>
                  <div><p>Công ty TNHH Partron Vina</p></div>
                  <div><strong>MST:</strong> 2500298765</div>
                  <div> <span style={{ fontWeight: "bold"}}>Address: </span>Lô 11, Khu công nghiệp Khai Quang, Phường Vĩnh Phúc, Tỉnh Phú Thọ, Việt Nam.</div>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>2. Đồng Sóc</div>
                <div style={{ marginLeft: "16px" }}>
                  <div><p>Công ty TNHH Partron Vina - Chi nhánh Đồng Sóc</p></div>
                  <div><strong>MST:</strong> 2500298765-002</div>
                  <div> <span style={{ fontWeight: "bold"}}>Address: </span>Lô CN03-03, Cụm Công nghiệp Đồng Sóc, Xã Vĩnh Tường, Tỉnh Phú Thọ, Việt Nam.</div>
                </div>
              </div>

              <div>
                <div><strong>Phone:</strong> 012 345 6789</div>
                <div><strong>Fax:</strong> 012 345 6789</div>
                <div><strong>Email:</strong> partronvina@gmail.com</div>
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
                boxShadow:
                  "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                
              }}
            />
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </AnimatedContent>
  );
}

export default Contact;
