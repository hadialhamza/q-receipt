"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Palette, Settings2 } from "lucide-react";
import ProfileForm from "@/components/settings/ProfileForm";
import SecuritySettings from "@/components/settings/SecuritySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PageHeader from "@/components/dashboard/PageHeader";

export default function SettingsClient() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <PageHeader
        title="Account"
        highlightWord="Settings"
        description="Manage your account settings and preferences."
        icon={Settings2}
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:flex md:flex-row bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="general"
            className="flex-1 md:flex-none md:min-w-35 px-6 py-2.5 space-x-2 font-sans rounded-lg transition-all"
          >
            <User className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="flex-1 md:flex-none md:min-w-35 px-6 py-2.5 space-x-2 font-sans rounded-lg transition-all"
          >
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex-1 md:flex-none md:min-w-35 px-6 py-2.5 space-x-2 font-sans rounded-lg transition-all"
          >
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex-1 md:flex-none md:min-w-35 px-6 py-2.5 space-x-2 font-sans rounded-lg transition-all"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
