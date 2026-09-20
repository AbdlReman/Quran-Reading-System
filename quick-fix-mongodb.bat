@echo off
echo 🔧 Quick MongoDB Fix Tool
echo =========================
echo.

echo Choose your MongoDB setup:
echo 1. Use MongoDB Atlas (cloud database)
echo 2. Use Local MongoDB (install locally)
echo 3. Check current environment
echo.

set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto atlas
if "%choice%"=="2" goto local
if "%choice%"=="3" goto check
goto invalid

:atlas
echo.
echo 🚀 Setting up MongoDB Atlas...
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
echo Updating .env.local with MongoDB Atlas...
(
echo # Database Configuration
echo MONGODB_URI=%MONGODB_URI%
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
echo NEXTAUTH_URL=http://localhost:3000
) > .env.local

echo ✅ MongoDB Atlas configured!
echo.
echo Next steps:
echo 1. Restart your server: npm run dev
echo 2. Test: http://localhost:3000/api/test-connection
echo 3. Try registration: http://localhost:3000/auth/signup
echo.
pause
goto end

:local
echo.
echo 🏠 Setting up Local MongoDB...
echo.
echo Make sure MongoDB is installed and running locally.
echo.

(
echo # Database Configuration
echo MONGODB_URI=mongodb://localhost:27017/qurvia
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
echo NEXTAUTH_URL=http://localhost:3000
) > .env.local

echo ✅ Local MongoDB configured!
echo.
echo Next steps:
echo 1. Start MongoDB: mongod
echo 2. Restart your server: npm run dev
echo 3. Test: http://localhost:3000/api/test-connection
echo.
pause
goto end

:check
echo.
echo 📋 Current Environment Check:
echo.
if exist .env.local (
    echo ✅ .env.local file exists
    echo.
    echo Current MONGODB_URI:
    findstr "MONGODB_URI" .env.local
) else (
    echo ❌ .env.local file not found
)
echo.
pause
goto end

:invalid
echo ❌ Invalid choice! Please enter 1, 2, or 3.
pause
goto end

:end
