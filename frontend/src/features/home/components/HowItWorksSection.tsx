export function HowItWorksSection() {
    return (
        <section className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center md:mb-12">
                    <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:mb-4">Cách Đặt Lịch</h2>
                    <p className="text-sm text-muted-foreground sm:text-base">Quy trình đơn giản trong 3 bước</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-3">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                            1
                        </div>
                        <h3 className="mb-2 text-lg font-semibold sm:text-xl">Chọn Phòng Khám</h3>
                        <p className="text-sm text-muted-foreground">Tìm và chọn phòng khám hoặc gói khám phù hợp</p>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                            2
                        </div>
                        <h3 className="mb-2 text-lg font-semibold sm:text-xl">Chọn Ngày Giờ</h3>
                        <p className="text-sm text-muted-foreground">Chọn thời gian khám phù hợp với lịch của bạn</p>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                            3
                        </div>
                        <h3 className="mb-2 text-lg font-semibold sm:text-xl">Xác Nhận</h3>
                        <p className="text-sm text-muted-foreground">Hoàn tất đặt lịch và nhận xác nhận qua email</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
