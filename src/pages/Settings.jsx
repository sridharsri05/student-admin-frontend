
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Save, School, Bell, Shield, Database, Mail } from 'lucide-react';

export const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    instituteName: 'EduFlow Academy',
    instituteAddress: '123 Education Street, Learning City',
    institutePhone: '+1 (555) 123-4567',
    instituteEmail: 'admin@eduflow.com',
    instituteWebsite: 'https://eduflow.academy',
    
    // Academic Settings
    academicYear: '2024-2025',
    defaultSessionDuration: 60,
    workingDaysPerWeek: 6,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    attendanceAlerts: true,
    
    // System Settings
    autoBackup: true,
    dataRetention: 365,
    sessionTimeout: 30,
    
    // Payment Settings
    currency: 'USD',
    taxRate: 0,
    lateFeePercentage: 5,
    gracePeriodDays: 7
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('eduflow-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage (replace with API call)
      localStorage.setItem('eduflow-settings', JSON.stringify(settings));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved successfully",
        description: "Your changes have been applied.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Settings</h1>
          <p className="text-muted-foreground">Manage your system configuration</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading} className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass border-white/20 grid w-full grid-cols-5 h-auto p-1 gap-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex flex-col sm:flex-row items-center gap-1 px-2 py-2 text-xs sm:text-sm">
            <School className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex flex-col sm:flex-row items-center gap-1 px-2 py-2 text-xs sm:text-sm">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex flex-col sm:flex-row items-center gap-1 px-2 py-2 text-xs sm:text-sm">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex flex-col sm:flex-row items-center gap-1 px-2 py-2 text-xs sm:text-sm">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex flex-col sm:flex-row items-center gap-1 px-2 py-2 text-xs sm:text-sm">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-gradient flex items-center">
                <School className="w-5 h-5 mr-2" />
                Institute Information
              </CardTitle>
              <CardDescription>
                Basic information about your educational institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input
                    id="instituteName"
                    value={settings.instituteName}
                    onChange={(e) => handleSettingChange('instituteName', e.target.value)}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instituteEmail">Email</Label>
                  <Input
                    id="instituteEmail"
                    type="email"
                    value={settings.instituteEmail}
                    onChange={(e) => handleSettingChange('instituteEmail', e.target.value)}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instituteAddress">Address</Label>
                <Input
                  id="instituteAddress"
                  value={settings.instituteAddress}
                  onChange={(e) => handleSettingChange('instituteAddress', e.target.value)}
                  className="glass border-white/20 focus:border-primary/50"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutePhone">Phone</Label>
                  <Input
                    id="institutePhone"
                    value={settings.institutePhone}
                    onChange={(e) => handleSettingChange('institutePhone', e.target.value)}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instituteWebsite">Website</Label>
                  <Input
                    id="instituteWebsite"
                    value={settings.instituteWebsite}
                    onChange={(e) => handleSettingChange('instituteWebsite', e.target.value)}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-gradient">Academic Configuration</CardTitle>
              <CardDescription>Settings related to academic operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={settings.academicYear}
                    onChange={(e) => handleSettingChange('academicYear', e.target.value)}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionDuration">Default Session Duration (minutes)</Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    value={settings.defaultSessionDuration}
                    onChange={(e) => handleSettingChange('defaultSessionDuration', parseInt(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingDays">Working Days Per Week</Label>
                  <Input
                    id="workingDays"
                    type="number"
                    min="1"
                    max="7"
                    value={settings.workingDaysPerWeek}
                    onChange={(e) => handleSettingChange('workingDaysPerWeek', parseInt(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-gradient flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send automatic payment reminders</p>
                </div>
                <Switch
                  checked={settings.paymentReminders}
                  onCheckedChange={(checked) => handleSettingChange('paymentReminders', checked)}
                />
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert for attendance issues</p>
                </div>
                <Switch
                  checked={settings.attendanceAlerts}
                  onCheckedChange={(checked) => handleSettingChange('attendanceAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-gradient flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Configuration
              </CardTitle>
              <CardDescription>Advanced system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Enable daily automatic backups</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-gradient">Payment Configuration</CardTitle>
              <CardDescription>Settings for payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lateFee">Late Fee (%)</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    value={settings.lateFeePercentage}
                    onChange={(e) => handleSettingChange('lateFeePercentage', parseInt(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={settings.gracePeriodDays}
                    onChange={(e) => handleSettingChange('gracePeriodDays', parseInt(e.target.value))}
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
