/**
 * API 响应类型定义
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  timestamp: number;
}

export enum ErrorCode {
  // 通用错误
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  
  // 限流错误
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 业务错误
  CAR_NOT_FOUND = 'CAR_NOT_FOUND',
  CAR_OUT_OF_STOCK = 'CAR_OUT_OF_STOCK',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  INVALID_ORDER_STATUS = 'INVALID_ORDER_STATUS',
  
  // 验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

