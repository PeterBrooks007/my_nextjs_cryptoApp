import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import Image from "next/image";
import { useTotalCounts } from "@/hooks/useTotalCounts";
import { User } from "@/types";
import { shortenText } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

const CardList = ({ title }: { title: string }) => {
  const router = useRouter();
  const { recentUsers } = useTotalCounts();

  return (
    <div>
      <div className="flex justify-between items-start ">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <Link href={"/dashboard/users"}>
      <Button variant={"outline"} size={"sm"}>View All</Button>
      </Link>

      </div>
      <div className="flex flex-col gap-2">
        {recentUsers &&
          recentUsers.length > 0 &&
          recentUsers.map((user: User) => (
            <Card
              key={user._id}
              className="flex-row users-center justify-between  items-center gap-4 p-2 cursor-pointer"
              onClick={() => router.push(`/dashboard/users/${user._id}`)}
            >
              <div className="w-12 h-12 rounded-sm relative overflow-hidden shrink-0">
                <Image
                  src={user.photo}
                  alt={user.firstname}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex-1 text-sm sm:text-xl  p-0">
                <CardTitle>
                  {user?.firstname} {user?.lastname}
                </CardTitle>
                <p className="hidden sm:text-base sm:inline-flex text-start">
                  {shortenText(user?.email, 40)}
                </p>
                <p className=" sm:hidden text-start">
                  {shortenText(user?.email, 25)}
                </p>
              </CardContent>
              <CardFooter className="p-0 shrink-0">
                <Avatar className="h-6 w-6 ">
                  <AvatarImage
                    src={`https://flagcdn.com/w80/${user?.address?.countryFlag}.png`}
                    alt={`country flag`}
                  />
                  <AvatarFallback>
                    <Globe className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default CardList;
