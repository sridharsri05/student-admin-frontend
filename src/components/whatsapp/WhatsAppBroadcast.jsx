
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Users, Calendar } from "lucide-react";

const mockStudents = [
  { id: 1, name: "John Doe", phone: "+91 9876543210", batch: "Web Development", status: "active" },
  { id: 2, name: "Jane Smith", phone: "+91 9876543211", batch: "Data Science", status: "active" },
  { id: 3, name: "Mike Johnson", phone: "+91 9876543212", batch: "Mobile Development", status: "pending" },
  { id: 4, name: "Sarah Wilson", phone: "+91 9876543213", batch: "AI/ML", status: "active" },
  { id: 5, name: "David Brown", phone: "+91 9876543214", batch: "Web Development", status: "inactive" }
];

export const WhatsAppBroadcast = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.phone.includes(searchTerm);
    const matchesBatch = filterBatch === "all" || student.batch === filterBatch;
    return matchesSearch && matchesBatch;
  });

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim() || selectedStudents.length === 0) {
      alert("Please select recipients and write a message");
      return;
    }

    console.log("Sending broadcast to:", selectedStudents, "Message:", broadcastMessage);
    // API call to send broadcast
    alert(`Broadcast sent to ${selectedStudents.length} recipients!`);
    setBroadcastMessage("");
    setSelectedStudents([]);
  };

  const batches = [...new Set(mockStudents.map(s => s.batch))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-gradient flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Recipients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass border-white/20"
                />
              </div>
              <select 
                value={filterBatch} 
                onChange={(e) => setFilterBatch(e.target.value)}
                className="glass border-white/20 rounded-md px-3 py-2 bg-background"
              >
                <option value="all">All Batches</option>
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectedStudents.length === filteredStudents.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">Select All ({filteredStudents.length})</span>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg glass border border-white/10">
                  <Checkbox 
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleSelectStudent(student.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.phone}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">{student.batch}</Badge>
                    <Badge 
                      variant={student.status === 'active' ? 'default' : student.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs ml-1"
                    >
                      {student.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedStudents.length} of {filteredStudents.length} students selected
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-gradient flex items-center gap-2">
              <Send className="w-5 h-5" />
              Compose Broadcast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Broadcast Message</label>
              <Textarea
                placeholder="Type your broadcast message here..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="glass border-white/20 min-h-32"
              />
              <p className="text-xs text-muted-foreground">{broadcastMessage.length}/1000 characters</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Broadcast Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Recipients:</span>
                  <span className="font-medium">{selectedStudents.length} students</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated cost:</span>
                  <span className="font-medium">₹{(selectedStudents.length * 0.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery time:</span>
                  <span className="font-medium">~2-5 minutes</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSendBroadcast}
              className="w-full bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
              disabled={!broadcastMessage.trim() || selectedStudents.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Broadcast ({selectedStudents.length})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Broadcast Options */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient">Quick Broadcast Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="glass border-white/20 hover:bg-white/10 p-4 h-auto flex-col"
              onClick={() => {
                setSelectedStudents(mockStudents.filter(s => s.status === 'active').map(s => s.id));
                setBroadcastMessage("Important announcement: All classes will be held as scheduled tomorrow. Please arrive on time.");
              }}
            >
              <Users className="w-6 h-6 mb-2 text-neon-cyan" />
              <span>All Active Students</span>
              <span className="text-xs text-muted-foreground">Class announcement</span>
            </Button>
            <Button 
              variant="outline" 
              className="glass border-white/20 hover:bg-white/10 p-4 h-auto flex-col"
              onClick={() => {
                setSelectedStudents(mockStudents.filter(s => s.status === 'pending').map(s => s.id));
                setBroadcastMessage("Reminder: Please complete your registration process and submit pending documents.");
              }}
            >
              <Calendar className="w-6 h-6 mb-2 text-neon-pink" />
              <span>Pending Students</span>
              <span className="text-xs text-muted-foreground">Registration reminder</span>
            </Button>
            <Button 
              variant="outline" 
              className="glass border-white/20 hover:bg-white/10 p-4 h-auto flex-col"
              onClick={() => {
                setSelectedStudents(mockStudents.map(s => s.id));
                setBroadcastMessage("Holiday Notice: The institute will be closed tomorrow for the festival. Regular classes will resume the day after.");
              }}
            >
              <Send className="w-6 h-6 mb-2 text-neon-green" />
              <span>All Students</span>
              <span className="text-xs text-muted-foreground">Holiday notice</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
