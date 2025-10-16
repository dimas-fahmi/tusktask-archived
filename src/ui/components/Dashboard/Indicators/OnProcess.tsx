import { LoaderPinwheel, type LucideProps } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";

export interface OnProcessClasses {
  container?: string;
  icon?: string;
}

export interface OnProcessProps extends Omit<LucideProps, "className"> {
  classes?: OnProcessClasses;
}

const OnProcess = ({ classes, ...props }: OnProcessProps) => {
  return (
    <div className={cn("flex items-center justify-center", classes?.container)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <LoaderPinwheel
            {...props}
            className={cn("animate-spin w-5 h-5", classes?.icon)}
          />
        </TooltipTrigger>
        <TooltipContent>You are working on this task</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default OnProcess;
