# 🚀 Docker Quick Start - Auction Web

## ⚡ Chạy nhanh (Windows)

```powershell
# Chạy script PowerShell
.\docker-run.ps1 start
```

## ⚡ Chạy nhanh (Linux/Mac)

```bash
# Cấp quyền thực thi cho script
chmod +x docker-run.sh

# Chạy script
./docker-run.sh start
```

## 📋 Yêu cầu

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose
- ít nhất 2GB RAM

## 🔧 Các lệnh cơ bản

### Windows PowerShell
```powershell
.\docker-run.ps1 start      # Khởi động
.\docker-run.ps1 stop       # Dừng
.\docker-run.ps1 logs       # Xem logs
.\docker-run.ps1 status     # Kiểm tra trạng thái
.\docker-run.ps1 rebuild    # Rebuild
```

### Linux/Mac Bash
```bash
./docker-run.sh start       # Khởi động
./docker-run.sh stop        # Dừng
./docker-run.sh logs        # Xem logs
./docker-run.sh status      # Kiểm tra trạng thái
./docker-run.sh rebuild     # Rebuild
```

### Docker Compose trực tiếp
```bash
docker-compose up -d --build    # Khởi động
docker-compose down             # Dừng
docker-compose logs             # Xem logs
docker-compose ps               # Kiểm tra trạng thái
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔍 Troubleshooting

### Port đã được sử dụng
Thay đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "8081:80"  # Thay đổi 8080 thành 8081
```

### Lỗi permission
```bash
# Linux/Mac
chmod 755 backend/uploads

# Windows
# Đảm bảo thư mục backend/uploads có quyền ghi
```

### Rebuild sau khi thay đổi code
```bash
docker-compose down
docker-compose up --build
```

## 📁 Cấu trúc file

```
auctionweb/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── env.example
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
├── docker-run.sh          # Linux/Mac
├── docker-run.ps1         # Windows
└── README-Docker.md       # Hướng dẫn chi tiết
```

## 🆘 Hỗ trợ

- Xem logs: `docker-compose logs`
- Kiểm tra status: `docker-compose ps`
- Xem resource usage: `docker stats`
- Cleanup: `docker-compose down --rmi all --volumes` 