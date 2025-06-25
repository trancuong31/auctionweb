import enum

class UserRole(enum.Enum):
    USER = 1
    ADMIN = 2

class OrderStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled" 