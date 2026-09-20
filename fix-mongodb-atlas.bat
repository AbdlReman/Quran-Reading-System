@echo off
echo Fixing MongoDB Atlas Connection...
echo.

echo Please enter your MongoDB Atlas connection string:
echo Example: mongodb+srv://username:password@cluster.mongodb.net/database
echo.

set /p MONGODB_URI="MongoDB Atlas URI: "

if "%MONGODB_URI%"=="" (
    echo ❌ No MongoDB URI provided!
    pause
    exit /b 1
)

echo.
echo Updating .env.local file...
echo.

REM Update .env.local file with MongoDB Atlas URI
(
echo # Database Configuration
echo MONGODB_URI=%MONGODB_URI%
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

echo ✅ .env.local file updated with MongoDB Atlas URI!
echo.
echo Configuration:
echo - MONGODB_URI: %MONGODB_URI%
echo - NEXTAUTH_SECRET: your-super-secret-key-change-this-in-production
echo - NEXTAUTH_URL: http://localhost:3000
echo.
echo ⚠️  IMPORTANT: Make sure your MongoDB Atlas credentials are correct!
echo.
echo Next steps:
echo 1. Restart your development server: npm run dev
echo 2. Test the connection: http://localhost:3000/api/test-connection
echo 3. Try registration again
echo.
pause
