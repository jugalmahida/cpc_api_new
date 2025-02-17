const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base upload directory
const baseUploadDir = path.join(__dirname, "../uploads");

// Create directories if they don't exist
const createUploadDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// File type validation
const fileFilter = (req, file, cb) => {

    const allowedImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    const allowedDocTypes = [
        'application/pdf',                                                         // PDF
        'application/msword',                                                      // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.ms-excel',                                               // XLS
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',      // XLSX
        'application/vnd.ms-powerpoint',                                          // PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PPTX
    ];

    // Check file types based on field name
    if (file.fieldname === 'pdf' || file.fieldname === 'announcementFile') {
        if (!allowedDocTypes.includes(file.mimetype)) {
            cb(new Error('Only PDF, Word, Excel and PowerPoint documents are allowed!'), false);
        } else {
            cb(null, true);
        }
    }
    else if (['profileImage', 'eventImage', 'verticals','media'].includes(file.fieldname)) {
        if (!allowedImageTypes.includes(file.mimetype)) {
            cb(new Error('Only JPEG, JPG & PNG images are allowed!'), false);
        } else {
            cb(null, true);
        }
    }
    else {
        cb(new Error('Invalid file type!'), false);
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;

        // Determine the upload directory based on the field name
        switch (file.fieldname) {
            case "profileImage":
                uploadDir = path.join(baseUploadDir, "profileImage");
                break;
            case "pdf":
                uploadDir = path.join(baseUploadDir, "pdfs");
                break;
            case "eventImage":
                uploadDir = path.join(baseUploadDir, "events");
                break;
            case "announcementFile":
                uploadDir = path.join(baseUploadDir, "announcementFile");
                break;
            case "verticals":
                uploadDir = path.join(baseUploadDir, "verticals");
                break;
            case "media":
                uploadDir = path.join(baseUploadDir, "media");
                break;
            default:
                uploadDir = baseUploadDir;
        }

        createUploadDir(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// Initialize multer with the storage configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Middleware for single file upload
const singleFileUpload = (fieldName) => upload.single(fieldName);

// Middleware for multiple files upload
const multipleFilesUpload = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Generic file upload handler
const handleFileUpload = (fieldName, { multiple = false, maxCount = 5 } = {}) => (req, res, next) => {
    const uploadMiddleware = multiple ?
        multipleFilesUpload(fieldName, maxCount) :
        singleFileUpload(fieldName);

    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    status: "error",
                    message: "File size cannot exceed 5MB"
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    status: "error",
                    message: `Cannot upload more than ${maxCount} files`
                });
            }
            return res.status(400).json({
                status: "error",
                message: err.message
            });
        }
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }
        next();
    });
};

module.exports = {
    handleFileUpload,
    upload // Export upload for custom configurations if needed
};