"use client";

import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { Sun, Moon, CloudSun, Coffee, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import FlipClock from "./FlipClock";

export default function WelcomeBanner({ userName = "User", userImage }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = time.getHours();

  // Dynamic Greeting Logic
  let greeting = "Good Morning";
  let GreetingIcon = Sun;
  let iconClass = "text-yellow-500 dark:text-yellow-400";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
    GreetingIcon = Sun;
    iconClass = "text-yellow-500 dark:text-yellow-400";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
    GreetingIcon = CloudSun;
    iconClass = "text-orange-500 dark:text-orange-400";
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good Evening";
    GreetingIcon = Coffee;
    iconClass = "text-indigo-500 dark:text-indigo-400";
  } else {
    greeting = "Good Night";
    GreetingIcon = Moon;
    iconClass = "text-blue-500 dark:text-blue-400";
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-7 shadow-sm ">
      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6">
        {/* Left Side: Avatar & Text */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* User Avatar Section */}
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-800 shadow-2xl ring-4 ring-red-500/10">
              <AvatarImage
                src={userImage}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl font-black bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                {userName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="absolute -top-1 -right-1 w-8 h-8 bg-linear-to-r from-green-500 to-emerald-500 rounded-full border-4 border-white dark:border-zinc-800 shadow-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
            </div>

            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-linear-to-r from-purple-600 to-violet-600 text-white border-0 shadow-sm px-3 py-1">
                <Crown className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <div
              className={`flex items-center justify-center md:justify-start gap-2 ${iconClass} mb-1`}
            >
              <GreetingIcon className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Dashboard Overview
              </span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-slate-900 dark:text-white">
              <span suppressHydrationWarning>{greeting}</span>,{" "}
              <span className="text-2xl md:text-3xl lg:text-4xl font-logo text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 animate-text-gradient bg-size-[200%_auto]">
                {userName}
              </span>
            </h1>

            <div className="text-md lg:text-xl text-slate-600 dark:text-slate-400 h-6 font-medium">
              <TypeAnimation
                sequence={[
                  "Here's what's happening today.",
                  4000,
                  "Check your latest receipts.",
                  3000,
                  "Revenue overview is ready.",
                  3000,
                ]}
                wrapper="span"
                speed={70}
                repeat={Infinity}
                cursor={true}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Flip Clock Component */}
        <FlipClock />
      </div>
    </div>
  );
}
