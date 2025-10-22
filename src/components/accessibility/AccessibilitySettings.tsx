import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Eye, Gauge, Type, Volume2, Keyboard, Palette } from "lucide-react";

const AccessibilitySettings = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textSize, setTextSize] = useState([100]);
  const [screenReaderAnnouncements, setScreenReaderAnnouncements] = useState(true);
  const [keyboardHighlights, setKeyboardHighlights] = useState(true);
  const [colorVisionMode, setColorVisionMode] = useState<string>("none");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setHighContrast(settings.highContrast ?? false);
      setReducedMotion(settings.reducedMotion ?? false);
      setTextSize([settings.textSize ?? 100]);
      setScreenReaderAnnouncements(settings.screenReaderAnnouncements ?? true);
      setKeyboardHighlights(settings.keyboardHighlights ?? true);
      setColorVisionMode(settings.colorVisionMode ?? "none");
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      setReducedMotion(true);
    }

    const prefersHighContrast = window.matchMedia("(prefers-contrast: more)");
    if (prefersHighContrast.matches) {
      setHighContrast(true);
    }
  }, []);

  // Save settings and apply changes
  useEffect(() => {
    const settings = {
      highContrast,
      reducedMotion,
      textSize: textSize[0],
      screenReaderAnnouncements,
      keyboardHighlights,
      colorVisionMode,
    };
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));

    // Apply settings to document
    document.documentElement.style.fontSize = `${textSize[0]}%`;
    
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    if (keyboardHighlights) {
      document.documentElement.classList.add("keyboard-focus");
    } else {
      document.documentElement.classList.remove("keyboard-focus");
    }

    // Apply color vision filters
    document.documentElement.setAttribute("data-color-vision", colorVisionMode);
  }, [highContrast, reducedMotion, textSize, screenReaderAnnouncements, keyboardHighlights, colorVisionMode]);

  const resetSettings = () => {
    setHighContrast(false);
    setReducedMotion(false);
    setTextSize([100]);
    setScreenReaderAnnouncements(true);
    setKeyboardHighlights(true);
    setColorVisionMode("none");
    localStorage.removeItem("accessibilitySettings");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Accessibility Settings</h2>
        <p className="text-muted-foreground">
          Customize your experience to meet your accessibility needs
        </p>
      </div>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Settings
          </CardTitle>
          <CardDescription>
            Adjust visual preferences for better readability and comfort
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Increase color contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-0.5">
              <Label htmlFor="text-size">Text Size: {textSize[0]}%</Label>
              <p className="text-sm text-muted-foreground">
                Adjust text size across the platform
              </p>
            </div>
            <Slider
              id="text-size"
              min={75}
              max={200}
              step={25}
              value={textSize}
              onValueChange={setTextSize}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (75%)</span>
              <span>Normal (100%)</span>
              <span>Large (200%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motion Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Motion & Animation
          </CardTitle>
          <CardDescription>
            Control animations and motion effects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard & Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard & Navigation
          </CardTitle>
          <CardDescription>
            Enhance keyboard navigation and focus indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keyboard-highlights">Enhanced Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">
                Show prominent outlines around focused elements
              </p>
            </div>
            <Switch
              id="keyboard-highlights"
              checked={keyboardHighlights}
              onCheckedChange={setKeyboardHighlights}
            />
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Screen Reader
          </CardTitle>
          <CardDescription>
            Configure screen reader announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sr-announcements">Live Region Announcements</Label>
              <p className="text-sm text-muted-foreground">
                Announce dynamic content changes to screen readers
              </p>
            </div>
            <Switch
              id="sr-announcements"
              checked={screenReaderAnnouncements}
              onCheckedChange={setScreenReaderAnnouncements}
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Vision Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Vision
          </CardTitle>
          <CardDescription>
            Adjust colors for different types of color vision deficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Color Vision Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={colorVisionMode === "none" ? "default" : "outline"}
                onClick={() => setColorVisionMode("none")}
                className="w-full"
              >
                Normal
              </Button>
              <Button
                variant={colorVisionMode === "protanopia" ? "default" : "outline"}
                onClick={() => setColorVisionMode("protanopia")}
                className="w-full"
              >
                Protanopia
              </Button>
              <Button
                variant={colorVisionMode === "deuteranopia" ? "default" : "outline"}
                onClick={() => setColorVisionMode("deuteranopia")}
                className="w-full"
              >
                Deuteranopia
              </Button>
              <Button
                variant={colorVisionMode === "tritanopia" ? "default" : "outline"}
                onClick={() => setColorVisionMode("tritanopia")}
                className="w-full"
              >
                Tritanopia
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Color vision modes simulate how people with different types of color blindness see colors
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
