import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';
import { Upload, FileText, File, CheckCircle, AlertCircle } from 'lucide-react';
import { DocumentParser, StandardizedBlog } from '@/utils/documentParser';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onDocumentParsed: (document: StandardizedBlog) => void;
  className?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentParsed,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word document (.docx) or PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      let parsedDocument: StandardizedBlog;
      
      if (file.type.includes('pdf')) {
        parsedDocument = await DocumentParser.parsePdfDocument(file);
      } else {
        parsedDocument = await DocumentParser.parseWordDocument(file);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Pass parsed data to parent
      onDocumentParsed(parsedDocument);

      toast({
        title: "Document standardized successfully",
        description: `Your ${file.type.includes('pdf') ? 'PDF' : 'Word'} document has been converted into ${parsedDocument.blocks.length} structured blocks with consistent formatting.`,
      });

    } catch (error) {
      console.error('Error parsing document:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.doc,.pdf"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <Card
        className={`border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50 ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } ${isUploading ? 'pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="p-6 text-center">
          {isUploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Standardizing document...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <FileText className="h-6 w-6 text-muted-foreground" />
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Upload Blog Document</p>
                <p className="text-xs text-muted-foreground">
                  Drop your Word (.docx) or PDF file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Auto-standardization:</strong> We'll extract and standardize your document content into consistent blocks with unified formatting, fonts, and layouts. Any mixed styles will be converted to our blog's standard structure.
        </AlertDescription>
      </Alert>
    </div>
  );
};