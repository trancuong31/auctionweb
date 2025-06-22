import React from "react";
import "./Footer.css";

export const Footer = () => {
  const companyInfo = {
    name: "Partron Vina Co., Ltd.",
    phone: "+84 123 456 789",
    email: "contact@partronvina.com",
    address: "123 Example St., District 1, Vinh Phuc Province, Vietnam",
  };

  const helpLinks = [
    "Hướng dẫn đấu giá/đặt giá",
    "Phương thức thanh toán/vận chuyển",
    "Chính sách bảo mật",
    "Quy chế hoạt động",
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section footer__company">
          <h2 className="footer__title">{companyInfo.name}</h2>
          <ul className="footer__list">
            <li>
              <span className="footer__label">Phone:</span> {companyInfo.phone}
            </li>
            <li>
              <span className="footer__label">Email:</span> {companyInfo.email}
            </li>
            <li>
              <span className="footer__label">Address:</span> {companyInfo.address}
            </li>
          </ul>
        </div>
        <div className="footer__section footer__help">
          <h2 className="footer__title">Trợ giúp người đấu giá</h2>
          <ul className="footer__list footer__list--inline">
            {helpLinks.map((link, idx) => (
              <li key={idx} className="footer__item">
                {link}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
