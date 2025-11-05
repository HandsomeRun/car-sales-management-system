/**
 * RateLimiter 单元测试
 * @author 张起灵 (测试工程师)
 * @date 2025-10-19
 */

import assert from 'assert';
import { test } from 'node:test';
import { RateLimiter } from '../../src/middleware/RateLimiter';

test('RateLimiter - 允许限制内的请求', () => {
  const limiter = new RateLimiter(100, 1000); // 100请求/秒

  // 发送 50 次请求，应该全部通过
  for (let i = 0; i < 50; i++) {
    const allowed = limiter.checkLimit('127.0.0.1');
    assert.strictEqual(allowed, true, `第${i + 1}次请求应该被允许`);
  }
});

test('RateLimiter - 拒绝超过限制的请求', () => {
  const limiter = new RateLimiter(10, 1000); // 10请求/秒

  // 发送 10 次请求，应该全部通过
  for (let i = 0; i < 10; i++) {
    limiter.checkLimit('192.168.1.1');
  }

  // 第 11 次请求应该被拒绝
  const allowed = limiter.checkLimit('192.168.1.1');
  assert.strictEqual(allowed, false, '超过限制的请求应该被拒绝');
});

test('RateLimiter - 不同 IP 独立计数', () => {
  const limiter = new RateLimiter(5, 1000);

  // IP1 发送 5 次请求
  for (let i = 0; i < 5; i++) {
    limiter.checkLimit('10.0.0.1');
  }

  // IP2 发送 5 次请求，应该也被允许
  for (let i = 0; i < 5; i++) {
    const allowed = limiter.checkLimit('10.0.0.2');
    assert.strictEqual(allowed, true, `IP2 的第${i + 1}次请求应该被允许`);
  }
});

test('RateLimiter - 时间窗口重置', async () => {
  const limiter = new RateLimiter(5, 100); // 5请求/100毫秒

  // 发送 5 次请求，用尽限额
  for (let i = 0; i < 5; i++) {
    limiter.checkLimit('10.0.1.1');
  }

  // 此时应该被拒绝
  assert.strictEqual(limiter.checkLimit('10.0.1.1'), false);

  // 等待 150 毫秒，窗口重置
  await new Promise(resolve => setTimeout(resolve, 150));

  // 应该又可以请求了
  const allowed = limiter.checkLimit('10.0.1.1');
  assert.strictEqual(allowed, true, '时间窗口重置后应该允许请求');

  // 清理
  limiter.destroy();
});

console.log('RateLimiter 单元测试完成！');

