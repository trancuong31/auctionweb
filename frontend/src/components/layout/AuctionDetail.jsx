import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalAuction from "../ui/formAuction";
import clsx from "clsx";
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
import { getOne } from "../../services/api";
const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectImg, setselectImg] = useState(0);
  const userData = JSON.parse(localStorage.getItem("user"));
  const sliderRef = useRef(null);

  const datafake = {
    id: 1,
    title: "Antique Vase",
    image_url: [
      "https://i.pinimg.com/736x/88/c6/de/88c6de0c0e083478ee5584556518aeeb.jpg",
      "https://images2.thanhnien.vn/zoom/686_429/Uploaded/vietthong/2019_07_19/thumb_SZDT.jpg",
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_31.jpg",
    ],
    end_time: "2025-07-10T23:59:59Z",
    starting_price: 5000000,
    step_price: 200000,
    status: "Active",
  };

  useEffect(() => {
    getOne("auction", id)
      .then((data) => setAuction(datafake))
      .catch((err) => setAuction(datafake))
      .finally(() => setLoading(false));
  }, [id]);

  // Ref to store interval id
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!auction?.image_url) return;

    resestInterval();

    return () => clearInterval(intervalRef.current);
  }, [auction]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${selectImg * 100}%)`;
    }
  }, [selectImg]);

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

  const handleSelectImg = (index) => {
    setselectImg(index);
    // Reset interval when user selects an image
    resestInterval();
  };

  const resestInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setselectImg((prevIndex) =>
        prevIndex + 1 >= auction.image_url.length ? 0 : prevIndex + 1
      );
    }, 3000);
  };

  const clickPreButton = () => {
    resestInterval();
    setselectImg((prevIndex) =>
      prevIndex - 1 < 0 ? auction.image_url.length - 1 : prevIndex - 1
    );
  };

  const clickNextButton = () => {
    resestInterval();
    setselectImg((prevIndex) =>
      prevIndex + 1 >= auction.image_url.length ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <NavBar />
      <h1 className="text-[50px] font-[600] mb-[50px]">
        Title: {auction.title}
      </h1>
      <div className="flex items-center">
        <div className="flex-1 mr-12 overflow-hidden relative">
          {/* <!-- Next and previous buttons --> */}
          <button
            onClick={() => clickPreButton()}
            className="hover:bg-[rgba(0,0,0,0.8)] z-10 cursor-pointer absolute top-1/2 -translate-y-1/2 px-4 text-white font-bold text-[50px] transition ease-in-out duration-500 rounded-r select-none"
          >
            &#10094;
          </button>
          <button
            onClick={() => clickNextButton()}
            className="hover:bg-[rgba(0,0,0,0.8)] z-10 cursor-pointer absolute top-1/2 -translate-y-1/2 px-4 text-white font-bold text-[50px] transition ease-in-out duration-500 rounded-r select-none right-0 rounded-l"
          >
            &#10095;
          </button>
          <div
            ref={sliderRef}
            className="flex transition-transform duration-700 ease-in-out"
          >
            {auction.image_url.length > 0
              ? auction.image_url.map((imageUrl) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt={auction.title}
                    className="min-w-full h-[400px] object-cover rounded-lg shadow-lg"
                  />
                ))
              : imagedefault}
          </div>
          <div className="text-center mt-2">
            {auction.image_url.length > 0 &&
              auction.image_url.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  onClick={() => handleSelectImg(index)}
                  className={clsx(
                    "cursor-pointer h-[15px] w-[15px] mx-[4px] rounded-full inline-block transition-colors duration-500 ease-in-out",
                    selectImg === index
                      ? "bg-[#717171]"
                      : "bg-[#bbb] hover:bg-[#717171]"
                  )}
                />
              ))}
          </div>
        </div>
        <div className="flex-1 text-[34px] font-bold">
          <p className="my-[20px]">
            <FontAwesomeIcon icon={faTags} className="mr-[20px]" />
            Deadline: {new Date(auction.end_time).toLocaleDateString()}
          </p>
          <p className="my-[20px]">
            <FontAwesomeIcon icon={faMoneyBill} className="mr-[20px]" />
            Starting price: {auction.starting_price.toLocaleString()}
          </p>
          <p className="my-[20px]">
            {" "}
            <FontAwesomeIcon icon={faLayerGroup} className="mr-[20px]" />
            Step price: {auction.step_price}
          </p>
          <p className="my-[20px]">
            <FontAwesomeIcon icon={faSignal5} className="mr-[20px]" />
            Status: {auction.status}
          </p>
          <p className="my-[20px]">
            <FontAwesomeIcon icon={faFileText} className="mr-[40px]" />
            Attached file:{" "}
            <button
              onClick={() => handleDownload(auction.id)}
              className="text-blue-500 hover:underline"
            >
              {auction.excel}
            </button>
          </p>
        </div>
      </div>

      <div className="w-full overflow-y-auto p-4 max-h-[300px] bg-gray-500 mt-[50px] rounded">
        1000+ bài văn mẫu lớp 9 (hay nhất) Tài liệu 500 bài văn hay lớp 9 sách
        mới Chân trời sáng tạo, Kết nối tri thức, Cánh diều được chọn lọc, tổng
        hợp từ những bài văn hay của học sinh lớp 9 và Giáo viên trên cả nước
        đầy đủ các bài văn phân tích, cảm nhận, thuyết minh, nghị luận, .... Hi
        vọng với các bài văn mẫu này, các em học sinh lớp 9 sẽ viết văn hay hơn,
        đủ ý hơn để đạt điểm cao trong các bài thi môn Ngữ văn lớp 9. 1000+ bài
        văn mẫu lớp 9 (hay nhất) 1000+ bài văn mẫu siêu hay (điểm cao) Văn mẫu 9
        Kết nối tri thức Xem chi tiết Văn mẫu 9 Chân trời sáng tạo Xem chi tiết
        Văn mẫu 9 Cánh diều Xem chi tiết Văn mẫu lớp 9 tổng hợp Top 50 Phân tích
        Mùa xuân nho nhỏ (hay nhất) Top 40 Phân tích Viếng Lăng Bác (hay nhất)
        Top 40 Phân tích Nói với con (hay nhất) Top 40 Cảm nhận về nhân vật
        Phương Định (siêu hay) Top 40 Chứng minh câu tục ngữ Có chí thì nên (hay
        nhất) Top 40 Phân tích Những ngôi sao xa xôi (hay nhất) Top 40 Cảm nhận
        về nhân vật anh thanh niên (hay nhất) 1000+ bài văn mẫu lớp 9 (hay nhất)
        Tài liệu 500 bài văn hay lớp 9 sách mới Chân trời sáng tạo, Kết nối tri
        thức, Cánh diều được chọn lọc, tổng hợp từ những bài văn hay của học
        sinh lớp 9 và Giáo viên trên cả nước đầy đủ các bài văn phân tích, cảm
        nhận, thuyết minh, nghị luận, .... Hi vọng với các bài văn mẫu này, các
        em học sinh lớp 9 sẽ viết văn hay hơn, đủ ý hơn để đạt điểm cao trong
        các bài thi môn Ngữ văn lớp 9. 1000+ bài văn mẫu lớp 9 (hay nhất) 1000+
        bài văn mẫu siêu hay (điểm cao) Văn mẫu 9 Kết nối tri thức Xem chi tiết
        Văn mẫu 9 Chân trời sáng tạo Xem chi tiết Văn mẫu 9 Cánh diều Xem chi
        tiết Văn mẫu lớp 9 tổng hợp Top 50 Phân tích Mùa xuân nho nhỏ (hay nhất)
        Top 40 Phân tích Viếng Lăng Bác (hay nhất) Top 40 Phân tích Nói với con
        (hay nhất) Top 40 Cảm nhận về nhân vật Phương Định (siêu hay) Top 40
        Chứng minh câu tục ngữ Có chí thì nên (hay nhất) Top 40 Phân tích Những
        ngôi sao xa xôi (hay nhất) Top 40 Cảm nhận về nhân vật anh thanh niên
        (hay nhất) 1000+ bài văn mẫu lớp 9 (hay nhất) Tài liệu 500 bài văn hay
        lớp 9 sách mới Chân trời sáng tạo, Kết nối tri thức, Cánh diều được chọn
        lọc, tổng hợp từ những bài văn hay của học sinh lớp 9 và Giáo viên trên
        cả nước đầy đủ các bài văn phân tích, cảm nhận, thuyết minh, nghị luận,
        .... Hi vọng với các bài văn mẫu này, các em học sinh lớp 9 sẽ viết văn
        hay hơn, đủ ý hơn để đạt điểm cao trong các bài thi môn Ngữ văn lớp 9.
        1000+ bài văn mẫu lớp 9 (hay nhất) 1000+ bài văn mẫu siêu hay (điểm cao)
        Văn mẫu 9 Kết nối tri thức Xem chi tiết Văn mẫu 9 Chân trời sáng tạo Xem
        chi tiết Văn mẫu 9 Cánh diều Xem chi tiết Văn mẫu lớp 9 tổng hợp Top 50
        Phân tích Mùa xuân nho nhỏ (hay nhất) Top 40 Phân tích Viếng Lăng Bác
        (hay nhất) Top 40 Phân tích Nói với con (hay nhất) Top 40 Cảm nhận về
        nhân vật Phương Định (siêu hay) Top 40 Chứng minh câu tục ngữ Có chí thì
        nên (hay nhất) Top 40 Phân tích Những ngôi sao xa xôi (hay nhất) Top 40
        Cảm nhận về nhân vật anh thanh niên (hay nhất) 1000+ bài văn mẫu lớp 9
        (hay nhất) Tài liệu 500 bài văn hay lớp 9 sách mới Chân trời sáng tạo,
        Kết nối tri thức, Cánh diều được chọn lọc, tổng hợp từ những bài văn hay
        của học sinh lớp 9 và Giáo viên trên cả nước đầy đủ các bài văn phân
        tích, cảm nhận, thuyết minh, nghị luận, .... Hi vọng với các bài văn mẫu
        này, các em học sinh lớp 9 sẽ viết văn hay hơn, đủ ý hơn để đạt điểm cao
        trong các bài thi môn Ngữ văn lớp 9. 1000+ bài văn mẫu lớp 9 (hay nhất)
        1000+ bài văn mẫu siêu hay (điểm cao) Văn mẫu 9 Kết nối tri thức Xem chi
        tiết Văn mẫu 9 Chân trời sáng tạo Xem chi tiết Văn mẫu 9 Cánh diều Xem
        chi tiết Văn mẫu lớp 9 tổng hợp Top 50 Phân tích Mùa xuân nho nhỏ (hay
        nhất) Top 40 Phân tích Viếng Lăng Bác (hay nhất) Top 40 Phân tích Nói
        với con (hay nhất) Top 40 Cảm nhận về nhân vật Phương Định (siêu hay)
        Top 40 Chứng minh câu tục ngữ Có chí thì nên (hay nhất) Top 40 Phân tích
        Những ngôi sao xa xôi (hay nhất) Top 40 Cảm nhận về nhân vật anh thanh
        niên (hay nhất)
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
    </>
  );
};

export default AuctionDetail;
