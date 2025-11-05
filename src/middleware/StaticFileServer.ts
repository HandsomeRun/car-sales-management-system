/**
 * 静态文件服务器中间件
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';

export class StaticFileServer {
  private publicDir: string;
  private mimeTypes: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };

  constructor(publicDir: string) {
    this.publicDir = publicDir;
  }

  /**
   * 处理静态文件请求
   */
  public async handle(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    let url = req.url || '/';
    
    // 移除查询字符串
    url = url.split('?')[0];

    // 如果是根路径，返回 index.html
    if (url === '/') {
      url = '/index.html';
    }

    // 构建文件路径
    const filePath = path.join(this.publicDir, url);

    // 安全检查：防止路径穿越攻击
    if (!filePath.startsWith(this.publicDir)) {
      return false;
    }

    try {
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return false;
      }

      // 检查是否是文件
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        return false;
      }

      // 读取文件
      const content = fs.readFileSync(filePath);

      // 获取 MIME 类型
      const ext = path.extname(filePath);
      const mimeType = this.mimeTypes[ext] || 'application/octet-stream';

      // 发送响应
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);

      return true;
    } catch (error) {
      return false;
    }
  }
}

