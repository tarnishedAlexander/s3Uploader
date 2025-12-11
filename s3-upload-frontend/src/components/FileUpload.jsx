import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getUploadUrl, uploadFileToS3 } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        setError(null);

        try {
            for (const file of acceptedFiles) {
                // 1. Get signed URL
                const { uploadUrl } = await getUploadUrl(file.name, file.type);

                // 2. Upload to S3
                await uploadFileToS3(uploadUrl, file);
            }

            onUploadSuccess();
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div
                {...getRootProps()}
                className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-white'}
        `}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <p className="text-blue-600 font-semibold">Uploading...</p>
                ) : isDragActive ? (
                    <p className="text-blue-600">Drop the files here ...</p>
                ) : (
                    <div>
                        <p className="text-gray-600 text-lg mb-2">Drag & drop files here, or click to select files</p>
                        <p className="text-sm text-gray-400">Supports all file types</p>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
