'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface FormStep2Props {
  email: string;
  onBack: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export function FormStep2({ email, onBack, onComplete, isLoading }: FormStep2Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'image/jpeg' && selectedFile.type !== 'image/png') {
      setError('Please select a valid image file (JPG or PNG)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a screenshot');
      return;
    }

    if (isUploading) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      const response = await fetch('/api/upload-screenshot', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onComplete();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload screenshot');
        setIsUploading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-50 mb-2">Upload Payment Screenshot</h2>
        <p className="text-zinc-400">Share your payment confirmation</p>
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="mb-6 p-4 bg-red-950 border border-red-800 rounded-lg text-red-200"
        >
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mb-6 flex flex-col items-center">
        <p className="text-zinc-400 text-sm mb-3">Scan the QR code below to make your payment</p>
        <div className="relative w-56 h-56 rounded-xl overflow-hidden border border-zinc-700 shadow-lg">
          <Image
            src="/PaymentSS.jpeg?v=2"
            alt="Payment QR Code"
            fill
            className="object-contain bg-white"
          />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mb-8 p-8 border-2 border-dashed border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-900/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
        />

        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-zinc-800">
              <Image
                src={preview}
                alt="Payment screenshot preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-zinc-300 font-medium">{file?.name}</p>
              <p className="text-zinc-500 text-sm">
                {(file!.size / 1024).toFixed(1)} KB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="text-zinc-400 hover:text-zinc-300 text-sm mt-2 underline"
              >
                Change file
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg
              className="w-12 h-12 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div className="text-center">
              <p className="text-zinc-300 font-medium">Drag and drop your screenshot</p>
              <p className="text-zinc-500 text-sm">or click to select a file</p>
            </div>
            <p className="text-zinc-600 text-xs">JPG or PNG, max 5MB</p>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          disabled={isUploading}
          variant="outline"
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 h-12 rounded-lg"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isUploading || !file}
          className="flex-1 bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold h-12 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading...
            </span>
          ) : 'Complete'}
        </Button>
      </motion.div>
    </motion.form>
  );
}
