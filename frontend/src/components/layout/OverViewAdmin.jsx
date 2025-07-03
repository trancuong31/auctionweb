import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAll, update, deleteOne } from "../../services/api";
import CreateAuctionForm from "./AuctionCreate";
import ModalDetailAuction from "./ModalDetailAuction";
import Pagination from "../ui/Pagination";
import {
  faUsers,
  faGavel,
  faCheck,
  faGear,
  faXmark,
  faClock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const OverViewAdmin = () => {
  const [currentEditing, setCurrentEditing] = useState(null);
  const [overViewData, setOverViewData] = useState({});
  const [userData, setUserData] = useState([]);
  const [auctionData, setAuctionData] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [displayCreateForm, setDisplayCreateForm] = useState(false);
  const [searchAuctionTitle, setSearchAuctionTitle] = useState("");
  const [idAuction, setIdAuction] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [sortUserBy, setSortUserBy] = useState("");
  const [sortUserOder, setSortUserOder] = useState("");
  const [totalPageUser, setTotalPageUser] = useState(0);
  const [sortAuctionBy, setSortAuctionBy] = useState("");
  const [sortAuctionOrder, setSortAuctionOrder] = useState("");
  const [totalPageAuction, setTotalPageAuction] = useState(0);

  const getOverView = async () => {
    try {
      const response = await getAll("overview", true);
      setOverViewData(response.data);
    } catch (error) {
      alert(" có lỗi khi lấy dữ liệu");
      console.log(error);
    }
  };

  const handleClickClose = () => {
    setIsOpenModal(false);
  };

  const getPageUser = async (page = 1) => {
    const param = {
      sort_by: sortUserBy,
      sort_order: sortUserOder,
      page: page,
    };
    try {
      const response = await getAll("users", true, param);
      setUserData(response.data.users);
      setTotalPageUser(
        Math.ceil(
          response.data.total_users / Number(import.meta.env.VITE_PAGE_SIZE)
        )
      );
    } catch (error) {
      alert("có lỗi khi lấy dữ liệu user");
      console.log(error);
    }
  };

  const getPageAuction = async (page = 1) => {
    const param = {
      sort_by: sortAuctionBy,
      sort_order: sortAuctionOrder,
      page: page,
    };
    try {
      const response = await getAll("auctions/search", true, param);
      setAuctionData(response.data.auctions);
      setTotalPageAuction(
        Math.ceil(response.data.total / Number(import.meta.env.VITE_PAGE_SIZE))
      );
    } catch (error) {
      alert("có lỗi khi lấy dữ liệu Auctions");
      console.log(error);
    }
  };

  const handleEditUser = async (user) => {
    const newUser = {
      ...user,
      username: userName,
      email: email,
    };

    try {
      await update("users", user.id, newUser, true);
      alert("Cập nhật user thành công");
      await getAllUser();
      setCurrentEditing(null);
    } catch (error) {
      alert("lỗi khi cập nhật user");
      console.log(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteOne("users", id, true);
      alert("xóa user thành công");
    } catch (error) {
      alert("xóa user thất bại");
      console.log(error);
    }
  };

  const openDetailBid = (id) => {
    setIdAuction(id);
    setIsOpenModal(true);
  };

  const filteredAuctions = auctionData?.filter((auction) =>
    auction.title.toLowerCase().includes(searchAuctionTitle.toLowerCase())
  );

  const handelClickEdit = (user, idx) => {
    setCurrentEditing(idx);
    setUserName(user.username);
    setEmail(user.email);
  };

  useEffect(() => {
    getOverView();
    getPageUser();
    getPageAuction();
  }, []);

  return (
    <div>
      <CreateAuctionForm
        isOpen={displayCreateForm}
        onClickClose={() => setDisplayCreateForm(false)}
      />
      {/* <!-- OVERVIEW --> */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-200 p-4 rounded shadow text-center">
          <p className="font-semibold">Total User</p>
          <p className="text-2xl font-bold">{overViewData.total_user}</p>
          <p className="text-xl">
            <FontAwesomeIcon icon={faUsers} />{" "}
          </p>
        </div>
        <div className="bg-yellow-200 p-4 rounded shadow text-center">
          <p className="font-semibold">Total auction</p>
          <p className="text-2xl font-bold">{overViewData.total_auction}</p>
          <p className="text-xl">
            <FontAwesomeIcon icon={faCheck} />
          </p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow text-center">
          <p className="font-semibold">Total successful auctions</p>
          <p className="text-2xl font-bold">
            {overViewData.total_successful_auctions}
          </p>
          <p className="text-xl">
            <FontAwesomeIcon icon={faGavel} />
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <p className="font-semibold">Total auction in progress</p>
          <p className="text-2xl font-bold">
            {overViewData.total_auction_in_progress}
          </p>
          <p className="text-xl">
            <FontAwesomeIcon icon={faGear} />
          </p>
        </div>
        <div className="bg-cyan-100 p-4 rounded shadow text-center">
          <p className="font-semibold">Total upcoming auctions</p>
          <p className="text-2xl font-bold">
            {overViewData.total_upcoming_auctions}
          </p>
          <p className="text-xl">
            <FontAwesomeIcon icon={faClock} />
          </p>
        </div>
        <div className="bg-red-300 p-4 rounded shadow text-center">
          <p className="font-semibold">Total unsuccessful auctions</p>
          <p className="text-2xl font-bold">
            {overViewData.total_unsuccessful_auctions}
          </p>
          <p className="text-xl">
            <FontAwesomeIcon icon={faXmark} />
          </p>
        </div>
      </div>

      {/* <!-- MANAGER USERS --> */}

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between mb-3 items-center">
          <p className="text-lg font-bold">MANAGER USERS</p>
          <div className="bg-white px-[120px] flex-1 flex flex-col md:flex-row items-center md:space-y-0 md:space-x-4 w-full">
            {/* <!-- Search Input --> */}
            <div className="w-[60%]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for category, name, company, etc"
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </div>
            {/* <!-- Category Select --> */}
            <div className="w-[25%] pb-6">
              <label className="text-sm font-semibold block mb-1">
                Sort by
              </label>
              {/* Sort select */}
              <div className="">
                <select
                  onChange={(e) => {
                    const selectedOption = e.target.selectedOptions[0];
                    setSortUserBy(selectedOption.value);
                    setSortUserOder(selectedOption.dataset.order);
                  }}
                  className="border border-gray-400 rounded-lg px-3 py-2 w-full"
                >
                  <option value="username" data-order="asc">
                    User Name from A to Z
                  </option>
                  <option value="username" data-order="desc">
                    User Name from Z to A
                  </option>
                  <option value="start_time" data-order="asc">
                    Email Name from A to Z
                  </option>
                  <option value="start_time" data-order="desc">
                    Email from Z to A
                  </option>
                  <option value="create_at" data-order="asc">
                    Create At from Oldest to Latest
                  </option>
                  <option value="create_at" data-order="desc">
                    Create At from Latest to Oldest
                  </option>
                </select>
              </div>
            </div>

            {/* <!-- Search Button --> */}
            <div className="w-full md:w-auto flex justify-end md:justify-center mt-2 md:mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold ml-3">
                SEARCH
              </button>
            </div>
          </div>
          <Pagination
            totalPage={totalPageUser}
            onPageChange={getPageUser}
            className={"mt-0"}
          />
        </div>

        <div className="overflow-x-auto border border-gray-300 rounded">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Create at</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Active</th>
              </tr>
            </thead>
            <tbody>
              {userData?.map((user, idx) => (
                <tr
                  key={user.id || idx}
                  className="hover:bg-blue-400 hover:text-white transition"
                >
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    {currentEditing === idx ? (
                      <input
                        type="text"
                        name="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="border px-2 py-1 w-full rounded text-black"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {currentEditing === idx ? (
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border px-2 py-1 w-full rounded text-black"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border px-2 py-1">{user.created_at}</td>
                  <td className="border px-2 py-1">{user.role}</td>
                  <td className="border px-2 py-1">
                    <div className="flex justify-center">
                      {user.status ? (
                        <span className="bg-blue-500 text-white text-xs px-3 py-2 min-w-[70%] text-center rounded">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white text-xs px-3 py-2 min-w-[70%] text-center rounded">
                          Disactive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border px-2 py-1 space-x-1 text-center">
                    {currentEditing === idx ? (
                      <>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-green-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setCurrentEditing(null)}
                          className="bg-orange-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handelClickEdit(user, idx)}
                          className="bg-blue-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- MANAGER AUCTIONS --> */}

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">MANAGER AUCTIONS</h2>
        </div>
        <div className="bg-white flex-1 flex flex-col md:flex-row justify-between items-center md:space-y-0 md:space-x-4 w-full">
          <div className="flex gap-10 w-[70%] items-center">
            <button
              onClick={() => setDisplayCreateForm(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Create auction
            </button>
            {/* <!-- Search Input --> */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for category, name, company, etc"
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </div>
            <div className="w-[25%] pb-6">
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
            </div>

            {/* <!-- Search Button --> */}
            <div className="">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold ml-3">
                SEARCH
              </button>
            </div>
          </div>
          <Pagination
            totalPage={totalPageAuction}
            onPageChange={getPageAuction}
          />
        </div>

        <div className="overflow-x-auto border border-gray-300 rounded">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Start time</th>
                <th className="border px-2 py-1">End time</th>
                <th className="border px-2 py-1">Starting price</th>
                <th className="border px-2 py-1">Current highest price</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">#</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions?.map((auction, idx) => {
                let statusText = "Ended";
                if (auction.status === 0) statusText = "Ongoing";
                else if (auction.status === 1) statusText = "Upcoming";

                return (
                  <tr
                    key={auction.id || idx}
                    className="hover:bg-blue-400 hover:text-white transition"
                  >
                    <td className="border px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border px-2 py-1">{auction.title}</td>
                    <td className="border px-2 py-1">{auction.start_time}</td>
                    <td className="border px-2 py-1">{auction.end_time}</td>
                    <td className="border px-2 py-1">
                      {auction.starting_price}
                    </td>
                    <td className="border px-2 py-1">
                      {auction.highest_amount}
                    </td>
                    <td className="border px-2 py-1">{statusText}</td>
                    <td
                      onClick={() => openDetailBid(auction.id)}
                      className="border px-2 py-1 text-blue-500 underline cursor-pointer"
                    >
                      View
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ModalDetailAuction
          isOpen={isOpenModal}
          clickClose={handleClickClose}
          idAuction={idAuction}
        />
      </div>
    </div>
  );
};

export default OverViewAdmin;
