
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Copy } from "lucide-react";

const mockTemplates = [
  {
    id: 1,
    name: "Fee Reminder",
    content: "Hi {student_name}, this is a reminder that your fee payment of ₹{amount} is due on {due_date}. Please make the payment to avoid any inconvenience.",
    category: "Payment",
    usage: 156
  },
  {
    id: 2,
    name: "Class Update",
    content: "Dear {student_name}, your class for {subject} on {date} has been rescheduled to {new_time}. Please join accordingly.",
    category: "Schedule",
    usage: 89
  },
  {
    id: 3,
    name: "Welcome Message",
    content: "Welcome to our institute, {student_name}! We're excited to have you join {course_name}. Your classes begin on {start_date}.",
    category: "Welcome",
    usage: 34
  },
  {
    id: 4,
    name: "Payment Confirmation",
    content: "Thank you {student_name}! Your payment of ₹{amount} has been received successfully. Receipt: {receipt_number}",
    category: "Payment",
    usage: 78
  }
];

export const WhatsAppTemplates = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "", category: "" });

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
      setEditingTemplate(null);
    } else {
      setTemplates([...templates, { ...newTemplate, id: Date.now(), usage: 0 }]);
      setNewTemplate({ name: "", content: "", category: "" });
    }
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.content);
    alert("Template copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gradient">Message Templates</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-white/20 bg-background">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Template Name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                className="glass border-white/20"
              />
              <Input
                placeholder="Category"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                className="glass border-white/20"
              />
              <Textarea
                placeholder="Template Content (use {variable_name} for dynamic content)"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                className="glass border-white/20 min-h-24"
              />
              <Button onClick={handleSaveTemplate} className="w-full">Save Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="glass border-white/10 hover-lift">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                    <Badge variant="secondary" className="text-xs">{template.usage} uses</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleCopyTemplate(template)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTemplate(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10">
                {template.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Template Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="glass border-white/20 bg-background">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Template Name"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                className="glass border-white/20"
              />
              <Input
                placeholder="Category"
                value={editingTemplate.category}
                onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})}
                className="glass border-white/20"
              />
              <Textarea
                placeholder="Template Content"
                value={editingTemplate.content}
                onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                className="glass border-white/20 min-h-24"
              />
              <Button onClick={handleSaveTemplate} className="w-full">Update Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
