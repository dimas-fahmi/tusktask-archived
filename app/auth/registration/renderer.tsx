import { UseOnboardingStore } from "@/src/lib/stores/page/onboardingStore";
import { RegistrationPhase } from "@/src/lib/types/supabase";
import React from "react";
import NamePhase from "./phases/NamePhase";
import UsernamePhase from "./phases/UsernamePhase";
import AvatarPhase from "./phases/AvatarPhase";
import ConfirmationPhase from "./phases/ConfirmationPhase";

export function renderer(
  setter: UseOnboardingStore["setter"],
  phase?: RegistrationPhase
) {
  switch (phase) {
    case "name":
      setter({
        title: "Let's Get Your Profile Set Up Quickly",
        subtitle:
          "This won't take long; first, we need to find out what name would you like people to call you?",
        render: <NamePhase />,
      });
      break;
    case "username":
      setter({
        title: "Next Step Is Unique Username",
        subtitle:
          "Unique username is how people will find you. You can even use it to sign in later.",
        render: <UsernamePhase />,
      });
      break;
    case "avatar":
      setter({
        title: "Last One: Avatar",
        subtitle:
          "Put a face to the name! Upload a photo so people can recognize you.",
        render: <AvatarPhase />,
      });

      break;
    case "confirmation":
      setter({
        title: "You're All Set!",
        subtitle:
          "Glad to have you aboard, you can change any of this on profile settings later on.",
        render: <ConfirmationPhase />,
      });
      break;
    default:
      break;
  }
}
