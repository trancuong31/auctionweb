import { useState, useEffect } from "react";
import { X, Clock, DollarSign, MapPin, Trophy, FileText } from "lucide-react";
import axiosClient from "../../services/axiosClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
const AuctionHistory = ({ isOpen, onClose }) => {
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayedItems, setDisplayedItems] = useState(5);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    i18n.changeLanguage(savedLang);
  }, [i18n]);
  useEffect(() => {
    setLoading(true);
    setError(null);
    setDisplayedItems(5);
    axiosClient
      .get("/bids/user")
      .then((res) => setAuctionHistory(res.data))
      .catch((err) => setError("Lỗi khi tải dữ liệu lịch sử đấu giá"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleLoadMore = () => {
    setDisplayedItems((prev) => prev + 5);
  };

  const hasMoreItems = displayedItems < auctionHistory.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  const truncateId = (id) => {
    return id.length > 50
      ? `${id.substring(0, 30)}...${id.substring(id.length - 8)}`
      : id;
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4",
          isOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={clsx(
            " fade-slide-up",
            "mt-[220px] sm:mt-[60px] md:mt-[55px] bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-2xl  md:max-w-4xl lg:max-w-7xl max-h-[95vh] overflow-hidden mx-2 sm:mx-4 md:mx-auto flex flex-col",
            isOpen ? "fade-slide-up-visible" : "fade-slide-up-hidden"
          )}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 flex items-center justify-between relative">
            <div className="flex-1 text-center">
              <h2 className="text-xl font-bold">{t("auction_history")}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2  hover:bg-opacity-20 rounded-lg transition-colors absolute right-4 sm:right-6"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content (scrollable) */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {loading && <div>Loading data...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && (
              <>
                <div className="space-y-4">
                  {auctionHistory.slice(0, displayedItems).map((bid, index) => (
                    <div
                      key={bid.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-500 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.30)]"
                      onClick={() => {
                        onClose();
                        navigate(`/auctions/${bid.auction_id}`);
                      }}
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              bid.is_winner ? "bg-green-500" : "bg-gray-400"
                            }`}
                          >
                            {bid.is_winner ? <Trophy size={20} /> : index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Bid #{index + 1}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ID: {truncateId(bid.id)}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bid.is_winner
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {bid.is_winner ? "Winning" : "Participated"}
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <DollarSign
                              className="text-green-500 mt-1"
                              size={18}
                            />
                            <div>
                              <p className="text-sm text-gray-500">
                                {t("bid_amount_usd")}
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                {formatCurrency(bid.bid_amount)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="text-blue-500 mt-1" size={18} />
                            <div>
                              <p className="text-sm text-gray-500">
                                {t("submitted_at")}
                              </p>
                              <p className="font-medium text-gray-900">
                                {formatDateTime(bid.created_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <DollarSign
                              className="text-purple-500 mt-1"
                              size={18}
                            />
                            <div>
                              <p className="text-sm text-gray-500">
                                {t("starting_price")}
                              </p>
                              <p className="text-lg font-bold text-gray-700">
                                {formatCurrency(bid.auction_starting_price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="text-red-500 mt-1" size={18} />
                            <div>
                              <p className="text-sm text-gray-500">
                                {t("address")}
                              </p>
                              <p className="text-gray-900">{bid.address}</p>
                            </div>
                          </div>

                          {bid.note && (
                            <div className="flex items-start gap-3">
                              <FileText
                                className="text-amber-500 mt-1"
                                size={18}
                              />
                              <div>
                                <p className="text-sm text-gray-500">
                                  {t("additional_notes")}
                                </p>
                                <p className="text-gray-900">{bid.note}</p>
                              </div>
                            </div>
                          )}

                          <div className="bg-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("title")}
                            </p>
                            <p className="font-mono text-xs text-gray-600">
                              {truncateId(bid.auction_title)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Load More Button */}
                {hasMoreItems && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {t("load_more")} ({auctionHistory.length - displayedItems}
                      )
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-600 text-sm font-medium">
                  {t("total_bids")}
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {auctionHistory.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="text-green-600 text-sm font-medium">
                  {t("winning_bids")}
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {auctionHistory.filter((bid) => bid.is_winner).length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="text-orange-600 text-sm font-medium">
                  {t("highest_value")}
                </div>
                <div className="text-lg font-bold text-orange-700">
                  {formatCurrency(
                    Math.max(...auctionHistory.map((bid) => bid.bid_amount))
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="text-purple-600 text-sm font-medium">
                  {t("success_rate")}
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {auctionHistory.length > 0
                    ? Math.round(
                        (auctionHistory.filter((bid) => bid.is_winner).length /
                          auctionHistory.length) *
                          100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionHistory;
