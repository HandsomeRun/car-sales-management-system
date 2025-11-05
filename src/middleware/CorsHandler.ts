/**
 * CORS 跨域处理中间件
 * @author 季博达 (后端开发)
 * @date 2025-10-17
 */

import { IncomingMessage, ServerResponse } from 'http';

export class CorsHandler {
  private allowedOrigins: string[];
  private allowedMethods: string[];
  private allowedHeaders: string[];

  constructor(
    allowedOrigins: string[] = ['*'],
    allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: string[] = ['Content-Type', 'Authorization']
  ) {
    this.allowedOrigins = allowedOrigins;
    this.allowedMethods = allowedMethods;
    this.allowedHeaders = allowedHeaders;
  }

  /**
   * 设置 CORS 响应头
   */
  public setCorsHeaders(req: IncomingMessage, res: ServerResponse): void {
    const origin = req.headers.origin || '*';

    // 检查是否允许该源
    if (this.allowedOrigins.includes('*') || this.allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', this.allowedMethods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', this.allowedHeaders.join(', '));
    res.setHeader('Access-Control-Max-Age', '86400'); // 24小时
  }

  /**
   * 处理 OPTIONS 预检请求
   */
  public handlePreflight(req: IncomingMessage, res: ServerResponse): boolean {
    if (req.method === 'OPTIONS') {
      this.setCorsHeaders(req, res);
      res.writeHead(204);
      res.end();
      return true;
    }
    return false;
  }
}

