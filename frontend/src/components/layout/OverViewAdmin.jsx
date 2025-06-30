import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAll } from "../../services/api";
import {
  faUsers,
  faGavel,
  faCheck,
  faGear,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const OverViewAdmin = () => {
  const [currentEditing, setCurrentEditing] = useState(null);
  const [overViewData, setOverViewData] = useState({});
  const [userData, setUserData] = useState([]);
  const [auctionData, setAuctionData] = useState([]);

  const getOverView = async () => {
    try {
      const response = await getAll("overview", true);
      setOverViewData(response.data);
    } catch (error) {
      alert(" có lỗi khi lấy dữ liệu");
      console.log(error);
    }
  };

  const getAllUser = async () => {
    try {
      const response = await getAll("users", true);
      setUserData(response.data);
    } catch (error) {
      alert("có lỗi khi lấy dữ liệu user");
      console.log(error);
    }
  };

  const getAllAuction = async () => {
    try {
      const response = await getAll("auctions", true);
      setAuctionData(response.data.auctions);
    } catch (error) {
      alert("có lỗi khi lấy dữ liệu Auctions");
      console.log(error);
    }
  };

  useEffect(() => {
    getOverView();
    getAllUser();
    getAllAuction();
  }, []);

  return (
    <div>
      {/* <!-- OVERVIEW --> */}
      <div className="grid grid-cols-5 gap-4 mb-6">
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
        <h2 className="text-lg font-bold mb-4">MANAGER USERS</h2>
        <table className="min-w-full border border-gray-300">
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
          {userData &&
            userData.map((user, idx) => (
              <tbody key={user.id || idx}>
                <tr>
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    {currentEditing === idx ? (
                      <input
                        type="text"
                        name="name"
                        value={user.username}
                        // onChange={handleChange}
                        className="border px-2 py-1 w-full rounded"
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
                        value={user.email}
                        // onChange={handleChange}
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border px-2 py-1">{user.created_at}</td>
                  <td className="border px-2 py-1">{user.role}</td>
                  <td className="border px-2 py-1 flex justify-center">
                    <span className="bg-blue-500 text-white text-xs px-3 py-2 min-w-[70%] text-center rounded">
                      Active
                    </span>
                  </td>
                  <td className="border px-2 py-1 space-x-1 text-center">
                    {currentEditing === idx ? (
                      <>
                        <button
                          onClick={() => setCurrentEditing(idx)}
                          className="bg-green-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setCurrentEditing(null)}
                          className="bg-orange-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Cancle
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setCurrentEditing(idx)}
                          className="bg-blue-500 text-white text-xs px-3 py-2 rounded min-w-[60px]"
                        >
                          Edit
                        </button>
                        <button className="bg-red-500 text-white text-xs px-3 py-2 rounded min-w-[60px]">
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>

      {/* <!-- MANAGER AUCTIONS --> */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">MANAGER AUCTIONS</h2>
          <input
            type="text"
            placeholder="Title"
            className="border px-2 py-1 rounded"
          />
        </div>
        <button className="bg-blue-500 text-white px-3 py-1 rounded mb-4">
          Create auction
        </button>
        <table className="min-w-full border border-gray-300">
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
          {auctionData &&
            auctionData.map((auction, idx) => {
              let statusText = "Ended";
              if (auction.status === 0) {
                statusText = "Upcoming";
              } else if (auction.status === 1) {
                statusText = "Ongoing";
              }
              return (
                <tbody key={auction.id || idx}>
                  <tr>
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
                    <td className="border px-2 py-1 text-blue-500 underline cursor-pointer">
                      View
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </div>
  );
};

export default OverViewAdmin;
