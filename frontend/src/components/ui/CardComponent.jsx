import clsx from "clsx";

const auctionListFake = [
  {
    id: 1,
    title: "Vintage Watch",
    image_url: [
      "https://i.pinimg.com/236x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg",
    ],
    starting_price: 1000000,
    start_time: "2025-07-01T08:00:00Z",
    end_time: "2025-07-10T20:00:00Z",
    step_price: 50000,
    highest_amount: 1500000,
  },
  {
    id: 2,
    title: "Antique Vase",
    image_url: [
      "https://i.pinimg.com/236x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg",
    ],
    starting_price: 2000000,
    start_time: "2025-07-05T10:00:00Z",
    end_time: "2025-07-12T18:00:00Z",
    step_price: 100000,
    highest_amount: 2500000,
  },
  {
    id: 3,
    title: "Classic Painting",
    image_url: [
      "https://i.pinimg.com/236x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg",
    ],
    starting_price: 5000000,
    start_time: "2025-07-02T09:30:00Z",
    end_time: "2025-07-15T21:00:00Z",
    step_price: 250000,
    highest_amount: null,
  },
  {
    id: 4,
    title: "Rare Book Collection",
    image_url: [
      "https://i.pinimg.com/236x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg",
    ],
    starting_price: 300000,
    start_time: "2025-07-03T14:00:00Z",
    end_time: "2025-07-13T19:00:00Z",
    step_price: 20000,
    highest_amount: 420000,
  },
  {
    id: 5,
    title: "Luxury Handbag",
    image_url: [
      "https://i.pinimg.com/236x/68/8a/1f/688a1f972abe2aaa9b112a6064f455c2.jpg",
    ],
    starting_price: 2500000,
    start_time: "2025-07-04T11:00:00Z",
    end_time: "2025-07-14T17:30:00Z",
    step_price: 100000,
    highest_amount: null,
  },
];

const RenderCardAuction = ({ arrAuction, numberCol }) => {
const gridClass = clsx(
  "grid gap-4",
  "grid-cols-1",           // Mobile mặc định: 1 cột
  "sm:grid-cols-2",        // Tablet nhỏ
  "md:grid-cols-3",        // Tablet ngang / laptop nhỏ
  "lg:grid-cols-4",        // Laptop
  numberCol && {
    [`xl:grid-cols-${numberCol}`]: numberCol >= 1 && numberCol <= 4
  }
);
  return (
    <div className={gridClass}>
      {auctionListFake.map((item) => (
        <div
          className="bg-white border border-[#7d8085] rounded-[12px] overflow-hidden transition-transform duration-300 ease-in-out shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col h-full"
          key={item.id}
          style={{ cursor: "pointer" }}
        >
          <div className="bg-gray-300 h-[200px] flex items-center justify-center relative">
            <img
              src={item.image_url[0] || imagedefault}
              alt={item.title || "Auction"}
              className={!item.image_url ? "img-no" : "w-full h-full object-cover"}
            />
          </div>
          <div className="bg-gray-100 p-3 text-sm leading-[1.5] flex-grow">
            <p className="flex justify-between">
              <span className="font-semibold text-gray-600">Name:</span> {item.title}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-gray-600">Starting price:</span>{" "}
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
              <span className="font-semibold text-gray-600">Price step:</span> {item.step_price}
            </p>
            {item.highest_amount !== null ? (
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600">Highest Price:</span>{" "}
                {item.highest_amount}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCardAuction;
