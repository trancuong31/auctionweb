# Tính năng Admin Phê duyệt Người trúng thầu

## Tổng quan
Tính năng này cho phép admin phê duyệt người trúng thầu thay vì tự động lấy người đấu giá cao nhất. Admin có thể chọn bất kỳ người đấu giá nào làm người trúng thầu bằng cách set trường `is_winner = 1` trong bảng `bids`.

**Quy tắc mới**: Sau khi auction kết thúc, admin có **1 ngày** để phê duyệt người trúng thầu. Nếu quá 1 ngày mà admin không phê duyệt, hệ thống sẽ tự động lấy người đấu giá cao nhất làm người trúng thầu.

## Các API Endpoint

### 1. Chạy tự động phê duyệt cho các auction quá hạn
```
POST /api/v1/admin/auto-approve-expired
```
**Mô tả**: Chạy thủ công để tự động phê duyệt người trúng thầu cho các auction đã quá hạn 1 ngày.

**Response**:
```json
{
  "message": "Auto-approved 3 auctions",
  "auto_approved_auctions": ["auction_id_1", "auction_id_2", "auction_id_3"]
}
```

### 2. Lấy danh sách auction cần phê duyệt (có thời hạn)
```
GET /api/v1/admin/auctions/pending-winner
```
**Mô tả**: Lấy danh sách các auction đã kết thúc và trạng thái có người trúng thầu hay chưa, bao gồm thông tin thời hạn phê duyệt.

**Response**:
```json
[
  {
    "id": "auction_id",
    "title": "Tên auction",
    "end_time": "2024-01-01T00:00:00",
    "total_bids": 5,
    "has_winner": false,
    "winner_name": null,
    "approval_deadline": "2024-01-02T00:00:00",
    "can_approve": true,
    "is_expired": false
  },
  {
    "id": "auction_id_2",
    "title": "Auction quá hạn",
    "end_time": "2024-01-01T00:00:00",
    "total_bids": 3,
    "has_winner": false,
    "winner_name": null,
    "approval_deadline": "2024-01-02T00:00:00",
    "can_approve": false,
    "is_expired": true
  }
]
```

**Trường mới**:
- `approval_deadline`: Thời hạn phê duyệt (1 ngày sau khi auction kết thúc)
- `can_approve`: Admin có thể phê duyệt hay không
- `is_expired`: Auction đã quá hạn phê duyệt hay chưa

### 3. Lấy danh sách bids của một auction
```
GET /api/v1/admin/auctions/{auction_id}/bids
```
**Mô tả**: Lấy danh sách tất cả bids của một auction để admin có thể chọn người trúng thầu.

**Response**:
```json
[
  {
    "id": "bid_id",
    "user_id": "user_id",
    "user_name": "Tên người dùng",
    "bid_amount": 1000000,
    "created_at": "2024-01-01T00:00:00",
    "note": "Ghi chú",
    "address": "Địa chỉ",
    "is_winner": false
  }
]
```

### 4. Set người trúng thầu (có kiểm tra thời hạn)
```
POST /api/v1/admin/auctions/{auction_id}/set-winner
```
**Body**:
```json
{
  "bid_id": "bid_id"
}
```

**Response**:
```json
{
  "message": "Winner set successfully",
  "winner_bid_id": "bid_id",
  "winner_user_id": "user_id",
  "winner_user_name": "Tên người trúng thầu",
  "winner_amount": 1000000,
  "approved_at": "2024-01-01T12:00:00"
}
```

**Lưu ý**: Nếu auction đã quá hạn phê duyệt (1 ngày), API sẽ trả về lỗi:
```json
{
  "detail": "Cannot approve this auction. Approval deadline was: 2024-01-02 00:00:00"
}
```

### 5. Xóa người trúng thầu (có kiểm tra thời hạn)
```
DELETE /api/v1/admin/auctions/{auction_id}/clear-winner
```
**Mô tả**: Reset về trạng thái không có người trúng thầu (chỉ khi chưa quá hạn).

