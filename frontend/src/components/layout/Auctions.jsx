// src/components/layout/AuctionSection.jsx
import React, { useEffect, useState } from "react";
import imagedefault from "../../assets/images/imagedefault.png";
import "./Auctions.css";
import CountdownTimer from "../../common/CountDownTime";
import { useNavigate } from "react-router-dom";
import RenderCardAuction from "../ui/CardComponent";
const AuctionSection = ({ title, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const statusMap = {
    ongoing: 0,
    upcoming: 1,
    ended: 2,
  };
  const handleClick = (id) => {
    navigate(`/auctions/${id}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/v1/auctions?status=${statusMap[type]}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setItems(data.auctions || []);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

 
  // if (loading)
  //   return <p className="loading">Đang tải {title.toLowerCase()}...</p>;
  // if (error) return <p className="error">{error}</p>;

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <RenderCardAuction numberCol={4} />
      <a href="#" className="see-all">
        See all
      </a>
    </div>
  );
};

export default AuctionSection;
