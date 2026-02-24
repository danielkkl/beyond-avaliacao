@echo off
setlocal

set VERSION=%1
if "%VERSION%"=="" set VERSION=

powershell -ExecutionPolicy Bypass -File "%~dp0create_release_bundle.ps1" -Version "%VERSION%"

endlocal
