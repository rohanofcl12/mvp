@echo off
echo Setting up Lead Management CRM MVP...
echo.

cd /d "%~dp0"

REM Backend setup
echo [1/4] Setting up backend...
cd crm_project
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt > nul 2>&1
if errorlevel 1 (
    echo Error installing requirements. Make sure Python is installed.
    pause
    exit /b 1
)
python manage.py migrate
if errorlevel 1 (
    echo Migration failed.
    pause
    exit /b 1
)

REM Create superuser (optional - commented out)
REM python manage.py createsuperuser

echo Backend setup complete.
cd ..

REM Frontend setup
echo [2/4] Setting up frontend...
cd crm-frontend
if not exist node_modules (
    npm install
)
cd ..

echo.
echo [3/4] Setup complete!
echo.
echo To run the application:
echo.
echo   Backend: cd crm_project ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo   Frontend: cd crm-frontend ^&^& npm run dev
echo.
echo Default backend: http://localhost:8000
echo Default frontend: http://localhost:5173
echo.
pause