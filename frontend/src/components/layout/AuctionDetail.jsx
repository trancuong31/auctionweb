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
    <div className="px-10">
      <h1 className="text-2xl font-bold text-left text-gray-600 drop-shadow break-words w-1/2">
        {auction.title}
      </h1>

      <div className="flex flex-col lg:flex-row items-start gap-10">
        {/* Slider Image */}
        <div className="flex-1 overflow-hidden relative rounded-lg shadow-lg border border-gray-300">
          {/* Prev Button */}
          <button
            onClick={clickPreButton}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/50 text-white text-3xl rounded-r hover:bg-black/70 z-10"
          >
            &#10094;
          </button>
          {/* Next Button */}
          <button
            onClick={clickNextButton}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/50 text-white text-3xl rounded-l hover:bg-black/70 z-10"
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
            <button
              onClick={() => handleDownload(auction.id)}
              className="text-blue-600 hover:underline font-medium"
            >
              {auction.excel}
            </button>
          </p>
        </div>
      </div>
      <div className="w-full max-h-[300px] overflow-y-auto p-6 mt-12 bg-gray-100 rounded-lg text-base leading-relaxed shadow-inner text-gray-700">
        Mùa hè kết thúc tháng bảy nhường chỗ cho tháng tám. vậy là tôi lớn thêm
        một tuổi lên thêm một lớp, năm học mới sắp bắt đầu ,nhìn mọi người ai
        nấy lo sách vở quần áo nhất là các em học sinh chuẩn bị vào lớp 1, tôi
        lại nhớ đến bản thân mình ngày xưa cách đây cũng lâu lắm rồi. cái ngày
        mà tôi chập chững vào lớp 1 để tập viết tập đọc Cách ngày khai giảng
        trước 1 tuần mẹ đã đưa tôi mua quần áo sắm sửa sách vở rồi về đến nhà
        tôi cùng mẹ bao vở dán tem cho sách giáo khoa, tập viết cho thật tỉ mĩ
        gọn gàng. trong lòng tôi có hơi bồi hồi 1 chút vì hết đêm nay đến ngày
        mai tôi đã chính thức trở thành học sinh lớp 1. đối với bản thân và khi
        ấy tôi chỉ là một đứa trẻ 1 đứa trẻ với tâm trạng sắp đối diện với sự
        kiện quan trọng nhất trong cuộc đời của chính bản thân mình. Tôi dậy sớm
        vào sáng hôm sau vệ sinh cá nhân rồi mặc vào người bộ đồng phục còn thơm
        mùi quần áo mới. tôi, đã sẵn sàng cho ngày đầu tiên đi học,tôi theo mẹ
        lên xe ngồi sau xe ôm chặt mẹ. lòng tôi háo hức vô cùng, cuối thu nên
        trời rất mát gió pha lẫn với nắng tạo nên bầu không khí ấm áp khiến
        người người cảm thấy thoải mái dễ chịu khi bước ra đường. đường đi quang
        cảnh xung quanh vẫn không thay đổi mọi thứ vẫn như thế chỉ có người thay
        đổi là tôi. ngồi trên xe với mẹ tôi hí hửng mong tới trường bởi vì bây
        giờ tôi đã là học sinh lớp 1 Trường học là nơi mà tôi sẽ gắn bó suốt
        những tháng năm trưởng thành và bây giờ thứ đang đứng trước mặt tôi là
        cổng trường, chung quanh là các anh chị lớn hơn đang vui vẻ cười nói với
        nhau hơn sau 3 tháng không gặp. còn những đứa mới vào lớp 1 như tôi thì
        bé tí mặc ai cũng ngu ngơ khờ khạo. có mấy đứa còn rụt rè. tôi bước vào
        sân trường chớp mắt quay đầu qua lại nhìn xung quanh trước mặt tôi hiện
        giờ là cảnh quan vô cùng mới lớp học hàng cây con người cả bầu không khí
        nữa tôi cảm thấy bản thân như bước vào thế giới mới. rồi tiếng trống đầu
        tiên của đời học sinh to vang lên háo hức ngoảnh đầu lại nhìn mẹ tạm
        biệt rồi theo các bạn theo cô giáo vào lớp học. Với bao nhiêu đều suy
        nghĩ trong tôi có cả niềm vui xen lẫn điều kiêu hãnh và cả sự thẹn thùng
        bỡ ngỡ một chút lo lắng... bấy nhiêu cảm xúc của những ngày đầu tiên đó
        dưới mái trường tiểu học chắc chắn sẽ đọng lại trong lòng tôi một dấu ấn
        không thể phai mờ.
      </div>

      {/* Nút đấu giá */}
      <div className="flex justify-center mt-12">
        <button
          onClick={openAuctionForm}
          className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-semibold tracking-wide rounded-2xl shadow-md hover:from-blue-600 hover:to-indigo-600 hover:scale-[1.03] hover:shadow-lg border transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
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
