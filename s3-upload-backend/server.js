const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});

// Generar URL firmada para subida
app.post('/api/get-upload-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const key = `uploads/${Date.now()}-${fileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: 300,
      // ContentType: fileType,
      // ACL: 'public-read'
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ success: true, uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar archivos
app.get('/api/files', async (req, res) => {
  try {
    const data = await s3.listObjectsV2({
      Bucket: process.env.S3_BUCKET,
      Prefix: 'uploads/'
    }).promise();

    const files = data.Contents || [];

    const fileList = files.map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
    }));

    res.json({ success: true, files: fileList });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Eliminar archivo - usando query parameter
app.delete('/api/files', async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ success: false, error: 'Key is required' });
    }

    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET,
      Key: key
    }).promise();

    res.json({ success: true, message: 'Archivo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    bucket: process.env.S3_BUCKET,
    region: process.env.AWS_REGION
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Bucket: ${process.env.S3_BUCKET}`);
  console.log(`🌍 Region: ${process.env.AWS_REGION}`);
});
