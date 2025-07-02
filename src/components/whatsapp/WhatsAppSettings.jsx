
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Phone, Key, Bell, Clock, Save } from "lucide-react";

export const WhatsAppSettings = () => {
  const [settings, setSettings] = useState({
    apiKey: "wa_xxxxxxxxxxxxxxxxxxxx",
    phoneNumber: "+91 9876543210",
    businessName: "EduFlow Institute",
    autoReply: true,
    deliveryReports: true,
    messageQueue: true,
    rateLimiting: "standard",
    timezone: "Asia/Kolkata",
    workingHours: {
      enabled: true,
      start: "09:00",
      end: "18:00"
    }
  });

  const [connectionStatus, setConnectionStatus] = useState("connected");

  const handleSaveSettings = () => {
    console.log("Saving WhatsApp settings:", settings);
    // API call to save settings
    alert("Settings saved successfully!");
  };

  const handleTestConnection = () => {
    console.log("Testing WhatsApp connection...");
    // API call to test connection
    setConnectionStatus("testing");
    setTimeout(() => {
      setConnectionStatus("connected");
      alert("Connection test successful!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-gradient flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>WhatsApp API Key</Label>
              <Input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                className="glass border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label>Business Phone Number</Label>
              <Input
                value={settings.phoneNumber}
                onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
                className="glass border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input
                value={settings.businessName}
                onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                className="glass border-white/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Connection Status:</span>
              <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'testing' ? 'secondary' : 'destructive'}>
                {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'testing' ? 'Testing...' : 'Disconnected'}
              </Badge>
            </div>

            <Button 
              onClick={handleTestConnection}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10"
              disabled={connectionStatus === 'testing'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-gradient flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Message Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Reply</Label>
                <p className="text-xs text-muted-foreground">Automatically reply to incoming messages</p>
              </div>
              <Switch
                checked={settings.autoReply}
                onCheckedChange={(checked) => setSettings({...settings, autoReply: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Delivery Reports</Label>
                <p className="text-xs text-muted-foreground">Track message delivery status</p>
              </div>
              <Switch
                checked={settings.deliveryReports}
                onCheckedChange={(checked) => setSettings({...settings, deliveryReports: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Message Queue</Label>
                <p className="text-xs text-muted-foreground">Queue messages for optimal delivery</p>
              </div>
              <Switch
                checked={settings.messageQueue}
                onCheckedChange={(checked) => setSettings({...settings, messageQueue: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label>Rate Limiting</Label>
              <Select value={settings.rateLimiting} onValueChange={(value) => setSettings({...settings, rateLimiting: value})}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/20 bg-card">
                  <SelectItem value="low">Low (10 msg/min)</SelectItem>
                  <SelectItem value="standard">Standard (30 msg/min)</SelectItem>
                  <SelectItem value="high">High (60 msg/min)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/20 bg-card">
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Working Hours</Label>
              <p className="text-xs text-muted-foreground">Only send messages during working hours</p>
            </div>
            <Switch
              checked={settings.workingHours.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings, 
                workingHours: {...settings.workingHours, enabled: checked}
              })}
            />
          </div>

          {settings.workingHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    workingHours: {...settings.workingHours, start: e.target.value}
                  })}
                  className="glass border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => setSettings({
                    ...settings,
                    workingHours: {...settings.workingHours, end: e.target.value}
                  })}
                  className="glass border-white/20"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
