#!/bin/bash

# 汽车销售管理系统 - 启动脚本
# @author 吴邪 (DevOps 工程师)
# @date 2025-10-19

echo "========================================"
echo "汽车销售管理系统 - 启动脚本"
echo "========================================"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装成功"
fi

# 启动服务器
echo "🚀 正在启动服务器..."
npm start

