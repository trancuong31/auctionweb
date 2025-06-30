import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import "flatpickr/dist/flatpickr.min.css";

function RangeCalender({ onChange, value }) {
  const calendarRef = useRef(null);

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
    <input
      ref={calendarRef}
      placeholder="Chọn khoảng thời gian"
      className="border w-full p-2"
    />
  );
}

export default RangeCalender;
