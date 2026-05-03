// Site configuration
export const siteConfig = {
    name: "HealthCare",
    description: "Đặt lịch khám tại các phòng khám uy tín nhanh chóng và tiện lợi",
    url: "https://healthcare.vn",
    ogImage: "/og-image.png",
    links: {
        facebook: "https://facebook.com/healthcare",
        twitter: "https://twitter.com/healthcare",
        github: "https://github.com/healthcare",
    },
    creator: {
        name: "HealthCare Team",
        url: "https://healthcare.vn",
    },
} as const

// Navigation configuration
export const navConfig = {
    mainNav: [
        {
            title: "Phòng Khám",
            href: "/clinics",
        },
        {
            title: "Gói Khám Sức Khỏe",
            href: "/#packages",
        },
        {
            title: "Về Chúng Tôi",
            href: "/about",
        },
        {
            title: "Cẩm Nang Sức Khỏe",
            href: "/health-guide",
        },
    ],
    sidebarNav: [
        {
            title: "Dashboard",
            href: "/admin",
            icon: "dashboard",
        },
        {
            title: "Clinics",
            href: "/admin/clinic",
            icon: "clinic",
        },
        {
            title: "Website",
            href: "/admin/website",
            icon: "website",
        },
    ],
} as const
