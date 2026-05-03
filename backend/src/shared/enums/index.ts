export enum Role {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum PackageCategory {
    BASIC = 'basic',
    COMPREHENSIVE = 'comprehensive',
    PREMIUM = 'premium',
}

export enum NotificationType {
    BOOKING = 'booking',
    REMINDER = 'reminder',
    PROMOTION = 'promotion',
    SYSTEM = 'system',
}

export enum CategoryType {
    ARTICLE = 'article',
    SERVICE = 'service',
}
