const fs = require('fs');
const path = require('path');

// 支持的文件类型
const CODE_EXTENSIONS = [
  '.js', '.ts', '.jsx', '.tsx',
  '.html', '.css',
  '.c', '.h', '.cpp', '.py', '.java'
];

// 判断是否为注释或空行
function isCodeLine(line, ext) {
  const trimmed = line.trim();
  if (trimmed === '') return false;

  // JS/TS/React 注释
  if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
    return !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
  }

  // HTML 注释
  if (ext === '.html') {
    return !trimmed.startsWith('<!--');
  }

  // CSS 注释
  if (ext === '.css') {
    return !trimmed.startsWith('/*') && !trimmed.startsWith('*');
  }

  // C/C++ 注释
  if (['.c', '.h', '.cpp'].includes(ext)) {
    return !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
  }

  // Java 注释
  if (ext === '.java') {
    return !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
  }

  // Python 注释
  if (ext === '.py') {
    return !trimmed.startsWith('#');
  }

  // 默认保留
  return true;
}

// 递归读取文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 主函数
function countLinesInDirectory(directory) {
  const allFiles = getAllFiles(directory);
  let totalLines = 0;

  for (let file of allFiles) {
    const ext = path.extname(file);
    if (CODE_EXTENSIONS.includes(ext)) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split(/\r?\n/);
      const codeLines = lines.filter(line => isCodeLine(line, ext)).length;
      console.log(`${file}: ${codeLines} lines`);
      totalLines += codeLines;
    }
  }

  console.log(`\nTotal code lines: ${totalLines}`);
}

// 获取命令行参数
const targetDir = process.argv[2];
if (!targetDir) {
  console.error('请提供目录路径，例如：node countLines.js ./src');
  process.exit(1);
}

countLinesInDirectory(targetDir);
