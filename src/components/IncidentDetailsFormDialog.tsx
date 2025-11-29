import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncidentDetailsFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string; image?: string }) => void;
  incidentType: string;
}

const IncidentDetailsFormDialog = ({
  open,
  onClose,
  onSubmit,
  incidentType,
}: IncidentDetailsFormDialogProps) => {
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // Validate description
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    let imageBase64: string | undefined;

    // Convert image to base64 if present
    if (imageFile) {
      try {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } catch (err) {
        setError('Failed to process image');
        return;
      }
    }

    onSubmit({
      description: description.trim(),
      image: imageBase64,
    });

    // Reset form
    setDescription('');
    setImagePreview(null);
    setImageFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setDescription('');
    setImagePreview(null);
    setImageFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Details</DialogTitle>
          <DialogDescription>
            Provide more information about this {incidentType} incident
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what happened..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max 5MB (JPG, PNG, etc.)
                </p>
              </div>
            ) : (
              <div className="relative border border-border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              type="button"
            >
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsFormDialog;