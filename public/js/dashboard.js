/**
 * 首页统计面板逻辑
 * @author 虾仁 (前端开发)
 * @date 2025-10-18
 */

/**
 * 加载统计数据
 */
async function loadStats() {
  const loading = document.getElementById('statsLoading');
  const container = document.getElementById('statsContainer');

  try {
    loading.style.display = 'block';
    container.style.display = 'none';

    const stats = await StatsAPI.get();

    document.getElementById('totalCars').textContent = stats.totalCars;
    document.getElementById('availableCars').textContent = stats.availableCars;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('pendingOrders').textContent = stats.pendingOrders;

    loading.style.display = 'none';
    container.style.display = 'block';
  } catch (error) {
    loading.innerHTML = `<p style="color: red;">加载失败：${error.message}</p>`;
  }
}

// 页面加载时获取统计数据
window.addEventListener('DOMContentLoaded', loadStats);

// 每 30 秒自动刷新统计数据
setInterval(loadStats, 30000);

