@echo off
echo Starting Qurvia Authentication System Test...
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local file not found!
    echo.
    echo Please run setup-env.bat first to create your environment file.
    echo.
    pause
    exit /b 1
)

echo ✅ Environment file found
echo.

REM Check if MongoDB URI is set
findstr /C:"MONGODB_URI=" .env.local >nul
if errorlevel 1 (
    echo ❌ MONGODB_URI not found in .env.local
    echo Please check your environment configuration.
    pause
    exit /b 1
)

echo ✅ Environment variables configured
echo.

REM Start the development server
echo 🚀 Starting development server...
echo.
echo The server will be available at: http://localhost:3000
echo.
echo Test URLs:
echo - Debug page: http://localhost:3000/debug-registration
echo - Sign up: http://localhost:3000/auth/signup
echo - Sign in: http://localhost:3000/auth/signin
echo - API test: http://localhost:3000/api/check-env
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
