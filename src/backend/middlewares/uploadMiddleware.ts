import multer from 'multer';

// Use memory storage to store raw file buffers directly in memory (avoids disk access inside serverless containers)
const storage = multer.memoryStorage();

// Accept P&IDs/Drawings (PDF, PNG, JPG, JPEG) and Jobbooks (XLS, XLSX)
export const fileUpload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf';
    const isImage = file.mimetype.startsWith('image/');
    const isExcel =
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel';

    if (isPdf || isImage || isExcel) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Formatos aceitos: PDF, Imagens (PNG, JPG, JPEG) ou Planilhas Excel (XLS, XLSX).') as any);
    }
  }
});
