import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getUploadUrl = async (fileName, fileType) => {
    const response = await axios.post(`${API_URL}/get-upload-url`, {
        fileName,
        fileType,
    });
    return response.data;
};

export const uploadFileToS3 = async (url, file) => {
    await axios.put(url, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};

export const getFiles = async () => {
    const response = await axios.get(`${API_URL}/files`);
    return response.data.files;
};

export const deleteFile = async (key) => {
    await axios.delete(`${API_URL}/files`, {
        params: { key },
    });
};
