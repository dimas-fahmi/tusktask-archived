import { useIconPickerStore } from "@/src/lib/stores/ui/iconPickerStore";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/src/ui/shadcn/components/ui/drawer";
import React from "react";
import IconPicker from "../../IconPicker";

const IconPickerDrawer = ({ onChange }: { onChange: (n: string) => void }) => {
  // Pull states from store
  const { iconPickerDrawerOpen, setIconPickerDrawerOpen } =
    useIconPickerStore();

  return (
    <Drawer open={iconPickerDrawerOpen} onOpenChange={setIconPickerDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-header text-2xl mb-2">
            Pick Icon
          </DrawerTitle>
          <DrawerDescription>{`Look up anything, whether it's code, burger, or even a cat. There are over 1.6k icons to choose from!`}</DrawerDescription>
        </DrawerHeader>

        <div className="max-w-2xl w-full mx-auto p-4">
          <IconPicker
            setIconName={(e) => {
              setIconPickerDrawerOpen(false);
              onChange(e);
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default IconPickerDrawer;
