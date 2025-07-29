# Auction Web - Docker Setup

Hướng dẫn setup và chạy ứng dụng Auction Web bằng Docker.

## Cấu trúc dự án

```
auctionweb/
├── backend/          # FastAPI Backend
├── frontend/         # React Frontend
├── docker-compose.yml
└── README-Docker.md
```

## Yêu cầu hệ thống

- Docker Engine 20.10+
- Docker Compose 2.0+
- ít nhất 2GB RAM

## Cách sử dụng

### 1. Build và chạy toàn bộ ứng dụng

```bash
# Build và chạy tất cả services
docker-compose up --build

# Chạy ở background
docker-compose up -d --build
```

### 2. Chạy từng service riêng lẻ

```bash
# Chỉ chạy backend
docker-compose up backend

# Chỉ chạy frontend
docker-compose up frontend
```

### 3. Dừng ứng dụng

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

### 4. Xem logs

```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của backend
docker-compose logs backend

# Xem logs của frontend
docker-compose logs frontend

# Follow logs real-time
docker-compose logs -f
```

### 5. Rebuild sau khi thay đổi code

```bash
# Rebuild và restart
docker-compose up --build

# Hoặc rebuild từng service
docker-compose build backend
docker-compose build frontend
```

## Truy cập ứng dụng

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs

## Cấu hình

### Environment Variables

Backend environment variables có thể được cấu hình trong `docker-compose.yml`:

```yaml
environment:
  - DATABASE_URL=your_database_url
  - SECRET_KEY=your_secret_key
  - DEBUG=True
```

### Volumes

- `./backend/uploads:/app/uploads`: Lưu trữ file uploads từ backend
- Database files được lưu trong container (có thể thay đổi bằng cách mount volume)

### Networks

Các services giao tiếp với nhau thông qua network `appnet`.

## Troubleshooting

### 1. Port đã được sử dụng

Nếu port 8000 hoặc 8080 đã được sử dụng, thay đổi trong `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Thay đổi 8000 thành 8001
```

### 2. Permission issues với uploads

```bash
# Tạo thư mục uploads với quyền đúng
mkdir -p backend/uploads
chmod 755 backend/uploads
```

### 3. Rebuild sau khi thay đổi dependencies

```bash
# Xóa images cũ
docker-compose down
docker system prune -f

# Rebuild
docker-compose up --build
```

### 4. Health check failed

Kiểm tra logs để xem lỗi:

```bash
docker-compose logs backend
docker-compose logs frontend
```

## Development

### Hot reload cho development

Để có hot reload trong development, sử dụng:

```bash
# Backend với reload
docker-compose up backend

# Frontend development server
cd frontend
npm run dev
```

### Debug mode

Thêm environment variable `DEBUG=True` trong `docker-compose.yml`:

```yaml
environment:
  - DEBUG=True
```

## Production

### 1. Build production images

```bash
docker-compose -f docker-compose.yml build
```

### 2. Chạy production

```bash
docker-compose -f docker-compose.yml up -d
```

### 3. Monitoring

```bash
# Kiểm tra status
docker-compose ps

# Xem resource usage
docker stats
```

## Cleanup

```bash
# Dừng và xóa containers
docker-compose down

# Xóa images
docker-compose down --rmi all

# Xóa volumes
docker-compose down -v

# Xóa tất cả (containers, images, volumes, networks)
docker system prune -a --volumes
``` 