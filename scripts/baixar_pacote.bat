@echo off
setlocal

set VERSION=%1
if "%VERSION%"=="" set VERSION=

call "%~dp0create_release_bundle.bat" %VERSION%

echo.
echo Pacote gerado em dist-release\
echo.
start "" explorer dist-release

endlocal
