"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Lock,
  Bell,
  Palette,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Loader2,
  Camera,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/update-profile";
import { uploadToImgbb } from "@/app/actions/upload-image";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setPreviewImage(session.user.image || "");
    }
  }, [session]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size (e.g., < 2MB)
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const result = await uploadToImgbb(base64);

        if (result.success) {
          setPreviewImage(result.url);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error(result.message || "Failed to upload image.");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image selection error:", error);
      toast.error("An error occurred during image selection.");
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        image: previewImage,
      });

      if (result.success) {
        // Refresh session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: name.trim(),
            image: previewImage,
          },
        });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("An error occurred while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    name.trim() !== (session?.user?.name || "") ||
    previewImage !== (session?.user?.image || "");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient-primary font-logo">
          Settings
        </h2>
        <p className="text-muted-foreground font-sans">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4 bg-muted/50 p-1 h-auto">
          <TabsTrigger value="general" className="space-x-2 font-sans">
            <User className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="space-x-2 font-sans">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="space-x-2 font-sans">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="space-x-2 font-sans">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-sm glass">
            <CardHeader>
              <CardTitle className="font-logo">Profile Information</CardTitle>
              <CardDescription className="font-sans">
                Update your profile details and public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                      <AvatarImage
                        src={previewImage}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-primary text-white text-3xl font-logo">
                        {name
                          ? name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      ) : (
                        <Camera className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImageClick}
                    disabled={isUploading}
                    className="font-sans"
                  >
                    {isUploading ? "Uploading..." : "Change Photo"}
                  </Button>
                </div>
                <div className="flex-1 space-y-5 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-sans">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-muted/30 font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="font-sans">
                        Email Address
                      </Label>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    </div>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      type="email"
                      className="bg-muted/50 cursor-not-allowed opacity-70 font-sans"
                    />
                    <p className="text-[11px] text-muted-foreground font-sans italic">
                      Email address cannot be changed for security reasons.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving || isUploading || !hasChanges}
                className="bg-gradient-primary shadow-primary border-none text-white font-sans px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-6 py-4 flex justify-end">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button className="bg-gradient-primary shadow-primary border-none text-white">
                Update Password
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  Secure your account with 2FA.
                </div>
              </div>
              <Switch />
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Select the theme for the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="cursor-pointer">
                <div className="rounded-xl border-2 border-muted p-1 hover:border-primary transition-colors hover:bg-muted/50">
                  <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-20 rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <div className="block p-2 text-center font-normal">Light</div>
              </div>

              <div className="cursor-pointer">
                <div className="rounded-xl border-2 border-muted p-1 hover:border-primary transition-colors hover:bg-muted/50">
                  <div className="space-y-2 rounded-lg bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-20 rounded-lg bg-slate-400" />
                      <div className="h-2 w-25 rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-25 rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <div className="block p-2 text-center font-normal">Dark</div>
              </div>

              <div className="cursor-pointer">
                <div className="rounded-xl border-2 border-primary/50 bg-primary/5 p-1">
                  <div className="space-y-2 rounded-lg bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-20 rounded-lg bg-slate-400" />
                      <div className="h-2 w-25 rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-25 rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <div className="block p-2 text-center font-medium text-primary">
                  System
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what you want to be notified about via email.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="receipts" className="flex flex-col space-y-1">
                  <span>New Receipt Created</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive an email when a new receipt is generated.
                  </span>
                </Label>
                <Switch id="receipts" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>Marketing & Updates</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive emails about new features and offers.
                  </span>
                </Label>
                <Switch id="marketing" />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="security" className="flex flex-col space-y-1">
                  <span>Security Alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive emails about suspicious activity.
                  </span>
                </Label>
                <Switch id="security" defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
