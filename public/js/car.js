/**
 * 汽车管理页面逻辑
 * @author 虾仁 (前端开发)
 * @date 2025-10-17
 */

let editingCarId = null;

/**
 * 加载汽车列表
 */
async function loadCars() {
  const loading = document.getElementById('loading');
  const container = document.getElementById('carListContainer');
  const tbody = document.getElementById('carList');

  try {
    loading.style.display = 'block';
    container.style.display = 'none';

    const cars = await CarAPI.getAll();
    
    if (cars.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">暂无汽车数据</td></tr>';
    } else {
      tbody.innerHTML = cars.map(car => `
        <tr>
          <td>${car.brand}</td>
          <td>${car.model}</td>
          <td>${car.year}</td>
          <td>¥${car.price.toLocaleString()}</td>
          <td>${car.color}</td>
          <td>${car.stock}</td>
          <td>${getStatusBadge(car.status)}</td>
          <td>
            <div class="actions">
              <button class="btn btn-sm btn-primary" onclick="editCar('${car.id}')">编辑</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCar('${car.id}', '${car.brand} ${car.model}')">删除</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    loading.style.display = 'none';
    container.style.display = 'block';
  } catch (error) {
    loading.innerHTML = `<p style="color: red;">加载失败：${error.message}</p>`;
  }
}

/**
 * 获取状态徽章
 */
function getStatusBadge(status) {
  const badges = {
    available: '<span class="badge badge-success">可售</span>',
    sold: '<span class="badge badge-danger">已售</span>',
    reserved: '<span class="badge badge-warning">预订</span>',
  };
  return badges[status] || status;
}

/**
 * 添加/更新汽车
 */
document.getElementById('carForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const carData = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    year: parseInt(document.getElementById('year').value),
    price: parseFloat(document.getElementById('price').value),
    color: document.getElementById('color').value,
    stock: parseInt(document.getElementById('stock').value),
    description: document.getElementById('description').value || undefined,
  };

  try {
    if (editingCarId) {
      // 更新汽车
      await CarAPI.update(editingCarId, carData);
      alert('汽车更新成功！');
      cancelEdit();
    } else {
      // 添加汽车
      await CarAPI.create(carData);
      alert('汽车添加成功！');
      document.getElementById('carForm').reset();
    }
    
    loadCars();
  } catch (error) {
    alert('操作失败：' + error.message);
  }
});

/**
 * 编辑汽车
 */
async function editCar(id) {
  try {
    const car = await CarAPI.getById(id);
    
    document.getElementById('brand').value = car.brand;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('price').value = car.price;
    document.getElementById('color').value = car.color;
    document.getElementById('stock').value = car.stock;
    document.getElementById('description').value = car.description || '';

    editingCarId = id;
    document.querySelector('#carForm button[type="submit"]').textContent = '更新汽车';
    document.getElementById('cancelEdit').style.display = 'inline-block';

    // 滚动到表单
    document.getElementById('carForm').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    alert('加载汽车信息失败：' + error.message);
  }
}

/**
 * 取消编辑
 */
function cancelEdit() {
  editingCarId = null;
  document.getElementById('carForm').reset();
  document.querySelector('#carForm button[type="submit"]').textContent = '添加汽车';
  document.getElementById('cancelEdit').style.display = 'none';
}

document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

/**
 * 删除汽车
 */
async function deleteCar(id, name) {
  if (!confirm(`确定要删除 ${name} 吗？`)) {
    return;
  }

  try {
    await CarAPI.delete(id);
    alert('汽车删除成功！');
    loadCars();
  } catch (error) {
    alert('删除失败：' + error.message);
  }
}

// 页面加载时获取汽车列表
window.addEventListener('DOMContentLoaded', loadCars);

