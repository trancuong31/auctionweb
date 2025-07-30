FROM python:3.11-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các dependencies cần thiết cho hệ thống
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .

# Cài đặt Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

# Tạo thưư mục uploads
RUN mkdir -p uploads/excels uploads/images

# Thiết lập quyền cho thư mục uploads
RUN chmod -R 755 uploads/

EXPOSE 8000

# Thiết lập environment variables mặc định
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Chạy app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
