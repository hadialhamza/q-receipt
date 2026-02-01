"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfile } from "@/app/actions/update-profile";
import { uploadToImgbb } from "@/app/actions/upload-image";

export default function ProfileForm() {
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
                <AvatarImage src={previewImage} className="object-cover" />
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
  );
}
