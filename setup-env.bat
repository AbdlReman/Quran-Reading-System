@echo off
echo Setting up environment variables for Qurvia Authentication System...
echo.

REM Check if .env.local exists
if exist .env.local (
    echo .env.local file already exists.
    echo.
    echo Current environment variables:
    echo -----------------------------
    type .env.local
    echo.
    echo.
) else (
    echo Creating .env.local file...
    echo.
)

echo Please enter the following information:
echo.

set /p MONGODB_URI="MongoDB URI (e.g., mongodb://localhost:27017/qurvia): "
set /p NEXTAUTH_SECRET="NextAuth Secret (generate a random string): "
set /p NEXTAUTH_URL="NextAuth URL (default: http://localhost:3000): "

if "%NEXTAUTH_URL%"=="" set NEXTAUTH_URL=http://localhost:3000

echo.
echo Creating .env.local file with the following variables:
echo MONGODB_URI=%MONGODB_URI%
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET%
echo NEXTAUTH_URL=%NEXTAUTH_URL%
echo.

REM Create .env.local file
(
echo # Database Configuration
echo MONGODB_URI=%MONGODB_URI%
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET%
echo NEXTAUTH_URL=%NEXTAUTH_URL%
echo.
echo # Email Configuration (for production)
echo # EMAIL_SERVER_HOST=smtp.example.com
echo # EMAIL_SERVER_PORT=587
echo # EMAIL_SERVER_USER=your_email@example.com
echo # EMAIL_SERVER_PASSWORD=your_email_password
echo # EMAIL_FROM=noreply@example.com
) > .env.local

echo.
echo ✅ Environment file created successfully!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Start the development server: npm run dev
echo 3. Test the registration API
echo.
pause
