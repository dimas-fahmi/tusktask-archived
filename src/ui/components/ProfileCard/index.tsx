"use client";

import { Ellipsis } from "lucide-react";
import { useFetchUserProfile } from "@/src/lib/hooks/queries/useFetchUserProfile";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";

const ProfileCard = () => {
  // Profile
  const { data: profile } = useFetchUserProfile();

  return (
    <button
      type="button"
      className="flex text-left cursor-pointer group/button items-center gap-2"
    >
      {/* Content  */}
      {/* Avatar */}
      <Avatar className="w-14 h-14">
        {profile?.avatar && (
          <AvatarImage
            src={profile.avatar}
            alt={`${profile?.username}'s avatar`}
          />
        )}
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>

      {/* Information */}
      <div className="flex-1">
        <h1 className="font-bold font-header">{profile?.name}</h1>
        <p className="text-xs">{profile?.username}</p>
      </div>

      {/* Dropdown Icon */}
      <Ellipsis className="w-5 h-5 group-active/button:scale-95 transition-all duration-300" />
    </button>
  );
};

export default ProfileCard;
