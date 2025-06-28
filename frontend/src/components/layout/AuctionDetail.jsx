import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalAuction from "../ui/formAuction";
import {
  faTags,
  faMoneyBill,
  faSignal5,
  faFileText,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import imagedefault from "../../assets/images/imagedefault.png";
const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/v1/auctions/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setAuction(data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!auction?.image_url) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= auction.image_url.length ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [auction]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (loading) return <p>Loading...</p>;
  if (!auction) return <p>Không tìm thấy dữ liệu</p>;

  const openAuctionForm = () => {
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

  return (
    <>
      <NavBar />
      <div className="p-20">
        <h1 className="text-[50px] font-[600] mb-[50px]">
          Title: {auction.title}
        </h1>
        <div className="flex items-center">
          <div className="flex-1 mr-12 overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-700 ease-in-out"
            >
              {auction.image_url.length > 0
                ? auction.image_url.map((imageUrl) => (
                    <img
                      key={imageUrl}
                      src={`http://192.168.23.197:8000${imageUrl}`}
                      alt={auction.title}
                      className="min-w-full h-[400px] object-cover rounded-lg shadow-lg"
                    />
                  ))
                : imagedefault}
            </div>
          </div>
          <div className="flex-1 text-[40px] font-bold">
            <p>
              <FontAwesomeIcon icon={faTags} className="mr-[20px]" />
              Deadline: {new Date(auction.end_time).toLocaleDateString()}
            </p>
            <p>
              <FontAwesomeIcon icon={faMoneyBill} className="mr-[20px]" />
              Starting price: {auction.starting_price.toLocaleString()}
            </p>
            <p>
              {" "}
              <FontAwesomeIcon icon={faLayerGroup} className="mr-[20px]" />
              Step price: {auction.step_price}
            </p>
            <p>
              <FontAwesomeIcon icon={faSignal5} className="mr-[20px]" />
              Status: {auction.status}
            </p>
            <p>
              <FontAwesomeIcon icon={faFileText} className="mr-[40px]" />
              Attached file:{" "}
              <button
                onClick={() => handleDownload(auction.id)}
                className="text-blue-500 hover:underline"
              >
                Download
              </button>
            </p>
          </div>
        </div>

        <div className="w-full overflow-y-auto p-4 max-h-[300px] bg-gray-500 mt-[50px] rounded">
          1000+ bài văn mẫu lớp 9 (hay nhất) Tài liệu 500 bài văn hay lớp 9 sách
          mới Chân trời sáng tạo, Kết nối tri thức, Cánh diều được chọn lọc,
          tổng hợp từ những bài văn hay của học sinh lớp 9 và Giáo viên trên cả
          nước đầy đủ các bài văn phân tích, cảm nhận, thuyết minh, nghị luận,
          .... Hi vọng với các bài văn mẫu này, các em học sinh lớp 9 sẽ viết
          văn hay hơn, đủ ý hơn để đạt điểm cao trong các bài thi môn Ngữ văn
          lớp 9. 1000+ bài văn mẫu lớp 9 (hay nhất) 1000+ bài văn mẫu siêu hay
          (điểm cao) Văn mẫu 9 Kết nối tri thức Xem chi tiết Văn mẫu 9 Chân trời
          sáng tạo Xem chi tiết Văn mẫu 9 Cánh diều Xem chi tiết Văn mẫu lớp 9
          tổng hợp Top 50 Phân tích Mùa xuân nho nhỏ (hay nhất) Top 40 Phân tích
          Viếng Lăng Bác (hay nhất) Top 40 Phân tích Nói với con (hay nhất) Top
          40 Cảm nhận về nhân vật Phương Định (siêu hay) Top 40 Chứng minh câu
          tục ngữ Có chí thì nên (hay nhất) Top 40 Phân tích Những ngôi sao xa
          xôi (hay nhất) Top 40 Cảm nhận về nhân vật anh thanh niên (hay nhất)
          1000+ bài văn mẫu lớp 9 (hay nhất) Tài liệu 500 bài văn hay lớp 9 sách
          mới Chân trời sáng tạo, Kết nối tri thức, Cánh diều được chọn lọc,
          tổng hợp từ những bài văn hay của học sinh lớp 9 và Giáo viên trên cả
          nước đầy đủ các bài văn phân tích, cảm nhận, thuyết minh, nghị luận,
          .... Hi vọng với các bài văn mẫu này, các em học sinh lớp 9 sẽ viết
          văn hay hơn, đủ ý hơn để đạt điểm cao trong các bài thi môn Ngữ văn
          lớp 9. 1000+ bài văn mẫu lớp 9 (hay nhất) 1000+ bài văn mẫu siêu hay
          (điểm cao) Văn mẫu 9 Kết nối tri thức Xem chi tiết Văn mẫu 9 Chân trời
          sáng tạo Xem chi tiết Văn mẫu 9 Cánh diều Xem chi tiết Văn mẫu lớp 9
          tổng hợp Top 50 Phân tích Mùa xuân nho nhỏ (hay nhất) Top 40 Phân tích
          Viếng Lăng Bác (hay nhất) Top 40 Phân tích Nói với con (hay nhất) Top
          40 Cảm nhận về nhân vật Phương Định (siêu hay) Top 40 Chứng minh câu
          tục ngữ Có chí thì nên (hay nhất) Top 40 Phân tích Những ngôi sao xa
          xôi (hay nhất) Top 40 Cảm nhận về nhân vật anh thanh niên (hay nhất)
          1000+ bài văn mẫu lớp 9 (hay nhất) Tài liệu 500 bài văn hay lớp 9 sách
          mới Chân trời sáng tạo, Kết nối tri thức, Cánh diều được chọn lọc,
          tổng hợp từ những bài văn hay của học sinh lớp 9 và Giáo viên trên cả
          nước đầy đủ các bài văn phân tích, cảm nhận, thuyết minh, nghị luận,
          .... Hi vọng với các bài văn mẫu này, các em học sinh lớp 9 sẽ viết
          văn hay hơn, đủ ý hơn để đạt điểm cao trong các bài thi môn Ngữ văn
          lớp 9. 1000+ bài văn mẫu lớp 9 (hay nhất) 1000+ bài văn mẫu siêu hay
          (điểm cao) Văn mẫu 9 Kết nối tri thức Xem chi tiết Văn mẫu 9 Chân trời
          sáng tạo Xem chi tiết Văn mẫu 9 Cánh diều Xem chi tiết Văn mẫu lớp 9
          tổng hợp Top 50 Phân tích Mùa xuân nho nhỏ (hay nhất) Top 40 Phân tích
          Viếng Lăng Bác (hay nhất) Top 40 Phân tích Nói với con (hay nhất) Top
          40 Cảm nhận về nhân vật Phương Định (siêu hay) Top 40 Chứng minh câu
          tục ngữ Có chí thì nên (hay nhất) Top 40 Phân tích Những ngôi sao xa
          xôi (hay nhất) Top 40 Cảm nhận về nhân vật anh thanh niên (hay nhất)
          1000+ bài văn mẫu lớp 9 (hay nhất) Tài liệu 500 bài văn hay lớp 9 sách
          mới Chân trời sáng tạo, Kết nối tri thức, Cánh diều được chọn lọc,
          tổng hợp từ những bài văn hay của học sinh lớp 9 và Giáo viên trên cả
          nước đầy đủ các bài văn phân tích, cảm nhận, thuyết minh, nghị luận,
          .... Hi vọng với các bài văn mẫu này, các em học sinh lớp 9 sẽ viết
          văn hay hơn, đủ ý hơn để đạt điểm cao trong các bài thi môn Ngữ văn
          lớp 9. 1000+ bài văn mẫu lớp 9 (hay nhất) 1000+ bài văn mẫu siêu hay
          (điểm cao) Văn mẫu 9 Kết nối tri thức Xem chi tiết Văn mẫu 9 Chân trời
          sáng tạo Xem chi tiết Văn mẫu 9 Cánh diều Xem chi tiết Văn mẫu lớp 9
          tổng hợp Top 50 Phân tích Mùa xuân nho nhỏ (hay nhất) Top 40 Phân tích
          Viếng Lăng Bác (hay nhất) Top 40 Phân tích Nói với con (hay nhất) Top
          40 Cảm nhận về nhân vật Phương Định (siêu hay) Top 40 Chứng minh câu
          tục ngữ Có chí thì nên (hay nhất) Top 40 Phân tích Những ngôi sao xa
          xôi (hay nhất) Top 40 Cảm nhận về nhân vật anh thanh niên (hay nhất)
        </div>

        <div className="flex justify-center mt-[50px]">
          <button
            onClick={openAuctionForm}
            className="p-[20px] bg-[#3270f7] w-[300px] rounded-lg text-white text-[30px] font-bold hover:bg-[#1a4bbd] transition duration-300"
          >
            AUCTION
          </button>
        </div>

        <ModalAuction
          canOpen={isOpen}
          email={userData?.email}
          username={userData?.username}
          auctionId={auction.id}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
};

export default AuctionDetail;
