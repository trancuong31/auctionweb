import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export const Footer = () => {
  const companyInfo = {
    name: "Partron Vina Co., Ltd.",
    phone: "+84 123 456 789",
    email: "contact@partronvina.com",
    address: "123 Example St., District 1, Vinh Phuc Province, Vietnam",
  };

  const helpLinks = [
  { label: "Register for Account Pricing", to: "/guide" },
  { label: "Online Pricing Rules Policy Security", to: "/policy" },
  { label: "Vision & Development Orientation", to: "/about" },
  { label: "History of Partron Vina Company Limited", to: "/history" },
];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section footer__company">
          <h2 className="footer__title">{companyInfo.name}</h2>
          <ul className="footer__list">
            <li>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8 }} />
              <span className="footer__label">Phone:</span> {companyInfo.phone}
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />
              <span className="footer__label">Email:</span> {companyInfo.email}
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8 }} />
              <span className="footer__label">Address:</span> {companyInfo.address}
            </li>
          </ul>
        </div>
        <div className="footer__section footer__help">
          <h2 className="footer__title">Auctioneer Assistance</h2>
          <ul className="footer__list footer__list--inline">
            {helpLinks.map((link, idx) => (
              <li key={idx} className="footer__item">
                <Link to={link.to} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;