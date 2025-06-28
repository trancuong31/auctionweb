//  function renderCard = ({}) => (
//     <div
//       className="auction-card"
//       key={item.id}
//       onClick={() => handleClick(item.id)}
//       style={{ cursor: "pointer" }}
//     >
//       <div className="auction-image">
//         <img
//           src={`http://192.168.23.197:8000${item.image_url[0]}` || imagedefault}
//           alt={item.title || "Auction"}
//           className={!item.image_url ? "img-no" : ""}
//         />
//       </div>
//       <div className="auction-info">
//         <p>
//           <span className="label">Name:</span> {item.title}
//         </p>
//         <p>
//           <span className="label">Starting price:</span> {item.starting_price}
//         </p>
//         <p>
//           <span className="label">Start time:</span>{" "}
//           {new Date(item.start_time).toLocaleString()}
//         </p>
//         <p>
//           <span className="label">End time:</span>{" "}
//           {new Date(item.end_time).toLocaleString()}
//         </p>
//         <p>
//           <span className="label">Price step:</span> {item.step_price}
//         </p>
//         {item.highest_amount !== null ? (
//           <p>
//             <span className="label">Highest Price:</span> {item.highest_amount}
//           </p>
//         ) : type === "ended" ? (
//           <p>
//             <span className="label">Highest Price:</span> Đấu giá thất bại
//           </p>
//         ) : null}
//       </div>
//     </div>
//   );
