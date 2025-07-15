import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import "flatpickr/dist/flatpickr.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function RangeCalender({ onChange, value, allowMinDate }) {
  const calendarRef = useRef(null);
  const { t, i18n } = useTranslation();
  const handleFocus = () => {
    calendarRef.current?.focus();
  };

  useEffect(() => {
    const fp = flatpickr(calendarRef.current, {
      mode: "range",
      enableTime: true,
      time_24hr: true,
      minDate: allowMinDate ? null : "today",
      dateFormat: "d-m-Y H:i:S",
      defaultDate: value || [],
      onChange: (selectedDates) => {
        onChange?.(selectedDates);
      },
    });

    return () => fp.destroy();
  }, []);

  // Khi load trang, ưu tiên lấy ngôn ngữ từ sessionStorage nếu có
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <div className="flex items-center border rounded overflow-hidden">
      <div
        onClick={handleFocus}
        className="bg-blue-500 h-8 flex items-center px-3"
      >
        <FontAwesomeIcon
          icon={faCalendar}
          className="text-white cursor-pointer"
        />
      </div>
      <input
        ref={calendarRef}
        placeholder={t("select_time_range")}
        className="p-2 w-full h-full focus:outline-none"
      />
    </div>
  );
}

export default RangeCalender;
