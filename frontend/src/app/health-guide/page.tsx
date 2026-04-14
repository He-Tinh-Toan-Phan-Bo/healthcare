import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HealthGuidePage() {
  const articles = [
    {
      id: 1,
      title: "10 Thói Quen Tốt Cho Sức Khỏe Tim Mạch",
      category: "Tim mạch",
      excerpt: "Khám phá các thói quen đơn giản giúp bảo vệ tim mạch và cải thiện sức khỏe tổng thể của bạn.",
      readTime: "5 phút đọc",
      date: "25/12/2025",
    },
    {
      id: 2,
      title: "Hướng Dẫn Chăm Sóc Răng Miệng Đúng Cách",
      category: "Nha khoa",
      excerpt: "Tìm hiểu cách vệ sinh răng miệng đúng cách và phòng ngừa các bệnh lý về răng.",
      readTime: "4 phút đọc",
      date: "23/12/2025",
    },
    {
      id: 3,
      title: "Vai Trò Của Xét Nghiệm Sức Khỏe Định Kỳ",
      category: "Sức khỏe tổng quát",
      excerpt: "Tầm quan trọng của việc kiểm tra sức khỏe định kỳ trong phòng ngừa bệnh tật.",
      readTime: "6 phút đọc",
      date: "20/12/2025",
    },
    {
      id: 4,
      title: "Dinh Dưỡng Cân Bằng Cho Người Bận Rộn",
      category: "Dinh dưỡng",
      excerpt: "Mẹo và lời khuyên để duy trì chế độ ăn uống lành mạnh ngay cả khi bạn bận rộn.",
      readTime: "7 phút đọc",
      date: "18/12/2025",
    },
    {
      id: 5,
      title: "Tầm Quan Trọng Của Giấc Ngủ Đối Với Sức Khỏe",
      category: "Sức khỏe tổng quát",
      excerpt: "Giấc ngủ chất lượng ảnh hưởng như thế nào đến sức khỏe thể chất và tinh thần.",
      readTime: "5 phút đọc",
      date: "15/12/2025",
    },
    {
      id: 6,
      title: "Cách Phòng Ngừa Cảm Cúm Mùa Đông",
      category: "Phòng bệnh",
      excerpt: "Các biện pháp hiệu quả để phòng tránh cảm cúm và tăng cường hệ miễn dịch.",
      readTime: "4 phút đọc",
      date: "12/12/2025",
    },
  ]

  const categories = ["Tất cả", "Tim mạch", "Nha khoa", "Sức khỏe tổng quát", "Dinh dưỡng", "Phòng bệnh"]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Cẩm Nang Sức Khỏe</h1>
            <p className="text-muted-foreground">Kiến thức và lời khuyên hữu ích về chăm sóc sức khỏe</p>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                {category}
              </Badge>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/health-guide/${article.id}`}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={`/abstract-healthcare.png?height=200&width=400&query=healthcare ${article.category}`}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 w-fit">
                      {article.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
