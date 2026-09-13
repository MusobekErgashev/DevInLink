import { Bell, Cog, Compass, Quote } from "lucide-react";

export const pages = [
    {
        id: 1,
        title: "Explore",
        path: "/explore",
        icon: <Compass size={24} />
    },
    {
        id: 2,
        title: "Quotes",
        path: "/quotes",
        icon: <Quote size={24} />
    },
    {
        id: 3,
        title: "Notification",
        path: "/notification",
        icon: <Bell size={24} />
    },
    {
        id: 4,
        title: "Settings",
        path: "/settings",
        icon: <Cog size={24} />
    },
]