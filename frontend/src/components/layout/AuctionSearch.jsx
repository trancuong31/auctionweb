import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import RangeCalender from "../ui/RangeCalender";
import RenderCardAuction from "../ui/CardComponent";
import { useEffect, useState } from "react";
import { getAll } from "../../services/api";

import clsx from "clsx";

const AuctionSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [sortOder, setSortOder] = useState("");
  const [arrAuction, setArrAuction] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSearch = async (page) => {
    const param = {
      title: searchText,
      status: status,
      sort_by: sortBy,
      sort_order: sortOder,
      page: page,
    };

    try {
      const response = await getAll("auctions/search", false, param);
      setArrAuction(response.data.auctions);
      setTotalPage(
        Math.ceil(response.data.total / Number(import.meta.env.VITE_PAGE_SIZE))
      );
    } catch (err) {
      alert(err);
    }
  };

  const getAllAuction = async () => {
    try {
      const response = await getAll("auctions", false, {
        sortBy: "created_at",
        sort_older: "desc",
      });
      setArrAuction(response.data.auctions);
      setTotalPage(
        Math.ceil(
          response.data.auctions.length / Number(import.meta.env.VITE_PAGE_SIZE)
        )
      );
    } catch (error) {
      console.log(error);
      alert("có lỗi khi get auctions");
    }
  };

  useEffect(() => {
    getAllAuction();
  }, []);

  const handleClickPagination = (value) => {
    setCurrentIndex(value);
    handleSearch(value + 1);
  };

  return (      
    <div className="bg-gray-100 p-4 text-xs">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 items-end">
      {/* Search input */}
      
      <div className="relative col-span-1">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          type="text"
          placeholder="Title..."
          className="pl-10 pr-4 py-2 w-full rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Status select */}
      <div className="col-span-1">
        <label className="text-sm text-gray-600 mb-1 mr-2 block">Status</label>
        <select
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-400 rounded-lg px-3 py-2 w-full"
        >
          <option value="0">Ongoing</option>
          <option value="1">Upcoming</option>
          <option value="2">Ended</option>
        </select>
      </div>

      {/* Sort select */}
      <div className="col-span-1">
        <label className="text-sm text-gray-600 mb-1 mr-2 block">Sort by</label>
        <select
          onChange={(e) => {
            const selectedOption = e.target.selectedOptions[0];
            setSortBy(selectedOption.value);
            setSortOder(selectedOption.dataset.order);
          }}
          className="border border-gray-400 rounded-lg px-3 py-2 w-full"
        >
          <option value="title" data-order="asc">
            Title from A to Z
          </option>
          <option value="title" data-order="desc">
            Title from Z to A
          </option>
          <option value="create_at" data-order="asc">
            Create At from Oldest to Latest
          </option>
          <option value="create_at" data-order="desc">
            Create At from Latest to Oldest
          </option>
          <option value="start_time" data-order="asc">
            Start Time from Oldest to Latest
          </option>
          <option value="start_time" data-order="desc">
            Start Time from Latest to Oldest
          </option>
          <option value="end_time" data-order="asc">
            End Time from Oldest to Latest
          </option>
          <option value="end_time" data-order="desc">
            End Time from Latest to Oldest
          </option>
        </select>
      </div>

      {/* Calendar */}
      <div className="col-span-1">
        <label className="text-sm text-gray-600 mb-1 block invisible">Calendar</label>
        <RangeCalender />
      </div>

      {/* Search button */}
      <div className="col-span-1 px-4 flex items-end ">
        <button
          onClick={() => handleSearch(1)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition w-1/2 "
        >
          Search
        </button>
      </div>
    </div>

    <RenderCardAuction arrAuction={arrAuction} numberCol={4} />

    <div className="flex gap-2 justify-center mt-10 text-white flex-wrap">
      <span className="p-3 bg-[#4caf50] border rounded">Prev</span>
      {Array.from({ length: totalPage }, (_, i) => (
        <button
          onClick={() => handleClickPagination(i)}
          key={i}
          className={clsx(
            "p-3 border rounded",
            currentIndex === i
              ? "bg-[#4caf50]"
              : "bg-[#bbb] hover:bg-[#4caf50]"
          )}
        >
          {i + 1}
        </button>
      ))}
      <span className="p-3 bg-[#4caf50] border rounded">Next</span>
    </div>
  </div>
);
};

export default AuctionSearch;
