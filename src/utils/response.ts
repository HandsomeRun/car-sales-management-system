/**
 * 统一响应格式工具
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import { ApiResponse, ErrorCode } from '../types/Response';

export class ResponseUtil {
  /**
   * 成功响应
   */
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 错误响应
   */
  static error(code: ErrorCode | string, message: string): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 404 Not Found
   */
  static notFound(resource: string): ApiResponse {
    return this.error(ErrorCode.NOT_FOUND, `${resource} not found`);
  }

  /**
   * 400 Bad Request
   */
  static badRequest(message: string): ApiResponse {
    return this.error(ErrorCode.BAD_REQUEST, message);
  }

  /**
   * 500 Internal Server Error
   */
  static internalError(message: string = 'Internal server error'): ApiResponse {
    return this.error(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }

  /**
   * 429 Rate Limit Exceeded
   */
  static rateLimitExceeded(): ApiResponse {
    return this.error(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many requests, please try again later'
    );
  }
}

