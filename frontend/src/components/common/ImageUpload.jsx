import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { validators, handleError } from '../../utils/errorHandler';

const ImageUpload = ({
  label,
  currentImage,
  onImageUpload,
  onImageDelete,
  aspectRatio = '16:9', // '1:1' for logos, '16:9' for banners
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  },
  isLoading = false,
  error = null,
  placeholder = 'Drag and drop an image here, or click to select',
  height = 200,
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploadError, setUploadError] = useState(error);

  // Sync preview with currentImage prop changes
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  // Sync error with error prop changes
  useEffect(() => {
    setUploadError(error);
  }, [error]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('ImageUpload: onDrop called', { acceptedFiles, rejectedFiles });
    setUploadError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      console.log('ImageUpload: File rejected', rejection.errors);
      
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        const sizeError = validators.fileSize(rejection.file, Math.round(maxSize / 1024 / 1024));
        setUploadError(sizeError);
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        // Get allowed MIME types from accept object
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const typeError = validators.fileType(rejection.file, allowedTypes);
        setUploadError(typeError || 'Invalid file type. Please upload an image file.');
      } else {
        setUploadError('Invalid file. Please try again.');
      }
      return;
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('ImageUpload: File accepted', { name: file.name, size: file.size, type: file.type });
      
      // Validate file again (double-check)
      const sizeError = validators.fileSize(file, Math.round(maxSize / 1024 / 1024));
      if (sizeError) {
        setUploadError(sizeError);
        return;
      }
      
      const typeError = validators.fileType(file, ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);
      if (typeError) {
        setUploadError(typeError);
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        console.log('ImageUpload: Preview created');
        setPreview(reader.result);
      };
      reader.onerror = () => {
        console.error('ImageUpload: Failed to create preview');
        setUploadError('Failed to create image preview.');
      };
      reader.readAsDataURL(file);

      // Call upload handler
      if (onImageUpload) {
        console.log('ImageUpload: Calling onImageUpload');
        try {
          onImageUpload(file);
        } catch (error) {
          console.error('ImageUpload: onImageUpload failed', error);
          setUploadError('Failed to upload image. Please try again.');
        }
      }
    }
  }, [maxSize, onImageUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleDelete = () => {
    console.log('ImageUpload: Deleting image');
    setPreview(null);
    setUploadError(null);
    if (onImageDelete) {
      try {
        onImageDelete();
      } catch (error) {
        console.error('ImageUpload: onImageDelete failed', error);
        setUploadError('Failed to delete image. Please try again.');
      }
    }
  };

  const getDropzoneStyles = () => {
    let borderColor = '#e0e0e0';
    let backgroundColor = '#fafafa';

    if (isDragActive && !isDragReject) {
      borderColor = '#2196f3';
      backgroundColor = '#e3f2fd';
    } else if (isDragReject) {
      borderColor = '#f44336';
      backgroundColor = '#ffebee';
    }

    return {
      borderColor,
      backgroundColor,
    };
  };

  const isSquare = aspectRatio === '1:1';

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      )}
      
      <Paper
        {...getRootProps()}
        elevation={0}
        sx={{
          border: '2px dashed',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          height: height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          ...getDropzoneStyles(),
          '&:hover': {
            borderColor: '#2196f3',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <input 
          {...getInputProps()} 
          id={`image-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
          name={`image-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
          aria-label={`Upload ${label || 'image'}`}
        />
        
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Uploading...
            </Typography>
          </Box>
        ) : preview ? (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {isSquare ? (
              <Avatar
                src={preview}
                sx={{
                  width: 120,
                  height: 120,
                  margin: 'auto',
                  border: '3px solid #fff',
                  boxShadow: 2,
                }}
              />
            ) : (
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            )}
            
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                aria-label={`Edit ${label || 'image'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Trigger file input
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = Object.keys(accept).join(',');
                  input.id = `edit-${label?.replace(/\s+/g, '-').toLowerCase() || 'image'}`;
                  input.name = `edit-${label?.replace(/\s+/g, '-').toLowerCase() || 'image'}`;
                  input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                      onDrop([file], []);
                    }
                  };
                  input.click();
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <IconButton
                size="small"
                aria-label={`Delete ${label || 'image'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'error.main',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    color: 'error.dark',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="body1" color="text.primary">
              {isDragActive ? 'Drop the image here' : placeholder}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports JPEG, PNG, GIF, WebP (max {Math.round(maxSize / 1024 / 1024)}MB)
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              size="small"
              aria-label={`Browse files to upload ${label || 'image'}`}
              onClick={(e) => e.stopPropagation()}
            >
              Browse Files
            </Button>
          </Box>
        )}
      </Paper>

      {(uploadError || error) && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {uploadError || error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload;
