import RangeCalender from "../ui/RangeCalender";
import { useState } from "react";
import { create } from "../../services/api";
import { data } from "autoprefixer";

const CreateAuctionForm = () => {
  const [calender, setCalender] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [stepPrice, setStepPrice] = useState(0);
  const [status, setStatus] = useState(0);
  const [imgs, setImgs] = useState([]);
  const [imgFiles, setImgFiles] = useState([]);

  const submitHandler = (event) => {
    event.preventDefault();
    handlerUploadImgs();

    // create("auctions", data, true)
    //   .then((response) => {
    //     alert("Auction created successfully!");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     alert(error.response.data.detail);
    //   });
  };

  const handlerUploadImgs = async () => {
    const formData = new FormData();
    console.log("Image Files:", imgFiles);
    imgFiles.forEach((img) => {
      formData.append("files", img);
    });
    create("upload/image", formData, true)
      .then((response) => {
        if (response) {
          setImgs(response.data.image_urls);
          const data = {
            title: title,
            description: description,
            starting_price: Number(startingPrice),
            step_price: Number(stepPrice),
            image_url: imgs,
            file_excel: "",
            start_time: calender[0] ? calender[0] : "",
            end_time: calender[1] ? calender[1] : "",
            status: Number(status),
          };
          console.log("Auction Data:", data);
        }
      })
      .catch((error) => {
        alert("Error uploading images:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-200 w-full max-w-2xl max-h-[95vh] p-8 rounded-lg relative">
        <button className="absolute top-2 right-3 text-black font-bold text-xl">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              STATUS<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ongoing/Upcoming/Ended"
              className="w-full p-2 rounded shadow"
              onChange={(e) => setStatus(e.target.value)}
            />
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
