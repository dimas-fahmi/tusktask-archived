import { APP_THEMES, APP_THEMES_ID } from "@/src/lib/configs";
import { useThemeStore } from "@/src/lib/stores/ui/themeStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ThemePickerDialog = () => {
  const {
    setThemePickerDialogOpen,
    themePickerDialogOpen,
    setActiveTheme,
    activeTheme,
  } = useThemeStore();

  const handleThemeSelect = (themeId: (typeof APP_THEMES_ID)[number]) => {
    setActiveTheme(APP_THEMES[themeId]);
  };

  return (
    <Dialog
      open={themePickerDialogOpen}
      onOpenChange={setThemePickerDialogOpen}
    >
      <DialogContent
        className={`${activeTheme.id} bg-background text-foreground max-w-4xl max-h-[85vh] overflow-y-scroll scrollbar-none`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Choose Your Theme
          </DialogTitle>
          <DialogDescription>
            Select a theme to personalize your TuskTask experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {APP_THEMES_ID.map((themeId, index) => {
            const theme = APP_THEMES[themeId];
            const isActive = activeTheme.id === themeId;

            return (
              <motion.div
                key={themeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <button
                  onClick={() => handleThemeSelect(themeId)}
                  className={`
                    relative w-full rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                        : "ring-1 ring-border hover:ring-2 hover:ring-primary/50 hover:shadow-md"
                    }
                  `}
                >
                  <div className="relative aspect-video p-2 rounded-lg overflow-hidden">
                    <Image
                      width={1360}
                      height={768}
                      src={theme.screenshot}
                      alt={theme.name}
                      className="w-full h-full object-contain rounded-lg"
                      loading="lazy"
                    />

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4 text-left bg-background">
                    <h3 className="font-semibold text-base mb-1">
                      {theme.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {theme.label}
                    </p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            {APP_THEMES[activeTheme.id].name} selected
          </p>
          <Button
            variant={"default"}
            onClick={() => setThemePickerDialogOpen(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemePickerDialog;
