/**
 * 订单管理页面逻辑
 * @author 秦彻 (前端开发 Lead)
 * @date 2025-10-18
 */

let availableCars = [];

async function loadAvailableCars() {
  try {
    const cars = await CarAPI.getAll();
    availableCars = cars.filter(car => car.status === 'available' && car.stock > 0);
    
    const select = document.getElementById('carId');
    select.innerHTML = '<option value="">请选择汽车...</option>' +
      availableCars.map(car => `
        <option value="${car.id}">
          ${car.brand} ${car.model} (${car.year}) - ¥${car.price.toLocaleString()} - 库存:${car.stock}
        </option>
      `).join('');
  } catch (error) {
    console.error('加载汽车列表失败:', error);
  }
}

async function loadOrders() {
  const loading = document.getElementById('loading');
  const container = document.getElementById('orderListContainer');
  const tbody = document.getElementById('orderList');

  try {
    loading.style.display = 'block';
    container.style.display = 'none';

    const [orders, cars] = await Promise.all([
      OrderAPI.getAll(),
      CarAPI.getAll()
    ]);

    const carMap = new Map(cars.map(car => [car.id, car]));
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">暂无订单数据</td></tr>';
    } else {
      tbody.innerHTML = orders.map(order => {
        const car = carMap.get(order.carId);
        const carInfo = car ? `${car.brand} ${car.model}` : '未知车辆';
        
        return `
          <tr>
            <td>${order.id.substring(0, 8)}...</td>
            <td>${order.customerName}</td>
            <td>${order.customerPhone}</td>
            <td>${carInfo}</td>
            <td>${order.quantity}</td>
            <td>¥${order.totalPrice.toLocaleString()}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td>
              <div class="actions">
                ${getStatusActions(order)}
                <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}', '${order.id.substring(0, 8)}')">删除</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    loading.style.display = 'none';
    container.style.display = 'block';
  } catch (error) {
    loading.innerHTML = `<p style="color: red;">加载失败：${error.message}</p>`;
  }
}

function getStatusBadge(status) {
  const badges = {
    pending: '<span class="badge badge-warning">待处理</span>',
    confirmed: '<span class="badge badge-info">已确认</span>',
    completed: '<span class="badge badge-success">已完成</span>',
    cancelled: '<span class="badge badge-danger">已取消</span>',
  };
  return badges[status] || status;
}

function getStatusActions(order) {
  if (order.status === 'pending') {
    return `<button class="btn btn-sm btn-success" onclick="updateStatus('${order.id}', 'confirmed')">确认</button>
            <button class="btn btn-sm btn-danger" onclick="updateStatus('${order.id}', 'cancelled')">取消</button>`;
  } else if (order.status === 'confirmed') {
    return `<button class="btn btn-sm btn-success" onclick="updateStatus('${order.id}', 'completed')">完成</button>`;
  }
  return '';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderData = {
    carId: document.getElementById('carId').value,
    customerName: document.getElementById('customerName').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerEmail: document.getElementById('customerEmail').value,
    quantity: parseInt(document.getElementById('quantity').value),
    notes: document.getElementById('notes').value || undefined,
  };

  try {
    await OrderAPI.create(orderData);
    alert('订单创建成功！');
    document.getElementById('orderForm').reset();
    loadOrders();
    loadAvailableCars();
  } catch (error) {
    alert('创建失败：' + error.message);
  }
});

async function updateStatus(id, status) {
  const confirmMessages = {
    confirmed: '确认此订单',
    completed: '完成此订单',
    cancelled: '取消此订单',
  };

  if (!confirm(`确定要${confirmMessages[status]}吗？`)) {
    return;
  }

  try {
    await OrderAPI.updateStatus(id, status);
    alert('状态更新成功！');
    loadOrders();
    loadAvailableCars();
  } catch (error) {
    alert('更新失败：' + error.message);
  }
}

async function deleteOrder(id, displayId) {
  if (!confirm(`确定要删除订单 ${displayId}... 吗？`)) {
    return;
  }

  try {
    await OrderAPI.delete(id);
    alert('订单删除成功！');
    loadOrders();
    loadAvailableCars();
  } catch (error) {
    alert('删除失败：' + error.message);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadAvailableCars();
  loadOrders();
});

