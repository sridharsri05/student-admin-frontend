// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Upload, Download, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// export const BulkUpload = () => {
//   const { toast } = useToast();
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [uploadResults, setUploadResults] = useState<{
//     total: number;
//     successful: number;
//     failed: number;
//     errors: string[];
//   } | null>(null);

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
//         setFile(selectedFile);
//         setUploadResults(null);
//       } else {
//         toast({
//           title: "Invalid File Format",
//           description: "Please select a CSV file.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     setUploading(true);
//     setProgress(0);

//     try {
//       // Simulate file upload and processing
//       for (let i = 0; i <= 100; i += 10) {
//         setProgress(i);
//         await new Promise(resolve => setTimeout(resolve, 200));
//       }

//       // Simulate processing results
//       const mockResults = {
//         total: 50,
//         successful: 45,
//         failed: 5,
//         errors: [
//           "Row 5: Invalid email format",
//           "Row 12: Missing required field 'phone'",
//           "Row 23: Duplicate student ID",
//           "Row 34: Invalid date format",
//           "Row 41: University not found in master data"
//         ]
//       };

//       setUploadResults(mockResults);

//       toast({
//         title: "Bulk Upload Completed",
//         description: `Successfully processed ${mockResults.successful} out of ${mockResults.total} records.`,
//       });
//     } catch (error) {
//       toast({
//         title: "Upload Failed",
//         description: "There was an error processing the file. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const downloadTemplate = () => {
//     // Create CSV template
//     const csvContent = `Student ID,First Name,Last Name,Email,Phone,Date of Birth,Gender,Address,City,State,Pincode,Parent Name,Parent Phone,Parent Email,Relationship,University,Course,Semester,Roll Number,Selected Course,Batch Preference,Course Mode,Emergency Name,Emergency Phone,Emergency Relation,Medical Conditions,How Did You Hear
// STU001,John,Doe,john.doe@email.com,+91 9876543210,1995-05-15,Male,"123 Main St",Mumbai,Maharashtra,400001,Jane Doe,+91 9876543211,jane.doe@email.com,Mother,Mumbai University,Engineering,2nd Year,ENG123,JEE Main Preparation,Morning Batch,Offline,Jane Doe,+91 9876543211,Mother,None,Social Media`;

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'student_upload_template.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Instructions */}
//       <Alert className="glass border-blue-500/20 bg-blue-500/10">
//         <Info className="h-4 w-4 text-blue-400" />
//         <AlertDescription className="text-blue-100">
//           <strong>Instructions:</strong>
//           <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
//             <li>Download the template CSV file and fill in student information</li>
//             <li>Ensure all required fields are filled correctly</li>
//             <li>Use the exact format shown in the template</li>
//             <li>Maximum file size: 10MB</li>
//             <li>Maximum records per upload: 1000</li>
//           </ul>
//         </AlertDescription>
//       </Alert>

//       {/* Template Download */}
//       <Card className="glass border-white/10">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-neon-cyan">
//             <Download className="w-5 h-5" />
//             Download Template
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground mb-4">
//             Download the CSV template to ensure your data is in the correct format.
//           </p>
//           <Button
//             onClick={downloadTemplate}
//             variant="outline"
//             className="border-white/20 hover:bg-white/10"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             Download CSV Template
//           </Button>
//         </CardContent>
//       </Card>

//       {/* File Upload */}
//       <Card className="glass border-white/10">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-neon-purple">
//             <Upload className="w-5 h-5" />
//             Upload Student Data
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
//             <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <p className="text-muted-foreground mb-4">
//               {file ? `Selected: ${file.name}` : "Select a CSV file to upload"}
//             </p>
//             <Input
//               type="file"
//               accept=".csv"
//               onChange={handleFileSelect}
//               className="hidden"
//               id="file-upload"
//             />
//             <label htmlFor="file-upload">
//               <Button variant="outline" className="border-white/20 hover:bg-white/10" asChild>
//                 <span>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Choose File
//                 </span>
//               </Button>
//             </label>
//           </div>

//           {file && (
//             <div className="flex items-center justify-between p-4 glass rounded-lg border border-white/10">
//               <div className="flex items-center space-x-3">
//                 <FileText className="w-5 h-5 text-neon-cyan" />
//                 <div>
//                   <p className="font-medium">{file.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {(file.size / 1024 / 1024).toFixed(2)} MB
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
//               >
//                 {uploading ? "Processing..." : "Upload & Process"}
//               </Button>
//             </div>
//           )}

//           {uploading && (
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Processing file...</span>
//                 <span>{progress}%</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Upload Results */}
//       {uploadResults && (
//         <Card className="glass border-white/10">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-neon-green">
//               <CheckCircle className="w-5 h-5" />
//               Upload Results
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="text-center p-4 glass rounded-lg border border-white/10">
//                 <p className="text-2xl font-bold text-foreground">{uploadResults.total}</p>
//                 <p className="text-sm text-muted-foreground">Total Records</p>
//               </div>
//               <div className="text-center p-4 glass rounded-lg border border-white/10">
//                 <p className="text-2xl font-bold text-neon-green">{uploadResults.successful}</p>
//                 <p className="text-sm text-muted-foreground">Successful</p>
//               </div>
//               <div className="text-center p-4 glass rounded-lg border border-white/10">
//                 <p className="text-2xl font-bold text-red-400">{uploadResults.failed}</p>
//                 <p className="text-sm text-muted-foreground">Failed</p>
//               </div>
//             </div>

//             {uploadResults.errors.length > 0 && (
//               <div>
//                 <h4 className="font-medium mb-2 flex items-center gap-2 text-red-400">
//                   <AlertCircle className="w-4 h-4" />
//                   Errors ({uploadResults.errors.length})
//                 </h4>
//                 <div className="space-y-1 max-h-40 overflow-y-auto">
//                   {uploadResults.errors.map((error, index) => (
//                     <p key={index} className="text-sm text-red-400 bg-red-400/10 p-2 rounded">
//                       {error}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import axios from "axios"; // Update to your axios path

export const BulkUpload = ({ onSuccess }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setUploadResults(null);
      } else {
        toast({
          title: "Invalid File Format",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const text = await file.text();
    const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const validStudents: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // header row is 1

      if (!row["Email"] || !row["Email"].includes("@")) {
        errors.push(`Row ${rowNumber}: Invalid email`);
        errorCount++;
        continue;
      }
      if (!row["Phone"]) {
        errors.push(`Row ${rowNumber}: Missing phone`);
        errorCount++;
        continue;
      }
      if (!row["Roll Number"]) {
        errors.push(`Row ${rowNumber}: Missing roll number`);
        errorCount++;
        continue;
      }

      // Example duplicate check
      if (row["Roll Number"] === "DUPLICATE123") {
        errors.push(`Row ${rowNumber}: Duplicate roll number`);
        errorCount++;
        continue;
      }

      validStudents.push({
        name: `${row["First Name"]} ${row["Last Name"]}`,
        email: row["Email"],
        phone: row["Phone"],
        dob: row["Date of Birth"],
        gender: row["Gender"],
        address: row["Address"],
        city: row["City"],
        state: row["State"],
        pincode: row["Pincode"],
        rollNumber: row["Roll Number"],
        parentGuardian: {
          name: row["Parent Name"],
          phone: row["Parent Phone"],
          email: row["Parent Email"],
          relationship: row["Relationship"],
        },
        status: "active-paid",
        university: row["University"],
        course: row["Course"],
        coursePackage: row["Selected Course"],
        semester: row["Semester"],
        batchPreference: row["Batch Preference"],
        courseMode: row["Course Mode"],
        nationality: row["Nationality"],
      });

      successCount++;
    }

    if (validStudents.length > 0) {
      try {
        setProgress(80);
        await axios.post("/api/students/bulk-register", { students: validStudents });

        toast({
          title: "Upload & Save Successful",
          description: `Saved ${validStudents.length} students to database.`,
        });

        setProgress(100);
        onSuccess?.();
      } catch (error) {
        toast({
          title: "Backend Error",
          description: "Failed to save data to server.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
    }

    setUploadResults({
      total: data.length,
      successful: successCount,
      failed: errorCount,
      errors,
    });

    setUploading(false);
  };

  const downloadTemplate = () => {
    const csvContent = `Student ID,First Name,Last Name,Email,Phone,Date of Birth,Gender,Address,City,State,Pincode,Parent Name,Parent Phone,Parent Email,Relationship,University,Course,Semester,Roll Number,Selected Course,Batch Preference,Course Mode,Emergency Name,Emergency Phone,Emergency Relation,Medical Conditions,How Did You Hear
STU001,John,Doe,john.doe@email.com,+91 9876543210,1995-05-15,Male,"123 Main St",Mumbai,Maharashtra,400001,Jane Doe,+91 9876543211,jane.doe@email.com,Mother,Mumbai University,Engineering,2nd Year,ENG123,JEE Main Preparation,Morning Batch,Offline,Jane Doe,+91 9876543211,Mother,None,Social Media`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_upload_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadErrorReport = () => {
    if (!uploadResults || uploadResults.errors.length === 0) return;

    const errorContent = uploadResults.errors
      .map((error, index) => `${index + 1},${error}`)
      .join("\n");
    const csvHeader = "No,Error Description\n";
    const csvData = csvHeader + errorContent;

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "error_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert className="glass border-blue-500/20 bg-blue-500/10">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-100">
          <strong>Instructions:</strong>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
            <li>Download the template CSV file and fill in student information</li>
            <li>Ensure all required fields are filled correctly</li>
            <li>Use the exact format shown in the template</li>
            <li>Max file size: 10MB, Max records per upload: 1000</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Template Download */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-cyan">
            <Download className="w-5 h-5" />
            Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Download the CSV template to ensure your data is in the correct format.
          </p>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-purple">
            <Upload className="w-5 h-5" />
            Upload Student Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {file ? `Selected: ${file.name}` : "Select a CSV file to upload"}
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </label>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 glass rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-neon-cyan" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
              >
                {uploading ? "Processing..." : "Upload & Process"}
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing file...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadResults && (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-green">
              <CheckCircle className="w-5 h-5" />
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 glass rounded-lg border border-white/10">
                <p className="text-2xl font-bold text-foreground">
                  {uploadResults.total}
                </p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
              <div className="text-center p-4 glass rounded-lg border border-white/10">
                <p className="text-2xl font-bold text-neon-green">
                  {uploadResults.successful}
                </p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
              <div className="text-center p-4 glass rounded-lg border border-white/10">
                <p className="text-2xl font-bold text-red-400">{uploadResults.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>

            {uploadResults.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  Errors ({uploadResults.errors.length})
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {uploadResults.errors.map((error, index) => (
                    <p
                      key={index}
                      className="text-sm text-red-400 bg-red-400/10 p-2 rounded"
                    >
                      {error}
                    </p>
                  ))}
                </div>
                <Button
                  onClick={downloadErrorReport}
                  variant="outline"
                  className="border-red-400/40 text-red-400 hover:bg-red-400/10 mt-2"
                >
                  Download Error Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
