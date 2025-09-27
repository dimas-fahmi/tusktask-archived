import React from "react";
import { Button } from "../../shadcn/components/ui/button";
import Google from "../SVG/Logos/Google";
import Github from "../SVG/Logos/Github";
import Discord from "../SVG/Logos/Discord";
import { useOAuth } from "@/src/lib/hooks/auth/useAuth";

const OAuthBar = () => {
  // Use OAuth
  const { mutate: signIn } = useOAuth();

  return (
    <div className="grid grid-cols-3 mt-6 gap-3">
      <Button
        variant={"outline"}
        onClick={() => {
          signIn({ provider: "google" });
        }}
      >
        <Google />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          signIn({ provider: "github" });
        }}
      >
        <Github />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          signIn({ provider: "discord" });
        }}
      >
        <Discord />
      </Button>
    </div>
  );
};

export default OAuthBar;
