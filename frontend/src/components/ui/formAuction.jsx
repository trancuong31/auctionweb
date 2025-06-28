import React, { useState } from "react";
import { create } from "../../services/api";

function ModalAuction({ canOpen, onClose, email, username, auctionId }) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  if (!canOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      auction_id: auctionId,
      address: address,
      bid_amount: Number(amount),
      note: note,
    };

    create("bids", data, true)
      .then((response) => {
        alert("Đã gửi đấu giá thành công!");
      })
      .catch((error) => {
        console.error(error);
        alert(error.response.data.detail);
      });
    onClose();
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md bg-gray-300 p-6 rounded-lg shadow-md">
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-black font-bold text-lg"
      >
        ×
      </button>

      <label className="block mb-2 font-semibold">
        <span className="inline-flex items-center gap-1">
          <i className="fas fa-user"></i> User Name
          <span className="text-red-500">*</span>
        </span>
        <input
          type="text"
          className="w-full mt-1 p-2 border rounded-md shadow-sm"
          value={username}
          disabled
        />
      </label>

      <label className="block mb-2 font-semibold">
        <span className="inline-flex items-center gap-1">
          <i className="fas fa-envelope"></i> Supplier_Email
          <span className="text-red-500">*</span>
        </span>
        <input
          type="email"
          className="w-full mt-1 p-2 border rounded-md shadow-sm"
          value={email}
          disabled
        />
      </label>

      <label className="block mb-2 font-semibold">
        <span className="inline-flex items-center gap-1">
          <i className="fas fa-map-marker-alt"></i> Address
          <span className="text-red-500">*</span>
        </span>
        <input
          type="text"
          className="w-full mt-1 p-2 border rounded-md shadow-sm"
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>

      <label className="block mb-2 font-semibold">
        <span className="inline-flex items-center gap-1">
          <i className="fas fa-dollar-sign"></i> Bid_Amount($)
          <span className="text-red-500">*</span>
        </span>
        <input
          type="number"
          className="w-full mt-1 p-2 border rounded-md shadow-sm"
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label className="block mb-4 font-semibold">
        <span className="inline-flex items-center gap-1">
          <i className="fas fa-calendar-alt"></i> Note
        </span>
        <textarea
          onChange={(e) => setNote(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md shadow-sm h-32 resize-none"
        ></textarea>
      </label>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ModalAuction;
