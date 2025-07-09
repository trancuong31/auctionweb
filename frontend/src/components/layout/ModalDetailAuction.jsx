import { getOne } from "../../services/api";
import { useEffect, useState } from "react";
import clsx from "clsx";
import imagedefault from "../../assets/images/imagedefault.png";
const ModalDetailAuction = ({ idAuction, isOpen, clickClose }) => {
  const [bids, setBids] = useState([]);
  const [auction, setAuction] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/v1/download/excel/by-auction/${id}`);
      if (!res.ok) throw new Error("Dowload file fail!");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `auction-${id}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error download file:", error);
    }
  };
  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        const response = await getOne("auctions", idAuction, false);
        setAuction(response.data);
        setBids(response.data.bids);
      } catch (error) {
        console.log(error);
        alert("Có lỗi khi lấy auctions");
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen && idAuction) {
      fetchBids();
    }
  }, [isOpen, idAuction]);

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50",
        isOpen ? "visible" : "invisible"
      )}
    >
      <div className="bg-white shadow-lg w-[80%] max-w-6xl p-6 relative max-h-[80%] overflow-y-auto">
        <button
          onClick={clickClose}
          className="absolute top-4 right-4 text-black-500 hover:text-red-700 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Auction Details</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={
                auction.image_url && auction.image_url.length > 0
                  ? `${import.meta.env.VITE_BASE_URL}${auction.image_url[0]}`
                  : imagedefault
              }
              alt="Auction Image"
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="mt-4 p-3 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 text-white rounded-xl shadow text-center">
              <p className="text-sm font-semibold">Current Status</p>
              <p className="text-lg font-bold bg-blue-50 text-blue-800 px-4 py-2 rounded-xl shadow-sm">
                {auction.status === 0
                  ? "Ongoing"
                  : auction.status === 1
                  ? "Upcoming"
                  : "Ended"}
              </p>
            </div>
            
          </div>

          <div className="lg:w-1/2 w-full space-y-3">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-lg font-semibold text-indigo-700 text-left">
                {auction.title || "No title"}
              </p>              
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">Deadline</p>
                <p className="font-semibold text-gray-800">
                  {auction.end_time
                    ? new Date(auction.end_time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })
                    : "-"}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">Starting Price</p>
                <p className="text-green-600 font-bold text-lg">
                  {auction.starting_price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) || "$0"}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">Step Price</p>
                <p className="text-red-600 font-bold text-lg">
                  {auction.step_price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) || "$0"}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">File</p>
                <p className="text-red-600 font-bold text-lg">
                  {auction.file_exel ? (
                    <button
                      onClick={() => handleDownload(auction.id)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      <p>{auction.file_exel.split("/").pop()}</p>
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No file</span>
                  )}
                </p>
              </div>
            </div>


            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-gray-700 text-sm max-h-32 overflow-y-auto">
                {auction.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-text-center">
            Total Bids: <span className="text-red-700">{bids?.length || 0}</span>
        </div>
        <div className=" border rounded-xl max-h-60 overflow-y-auto">
          <table className="table-fixed min-w-full text-sm text-left">

            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-semibold uppercase">#</th>
                <th className="px-4 py-2 font-semibold uppercase">Supplier Email</th>
                <th className="px-4 py-2 font-semibold uppercase">User Name</th>
                <th className="px-4 py-2 font-semibold uppercase">Bid Amount</th>
                <th className="px-4 py-2 font-semibold uppercase">Submission Time</th>
                <th className="px-4 py-2 font-semibold uppercase">Note</th>
                
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                bids?.map((bid, idx) => (
                  <tr
                    key={idx}
                    className={clsx(
                      "border-t",
                      idx === 0 ? "bg-yellow-100" : "bg-white",
                      "even:bg-gray-50"
                    )}
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{bid.email || "-"}</td>
                    <td className="px-4 py-2">{bid.user_name || "-"}</td>
                    <td className="px-4 text-green-500 py-2">{bid.bid_amount || "-"}$</td>
                    <td className="px-4 py-2">
                      {new Date(bid.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 w-[200px] break-all whitespace-normal">{bid.note || "-"}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading bids...
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