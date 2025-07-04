import clsx from "clsx";
import imagedefault from "../../assets/images/imagedefault.png";
import CountdownTimer from "../../common/CountDownTime";
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
          No data available
        </p>
      ) : (
        arrAuction.map((item) => (
          <button
            className="bg-[#18181c] rounded-[10px] overflow-hidden transition-transform duration-300 ease-in-out shadow-[0_4px_16px_rgba(0,0,0,0.40)] flex flex-col h-full hover:shadow-[0_8px_32px_rgba(76,81,255,0.35)] group"
            key={item.id}
            style={{ cursor: "pointer" }}
            onClick={() => clickCard(item.id)}
          >
            <div className="bg-gray-300 h-[200px] flex items-center justify-center relative overflow-hidden">
              <CountdownTimer targetTime={item.end_time} />
              <img
                src={
                  item.image_url && item.image_url.length > 0
                    ? `${import.meta.env.VITE_BASE_URL}${item.image_url[0]}`
                    : imagedefault
                }
                alt={item.title || "Auction"}
                className={
                  (item.image_url && item.image_url.length > 0
                    ? "w-full h-full object-cover"
                    : "img-no") +
                  " transition-transform duration-300 ease-in-out group-hover:scale-105"
                }
              />
            </div>
            <div className="bg-gray-100 p-3 text-sm leading-[1.5] flex-grow">
              <p className="flex justify-between">
                <span className="break-all w-0 flex-1 min-w-0 text-left font-[600]">
                  {item.title}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-500">
                  Starting price:
                </span>{" "}
                {item.starting_price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-500">Start time:</span>{" "}
                <span className="font-[600]">
                  {new Date(item.start_time).toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-500">End time:</span>{" "}
                <span className="font-[600]">
                  {new Date(item.end_time).toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-500">Price step:</span>{" "}
                {item.step_price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              {item.status === 2 ? (
                item.highest_amount !== null && item.winner_info !== null ? (
                  <p className="flex justify-between">
                    <span className="font-semibold text-gray-500">
                      Highest Price:
                    </span>{" "}
                    <span className="text-red-500 font-bold">
                      {item.highest_amount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </p>
                ) : (
                  <p className="flex justify-end">
                    <span className="font-semibold text-red-500">Unsuccessful</span>
                  </p>
                )
              ) : null}
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default RenderCardAuction;
