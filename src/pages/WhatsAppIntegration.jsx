
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Users, Settings, Phone, CheckCircle, Clock, X } from "lucide-react";
import { WhatsAppTemplates } from "@/components/whatsapp/WhatsAppTemplates";
import { WhatsAppBroadcast } from "@/components/whatsapp/WhatsAppBroadcast";
import { WhatsAppSettings } from "@/components/whatsapp/WhatsAppSettings";

export const WhatsAppIntegration = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  // Mock data - replace with API calls
  const stats = {
    totalMessages: 1245,
    deliveredMessages: 1156,
    pendingMessages: 67,
    failedMessages: 22
  };

  const recentMessages = [
    { id: 1, recipient: "John Doe", message: "Fee reminder for January", status: "delivered", time: "2 mins ago" },
    { id: 2, recipient: "Jane Smith", message: "Class schedule update", status: "delivered", time: "5 mins ago" },
    { id: 3, recipient: "Mike Johnson", message: "Payment confirmation", status: "pending", time: "10 mins ago" },
    { id: 4, recipient: "Sarah Wilson", message: "Admission confirmation", status: "delivered", time: "15 mins ago" },
    { id: 5, recipient: "David Brown", message: "Course completion certificate", status: "failed", time: "20 mins ago" }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    console.log("Sending WhatsApp message:", {
      message,
      recipients: selectedRecipients,
      template: selectedTemplate
    });
    
    // API call to send message
    setMessage("");
    alert("Message sent successfully!");
  };

  const handleQuickMessage = (recipient, messageText) => {
    console.log("Sending quick message to:", recipient, messageText);
    // API call to send quick message
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-neon-green" />
            WhatsApp Integration
          </h1>
          <p className="text-muted-foreground mt-1">Send messages, notifications, and manage WhatsApp communications</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-white/20 hover:bg-white/10"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
            onClick={() => setActiveTab("send")}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-neon-green">{stats.totalMessages}</p>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green">+23%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-neon-cyan">{stats.deliveredMessages}</p>
              </div>
              <Badge className="bg-neon-cyan/20 text-neon-cyan">93%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-neon-pink">{stats.pendingMessages}</p>
              </div>
              <Badge className="bg-neon-pink/20 text-neon-pink">Sending</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-400">{stats.failedMessages}</p>
              </div>
              <Badge className="bg-red-400/20 text-red-400">Error</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass border-white/20">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20">Dashboard</TabsTrigger>
          <TabsTrigger value="send" className="data-[state=active]:bg-primary/20">Send Message</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary/20">Templates</TabsTrigger>
          <TabsTrigger value="broadcast" className="data-[state=active]:bg-primary/20">Broadcast</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMessages.map((msg) => (
                    <div key={msg.id} className="flex items-center justify-between p-3 rounded-lg glass border border-white/10">
                      <div className="flex items-center gap-3">
                        {msg.status === 'delivered' ? (
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                        ) : msg.status === 'failed' ? (
                          <X className="w-5 h-5 text-red-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-neon-pink" />
                        )}
                        <div>
                          <p className="font-medium">{msg.recipient}</p>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{msg.time}</p>
                        <Badge variant={msg.status === 'delivered' ? 'default' : msg.status === 'failed' ? 'destructive' : 'secondary'}>
                          {msg.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 hover:from-neon-green/30 hover:to-neon-cyan/30"
                  onClick={() => handleQuickMessage("all-students", "Fee reminder")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Send Fee Reminder to All Students
                </Button>
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 hover:from-neon-purple/30 hover:to-neon-pink/30"
                  onClick={() => handleQuickMessage("new-admissions", "Welcome message")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Welcome New Admissions
                </Button>
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 hover:from-neon-cyan/30 hover:to-neon-purple/30"
                  onClick={() => handleQuickMessage("pending-payments", "Payment reminder")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Payment Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">Compose Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Recipients</label>
                  <Select>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Choose recipient group" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20 bg-card">
                      <SelectItem value="all-students">All Students</SelectItem>
                      <SelectItem value="active-students">Active Students</SelectItem>
                      <SelectItem value="pending-payments">Pending Payments</SelectItem>
                      <SelectItem value="new-admissions">New Admissions</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Choose template (optional)" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20 bg-card">
                      <SelectItem value="fee-reminder">Fee Reminder</SelectItem>
                      <SelectItem value="class-update">Class Update</SelectItem>
                      <SelectItem value="welcome">Welcome Message</SelectItem>
                      <SelectItem value="payment-confirmation">Payment Confirmation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="glass border-white/20 min-h-32"
                  />
                  <p className="text-xs text-muted-foreground">{message.length}/1000 characters</p>
                </div>

                <Button 
                  onClick={handleSendMessage}
                  className="w-full bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">Message Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">WhatsApp Message</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">{message || "Your message will appear here..."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <WhatsAppTemplates />
        </TabsContent>

        <TabsContent value="broadcast">
          <WhatsAppBroadcast />
        </TabsContent>

        <TabsContent value="settings">
          <WhatsAppSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
