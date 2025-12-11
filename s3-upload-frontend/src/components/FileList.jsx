import React from 'react';
import { deleteFile } from '../services/api';

const FileList = ({ files, onDeleteSuccess }) => {
    const handleDelete = async (key) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await deleteFile(key);
                onDeleteSuccess();
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete file');
            }
        }
    };

    if (!files.length) {
        return (
            <div className="text-center text-gray-500 py-8">
                No files uploaded yet.
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Files</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {files.map((file) => (
                        <li key={file.key} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1 min-w-0">
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 truncate hover:underline"
                                >
                                    {file.key.split('/').pop().split('-').slice(1).join('-') || file.key}
                                </a>
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(file.size / 1024).toFixed(2)} KB •
                                    Uploaded: {new Date(file.lastModified).toLocaleString()}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <button
                                    onClick={() => handleDelete(file.key)}
                                    className="font-medium text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileList;
