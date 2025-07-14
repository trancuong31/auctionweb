import React from "react"

import "./AccountInfo.css"

export const AccountInfo = () => {
    return (
        <div id="webcrumbs">
            <div className="w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6 relative">
                    <h2 className="text-2xl font-bold text-white mb-2">Cập nhật tài khoản</h2>
                    <p className="text-primary-100 text-sm">Cập nhật thông tin cơ bản của bạn</p>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                        <span className="material-symbols-outlined text-white text-xl">close</span>
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-4xl">person</span>
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110">
                                <span className="material-symbols-outlined text-white text-sm">edit</span>
                            </button>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Họ và tên</label>
                                <input
                                    type="text"
                                    defaultValue="Nguyễn Văn An"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    defaultValue="nguyenvanan@email.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                    placeholder="Nhập email"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Số điện thoại</label>
                                <input
                                    type="tel"
                                    defaultValue="0123456789"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Ngày sinh</label>
                                <input
                                    type="date"
                                    defaultValue="1990-01-01"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Giới tính</label>
                            <div className="grid grid-cols-3 gap-3">
                                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">Nam</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">Nữ</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">Khác</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Địa chỉ</label>
                            <textarea
                                defaultValue="123 Nguyễn Văn Cừ, Quận 5, TP.HCM"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 resize-none"
                                rows="3"
                                placeholder="Nhập địa chỉ"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Giới thiệu</label>
                            <textarea
                                defaultValue="Tôi là một lập trình viên với kinh nghiệm 5 năm trong lĩnh vực phát triển web."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 resize-none"
                                rows="3"
                                placeholder="Giới thiệu về bản thân"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                            >
                                Hủy bỏ
                            </button>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-white border border-primary-500 text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                                >
                                    Xem trước
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Next: "Add password change section" */}
                {/* Next: "Add notification preferences" */}
                {/* Next: "Add two-factor authentication toggle" */}
            </div>
        </div>
    )
}
export default AccountInfo;