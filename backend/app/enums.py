import enum

class UserRole(enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class OrderStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled" 