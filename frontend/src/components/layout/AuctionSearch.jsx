import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import RangeCalender from "../ui/RangeCalender";
import RenderCardAuction from "../ui/CardComponent";
import { useEffect, useState } from "react";
import { getAll } from "../../services/api";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";


const AuctionSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [sortOder, setSortOder] = useState("");
  const [arrAuction, setArrAuction] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [dateRange, setDateRange] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const maxPageShow = 5;
  let startPage = Math.max(0, currentIndex - Math.floor(maxPageShow / 2));
  let endPage = startPage + maxPageShow - 1;
  if (endPage >= totalPage) {
    endPage = totalPage - 1;
    startPage = Math.max(0, endPage - maxPageShow + 1);
  }
  const handleSearch = async (page = 1) => {
    const param = {
      title: searchText,
      status: status,
      sort_by: sortBy,
      sort_order: sortOder,
      start_time: dateRange[0] ? dateRange[0].toISOString() : undefined,
      end_time: dateRange[1] ? dateRange[1].toISOString() : undefined,
      page: page,
    };

    try {
      const response = await getAll("auctions/search", false, param);
      setArrAuction(response.data.auctions);
      setTotalPage(
        Math.ceil(response.data.total / Number(import.meta.env.VITE_PAGE_SIZE))
      );
      setCurrentIndex(page - 1);
    } catch (err) {
      alert(err);
    }
  };

  const handleClick = (id) => {
    navigate(`/auctions/${id}`);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleClickPagination = (value) => {
    setCurrentIndex(value);
    handleSearch(value + 1);
  };

  //   const handleClickPre = () => {
  //   setCurrentIndex = currentIndex === 0 ?
  //   setCurrentIndex(value);
  //   handleSearch(value + 1);
  // };

  //   const handleClickNext = () => {
  //   setCurrentIndex(value);
  //   handleSearch(value + 1);
  // };

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
            className="pl-10 border pr-4 py-2 w-full rounded border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Status select */}
        <div className="col-span-1">
          <label className="text-sm text-gray-600 mb-1 mr-2 block">
            Status
          </label>
          <select
            onChange={(e) =>
              setStatus(e.target.value === "" ? null : e.target.value)
            }
            className="border border-gray-400 rounded-lg px-3 py-2 w-full"
          >
            <option value="">-- Select status --</option>
            <option value="0">Ongoing</option>
            <option value="1">Upcoming</option>
            <option value="2">Ended</option>
          </select>
        </div>

        {/* Sort select */}
        <div className="col-span-1">
          <label className="text-sm text-gray-600 mb-1 mr-2 block">
            Sort by
          </label>
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
          <label className="text-sm text-gray-600 mb-1 block">
            Calendar
          </label>
          <RangeCalender value={dateRange} onChange={setDateRange} />
        </div>

        {/* Search button */}
        <div className="col-span-1 px-4 flex items-end ">
          <button
            onClick={() => handleSearch()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200 ease-in-out w-full font-semibold tracking-wide"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Search
          </button>
        </div>
      </div>

      <RenderCardAuction
        arrAuction={arrAuction}
        numberCol={4}
        clickCard={handleClick}
      />
      <div className="flex justify-center mt-10">  
          <span
            className={clsx(
              "w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white transition-all duration-150",
              currentIndex === 0
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-[#a8a8a8d0] group cursor-pointer"
            )}
            onClick={() => {
              if (currentIndex !== 0) handleClickPagination(Math.max(currentIndex - 1, 0));
            }}
          >
            <FontAwesomeIcon icon={faAnglesLeft} className="group-hover:text-white" />
          </span>

        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
          const i = startPage + idx;
          return (
            <button
              onClick={() => handleClickPagination(i)}
              key={i}
              className={clsx(
                "mx-1 px-4 py-2 rounded-lg border font-semibold transition-all duration-150",
                currentIndex === i
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400"
              )}
            >
              {i + 1}
            </button>
          );
        })}

          <span
            className={clsx(
              "w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white transition-all duration-150",
              currentIndex === totalPage - 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-[#a8a8a8d0] group cursor-pointer"
            )}
            onClick={() => {
              if (currentIndex !== totalPage - 1) handleClickPagination(Math.min(currentIndex + 1, totalPage - 1));
            }}
          >
            <FontAwesomeIcon icon={faAnglesRight} className="group-hover:text-white" />
          </span>
      </div>
    </div>
  );
};

export default AuctionSearch;
