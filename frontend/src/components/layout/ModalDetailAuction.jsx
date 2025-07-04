import { getOne } from "../../services/api";
import { useEffect, useState } from "react";

const ModalDetailAuction = ({ idAuction, isOpen, clickClose }) => {
  const [bids, setBids] = useState([]);
  const [auction, setAuction] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        const response = await getOne("auctions", idAuction, false);
        setAuction(response.data);
        setBids(response.data.bids);
        console.log("a");
      } catch (error) {
        console.log(error);
        alert("có lỗi khi lấy auctions");
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen && idAuction) {
      fetchBids();
    }
  }, [isOpen, idAuction]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg h-[80%] w-[90%] max-w-5xl p-4">
        <div className="flex justify-end">
          <button onClick={clickClose} className="text-black text-lg font-bold">
            &times;
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {auction && (
            <>
              <div className="w-full md:w-1/2">
                <img
                  src={
                    auction.image_url && auction.image_url.length > 0
                      ? `${import.meta.env.VITE_BASE_URL}${
                          auction.image_url[0]
                        }`
                      : ""
                  }
                  alt="Building"
                  className="w-full h-auto border max-w-[50%] rounded"
                />
              </div>

              <div className="text-sm md:text-base w-full md:w-1/2">
                <p>
                  <strong>PARTRON NO:</strong> xxxxxxxxxxxxxx
                </p>
                <p>
                  <strong>Title:</strong> {auction.title}
                </p>
                <p>
                  <strong>Deadline:</strong> {auction.end_time}
                </p>
                <p>
                  <strong>Starting price:</strong> {auction.starting_price}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {auction.status === 0
                    ? "Ongoing"
                    : auction.status === 1
                    ? "Upcoming"
                    : "Ended"}
                </p>
                <p>
                  <strong>Description:</strong> {auction.description}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="max-h-[40%] overflow-y-auto border border-gray-300 mt-6">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">
                  Supplier_Email
                </th>
                <th className="border border-gray-300 px-4 py-2">Bid amount</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
                <th className="border border-gray-300 px-4 py-2">Note</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                bids?.map((bid, idx) => (
                  <tr
                    className={
                      idx === 0 ? "bg-yellow-100" : "hover:bg-yellow-100"
                    }
                    key={idx}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bid.email || ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bid.bid_amount || ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bid.created_at || ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bid.note || ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bid.user_name || ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    đang load dữ liệu...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailAuction;
