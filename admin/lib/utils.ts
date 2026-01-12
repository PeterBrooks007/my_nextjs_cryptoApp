import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Measure phone performance to know if high end phone or not
export const measurePerformance = () => {
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    Math.sqrt(i);
  }
  const end = performance.now();
  return end - start;
};

//Shorten text
export const shortenText = (text: string, n: number) => {
  if (text.length > n) {
    const shoretenedText = text.substring(0, n).trim().concat("...");
    return shoretenedText;
  }
  return text;
};

//Validate Email
export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Get time ago from a given date
export const timeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const inputDate = new Date(date);
  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
