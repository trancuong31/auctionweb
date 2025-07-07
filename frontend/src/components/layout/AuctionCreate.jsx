import RangeCalender from "../ui/RangeCalender";
import { useState } from "react";
import { create } from "../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import clsx from "clsx";
import toast from "react-hot-toast";

const CreateAuctionForm = ({ isOpen, onClickClose }) => {
  const [calender, setCalender] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [stepPrice, setStepPrice] = useState(0);
  const [imgFiles, setImgFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const submitHandler = async (event) => {
    event.preventDefault();
    const arrLinkImg = await handlerUploadImgs();
    const linkExcel = await handleUpLoadExcel();

    try {
      const data = {
        title: title,
        description: description,
        starting_price: Number(startingPrice),
        step_price: Number(stepPrice),
        image_url: arrLinkImg,
        file_exel: linkExcel,
        start_time: dayjs(calender[0]).tz("Asia/Ho_Chi_Minh").format(),
        end_time: dayjs(calender[1]).tz("Asia/Ho_Chi_Minh").format(),
      };

      await create("auctions", data, true);
    } catch (error) {
      toast.error("Error while add Auction");
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImgFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      setImgFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (indexToRemove) => {
    setImgFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    setImgFiles([]);
  };

  const handleDragAreaClick = () => {
    document.getElementById("imageInput").click();
  };

  const handlerUploadImgs = async () => {
    const formData = new FormData();
    imgFiles.forEach((img) => {
      formData.append("files", img);
    });
    try {
      const response = await create("upload/image", formData, true);
      return response.data.image_urls;
    } catch (error) {
      toast.error("Error while upload image");
      throw error;
    }
  };

  const handleUpLoadExcel = async () => {
    if (!excelFile) return alert("Vui lòng chọn file Excel");

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await create("upload/excel", formData, true);
      return response.data.file_excel;
    } catch (error) {
      toast.error("Error while upload Excel");
      throw error;
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50",
        isOpen ? "visible" : "invisible"
      )}
    >
      <div
        className={clsx(
          "bg-gray-200 w-full max-w-2xl max-h-[95vh] p-8 rounded-2xl relative fade-slide-up overflow-hidden",
          isOpen ? "fade-slide-up-visible" : "fade-slide-up-hidden"
        )}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sm:p-1 absolute top-0 left-0 w-full h-[10%]">
          <h2 className="text-lg sm:text-2xl font-bold text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-1/2">
            CREATE AUCTION
          </h2>
          <button
            onClick={() => onClickClose()}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 text-white hover:text-gray-200"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-2 mt-[10%]">
          <div>
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"
                />
              </svg>
              Title
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M3 7a4 4 0 014-4h6l8 8-6 6-8-8V7z"
                />
              </svg>
              Starting Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setStartingPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 17l6-6 4 4 8-8M14 7h7v7"
                />
              </svg>
              Step Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setStepPrice(e.target.value)}
            />
          </div>

          <RangeCalender onChange={setCalender} allowMinDate={false} />

          <div>
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16h8M8 12h8M9 4h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 rounded shadow h-24"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h16v16H4V4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 9l6 6m0-6l-6 6"
                />
              </svg>
              Excel
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="w-full p-2 rounded shadow bg-white"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />
          </div>

          <div className="flex-1">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h2l1-1h6l1 1h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                />
                <circle cx="12" cy="13" r="3" />
              </svg>
              Image
            </label>

            {/* Drag & Drop Area */}
            <div
              className={clsx(
                "w-full p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:border-blue-500",
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDragAreaClick}
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">
                      Nhấp để chọn ảnh
                    </span>{" "}
                    hoặc kéo thả vào đây
                  </p>
                </div>
              </div>
            </div>

            {/* Hidden Input */}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <div className="max-h-20 overflow-y-auto space-y-2 max-w-full overflow-x-hidden">
              {/* Selected Files Preview */}
              {imgFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Đã chọn {imgFiles.length} ảnh:
                    </p>
                    <button
                      onClick={clearAllFiles}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="space-y-2">
                    {imgFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <span className="text-sm text-gray-600 truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionForm;
