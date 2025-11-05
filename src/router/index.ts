/**
 * 路由分发器
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import { IncomingMessage, ServerResponse } from 'http';

export type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params?: Record<string, string>
) => void | Promise<void>;

export interface Route {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  paramNames: string[];
}

export class Router {
  private routes: Route[] = [];

  /**
   * 注册路由
   */
  public register(method: string, path: string, handler: RouteHandler): void {
    const { pattern, paramNames } = this.pathToRegex(path);
    this.routes.push({ method, pattern, handler, paramNames });
  }

  /**
   * GET 请求
   */
  public get(path: string, handler: RouteHandler): void {
    this.register('GET', path, handler);
  }

  /**
   * POST 请求
   */
  public post(path: string, handler: RouteHandler): void {
    this.register('POST', path, handler);
  }

  /**
   * PUT 请求
   */
  public put(path: string, handler: RouteHandler): void {
    this.register('PUT', path, handler);
  }

  /**
   * DELETE 请求
   */
  public delete(path: string, handler: RouteHandler): void {
    this.register('DELETE', path, handler);
  }

  /**
   * 路由匹配
   */
  public match(method: string, url: string): { handler: RouteHandler; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = url.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  /**
   * 将路径转换为正则表达式
   */
  private pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const pattern = path.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });
    return {
      pattern: new RegExp(`^${pattern}$`),
      paramNames,
    };
  }
}

