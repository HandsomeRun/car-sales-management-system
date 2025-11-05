/**
 * 限流中间件 - 滑动时间窗口算法
 * @author 季博达 (后端开发 / 并发控制)
 * @date 2025-10-17
 */

import { IncomingMessage } from 'http';

interface RequestRecord {
  count: number;           // 请求次数
  windowStart: number;     // 时间窗口起始时间（毫秒）
}

export class RateLimiter {
  private records: Map<string, RequestRecord> = new Map();
  private readonly limit: number;           // 每秒最大请求数
  private readonly windowSize: number;      // 时间窗口（毫秒）
  private cleanupInterval: NodeJS.Timeout;

  constructor(limit: number = 1000, windowSize: number = 1000) {
    this.limit = limit;
    this.windowSize = windowSize;

    // 定期清理过期记录（每分钟）
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * 检查是否允许请求
   */
  public checkLimit(ip: string): boolean {
    const now = Date.now();
    const record = this.records.get(ip);

    if (!record) {
      // 首次请求
      this.records.set(ip, { count: 1, windowStart: now });
      return true;
    }

    const timeDiff = now - record.windowStart;

    if (timeDiff > this.windowSize) {
      // 超过时间窗口，重置计数器
      this.records.set(ip, { count: 1, windowStart: now });
      return true;
    }

    // 在时间窗口内
    if (record.count < this.limit) {
      record.count++;
      return true;
    }

    // 超过限制
    return false;
  }

  /**
   * 获取客户端 IP
   */
  public static getClientIp(req: IncomingMessage): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
  }

  /**
   * 清理过期记录
   */
  private cleanup(): void {
    const now = Date.now();
    const expireTime = this.windowSize * 10; // 保留 10 个窗口的记录

    this.records.forEach((record, ip) => {
      if (now - record.windowStart > expireTime) {
        this.records.delete(ip);
      }
    });
  }

  /**
   * 获取统计信息
   */
  public getStats() {
    return {
      totalIps: this.records.size,
      limit: this.limit,
      windowSize: this.windowSize,
    };
  }

  /**
   * 销毁（清理定时器）
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

