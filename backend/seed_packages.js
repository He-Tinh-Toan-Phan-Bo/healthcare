const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockPackages = [
  {
      name: "Gói Khám Sức Khỏe Cơ Bản",
      description: "Tầm soát sức khỏe thiết yếu cho sức khỏe tổng quát",
      price: 2000000,
      currency: "VND",
      category: "basic",
      isPopular: false,
      features: [
          "Xét nghiệm máu tổng quát",
          "Đo huyết áp",
          "Khám tổng quát",
          "Xét nghiệm chuyển hóa cơ bản",
      ],
  },
  {
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
      name: "Gói Khám Sức Khỏe Cao Cấp",
      description: "Gói khám sức khỏe cao cấp với chẩn đoán tiên tiến",
      price: 12000000,
      currency: "VND",
      category: "premium",
      isPopular: false,
      features: [
          "Tất cả xét nghiệm gói toàn diện",
          "Dấu ấn ung thư",
          "Đánh giá nguy cơ tim mạch",
          "Siêu âm bụng",
          "X-quang ngực",
          "Tư vấn dinh dưỡng",
      ],
  }
];

async function main() {
    const existing = await prisma.healthPackage.count();
    if (existing === 0) {
        for (const pkg of mockPackages) {
            await prisma.healthPackage.create({ data: pkg });
        }
        console.log("Seeded Packages!");
    } else {
        console.log("Packages already seeded!");
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
