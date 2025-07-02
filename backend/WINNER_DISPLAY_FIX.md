# Sửa lỗi hiển thị người trúng thầu trong API Auctions

## Vấn đề ban đầu

Trước đây, khi `status = 2` (auction đã kết thúc), API chỉ hiển thị `highest_amount` (giá cao nhất) mà không kiểm tra xem ai thực sự là người trúng thầu được admin phê duyệt.

## Logic cũ (Sai)
```python
# Chỉ lấy giá cao nhất, không quan tâm ai trúng thầu
highest_bid = db.query(Bid).filter(
    Bid.auction_id == auction.id
).order_by(Bid.bid_amount.desc()).first()

data["highest_amount"] = float(highest_bid.bid_amount) if highest_bid else None
```

## Logic mới (Đúng)
```python
# 1. Ưu tiên lấy người trúng thầu (is_winner = true)
winner_bid = db.query(Bid).filter(
    Bid.auction_id == auction.id,
    Bid.is_winner == True
).first()

if winner_bid:
    # Hiển thị thông tin người trúng thầu
    winner_user = db.query(User).filter(User.id == winner_bid.user_id).first()
    data["winner_info"] = {
        "bid_id": winner_bid.id,
        "user_id": winner_bid.user_id,
        "user_name": winner_user.username,
        "bid_amount": float(winner_bid.bid_amount),
        "created_at": winner_bid.created_at
    }
    data["highest_amount"] = float(winner_bid.bid_amount)
else:
    # Nếu chưa có người trúng thầu, lấy giá cao nhất
    highest_bid = db.query(Bid).filter(
        Bid.auction_id == auction.id
    ).order_by(Bid.bid_amount.desc()).first()
    data["highest_amount"] = float(highest_bid.bid_amount) if highest_bid else None
```

## Các API đã được sửa

### 1. `GET /api/v1/auctions` (get_auctions_by_status)
- **Trước**: Chỉ hiển thị `highest_amount`
- **Sau**: Hiển thị `winner_info` + `highest_amount` của người trúng thầu

### 2. `GET /api/v1/auctions/search` (search_auctions)
- **Trước**: Chỉ hiển thị `highest_amount`
- **Sau**: Hiển thị `winner_info` + `highest_amount` của người trúng thầu

### 3. `GET /api/v1/auctions/{auction_id}` (get_auction_by_id)
- **Trước**: Đã có logic đúng
- **Sau**: Sửa lỗi `winner_user.name` → `winner_user.username`

## Response mới

Khi auction đã kết thúc và có người trúng thầu:

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
  "highest_amount": 1500000,  // Giá của người trúng thầu
  "winner_info": {            // Thông tin người trúng thầu
    "bid_id": "bid_id",
    "user_id": "user_id", 
    "user_name": "Tên người trúng thầu",
    "bid_amount": 1500000,
    "created_at": "2024-01-01T12:00:00"
  }
}
```

Khi auction đã kết thúc nhưng chưa có người trúng thầu:

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
  "highest_amount": 1500000,  // Giá cao nhất
  "winner_info": null         // Chưa có người trúng thầu
}
```

## Lợi ích của việc sửa

1. **Hiển thị đúng người trúng thầu**: Không còn nhầm lẫn giữa người đấu giá cao nhất và người trúng thầu
2. **Thông tin đầy đủ**: Hiển thị cả tên người trúng thầu và giá trúng thầu
3. **Tính nhất quán**: Tất cả API đều sử dụng logic giống nhau
4. **Hỗ trợ tính năng admin approval**: Phản ánh đúng kết quả của việc admin phê duyệt

## Lưu ý

- Logic này hoạt động tốt với tính năng admin phê duyệt người trúng thầu
- Khi admin chưa phê duyệt, sẽ hiển thị giá cao nhất
- Khi admin đã phê duyệt, sẽ hiển thị thông tin người trúng thầu
- Tự động phê duyệt sau 1 ngày cũng sẽ được hiển thị đúng 