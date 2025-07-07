// src/components/layout/AuctionSection.jsx
import React, { useEffect, useState } from "react";
import "./Auctions.css";
import { useNavigate } from "react-router-dom";
import RenderCardAuction from "../ui/CardComponent";
const AuctionSection = ({ title, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const statusMap = {
    ongoing: 0,
    upcoming: 1,
    ended: 2,
  };
  const totalMap = {
    ongoing: "total_ongoing",
    upcoming: "total_upcoming",
    ended: "total_ended",
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
        setTotal(data[totalMap[type]] || 0);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) return <div className="loader" />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <span
        style={{
          fontWeight: "normal",
          color: "#8c8e94",
          fontSize: "12px",
          padding: "0px 0px 5px 0px",
        }}
      >
        Total: {total} asset
      </span>
      <RenderCardAuction
        arrAuction={items}
        numberCol={4}
        clickCard={handleClick}
      />
      <a href="/auctions/search" className="see-all">
        See all
      </a>
    </div>
  );
};

export default AuctionSection;
