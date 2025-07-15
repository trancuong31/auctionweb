import { useState } from "react";
import { create } from "../../services/api";
import { toast } from "react-hot-toast";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, Form } from "react-hook-form";
import clsx from "clsx";

const schema = z.object({
  auction_id: z.any(),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(100, "Address cannot exceed 100 characters"),
  bid_amount: z
    .number()
    .positive("Value must be greater than 0")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toFixed(2)), {
      message: "Only allow up to 2 decimal places",
    }),
  note: z.string().trim().max(1000, "Notes must not exceed 1000 characters."),
});

function ModalAuction({ isOpen, onClose, email, username, auctionId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      auction_id: auctionId,
      address: "",
      bid_amount: 0,
      note: "",
    },
  });

  const submitAuctionForm = async (formData) => {
    setIsSubmitting(true);
    console.log(formData);
    create("bids", formData, true)
      .then((response) => {
        toast.success("Bid submitted successfully!");
      })
      .catch((error) => {
        console.error(error.response.data.detail);
        toast.error(`Bid submitted error by ${error.response.data.detail}!`, {
          style: {
            textAlign: "center",
          },
        });
      })
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black bg-opacity-50 flex items-center pt-[80px] max-sm:pt-[140px] justify-center p-2 z-50",
        isOpen ? "visible" : "invisible"
      )}
      onClick={onClose}
    >
      <div
        className={clsx(
          "bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg  transform transition-all duration-300 fade-slide-up",
          isOpen ? "fade-slide-up-visible" : "fade-slide-up-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white sm:p-1 rounded-t-2xl relative">
          <h2 className="text-lg sm:text-2xl font-bold text-center">
            Submit Your Bid
          </h2>
          <p className="text-blue-100 text-center text-sm sm:text-base">
            Enter your auction details below
          </p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 text-white hover:text-gray-200"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(submitAuctionForm)}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Username Field */}
          <div className="">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-not-allowed"
                value={username}
                disabled
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Supplier Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-not-allowed"
                value={email}
                disabled
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Address Field */}
          <div className="">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    type="text"
                    {...field}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your delivery address"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-[10px]">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Bid Amount Field */}
          <div className="">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Bid Amount (USD)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium text-sm sm:text-base">
                  $
                </span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                {...register("bid_amount", { valueAsNumber: true })}
              />

              {errors.bid_amount && (
                <p className="text-red-500 text-[10px]">
                  {errors.bid_amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Note Field */}
          <div className="">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Additional Notes
            </label>
            <Controller
              name="note"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <textarea
                    {...field}
                    className="w-full px-4 sm:px-2 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                    rows="3"
                    placeholder="Add any special requirements or comments..."
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 px-4 sm:px-3 text-sm sm:text-base rounded-md sm:rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm sm:text-base">Submitting...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Submit Bid</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAuction;
