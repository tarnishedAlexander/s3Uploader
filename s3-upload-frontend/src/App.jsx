import React, { useEffect, useState } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import { getFiles } from './services/api';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const fileList = await getFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            S3 File Uploader
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Upload files to your S3 bucket with ease
          </p>
        </div>

        <FileUpload onUploadSuccess={fetchFiles} />

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-500">Loading files...</p>
          </div>
        ) : (
          <FileList files={files} onDeleteSuccess={fetchFiles} />
        )}
      </div>
    </div>
  );
}

export default App;
