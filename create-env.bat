@echo off
echo Creating .env.local file for Qurvia Authentication System...
echo.

REM Create .env.local file with basic configuration
(
echo # Database Configuration
echo MONGODB_URI=mongodb://localhost:27017/qurvia
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
echo NEXTAUTH_URL=http://localhost:3000
echo.
echo # Email Configuration ^(for production^)
echo # EMAIL_SERVER_HOST=smtp.example.com
echo # EMAIL_SERVER_PORT=587
echo # EMAIL_SERVER_USER=your_email@example.com
echo # EMAIL_SERVER_PASSWORD=your_email_password
echo # EMAIL_FROM=noreply@example.com
) > .env.local

echo ✅ .env.local file created successfully!
echo.
echo Configuration:
echo - MONGODB_URI: mongodb://localhost:27017/qurvia
echo - NEXTAUTH_SECRET: your-super-secret-key-change-this-in-production
echo - NEXTAUTH_URL: http://localhost:3000
echo.
echo ⚠️  IMPORTANT: Make sure MongoDB is running on localhost:27017
echo.
echo Next steps:
echo 1. Start MongoDB if not running
echo 2. Restart your development server: npm run dev
echo 3. Test the API: http://localhost:3000/api/check-env
echo.
pause
