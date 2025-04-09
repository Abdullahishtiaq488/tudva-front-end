'use client';

import React, { useState, useRef } from 'react';
import { Button, Form, ProgressBar, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const VideoUpload = ({
  onUploadComplete,
  maxSizeMB = 100,
  buttonText = 'Upload Video'
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const videoRef = useRef(null);

  const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setVideoPreview('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Invalid file type. Allowed types: MP4, AVI, QuickTime`);
      setFile(null);
      return;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds the maximum allowed size (${maxSizeMB}MB)`);
      setFile(null);
      return;
    }

    setFile(selectedFile);

    // Create a preview URL for the video
    const previewUrl = URL.createObjectURL(selectedFile);
    setVideoPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file first');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      toast.loading('Preparing to upload video...', { id: 'video-upload' });

      // Create FormData for upload
      const formData = new FormData();
      formData.append('video', file);

      // Upload using axios with progress tracking
      const response = await axios.post('/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);

          // Update toast with progress at certain intervals to avoid too many updates
          if (percentCompleted % 20 === 0 || percentCompleted === 100) {
            toast.loading(`Uploading: ${percentCompleted}%`, { id: 'video-upload' });
          }
        }
      });

      if (response.data.success) {
        setProgress(100);
        toast.success('Video uploaded successfully!', { id: 'video-upload' });

        // Call the callback with the file URL and the original file
        if (onUploadComplete) {
          onUploadComplete({
            url: response.data.url,
            file: file,
            previewUrl: videoPreview
          });
        }
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message || 'Unknown error'}`);
      toast.error(`Upload failed: ${err.message || 'Unknown error'}`, { id: 'video-upload' });
    } finally {
      setUploading(false);
    }
  };

  // Function to simulate upload for development
  const simulateUpload = () => {
    if (!file) {
      setError('Please select a video file first');
      return;
    }

    setUploading(true);
    setProgress(0);
    toast.loading('Uploading video...', { id: 'video-upload' });

    // Simulate progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      // Update toast with progress
      if (currentProgress % 20 === 0) {
        toast.loading(`Uploading: ${currentProgress}%`, { id: 'video-upload' });
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploading(false);
        toast.success('Video uploaded successfully!', { id: 'video-upload' });

        // Call the callback with the file and preview URL
        if (onUploadComplete) {
          onUploadComplete({
            url: videoPreview, // In simulation, we use the local preview URL
            file: file,
            previewUrl: videoPreview
          });
        }
      }
    }, 300);
  };

  return (
    <div className="video-upload-component mb-4">
      <Form.Group controlId="formVideo" className="mb-3">
        <Form.Label>Select video to upload</Form.Label>
        <Form.Control
          type="file"
          accept="video/mp4,video/avi,video/quicktime"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Form.Text className="text-muted">
          Max file size: {maxSizeMB}MB. Allowed types: MP4, AVI, QuickTime
        </Form.Text>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      {videoPreview && (
        <div className="video-preview mb-3">
          <p className="mb-2">Preview:</p>
          <video
            ref={videoRef}
            width="100%"
            height="auto"
            controls
            className="rounded"
          >
            <source src={videoPreview} type={file?.type || 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {uploading && (
        <div className="mb-3">
          <p className="mb-1">Uploading: {progress}%</p>
          <ProgressBar
            now={progress}
            label={`${progress}%`}
            animated
            variant={progress < 100 ? "primary" : "success"}
          />
        </div>
      )}

      <Button
        variant="primary"
        onClick={process.env.NODE_ENV === 'development' ? simulateUpload : handleUpload}
        disabled={!file || uploading}
        className="mt-2"
      >
        {uploading ? 'Uploading...' : buttonText}
      </Button>
    </div>
  );
};

export default VideoUpload;