**Response**:
```json
{
  "message": "Winner cleared successfully",
  "auction_id": "auction_id"
}
```

### 6. Xem thông tin auction với người trúng thầu
```
GET /api/v1/auctions/{auction_id}
```
**Response**:
```json
{
  "id": "auction_id",
  "title": "Tên auction",
  "description": "Mô tả",
  "starting_price": 100000,
  "step_price": 50000,
  "image_url": ["url1", "url2"],
  "file_exel": "file_url",
  "start_time": "2024-01-01T00:00:00",
  "end_time": "2024-01-02T00:00:00",
  "created_at": "2024-01-01T00:00:00",
  "status": 2,
  "highest_amount": 1500000,
  "winner_info": {
    "bid_id": "bid_id",
    "user_id": "user_id",
    "user_name": "Tên người trúng thầu",
    "bid_amount": 1000000,
    "created_at": "2024-01-01T12:00:00"
  }
}
```

## Quy trình sử dụng

### Quy trình tự động:
1. **Auction kết thúc**: Auction sẽ có trạng thái `ended` (status = 2)
2. **Thời gian chờ**: Admin có 1 ngày để phê duyệt người trúng thầu
3. **Tự động phê duyệt**: Nếu quá 1 ngày, hệ thống tự động lấy người đấu giá cao nhất
4. **Background task**: Hệ thống chạy kiểm tra mỗi giờ để tự động phê duyệt

### Quy trình thủ công:
1. **Admin xem danh sách cần phê duyệt**: Sử dụng endpoint `/admin/auctions/pending-winner`
2. **Admin xem chi tiết bids**: Chọn auction và xem danh sách bids bằng endpoint `/admin/auctions/{auction_id}/bids`
3. **Admin chọn người trúng thầu**: Sử dụng endpoint `/admin/auctions/{auction_id}/set-winner` với `bid_id` của người được chọn
4. **Xác nhận**: Người được chọn sẽ có `is_winner = true`, tất cả người khác sẽ có `is_winner = false`

## Lưu ý quan trọng

- **Thời hạn phê duyệt**: Admin chỉ có 1 ngày kể từ khi auction kết thúc để phê duyệt
- **Tự động phê duyệt**: Nếu quá hạn, hệ thống tự động lấy người đấu giá cao nhất
- **Background task**: Hệ thống tự động chạy mỗi giờ để kiểm tra và phê duyệt
- **Chỉ admin mới có quyền**: Truy cập các endpoint `/admin/*`
- **Mỗi auction chỉ có một người trúng thầu**
- **Khi set người trúng thầu mới, người trúng thầu cũ sẽ tự động bị hủy**

## Database Schema

### Bảng `auctions` - Trường mới:
- `admin_approved_at` (DateTime, nullable): Thời gian admin phê duyệt người trúng thầu

### Bảng `bids` - Trường hiện có:
- `is_winner` (Boolean): 
  - `is_winner = true`: Người trúng thầu
  - `is_winner = false`: Người không trúng thầu (mặc định)

## Logic xử lý

### Khi admin phê duyệt:
1. Kiểm tra auction chưa quá hạn phê duyệt
2. Set tất cả bids của auction đó về `is_winner = false`
3. Set bid được chọn thành `is_winner = true`
4. Lưu thời gian phê duyệt vào `admin_approved_at`

### Khi tự động phê duyệt:
1. Tìm các auction đã kết thúc hơn 1 ngày và chưa được phê duyệt
2. Lấy bid cao nhất của mỗi auction
3. Set bid cao nhất thành `is_winner = true`
4. Lưu thời gian auto-approve vào `admin_approved_at`

## Background Task

Hệ thống có background task chạy mỗi giờ để:
- Kiểm tra các auction quá hạn phê duyệt
- Tự động phê duyệt người đấu giá cao nhất
- Ghi log các hoạt động tự động

Task được khởi động tự động khi server start và chạy liên tục trong background. 