/**
 * API 调用封装
 * @author 虾仁 (前端开发)
 * @date 2025-10-17
 */

const API_BASE = window.location.origin;

/**
 * 通用 API 调用函数
 */
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || '请求失败');
    }

    return data.data;
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

/**
 * 汽车 API
 */
class CarAPI {
  /**
   * 获取所有汽车
   */
  static async getAll() {
    return apiCall('/api/cars');
  }

  /**
   * 根据 ID 获取汽车
   */
  static async getById(id) {
    return apiCall(`/api/cars/${id}`);
  }

  /**
   * 创建汽车
   */
  static async create(car) {
    return apiCall('/api/cars', {
      method: 'POST',
      body: JSON.stringify(car),
    });
  }

  /**
   * 更新汽车
   */
  static async update(id, car) {
    return apiCall(`/api/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
    });
  }

  /**
   * 删除汽车
   */
  static async delete(id) {
    return apiCall(`/api/cars/${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * 订单 API
 */
class OrderAPI {
  /**
   * 获取所有订单
   */
  static async getAll() {
    return apiCall('/api/orders');
  }

  /**
   * 根据 ID 获取订单
   */
  static async getById(id) {
    return apiCall(`/api/orders/${id}`);
  }

  /**
   * 创建订单
   */
  static async create(order) {
    return apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  /**
   * 更新订单状态
   */
  static async updateStatus(id, status) {
    return apiCall(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * 删除订单
   */
  static async delete(id) {
    return apiCall(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * 统计 API
 */
class StatsAPI {
  /**
   * 获取统计信息
   */
  static async get() {
    return apiCall('/api/stats');
  }
}

