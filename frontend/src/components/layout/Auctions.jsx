// src/components/layout/AuctionSection.jsx
import React, { useEffect, useState } from "react";
import "./Auctions.css";
import CountdownTimer from "../../common/CountDownTime";
import { useNavigate } from "react-router-dom";
import RenderCardAuction from "../ui/CardComponent";
import imagedefault from "../../assets/images/imagedefault.png";
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
        const res = await fetch(
          `/api/v1/auctions?status=${statusMap[type]}&sort_by=created_at&sort_order=desc`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        // Lấy 4 phần tử đầu tiên
        const firstFour = (data.auctions || []).slice(0, 4);
        setItems(firstFour);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading)
    return <p className="loading">Đang tải {title.toLowerCase()}...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <RenderCardAuction
        arrAuction={items}
        numberCol={4}
        clickCard={handleClick}
      />
      
      <a href="#" className="see-all">
        See all
      </a>
    </div>
  );
};

export default AuctionSection;