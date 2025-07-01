import RangeCalender from "../ui/RangeCalender";
import { useState } from "react";
import { create } from "../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const CreateAuctionForm = ({ isOpen, onClickClose }) => {
  const [calender, setCalender] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [stepPrice, setStepPrice] = useState(0);
  const [imgFiles, setImgFiles] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  if (!isOpen) return null;

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
      alert("có lỗi khi thêm auction");
      console.log(error);
    }
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
      alert("có lỗi khi upload ảnh");
      console.error(error);
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
      console.log(error);
      alert("có lỗi khi upload excel");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-200 w-full max-w-2xl max-h-[95vh] p-8 rounded-lg relative">
        <button
          onClick={() => onClickClose()}
          className="absolute top-2 right-3 text-black font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-center text-2xl font-bold mb-6">CREATE AUCTION</h2>

        <form className="space-y-2">
          <div>
            <label className="block text-sm font-semibold mb-1">
              TITLE<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              STARTING PRICE<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setStartingPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              STEP PRICE<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setStepPrice(e.target.value)}
            />
          </div>

          <RangeCalender onChange={setCalender} />

          <div>
            <label className="block text-sm font-semibold mb-1">
              DESCRIPTION<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 rounded shadow h-24"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">IMAGE</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 rounded shadow bg-white"
                multiple
                onChange={(e) => setImgFiles([...e.target.files])}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">EXCEL</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="w-full p-2 rounded shadow bg-white"
                onChange={(e) => setExcelFile(e.target.files[0])}
              />
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
