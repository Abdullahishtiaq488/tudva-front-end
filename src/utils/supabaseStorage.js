// src/utils/supabaseStorage.js
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Default bucket name
const DEFAULT_BUCKET = 'tudva-bucker';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Optional path within the bucket
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export const uploadFile = async (file, path = '', bucket = DEFAULT_BUCKET) => {
  try {
    const fileName = `${path}/${uuidv4()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} fileUrl - The URL of the file to delete
 * @param {string} bucket - The storage bucket name
 */
export const deleteFile = async (fileUrl, bucket = DEFAULT_BUCKET) => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
};

/**
 * Create a signed URL for temporary access to a file
 * @param {string} filePath - The path to the file in the bucket
 * @param {string} bucket - The storage bucket name
 * @param {number} expiresIn - Expiration time in seconds (default: 60 minutes)
 * @returns {Promise<string>} - The signed URL
 */
export const getSignedUrl = async (filePath, bucket = DEFAULT_BUCKET, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Error creating signed URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    throw error;
  }
};

/**
 * Download a file from Supabase Storage
 * @param {string} filePath - The path to the file in the bucket
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<Blob>} - The file blob
 */
export const downloadFile = async (filePath, bucket = DEFAULT_BUCKET) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error) {
      throw new Error(`Error downloading file: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in downloadFile:', error);
    throw error;
  }
};

/**
 * List all files in a folder
 * @param {string} folderPath - The folder path to list
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<Array>} - Array of file objects
 */
export const listFiles = async (folderPath = '', bucket = DEFAULT_BUCKET) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (error) {
      throw new Error(`Error listing files: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in listFiles:', error);
    throw error;
  }
};

export default {
  uploadFile,
  deleteFile,
  getSignedUrl,
  downloadFile,
  listFiles
};
