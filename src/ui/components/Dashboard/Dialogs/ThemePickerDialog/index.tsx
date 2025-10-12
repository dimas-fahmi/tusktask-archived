/** biome-ignore-all lint/a11y/noSvgWithoutTitle: JUST A FUCKING CIRCLE */
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import {
  APP_THEMES,
  APP_THEMES_ID,
  FONT_THEME_CLASSES,
  FONT_THEMES,
} from "@/src/lib/configs";
import { useThemeStore } from "@/src/lib/stores/ui/themeStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";

type TabType = "color" | "font";

const ThemePickerDialog = () => {
  const {
    setThemePickerDialogOpen,
    themePickerDialogOpen,
    setActiveTheme,
    activeTheme,
    setActiveFont,
    activeFont,
  } = useThemeStore();

  const [activeTab, setActiveTab] = useState<TabType>("color");

  const handleThemeSelect = (themeId: (typeof APP_THEMES_ID)[number]) => {
    setActiveTheme(APP_THEMES[themeId]);
  };

  const handleFontSelect = (fontId: (typeof FONT_THEME_CLASSES)[number]) => {
    setActiveFont(FONT_THEMES[fontId]);
  };

  return (
    <Dialog
      open={themePickerDialogOpen}
      onOpenChange={setThemePickerDialogOpen}
    >
      <DialogContent
        className={`${activeTheme.id} ${activeFont.id} bg-background text-foreground max-w-4xl max-h-[85vh] overflow-y-scroll scrollbar-none`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-header font-semibold">
            Customize Your Experience
          </DialogTitle>
          <DialogDescription className="font-body">
            Personalize colors and fonts for your TuskTask workspace
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b relative font-header">
          <button
            type="button"
            onClick={() => setActiveTab("color")}
            className={`px-4 flex-1 py-2.5 font-medium transition-colors relative z-10 ${
              activeTab === "color"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            } cursor-pointer`}
          >
            Color Themes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("font")}
            className={`px-4 flex-1 py-2.5 font-medium transition-colors relative z-10 ${
              activeTab === "font"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            } cursor-pointer`}
          >
            Font Themes
          </button>
          <motion.div
            className="absolute bottom-0 h-0.5 bg-primary"
            initial={false}
            animate={{
              left: activeTab === "color" ? "0%" : "50%",
              width: activeTab === "color" ? "50%" : "50%",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        </div>

        {/* Color Themes Tab */}
        {activeTab === "color" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
          >
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
                    type="button"
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
                      <h3 className="font-header font-semibold text-base mb-1">
                        {theme.name}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground">
                        {theme.label}
                      </p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Font Themes Tab */}
        {activeTab === "font" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-3 py-4"
          >
            {FONT_THEME_CLASSES.map((fontId, index) => {
              const font = FONT_THEMES[fontId];
              const isActive = activeFont.id === fontId;

              return (
                <motion.button
                  key={fontId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleFontSelect(fontId)}
                  className={`
                    ${fontId} relative p-4 rounded-lg text-left transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? "ring-2 ring-primary ring-offset-2 shadow-lg bg-accent/50"
                        : "ring-1 ring-border hover:ring-2 hover:ring-primary/50 hover:shadow-md hover:bg-accent/30"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-header font-semibold text-lg mb-1.5 truncate">
                        {font.name}
                      </h3>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">
                        {font.description}
                      </p>
                      <div
                        className={`${font.id} mt-3 pt-3 border-t border-border/50`}
                      >
                        <p className="text-base font-header">
                          The quick brown fox jumps over the lazy dog
                        </p>
                        <p className="text-xs font-body text-muted-foreground mt-1">
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg"
                      >
                        <svg
                          className="w-4 h-4"
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
                </motion.button>
              );
            })}
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            {activeTab === "color"
              ? `${APP_THEMES[activeTheme.id].name} selected`
              : `${FONT_THEMES[activeFont.id].name} selected`}
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
