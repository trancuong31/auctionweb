import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalAuction from "../ui/formAuction";
import clsx from "clsx";
import {
  faTags,
  faMoneyBill,
  faSignal5,
  faFileText,
  faUser,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import imagedefault from "../../assets/images/imagedefault.png";
import { getOne } from "../../services/api";
import { toast } from 'react-hot-toast';
function isTokenValid() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.access_token) return false;
  try {
    const token = user.access_token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectImg, setselectImg] = useState(0);
  const userData = JSON.parse(localStorage.getItem("user"));
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    getAuction();
  }, [id]);

  const getAuction = async () => {
    try {
      const response = await getOne("auctions", id);
      setAuction(response.data);
      setLoading(false);
    } catch (error) {
      alert("Có lỗi khi lấy dữ liệu auction");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!auction?.image_url) return;
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, [auction]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${selectImg * 100}%)`;
    }
  }, [selectImg]);

  const openAuctionForm = () => {
  if (!isTokenValid()) {
    toast.error("You must be logged in to participate in the auction!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000); 
    return;
  }
  if (auction.status === 2) {
    toast.error("This auction has ended!");
    return;
  }

  setIsOpen(true);
};

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/v1/download/excel/by-auction/${id}`);
      if (!res.ok) throw new Error("Tải file thất bại");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `auction-${id}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
    }
  };

  const handleSelectImg = (index) => {
    setselectImg(index);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setselectImg((prev) =>
        prev + 1 >= auction.image_url.length ? 0 : prev + 1
      );
    }, 3000);
  };

  const clickPreButton = () => {
    resetInterval();
    setselectImg((prev) =>
      prev - 1 < 0 ? auction.image_url.length - 1 : prev - 1
    );
  };

  const clickNextButton = () => {
    resetInterval();
    setselectImg((prev) =>
      prev + 1 >= auction.image_url.length ? 0 : prev + 1
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!auction) return <p>No data available</p>;

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-left text-black-300 drop-shadow break-words w-1/2">
        {auction.title}
      </h1>

      <div className="flex flex-col lg:flex-row items-start gap-10">
        {/* Slider Image */}
        <div className="flex-1 overflow-hidden relative rounded-lg shadow-lg border border-gray-300">
          {/* Prev Button */}
          <button
            onClick={clickPreButton}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 text-white text-3xl rounded-r hover:bg-black/70 z-10"
          >
            &#10094;
          </button>
          {/* Next Button */}
          <button
            onClick={clickNextButton}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2  text-white text-3xl rounded-l hover:bg-black/70 z-10"
          >
            &#10095;
          </button>

          <div
            ref={sliderRef}
            className="flex transition-transform duration-700 ease-in-out"
          >
            {auction.image_url.length > 0 ? (
              auction.image_url.map((imageUrl) => (
                <img
                  key={imageUrl}
                  src={`${import.meta.env.VITE_BASE_URL}${imageUrl}`}
                  alt={auction.title}
                  className="min-w-full h-[400px] object-cover"
                />
              ))
            ) : (
              <img
                src={imagedefault}
                alt="default"
                className="min-w-full h-[400px] object-cover"
              />
            )}
          </div>

          {/* Indicator dots nằm absolute bên trong ảnh */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {auction.image_url.length > 0 &&
              auction.image_url.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectImg(index)}
                  className={clsx(
                    "w-4 h-4 rounded-full",
                    selectImg === index
                      ? "bg-blue-700"
                      : "bg-gray-300 hover:bg-blue-500"
                  )}
                />
              ))}
          </div>
        </div>

        {/* Auction Info */}
        <div className="flex-1 text-xl font-medium space-y-6 text-gray-800">
          <p>
            <FontAwesomeIcon icon={faTags} className="mr-4 text-blue-500" />
            Deadline:{" "}
            <span className="font-semibold">
              {new Date(auction.end_time).toLocaleString()}
            </span>
          </p>
          <p>
            <FontAwesomeIcon
              icon={faMoneyBill}
              className="mr-4 text-green-500"
            />
            Starting price:{" "}
            <span className="font-semibold text-green-700">
              {auction.starting_price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </p>
          <p>
            <FontAwesomeIcon
              icon={faLayerGroup}
              className="mr-4 text-yellow-500"
            />
            Step price:{" "}
            <span className="font-semibold text-yellow-700">
              {auction.step_price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </p>
          <p>
            <FontAwesomeIcon
              icon={faSignal5}
              className="mr-4 text-purple-500"
            />
            Status:{" "}
            <span className="font-semibold">
              {auction.status === 0
                ? "Ongoing"
                : auction.status === 1
                ? "Upcoming"
                : auction.status === 2
                ? "Ended"
                : auction.status}
            </span>
          </p>
          <p>
            <FontAwesomeIcon icon={faFileText} className="mr-4 text-cyan-500" />
            Attached file:{" "}
            {auction.file_exel ? (
              <button
                onClick={() => handleDownload(auction.id)}
                className="text-blue-600 hover:underline font-medium"
              ><p>{auction.file_exel.split("/").pop()}</p>                
              </button>
            ) : (
              <span className="text-gray-400 italic">No file</span>
            )}
          </p>
          {auction.status === 2 && (
            <p>
              <FontAwesomeIcon
                icon={faUser}
                className="mr-4 text-black-500"
              />
              Winner:{" "}
              {Array.isArray(auction.bids) && auction.bids.find(bid => bid.is_winner) ? (
                <span className="font-semibold text-green-700">
                  {auction.bids.find(bid => bid.is_winner).user_name}
                </span>
              ) : (
                <span className="text-red-500 font-semibold">No winner</span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="w-full max-h-[300px] overflow-y-auto p-6 mt-12 bg-gray-100 rounded-lg text-base leading-relaxed shadow-inner text-gray-700">
        {auction.description ? (
          <p className="whitespace-pre-wrap break-words">
            <span className="font-semibold text-gray-800">Description:</span>{" "}
            {auction.description}
          </p>
        ) : (
          <p className="text-gray-400 italic">No description available</p>
        )}
      </div>

      {/* Nút đấu giá */}
      <div className="flex justify-center mt-12">
        <button
          onClick={openAuctionForm}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-semibold tracking-wide rounded-2xl shadow-md hover:from-blue-600 hover:to-indigo-600 hover:scale-[1.03] hover:shadow-lg border transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
        >
          AUCTION
        </button>
      </div>

      {/* Modal đấu giá */}
      <ModalAuction
        canOpen={isOpen}
        email={userData?.email}
        username={userData?.username}
        auctionId={auction.id}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default AuctionDetail;
