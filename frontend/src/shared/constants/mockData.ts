import type { Clinic, HealthPackage, Service } from "@/shared/types"

// Mock data - sẽ thay thế bằng API calls sau này
export const MOCK_SERVICES: Service[] = [
    {
        id: "1",
        name: "Khám Tổng Quát",
        description: "Tầm soát sức khỏe thiết yếu cho sức khỏe tổng quát",
        icon: "Stethoscope",
        category: "general",
    },
    {
        id: "2",
        name: "Khám Chuyên Khoa",
        description: "Dịch vụ chuyên khoa với bác sĩ giàu kinh nghiệm",
        icon: "Heart",
        category: "specialty",
    },
    {
        id: "3",
        name: "Xét Nghiệm",
        description: "Xét nghiệm chính xác với công nghệ hiện đại",
        icon: "TestTube",
        category: "laboratory",
    },
    {
        id: "4",
        name: "Tiêm Chủng",
        description: "Dịch vụ tiêm chủng an toàn và hiệu quả",
        icon: "Syringe",
        category: "vaccination",
    },
]

export const MOCK_PACKAGES: HealthPackage[] = [
    {
        id: "1",
        name: "Gói Khám Sức Khỏe Cơ Bản",
        description: "Tầm soát sức khỏe thiết yếu cho sức khỏe tổng quát",
        price: 2000000,
        currency: "VND",
        category: "basic",
        features: [
            "Xét nghiệm máu tổng quát",
            "Đo huyết áp",
            "Khám tổng quát",
            "Xét nghiệm chuyển hóa cơ bản",
        ],
    },
    {
        id: "2",
        name: "Gói Khám Sức Khỏe Toàn Diện",
        description: "Đánh giá sức khỏe toàn diện với các xét nghiệm chi tiết",
        price: 5000000,
        currency: "VND",
        category: "comprehensive",
        isPopular: true,
        features: [
            "Tất cả xét nghiệm gói cơ bản",
            "Chức năng gan và thận",
            "Hồ sơ lipid",
            "Điện tâm đồ (ECG)",
            "Chụp X-quang ngực",
            "Sàng lọc tiểu đường",
        ],
    },
    {
        id: "3",
        name: "Gói Khám Sức Khỏe Cao Cấp",
        description: "Gói khám sức khỏe cao cấp với chẩn đoán tiên tiến",
        price: 12000000,
        currency: "VND",
        category: "premium",
        features: [
            "Tất cả xét nghiệm gói toàn diện",
            "Dấu ấn ung thư",
            "Đánh giá nguy cơ tim mạch",
            "Siêu âm bụng",
            "X-quang ngực",
            "Tư vấn dinh dưỡng",
        ],
    },
]

export const MOCK_CLINICS: Clinic[] = [
    {
        id: "1",
        name: "Phòng Khám Đa Khoa An Khang",
        description: "Phòng khám chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
        phone: "028-1234-5678",
        email: "contact@ankhang.vn",
        rating: 4.8,
        reviewCount: 256,
        image: "/modern-medical-clinic.png",
        isOpen: true,
        openingHours: "T2-T7: 8:00 - 20:00",
        specialties: ["Nội khoa", "Ngoại khoa", "Nhi khoa"],
    },
    {
        id: "2",
        name: "Nha Khoa Thành Phố",
        description: "Chuyên khoa nha khoa với trang thiết bị hiện đại",
        address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
        phone: "028-2345-6789",
        email: "contact@nhakhoatp.vn",
        rating: 4.6,
        reviewCount: 189,
        image: "/healthcare-clinic-reception-area.jpg",
        isOpen: true,
        openingHours: "T2-CN: 8:00 - 21:00",
        specialties: ["Nha khoa tổng quát", "Implant", "Niềng răng"],
    },
    {
        id: "3",
        name: "Phòng Khám Gia Đình",
        description: "Chăm sóc sức khỏe toàn diện cho cả gia đình",
        address: "789 Đường Võ Văn Tần, Quận 5, TP.HCM",
        phone: "028-3456-7890",
        email: "contact@giadinh.vn",
        rating: 4.9,
        reviewCount: 312,
        image: "/family-health-clinic.jpg",
        isOpen: false,
        openingHours: "T2-T6: 7:00 - 19:00",
        specialties: ["Y học gia đình", "Nhi khoa", "Sản phụ khoa"],
    },
]

