import { getOne } from "../../services/api";
import { useEffect, useState } from "react";
import clsx from "clsx";
import imagedefault from "../../assets/images/imagedefault.png";
import { useTranslation } from "react-i18next";
const ModalDetailAuction = ({ idAuction, isOpen, clickClose }) => {
  const [bids, setBids] = useState([]);
  const [auction, setAuction] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const { t, i18n } = useTranslation();
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

  // Khi load trang, ưu tiên lấy ngôn ngữ từ sessionStorage nếu có
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        const response = await getOne("auctions", idAuction, false, {
          lang: sessionStorage.getItem("lang") || "en",
        });
        setAuction(response.data);
        const fetchedBids = response.data.bids;
        setBids(fetchedBids);
        const maxBid =
          fetchedBids.length > 0
            ? Math.max(...fetchedBids.map((b) => b.bid_amount))
            : 0;
        setHighestBid(maxBid);
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
      onClick={clickClose}
    >
      <div
        className={clsx(
          "bg-white shadow-lg w-[80%] max-w-6xl p-6 relative max-h-[80%] overflow-y-auto max-sm:max-h-[60%] max-sm:mt-32 max-lg:mt-10 scrollbar-hide fade-slide-up",
          isOpen ? "fade-slide-up-visible" : "fade-slide-up-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {t("auction_detail")}
        </h2>
        <button
          onClick={clickClose}
          className="absolute top-4 right-4 text-black-500 hover:text-red-700 text-2xl font-bold"
        >
          ×
        </button>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={
                auction.image_url && auction.image_url.length > 0
                  ? `${import.meta.env.VITE_BASE_URL}${auction.image_url[0]}`
                  : imagedefault
              }
              alt="Auction Image"
              className="w-full h-64 object-cover hover:scale-105 transition ease-out duration-500 rounded-2xl"
            />
            <div className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow flex items-center justify-between w-full">
              <p className="text-sm font-semibold">{t("current_status")}</p>
              <span className="text-sm font-medium bg-white text-purple-600 px-4 py-1 rounded-full shadow-sm">
                {auction.status === 0
                  ? t("ongoing_auctions")
                  : auction.status === 1
                  ? t("upcoming_auctions")
                  : t("ended_auctions")}
              </span>
            </div>
          </div>

          <div className="lg:w-1/2 w-full space-y-3">
            <div className="bg-gray-100 p-4 rounded-xl flex items-start rounded-r-3xl rounded-l-md border-l-4 border-purple-500 shadow-sm">
              <p className="text-lg font-semibold text-indigo-700 text-left break-words w-full">
                {auction.title || "No title"}
              </p>
            </div>

            <div className="bg-white border border-gray-400 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("deadline")}
                </p>
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

              <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("starting_price")}
                </p>
                <p className="text-green-600 font-bold text-lg">
                  {auction.starting_price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) || "$0"}
                </p>
              </div>

              <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("step_price")}
                </p>
                <p className="text-yellow-700 font-bold text-lg">
                  {auction.step_price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) || "$0"}
                </p>
              </div>

              <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("attached_file")}
                </p>
                <p className="text-red-600 font-bold text-lg">
                  {auction.file_exel ? (
                    <button
                      onClick={() => handleDownload(auction.id)}
                      className="text-blue-600 text-left hover:underline font-medium"
                    >
                      <p title={auction.file_exel.split("/").pop()}>
                        {auction.file_exel.split("/").pop().length > 30
                          ? auction.file_exel.split("/").pop().slice(0, 20) +
                            "..."
                          : auction.file_exel.split("/").pop()}
                      </p>
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">{t("no_file")}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-500">
                {t("description")}
              </p>
              <p className="text-gray-700 text-sm max-h-20 overflow-y-auto">
                {auction.description || t("no_description_available")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-700 px-4 py-2">
          <div>
            {t("total_bids")}:{" "}
            <span className="text-gray-500">{bids?.length || 0}</span>
          </div>
          <div>
            <span className="font-medium text-purple-600">
              {t("highest_bid")}:{" "}
              {highestBid.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>

        <div className=" border rounded-xl max-h-60 overflow-y-auto">
          <table className="table-fixed min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-semibold uppercase">#</th>
                <th className="px-4 py-2 font-semibold uppercase">
                  {t("supplier_email")}
                </th>
                <th className="px-4 py-2 font-semibold uppercase">
                  {t("user_name")}
                </th>
                <th className="px-4 py-2 font-semibold uppercase">
                  {t("bid_amount_usd")}
                </th>
                <th className="px-4 py-2 font-semibold uppercase">
                  {t("submitted_at")}
                </th>
                <th className="px-4 py-2 font-semibold uppercase">
                  {t("additional_notes")}
                </th>
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
                    <td className="px-4 text-green-500 py-2">
                      {bid.bid_amount != null
                        ? bid.bid_amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {bid.created_at
                        ? new Date(bid.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-2 w-[200px] break-all whitespace-normal">
                      {bid.note || "null"}
                    </td>
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
