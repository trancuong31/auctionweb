import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const Pagination = ({ totalPage, onPageChange, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickPagination = (index) => {
    setCurrentIndex(index);
  };

  const handleClickPre = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleClickNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    onPageChange(currentIndex + 1);
  }, [currentIndex]);

  // Helper to render a page button
  const renderPageButton = (i) => (
    <button
      key={i}
      onClick={() => handleClickPagination(i)}
      className={clsx(
        "px-5 font-semibold",
        currentIndex === i
          ? "bg-[#2563eb] text-white"
          : "bg-[#bbb] hover:bg-[#2563eb] hover:text-white"
      )}
    >
      {i + 1}
    </button>
  );

  // Helper to render dots
  const renderDots = (key) => (
    <span key={key} className="px-5">
      ...
    </span>
  );

  // Helper to get pages to show
  const getPagesToShow = () => {
    const pagesToShow = new Set();
    if (totalPage <= 5) {
      for (let i = 0; i < totalPage; i++) pagesToShow.add(i);
    } else {
      pagesToShow.add(0);
      if (currentIndex > 2) pagesToShow.add("leftDots");

      for (
        let i = Math.max(0, currentIndex - 1);
        i <= Math.min(totalPage - 1, currentIndex + 1);
        i++
      ) {
        pagesToShow.add(i);
      }

      if (currentIndex < totalPage - 3) pagesToShow.add("rightDots");
      pagesToShow.add(totalPage - 1);
    }
    return pagesToShow;
  };

  const renderPages = () => {
    const items = [];

    // Hiển thị nút <<
    if (currentIndex > 0) {
      items.push(
        <button
          key="left"
          className="p-3 hover:bg-[#2563eb] group cursor-pointer"
          onClick={handleClickPre}
        >
          <FontAwesomeIcon
            icon={faAnglesLeft}
            className="group-hover:text-white"
          />
        </button>
      );
    }

    const pagesToShow = getPagesToShow();

    for (let i = 0; i < totalPage; i++) {
      if (pagesToShow.has(i)) {
        items.push(renderPageButton(i));
      } else if (pagesToShow.has("leftDots") && i === 1) {
        items.push(renderDots("dots-left"));
      } else if (
        pagesToShow.has("rightDots") &&
        i === currentIndex + 2 &&
        i < totalPage - 1
      ) {
        items.push(renderDots("dots-right"));
      }
    }

    // Hiển thị nút >>
    if (currentIndex < totalPage - 1) {
      items.push(
        <button
          key="right"
          className="p-3 hover:bg-[#2563eb] group cursor-pointer"
          onClick={handleClickNext}
        >
          <FontAwesomeIcon
            icon={faAnglesRight}
            className="group-hover:text-white"
          />
        </button>
      );
    }

    return items;
  };

  return (
    <div className={clsx("flex justify-center mt-10", className)}>
      {renderPages()}
    </div>
  );
};

export default Pagination;
