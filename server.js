const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const BASE_DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`📥 请求: ${req.method} ${req.url}`);
    
    // 健康检查端点
    if (req.url === '/' || req.url === '/health' || req.url === '/api/health') {
        const indexPath = path.join(BASE_DIR, 'index.html');
        
        fs.readFile(indexPath, (err, data) => {
            if (err) {
                console.error('❌ 读取文件失败:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            res.writeHead(200, { 
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        });
        return;
    }
    
    // 处理静态文件
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(BASE_DIR, 'public', filePath);
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 服务器运行中: http://localhost:${PORT}`);
    console.log(`📍 健康检查: http://localhost:${PORT}/health`);
});
