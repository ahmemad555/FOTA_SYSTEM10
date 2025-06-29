const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectMongoose = require("./utils/connectMongoose");
const Logger = require("./utils/logger");
const path = require('path');
// تهيئة متغيرات البيئة
dotenv.config(); 

const app = express(); 
const port = process.env.PORT || 3000; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`, {
        query: req.query,
        body: req.body,
        ip: req.ip
    });
    next();
});
 
// Routes

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const uploadRoutes=require("./routes/uploadRoutes")
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/upload",uploadRoutes)

app.get("*", (req, res) => { 
    Logger.info('Root endpoint accessed');  
    res.send("not found api");
});

// Error handling middleware
app.use((err, req, res, next) => {
    // تسجيل تفاصيل الخطأ
    Logger.error('Server Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode || 500,
        body: req.body,
        params: req.params,
        query: req.query
    });
    
    // إرسال رسالة الخطأ للمستخدم
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// تشغيل السيرفر والاتصال بقاعدة البيانات
(async () => {
    try {
        // الاتصال بقاعدة البيانات
        await connectMongoose.connectDB(); 
        
        // تشغيل السيرفر
        app.listen(port, () => {
            Logger.info(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        Logger.error('Failed to start server:', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
})();








const User = require('./models/user'); // أو المسار المناسب

async function removeUserIndexes() {
  try {
    await User.collection.dropIndex("email_1"); // اسم الـ index غالبًا بيبقى بهذا الشكل: اسم_الحقل_1
    console.log("Index userId_1 has been removed.");
  } catch (error) {
    if (error.codeName === 'IndexNotFound') {
      console.log("Index not found. No action taken.");
    } else {
      console.error("Error while removing index:", error);
    }
  }
}
 
// removeUserIndexes();
 