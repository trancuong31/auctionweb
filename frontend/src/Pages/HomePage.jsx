import AuctionSection from "../components/layout/Auctions";
import { CheckCircle } from "lucide-react";
import register from "../assets/images/bg1.jpg"
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function HomePage() {
  const { t } = useTranslation();
  return (
    <main className="shadow-[0_4px_24px_rgba(0,0,0,0.30)] p-4 rounded-xl">
      <section className="relative w-full h-[630px] flex items-center justify-center text-center bg-black/50 mb-[35px]">
      {/* Background Image */}
      <img
        src={register}
        alt="Auction"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        {/* Subtitle */}
        <p className="text-white text-sm bg-gray-400/30 p-2 tracking-widest mb-3">
          {t("probid")}
        </p>
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          {t("select")} <span className="italic font-playfair text-[#ffffffa4]">{t("our_product")}</span>
          <br />
          {t("at_our_auction")}
        </h1>

        {/* Features */}
        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="text-green-500 w-5 h-5" />
            <span>{t("auction_excellence")}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="text-green-500 w-5 h-5" />
            <span>{t("moneyback_guarantee")}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="text-green-500 w-5 h-5" />
            <span>{t("support_24_7")}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link to="/guide">
            <button className="px-6 py-3 hover:bg-gray-100 transition-all transform  duration-300 hover:scale-105 bg-gradient-to-r from-blue-500 to-indigo-500  text-white font-semibold rounded-lg shadow-lg ">
              {t("start_a_bid")}
            </button>
          </Link>
          <Link to="/auctions/search">
            <button className="px-6 py-3 hover:bg-gray-100 transition-all transform  duration-300 hover:scale-105 bg-white text-black font-semibold rounded-lg shadow-lg">
              {t("view_all_auction")}
            </button>
          </Link>
        </div>
      </div>
    </section>

      <AuctionSection titleKey="ongoing_auctions" type="ongoing" />
      <AuctionSection titleKey="upcoming_auctions" type="upcoming" />
      <AuctionSection titleKey="ended_auctions" type="ended" />
    </main>
  );
}

export default HomePage;
