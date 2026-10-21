@echo off
setlocal
cd /d "%~dp0"
set "GALLA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%GALLA_NODE%" (
  "%GALLA_NODE%" server/preview.mjs
) else (
  node server/preview.mjs
)
pause
