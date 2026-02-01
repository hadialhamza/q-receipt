"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  return (
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
  );
}
