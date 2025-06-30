import clsx from "clsx";

const RenderCardAuction = ({ arrAuction, numberCol, clickCard }) => {
  const gridClass = clsx(
    "grid gap-4",
    "grid-cols-1",
    "sm:grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4",
    numberCol && {
      [`xl:grid-cols-${numberCol}`]: numberCol >= 1 && numberCol <= 4,
    }
  );
  return (
    <div className={gridClass}>
      {!arrAuction || arrAuction.length === 0 ? (
        <p className="text-gray-600 col-span-full text-center">
          Không có dữ liệu
        </p>
      ) : (
        arrAuction.map((item) => (
          <button
            className="bg-white border border-[#7d8085] rounded-[12px] overflow-hidden transition-transform duration-300 ease-in-out shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col h-full"
            key={item.id}
            style={{ cursor: "pointer" }}
            onClick={() => clickCard}
          >
            <div className="bg-gray-300 h-[200px] flex items-center justify-center relative">
              <img
                src={
                  item.image_url && item.image_url.length > 0
                    ? `${import.meta.env.VITE_BASE_URL}${item.image_url[0]}`
                    : imagedefault
                }
                alt={item.title || "Auction"}
                className={
                  item.image_url && item.image_url.length > 0
                    ? "w-full h-full object-cover"
                    : "img-no"
                }
              />
            </div>
            <div className="bg-gray-100 p-3 text-sm leading-[1.5] flex-grow">
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600">Name:</span>{" "}
                {item.title}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600">
                  Starting price:
                </span>{" "}
                {item.starting_price}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600">Start time:</span>{" "}
                {new Date(item.start_time).toLocaleString()}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600">End time:</span>{" "}
                {new Date(item.end_time).toLocaleString()}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600">Price step:</span>{" "}
                {item.step_price}
              </p>
              {item.highest_amount !== null ? (
                <p className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Highest Price:
                  </span>{" "}
                  {item.highest_amount}
                </p>
              ) : null}
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default RenderCardAuction;
