import React, { useEffect, useState } from "react";
import login from "../../assets/images/login.png";
import register from "../../assets/images/register.png";

function Tutorial() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main
        className={`tutorial-content transition-all duration-700 ease-out ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
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
          <h3
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Hướng dẫn tham gia đấu giá
          </h3>
          <ol
            style={{
              fontSize: "18px",
              color: "#222",
              fontStyle: "italic",
              lineHeight: "2",
            }}
          >
            <li>
              <b>Bước 1: Đăng ký tài khoản</b> tại Trang thông tin điện tử đấu
              giá trực tuyến, điền các thông tin cơ bản bao gồm email, username,
              mật khẩu. Đăng ký bước đầu chỉ với username và email để có tài
              khoản cơ bản, đủ điều kiện theo dõi các phiên đấu giá trực tuyến.
              <img
                className="img"
                style={{
                  maxWidth: "60%",
                  height: "auto",
                  maxHeight: "400px",
                  display: "block",
                  margin: "16px auto",
                }}
                src={register}
                alt="register"
              />
            </li>
            <li>
              <b>Bước 2: Đăng nhập và cập nhật thông tin tài khoản</b>
              <br />
              Nhập tài khoản và mật khẩu để đăng nhập hệ thống.
              <br />
              Sau khi có tài khoản, thực hiện điền đầy đủ thông tin để cập nhật
              tài khoản. Sau khi cập nhật thành công, cá nhân, tổ chức sẽ có tài
              khoản với đầy đủ các tính năng người dùng.
              <br />
              <img
                className="img"
                style={{
                  maxWidth: "60%",
                  height: "auto",
                  maxHeight: "400px",
                  display: "block",
                  margin: "16px auto",
                }}
                src={login}
                alt="login"
              />
            </li>
            <li>
              <b>
                Bước 3: Nghiên cứu Thông báo mời đấu giá, Quy chế cuộc đấu giá,
                hồ sơ pháp lý về tài sản
              </b>
              <br />
              Người có nhu cầu tham gia đấu giá sẽ tham khảo các thông tin về
              tài sản đấu giá, nghiên cứu Thông báo mời đấu giá, Quy chế cuộc
              đấu giá, hồ sơ pháp lý về tài sản được đăng tải trên Trang thông
              tin điện tử đấu giá trực tuyến.
            </li>
            <li>
              <b>Bước 4: Đăng ký tham gia đấu giá</b>
              <br />
              Sau khi nghiên cứu Thông báo mời đấu giá, Quy chế cuộc đấu giá,
              hồ sơ pháp lý về tài sản, nếu đủ điều kiện và có nguyện vọng tham
              gia đấu giá thì tiến hành đăng ký tài khoản và cập nhật thông tin
              tài khoản như Bước 1 và Bước 2 mục này.
            </li>
            <li>
              <b>Bước 5: Nộp hồ sơ tham gia đấu giá</b>
              <br />
              Người đăng ký tham gia đấu giá nộp hồ sơ tham gia đấu giá theo
              đúng cách thức và thời hạn quy định tại Quy chế cuộc đấu giá và
              email hướng dẫn.
              <br />
              Hồ sơ tham gia đấu giá gồm các tài liệu quy định tại Quy chế cuộc
              đấu giá áp dụng với từng tài sản.
            </li>
            <li>
              <b>
                Bước 6: Đăng nhập tài khoản, vào Phòng đấu giá để tham gia đấu
                giá
              </b>
              <br />
              Người đã đăng ký tham gia đấu giá thành công đăng nhập vào hệ
              thống đấu giá trực tuyến, bấm chọn vào vị trí logo có thông tin
              về tài sản đã nộp hồ sơ tham gia đấu giá, thực hiện bấm nút Điểm
              danh để có thể tiến hành trả giá.
              <br />
              Tại giao diện màn hình trả giá, nhập số tiền muốn trả và bấm vào
              nút “Đấu giá”.
            </li>
          </ol>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default Tutorial;
