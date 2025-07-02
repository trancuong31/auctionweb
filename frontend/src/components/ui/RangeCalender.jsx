import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import "flatpickr/dist/flatpickr.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

function RangeCalender({ onChange, value }) {
  const calendarRef = useRef(null);
  const handleFocus = () => {
    calendarRef.current?.focus();
  };

  useEffect(() => {
    const fp = flatpickr(calendarRef.current, {
      mode: "range",
      minDate: "today",
      dateFormat: "d-m-Y",
      defaultDate: value || [],
      onChange: (selectedDates) => {
        onChange?.(selectedDates);
      },
    });

    return () => fp.destroy();
  }, []);

  return (
    <div className="flex items-center border rounded h-10 overflow-hidden">
      <div
        onClick={handleFocus}
        className="bg-blue-400 h-full flex items-center px-3"
      >
        <FontAwesomeIcon
          icon={faCalendar}
          className="text-white cursor-pointer"
        />
      </div>
      <input
        ref={calendarRef}
        placeholder="Select a time range"
        className="p-2 w-full h-full focus:outline-none"
      />
    </div>
  );
}

export default RangeCalender;
