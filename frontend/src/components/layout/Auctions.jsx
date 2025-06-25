// Auctions.jsx
import React from "react"
import "./Auctions.css"
import imagedefault from '../../assets/images/imagedefault.png';

export const Auctions = () => {
  // Helper để render mỗi card
  const renderCard = (item) => (
    <div className="auction-card">
      <div className="auction-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <img className="img-no" src={imagedefault} alt="No Image" />
        )}
      </div>
      <div className="auction-info">
        <p>
          <span className="label">Name:</span> {item.name}
        </p>
        <p>
          <span className="label">Starting price:</span> {item.startingPrice}
        </p>
        <p>
          <span className="label">Start time:</span> {item.startTime}
        </p>
        <p>
          <span className="label">End time:</span> {item.endTime}
        </p>
        <p>
          <span className="label">Price step:</span> {item.priceStep}
        </p>
        {item.highestPrice && (
          <p className={`status ${item.status === "success" ? "success" : "fail"}`}>
            <span className="label">Highest price:</span> {item.highestPrice}
            <span className="status-text">
              {item.status === "success" ? "Successful" : "Unsuccessful"}
            </span>
          </p>
        )}
      </div>
    </div>
  )

  //có thể fetch từ API
  const data = {
    ongoing: Array(4).fill({
      name: "xxxx",
      startingPrice: "xxxx",
      startTime: "xxxx",
      endTime: "xxxx",
      priceStep: "xxxx",
    }),
    upcoming: Array(4).fill({
      name: "xxxx",
      startingPrice: "xxxx",
      startTime: "xxxx",
      endTime: "xxxx",
      priceStep: "xxxx",
    }),
    ended: Array(4).fill({
      name: "xxxx",
      startingPrice: "xxxx",
      startTime: "xxxx",
      endTime: "xxxx",
      priceStep: "xxxx",
      highestPrice: "xxxx",
      status: "fail",
    }),
  }

  // Helper để render từng section
  const renderSection = (title, items) => (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <div className="card-grid">
        {items.map((it, idx) => (
          <React.Fragment key={idx}>{renderCard(it)}</React.Fragment>
        ))}
      </div>
      <a href="#" className="see-all">
        See all
      </a>
    </div>
  )

  return (
    <div id="webcrumbs">
      <div className="wrapper">
        {renderSection("Ongoing auction", data.ongoing)}
        {renderSection("Upcoming auction", data.upcoming)}
        {renderSection("The auction has ended", data.ended)}
      </div>
    </div>
  )
}
export default Auctions
