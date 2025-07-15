import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAll, update, deleteOne, updateSatus } from "../services/api";
import CreateAuctionForm from "../components/layout/AuctionCreate";
import ModalDetailAuction from "../components/layout/ModalDetailAuction";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useDebounceCallback } from "../hooks/useDebounceCallback";
import AnimatedContent from "../components/ui/animatedContent";
import { useTranslation } from "react-i18next";
import {
  faUsers,
  faGavel,
  faCheck,
  faGear,
  faXmark,
  faClock,
  faSearch,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const OverViewAdmin = () => {
  const [currentIndexPageUser, setCurrentIndexPageUser] = useState(0);
  const [currentIndexPageAuction, setCurrentIndexPageAuction] = useState(0);
  const [currentEditing, setCurrentEditing] = useState(null);
  const [overViewData, setOverViewData] = useState({});
  const [userData, setUserData] = useState([]);
  const [auctionData, setAuctionData] = useState([]);
  const [userName, setUserName] = useState("");
  const [displayCreateForm, setDisplayCreateForm] = useState(false);
  const [idAuction, setIdAuction] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [totalPageUser, setTotalPageUser] = useState(0);
  const [totalPageAuction, setTotalPageAuction] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const { t, i18n } = useTranslation();
  const [userParam, setUserParam] = useState({
    sort_by: "",
    sort_order: "",
    search_text: "",
  });
  const [userFilterInput, setUserFilterInput] = useState({
    sort_by: "",
    sort_order: "",
    search_text: "",
  });
  const [auctionParam, setAuctionParam] = useState({
    sort_by: "",
    sort_order: "",
    status: null,
    title: "",
  });
  const [auctionFilterInput, setAuctionFilterInput] = useState({
    sort_by: "",
    sort_order: "",
    status: null,
    title: "",
  });
  // const [auctionParam, setAuctionParam] = useState({});
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    icon: null,
    onConfirm: () => {},
  });

  // Khi load trang, ưu tiên lấy ngôn ngữ từ sessionStorage nếu có
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const getOverView = async () => {
    try {
      const response = await getAll("overview", true, {
        lang: sessionStorage.getItem("lang") || "en",
      });
      setOverViewData(response.data);
    } catch (error) {
      toast.error("Error while get data");
      console.log(error);
    }
  };

  const handleClickClose = () => {
    setIsOpenModal(false);
  };

  const getPageUser = async (page = 1) => {
    const lang = sessionStorage.getItem("lang") || "en";
    const param = {
      ...userParam,
      page,
      lang,
    };
    try {
      // setIsLoadingSearch(true);
      const response = await getAll("users", true, param);
      setUserData(response.data.users);
      setTotalPageUser(
        Math.ceil(
          response.data.total_users / Number(import.meta.env.VITE_PAGE_SIZE)
        )
      );
    } catch (error) {
      toast.error("Error while get User data");
      console.log(error);
    } finally {
      // setIsLoadingSearch(false);
      setCurrentIndexPageUser(page - 1);
    }
  };

  const getPageAuction = async (page = 1) => {
    try {
      // setIsLoadingSearch(true);
      const lang = sessionStorage.getItem("lang") || "en";
      const paramWithPage = {
        ...auctionParam,
        page,
        lang,
      };
      const response = await getAll("auctions/search", true, paramWithPage);
      setAuctionData(response.data.auctions);
      setTotalPageAuction(
        Math.ceil(response.data.total / Number(import.meta.env.VITE_PAGE_SIZE))
      );
    } catch (error) {
      toast.error("Error while get Auction Data");
      console.log(error);
    } finally {
      // setIsLoadingSearch(false);
      setCurrentIndexPageAuction(page - 1);
    }
  };

  const [debouncedSearchAuction, cancelSearch] = useDebounceCallback(
    getPageAuction,
    500
  );

  // Handler cho nút search
  const handleSearch = () => {
    setAuctionParam({
      ...auctionFilterInput,
    });
  };

  useEffect(() => {
    debouncedSearchAuction(1);
  }, [auctionParam]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      cancelSearch();
    };
  }, [cancelSearch]);

  const [debouncedSearchUser, cancelSearchUser] = useDebounceCallback(
    getPageUser,
    500
  );

  // Handler cho nút search
  const searchUser = () => {
    setUserParam({
      ...userFilterInput,
    });
  };

  useEffect(() => {
    debouncedSearchUser(1);
  }, [userParam]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      cancelSearchUser();
    };
  }, [cancelSearchUser]);

  const handleEditUser = async (user) => {
    if (userName.length < 3) return toast.error("Username is not valid");
    const newUser = {
      ...user,
      username: userName,
    };

    try {
      await update("users", user.id, newUser, true, {
        lang: sessionStorage.getItem("lang") || "en",
      });
      toast.success("Update user successful!");
      setCurrentEditing(null);
      await getPageUser();
    } catch (error) {
      toast.error("update user fail!");
      console.log(error);
    }
  };

  const handleDeleteUser = (id) => {
    setConfirmConfig({
      title: t("delete_user_title"),
      message: t("delete_user_message"),
      icon: (
        <FontAwesomeIcon
          className="text-red-500 h-6"
          icon={faTriangleExclamation}
        />
      ),
      onConfirm: async () => {
        try {
          await deleteOne("users", id, true, {
            lang: sessionStorage.getItem("lang") || "en",
          });
          toast.success("Delete user successful!");
          getPageUser();
        } catch (error) {
          toast.error("Delete user fail!");
          console.log(error);
        }
      },
    });
    setConfirmOpen(true);
  };

  const handleDeactiveUser = (user) => {
    setConfirmConfig({
      title: t(user.status ? "deactivate_user_title" : "activate_user_title"),
      icon: (
        <FontAwesomeIcon
          className="text-yellow-500 h-6"
          icon={faTriangleExclamation}
        />
      ),
      message: t(
        user.status ? "deactivate_user_message" : "activate_user_message"
      ),
      onConfirm: async () => {
        try {
          await updateSatus("users", user.id, { status: !user.status }, true, {
            lang: sessionStorage.getItem("lang") || "en",
          });
          toast.success("update status user successful!");
          getPageUser();
        } catch (error) {
          toast.error("update status user fail!");
          console.log(error);
        }
      },
    });
    setConfirmOpen(true);
  };

  const openDetailBid = (id) => {
    setIdAuction(id);
    setIsOpenModal(true);
  };

  const handelClickEdit = (user, idx) => {
    setCurrentEditing(idx);
    setUserName(user.username);
  };

  useEffect(() => {
    const fetchDataOverview = async () => {
      setIsLoadingPage(true);
      await getOverView();
      setIsLoadingPage(false);
    };

    fetchDataOverview();
  }, []);

  // if (isLoadingPage) return <div className="loader" />;
  return (
    <>
      <ConfirmDialog
        open={confirmOpen}
        icon={confirmConfig.icon}
        setOpen={setConfirmOpen}
        onConfirm={() => {
          confirmConfig.onConfirm();
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
      <CreateAuctionForm
        isOpen={displayCreateForm}
        onClickClose={() => {
          setDisplayCreateForm(false);
        }}
      />
      <ModalDetailAuction
        isOpen={isOpenModal}
        clickClose={handleClickClose}
        idAuction={idAuction}
      />
      <AnimatedContent>
        {/* <!-- OVERVIEW --> */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="bg-indigo-400 p-3 sm:p-4 rounded shadow text-center aspect-[4/3] flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold">
              {t("total_user")}
            </p>
            <p className="text-2xl sm:text-2xl font-bold">
              {overViewData.total_user}
            </p>
            <p className="text-lg sm:text-xl">
              <FontAwesomeIcon icon={faUsers} />
            </p>
          </div>

          <div className="bg-yellow-200 p-3 sm:p-4 rounded shadow text-center aspect-[4/3] flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold">
              {t("total_auction")}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              {overViewData.total_auction}
            </p>
            <p className="text-lg sm:text-xl">
              <FontAwesomeIcon icon={faCheck} />
            </p>
          </div>

          <div className="bg-green-200 p-3 sm:p-4 rounded shadow text-center aspect-[4/3] flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold">
              {t("total_successful_auctions")}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              {overViewData.total_successful_auctions}
            </p>
            <p className="text-lg sm:text-xl">
              <FontAwesomeIcon icon={faGavel} />
            </p>
          </div>

          <div className="bg-yellow-100 p-3 sm:p-4 rounded shadow text-center aspect-[4/3] flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold">
              {t("total_auction_in_progress")}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              {overViewData.total_auction_in_progress}
            </p>
            <p className="text-lg sm:text-xl">
              <FontAwesomeIcon icon={faGear} />
            </p>
          </div>

          <div className="bg-cyan-100 p-3 sm:p-4 rounded shadow text-center aspect-[4/3] flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold">
              {t("total_upcoming_auctions")}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              {overViewData.total_upcoming_auctions}
            </p>
            <p className="text-lg sm:text-xl">
              <FontAwesomeIcon icon={faClock} />
            </p>
          </div>

          <div className="bg-red-300 p-3 sm:p-4 rounded shadow text-center aspect-[4/3] flex flex-col justify-between">
            <p className="text-xs sm:text-sm font-semibold">
              {t("total_unsuccessful_auctions")}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              {overViewData.total_unsuccessful_auctions}
            </p>
            <p className="text-lg sm:text-xl">
              <FontAwesomeIcon icon={faXmark} />
            </p>
          </div>
        </div>

        {/* <!-- MANAGER USERS --> */}

        <div className="bg-gray-100 p-4 rounded shadow mb-6">
          <div className="flex justify-between mb-3 items-center max-sm:flex-col max-sm:gap-3">
            <p className="text-lg font-bold">{t("manager_user")}</p>
            <div className="flex-1 flex flex-col md:flex-row items-center md:space-y-0 md:space-x-4 w-full justify-end max-sm:gap-3">
              {/* <!-- Search Input --> */}
              <div className="w-[60%] max-sm:w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("email_or_username")}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setUserFilterInput((prev) => ({
                        ...prev,
                        search_text: e.target.value.trim(),
                      }))
                    }
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
              </div>
              {/* <!-- Category Select --> */}
              <div className="w-[25%] pb-6 max-sm:w-full">
                <label className="text-sm font-semibold block mb-1">
                  {t("sort_by")}
                </label>
                {/* Sort select */}
                <div className="">
                  <select
                    onChange={(e) => {
                      const selectedOption = e.target.selectedOptions[0];
                      setUserFilterInput((prev) => ({
                        ...prev,
                        sort_by: selectedOption.value,
                        sort_order: selectedOption.dataset.order,
                      }));
                    }}
                    className="border border-gray-400 rounded-lg px-3 py-2 w-full"
                  >
                    <option value="username" data-order="asc">
                      {t("sort_username_asc")}
                    </option>
                    <option value="username" data-order="desc">
                      {t("sort_username_desc")}
                    </option>
                    <option value="email" data-order="asc">
                      {t("sort_email_asc")}
                    </option>
                    <option value="email" data-order="desc">
                      {t("sort_email_desc")}
                    </option>
                    <option value="create_at" data-order="asc">
                      {t("sort_create_at_asc")}
                    </option>
                    <option value="create_at" data-order="desc">
                      {t("sort_create_at_desc")}
                    </option>
                  </select>
                </div>
              </div>

              {/* <!-- Search Button --> */}
              <button
                onClick={searchUser}
                className="inline-flex items-center gap-2 px-4 py-3 pr-5 rounded-lg font-bold text-white text-base
             border border-transparent
             shadow-[0_0.7em_1.5em_-0.5em_rgba(77,54,208,0.75)]
             transition-transform duration-300
             bg-gradient-to-r from-blue-500 to-indigo-500
             hover:border-gray-100 active:scale-95"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>{t("search_btn")}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded">
            <div className="text-center ">
              {isLoadingSearch && <div className="loader" />}
            </div>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">{t("name")}</th>
                  <th className="border px-2 py-1">{t("email")}</th>
                  <th className="border px-2 py-1">{t("created_at")}</th>
                  <th className="border px-2 py-1">{t("role")}</th>
                  <th className="border px-2 py-1">{t("status")}</th>
                  <th className="border px-2 py-1">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {userData?.map((user, idx) => (
                  <tr
                    key={user.id || idx}
                    className="odd:bg-white even:bg-gray-100 hover:bg-blue-400 hover:text-white transition"
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
                    <td className="border px-2 py-1">{user.email}</td>
                    <td className="border px-2 py-1">
                      {dayjs(user.created_at).format("MM/DD/YYYY HH:mm")}
                    </td>
                    <td className="border px-2 py-1">{user.role}</td>
                    <td className="border px-2 py-1">
                      <div className="flex justify-center">
                        {user.status ? (
                          <button
                            onClick={() => handleDeactiveUser(user)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-2 min-w-[70%] text-center rounded"
                          >
                            {t("active")}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeactiveUser(user)}
                            className="bg-red-500 text-white text-xs px-3 py-2 min-w-[70%] text-center rounded"
                          >
                            {t("disactive")}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border px-2 py-1 space-x-1 text-center max-sm:flex">
                      {currentEditing === idx ? (
                        <>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-teal-100 text-teal-600 text-xs font-semibold px-3 py-2 min-w-16 rounded-md border border-teal-200 hover:bg-teal-300 transition"
                          >
                            {t("save")}
                          </button>
                          <button
                            onClick={() => setCurrentEditing(null)}
                            className="bg-orange-100 text-orange-600 font-semibold text-xs px-3 py-2 rounded-md min-w-[60px] border border-orange-200 hover:bg-orange-300 transition"
                          >
                            {t("cancle")}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handelClickEdit(user, idx)}
                            className="bg-indigo-100 hover:bg-indigo-200 font-semibold text-indigo-700 text-xs px-3 py-2 rounded min-w-[60px] transition"
                          >
                            {t("edit")}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-md border border-red-200 hover:bg-red-300 transition"
                          >
                            {t("delete")}
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
        <Pagination
          totalPage={totalPageUser}
          currentPage={currentIndexPageUser}
          onPageChange={getPageUser}
          className={"flex mt-0 justify-end mb-4"}
        />

        {/* <!-- MANAGER AUCTIONS --> */}

        <div className="bg-gray-100  p-4 rounded shadow">
          {/* <div className="flex justify-between items-center mb-4 max-sm:justify-center">
          
        </div> */}

          <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:space-y-0 md:space-x-4 w-full">
            <div className="flex gap-10 w-full items-center max-sm:flex-col max-sm:gap-4 max-sm:mb-4">
              <h2 className="text-lg font-bold"> {t("manager_auctions")}</h2>
              <button
                onClick={() => setDisplayCreateForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded max-sm:w-full"
              >
                {t("create_auction_btn")}
              </button>
              {/* <!-- Search Input --> */}
              <div className="flex-1 max-sm:w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("enter_title")}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setAuctionFilterInput((prev) => ({
                        ...prev,
                        title: e.target.value.trim(),
                      }))
                    }
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
              </div>
              <div className="w-[25%] pb-6 max-sm:w-full">
                {/* Sort select */}
                <div className="col-span-1">
                  <label className="text-sm font-[700] mb-1 mr-2 block">
                    {t("sort_by")}
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedOption = e.target.selectedOptions[0];
                      setAuctionFilterInput((prev) => ({
                        ...prev,
                        sort_by: selectedOption.value,
                        sort_order: selectedOption.dataset.order,
                      }));
                    }}
                    className="border border-gray-400 rounded-lg px-3 py-2 w-full"
                  >
                    <option value="">{t("select_sort")}</option>
                    <option value="title" data-order="asc">
                      {t("sort_title_asc")}
                    </option>
                    <option value="title" data-order="desc">
                      {t("sort_title_desc")}
                    </option>
                    <option value="create_at" data-order="asc">
                      {t("sort_create_at_asc")}
                    </option>
                    <option value="create_at" data-order="desc">
                      {t("sort_create_at_desc")}
                    </option>
                    <option value="start_time" data-order="asc">
                      {t("sort_start_time_asc")}
                    </option>
                    <option value="start_time" data-order="desc">
                      {t("sort_start_time_desc")}
                    </option>
                    <option value="end_time" data-order="asc">
                      {t("sort_end_time_asc")}
                    </option>
                    <option value="end_time" data-order="desc">
                      {t("sort_end_time_desc")}
                    </option>
                  </select>
                </div>
              </div>
              <select
                onChange={(e) =>
                  setAuctionFilterInput((prev) => ({
                    ...prev,
                    status: e.target.value === "" ? null : e.target.value,
                  }))
                }
                className="border border-gray-400 rounded-lg px-3 py-2 max-sm:w-full"
              >
                <option value="">{t("select_status")}</option>
                <option value="0">{t("ongoing_auctions")}</option>
                <option value="1">{t("upcoming_auctions")}</option>
                <option value="2">{t("ended_auctions")}</option>
              </select>
              {/* <!-- Search Button --> */}
              <div className="">
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center gap-2 px-4 py-3 pr-5 rounded-lg font-bold text-white text-base
             border border-transparent
             shadow-[0_0.7em_1.5em_-0.5em_rgba(77,54,208,0.75)]
             transition-transform duration-300
             bg-gradient-to-r from-blue-500 to-indigo-500
             hover:border-gray-100 active:scale-95"
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <span> {t("search_btn")}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto border border-gray-300 rounded">
            <div className="text-center ">
              {isLoadingSearch && <div className="loader" />}
            </div>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">{t("title")}</th>
                  <th className="border px-2 py-1">{t("start_time")}</th>
                  <th className="border px-2 py-1">{t("end_time")}</th>
                  <th className="border px-2 py-1">{t("starting_price")}</th>
                  <th className="border px-2 py-1">{t("highest_price")}</th>
                  <th className="border px-2 py-1">{t("status")}</th>
                  <th className="border px-2 py-1">#</th>
                </tr>
              </thead>
              <tbody>
                {auctionData?.map((auction, idx) => {
                  let statusText = "Ended";
                  if (auction.status === 0) statusText = "Ongoing";
                  else if (auction.status === 1) statusText = "Upcoming";

                  return (
                    <tr
                      key={auction.id || idx}
                      className="odd:bg-white even:bg-gray-100 hover:bg-blue-400 hover:text-white transition"
                    >
                      <td className="border px-2 py-1 max-w-96 text-center break-words">
                        {idx + 1}
                      </td>
                      <td className="border px-2 py-1 max-w-96 break-words">
                        {auction.title}
                      </td>
                      <td className="border px-2 py-1 max-w-96 break-words">
                        {dayjs(auction.start_time).format("MM/DD/YYYY HH:mm")}
                      </td>
                      <td className="border px-2 py-1 max-w-96 break-words">
                        {dayjs(auction.end_time).format("MM/DD/YYYY HH:mm")}
                      </td>
                      <td className="border px-2 py-1 max-w-96 break-words">
                        {auction.starting_price}
                      </td>
                      <td className="border px-2 py-1 max-w-96 break-words">
                        {auction.highest_amount || "null"}
                      </td>
                      <td className="border px-2 py-1 max-w-96 break-words">
                        {statusText}
                      </td>
                      <td
                        onClick={() => openDetailBid(auction.id)}
                        className="border px-2 py-1 max-w-96 text-blue-500 underline cursor-pointer break-words"
                      >
                        {t("view")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          totalPage={totalPageAuction}
          currentPage={currentIndexPageAuction}
          onPageChange={getPageAuction}
          className="flex mt-4 justify-end"
        />
      </AnimatedContent>
    </>
  );
};

export default OverViewAdmin;
