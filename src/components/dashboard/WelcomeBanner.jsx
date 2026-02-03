"use client";

import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { Sun, Moon, CloudSun, Coffee } from "lucide-react";
import FlipClock from "./FlipClock";

export default function WelcomeBanner({ userName = "User" }) {
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
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Text */}
        <div className="space-y-2 text-center md:text-left">
          <div
            className={`flex items-center justify-center md:justify-start gap-2 ${iconClass} mb-1`}
          >
            <GreetingIcon className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">
              Overview
            </span>
          </div>

          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-slate-900 dark:text-white">
            <span suppressHydrationWarning>{greeting}</span>,{" "}
            <span className="text-2xl md:text-3xl lg:text-4xl animate-text-gradient bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent bg-size-[200%_auto] font-logo">
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

        {/* Middle: Flip Clock Component */}
        <FlipClock />
      </div>
    </div>
  );
}
