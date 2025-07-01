import NavBar from "./NavBar";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import login from "../../assets/images/login.png";
import register from "../../assets/images/register.png";

function Tutorial() {
  return (
    <>
        <Header />
        <NavBar />
        <main className="information-content">
            <div
                style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "40px",
                maxWidth: "1200px",
                margin: "40px auto",
                boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                }}
            >
                <h2
                style={{
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    marginBottom: "32px",
                    color: "#2d3748",
                    letterSpacing: "1px",
                    textAlign: "center",
                }}
                >
                Tầm nhìn & Định hướng phát triển
                </h2>
                <div style={{ fontSize: "18px", color: "#222", lineHeight: "2", marginBottom: "32px" }}>
                <p>
                    Với vị thế là một trong những doanh nghiệp hàng đầu trong lĩnh vực sản xuất linh kiện điện tử tại Việt Nam, Công ty TNHH Partron Vina luôn không ngừng đổi mới và tiên phong trong việc áp dụng công nghệ vào hoạt động kinh doanh. Việc triển khai nền tảng đấu giá trực tuyến không chỉ là bước tiến trong việc đa dạng hóa kênh phân phối sản phẩm mà còn thể hiện cam kết của công ty trong việc nâng cao trải nghiệm khách hàng và tối ưu hóa giá trị sản phẩm.
                </p>
                <p>
                    Thông qua nền tảng này, Partron Vina hướng đến việc tạo ra một môi trường giao dịch minh bạch, công bằng và hiệu quả, đồng thời mở rộng cơ hội tiếp cận sản phẩm đến nhiều đối tượng khách hàng hơn.
                </p>
                </div>
                <h3
                style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "20px",
                    color: "#4a5568",
                }}
                >
                Lĩnh vực hoạt động của nền tảng đấu giá
                </h3>
                <ul style={{ fontSize: "18px", color: "#222", lineHeight: "2", marginLeft: "24px", marginBottom: "24px" }}>
                <li>
                    <strong>Đấu giá sản phẩm linh kiện điện tử:</strong> Cung cấp các sản phẩm do Partron Vina sản xuất như cảm biến hình ảnh, ăng-ten, mô-đun rung, tai nghe Bluetooth và các linh kiện điện tử khác.
                </li>
                <li>
                    <strong>Đấu giá thiết bị và máy móc:</strong> Đưa ra đấu giá các thiết bị, máy móc đã qua sử dụng hoặc dư thừa trong quá trình sản xuất, nhằm tối ưu hóa nguồn lực và giảm thiểu lãng phí.
                </li>
                <li>
                    <strong>Đấu giá sản phẩm nghiên cứu và phát triển (R&D):</strong> Giới thiệu và đấu giá các sản phẩm mới, nguyên mẫu hoặc sản phẩm thử nghiệm từ bộ phận R&D, tạo cơ hội cho khách hàng tiếp cận sớm với các công nghệ tiên tiến.
                </li>
                <li>
                    <strong>Hợp tác đấu giá với đối tác:</strong> Mở rộng nền tảng để các đối tác, nhà cung cấp có thể đưa sản phẩm của mình lên đấu giá, tạo ra một hệ sinh thái giao dịch phong phú và đa dạng.
                </li>
                </ul>
                <div style={{ fontSize: "18px", color: "#222", lineHeight: "2" }}>
                <p>
                    Thông qua việc triển khai nền tảng đấu giá trực tuyến, Partron Vina không chỉ khẳng định vị thế tiên phong trong lĩnh vực công nghệ mà còn thể hiện cam kết mạnh mẽ trong việc mang lại giá trị tối ưu cho khách hàng và đối tác.
                </p>
                </div>
            </div>
            </main>
        <Footer />
        </>
    );
}
export default Tutorial;