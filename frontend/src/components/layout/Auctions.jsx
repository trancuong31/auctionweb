// src/components/layout/AuctionSection.jsx
import React, { useEffect, useState } from "react";
import imagedefault from "../../assets/images/imagedefault.png";
import "./Auctions.css";
import { useNavigate } from "react-router-dom";
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
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const renderCard = (item) => (
    <div className="auction-card"  key={item.id} onClick={() => handleClick(item.id)} style={{ cursor: "pointer" }}>
      <div className="auction-image">
        <img
          src={item.image_url || imagedefault}
          alt={item.title || "Auction"}
          className={!item.image_url ? "img-no" : ""}
        />
      </div>
      <div className="auction-info">
        <p><span className="label">Name:</span> {item.title}</p>
        <p><span className="label">Starting price:</span> {item.starting_price}</p>
        <p><span className="label">Start time:</span> {new Date(item.start_time).toLocaleString()}</p>
        <p><span className="label">End time:</span> {new Date(item.end_time).toLocaleString()}</p>
        <p><span className="label">Price step:</span> {item.step_price}</p>
      </div>
    </div>
  );

  if (loading) return <p className="loading">Đang tải {title.toLowerCase()}...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <div className="card-grid">
        {items.length > 0 ? items.map(renderCard) : <p>Không có phiên đấu giá nào.</p>}
      </div>
      <a href="#" className="see-all">See all</a>
    </div>
  );
};

export default AuctionSection;
