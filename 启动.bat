@echo off
chcp 65001 >nul
echo ========================================
echo   ????????? - ????
echo ========================================
echo.

echo [1/3] ???? API ??...
start /B "" node D:\Documents\???\server\src\app.js
if %errorlevel% neq 0 (
  echo ?????????? Node.js ???
  pause
  exit /b
)
echo  ???????...
timeout /t 4 /nobreak >nul

echo [2/3] ??????...
node -e "var f=require('fs'),p='D:\\Documents\\???\\client\\index.html';f.writeFileSync('D:\\Documents\\???\\client\\index.preview.html',f.readFileSync(p,'utf8').replace('baseURL: '","'/api'","')','baseURL: '","'http://127.0.0.1:4567/api'","')'))"
echo  ??????

echo [3/3] ????????...
start /B "" node -e "var f=require('fs'),p=require('path'),m={'.html':'text/html;charset=utf-8'};require('http').createServer(function(q,r){var fp=p.join('D:\\Documents\\???\\client',q.url==='/'?'index.preview.html':q.url);f.readFile(fp,function(e,d){if(e){r.writeHead(404);r.end('404')}else{r.writeHead(200,{'Content-Type':m[p.extname(fp)]||'text/plain'});r.end(d)}})}).listen(8080,'0.0.0.0',function(){console.log(' ???????')})"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo  ?????
echo  ????????
echo.
echo    http://localhost:8080
echo.
echo ========================================
echo.
echo  ?????????????????
echo.
pause >nul
