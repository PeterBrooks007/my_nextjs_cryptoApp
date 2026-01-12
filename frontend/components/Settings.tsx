import React from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col gap-3">
      <p>MODE</p>

      <ButtonGroup className="w-full">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="lg"
          className="flex-1"
          onClick={() => setTheme("light")}
        >
          <Sun /> Light
        </Button>
        <Button
          variant={theme === "system" ? "default" : "outline"}
          size="lg"
          className="flex-1"
          onClick={() => setTheme("system")}
        >
          <Laptop /> System
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="lg"
          className="flex-1"
          onClick={() => setTheme("dark")}
        >
          <Moon /> Dark
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Settings;
