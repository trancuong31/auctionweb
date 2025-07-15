import AnimatedContent from "../ui/animatedContent";

function History() {
  return (
    <AnimatedContent>
      <main className="history-content ">
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "1200px",
            margin: "40px auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.30)",
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
            Lịch sử hình thành Công ty TNHH Partron Vina
          </h2>
          <div style={{ fontSize: "18px", color: "#222", lineHeight: "2" }}>
            <div
              style={{
                borderLeft: "4px solid #667eea",
                paddingLeft: "24px",
                marginBottom: "24px",
                background: "linear-gradient(90deg, #f6f8fa 80%, transparent)",
                borderRadius: "6px",
              }}
            >
              <strong>2008:</strong> Thành lập tại Lô CN11, Khu công nghiệp Khai
              Quang, Vĩnh Yên, Vĩnh Phúc với vốn đầu tư ban đầu 4 triệu USD từ
              Hàn Quốc.
              <br />
              <strong>2015:</strong> Tổng vốn đầu tư nâng lên 150 triệu USD.
              <br />
              <strong>2024:</strong> Tiếp tục mở rộng quy mô sản xuất, tổng vốn
              đầu tư đạt 269,4 triệu USD, đáp ứng nhu cầu thị trường điện tử
              tiên tiến.
            </div>
            <div style={{ marginBottom: "24px" }}>
              <strong>Lĩnh vực hoạt động:</strong>
              <ul style={{ margin: "8px 0 0 24px", padding: 0 }}>
                <li>Mô-đun cảm biến hình ảnh (ISM)</li>
                <li>Mô-tơ rung (Motor)</li>
                <li>Ăng-ten điện thoại (Intenna)</li>
                <li>Sạc không dây, tai nghe Bluetooth</li>
                <li>Các linh kiện điện tử khác</li>
              </ul>
              <span>
                Partron Vina là nhà cung cấp vệ tinh hàng đầu của Samsung
                Electronics Việt Nam, đồng thời sản xuất linh kiện cho các hãng
                lớn như Amazon. Sản phẩm đã có mặt tại Hàn Quốc, EU, Brazil, Ấn
                Độ...
              </span>
            </div>
            <div>
              <strong>Đội ngũ & Đóng góp:</strong>
              <ul style={{ margin: "8px 0 0 24px", padding: 0 }}>
                <li>Chuyên gia nước ngoài năng động, quản lý chuyên nghiệp</li>
                <li>
                  Tạo việc làm cho hàng nghìn lao động trong và ngoài tỉnh Vĩnh
                  Phúc
                </li>
                <li>
                  Góp phần phát triển kinh tế địa phương và ngành công nghiệp hỗ
                  trợ điện tử Việt Nam
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </AnimatedContent>
  );
}

export default History;
