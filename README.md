# 中国城市数据可视化平台

一个基于React和Leaflet的交互式地图应用，用于展示和分析中国城市的各种数据指标。

## 🌟 主要功能

### 📊 数据可视化
- **热度地图**: 基于搜索热度、旅游热度、经济热度的综合城市热度可视化
- **动态图例**: 自动计算热度分级，支持自定义颜色方案
- **统计面板**: 实时显示城市总数、有效坐标数量、平均热度等统计信息

### 🗺️ 交互式地图
- **高性能地图渲染**: 基于Leaflet的流畅地图体验
- **城市标记**: 可点击的城市标记，显示详细信息
- **弹出窗口**: 展示城市的坐标、热度数据等详细信息
- **地图控制**: 支持缩放、平移等标准地图操作

### 📏 距离测量工具
- **同心圆显示**: 以任意城市为中心绘制距离同心圆
- **可调参数**: 
  - 圆圈间隔：250km、500km、1000km
  - 最大距离：1500km、2500km、3500km
- **距离计算**: 基于Haversine公式的精确地理距离计算
- **视觉优化**: 渐变透明度、交替颜色、虚线样式

### 🔍 搜索与筛选
- **智能搜索**: 支持城市名称、省份的模糊搜索
- **热度筛选**: 按热度等级筛选城市
- **实时结果**: 搜索结果实时更新

### ⚙️ 数据管理
- **管理员模式**: 支持城市数据的增删改查
- **批量操作**: 支持批量导入、导出城市数据
- **数据验证**: 自动验证坐标格式和数据完整性

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/a905818999-del/city-data-visualization.git
cd city-data-visualization
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:3000`

### 构建生产版本
```bash
npm run build
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **地图库**: Leaflet + React-Leaflet
- **样式**: Styled-Components
- **构建工具**: Vite
- **数据处理**: 自定义城市数据服务

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ChinaMap.tsx    # 主地图组件
│   ├── SearchPanel.tsx # 搜索面板
│   ├── CityDetailPanel.tsx # 城市详情面板
│   ├── CityDataAdmin.tsx   # 数据管理组件
│   └── charts/         # 图表组件
├── data/               # 数据文件
│   ├── cityData.ts     # 城市数据定义
│   ├── chinaGeoJSON.ts # 中国地图GeoJSON数据
│   └── extendedCityDatabase.ts # 扩展城市数据库
├── services/           # 服务层
│   └── cityDataService.ts # 城市数据服务
├── utils/              # 工具函数
│   ├── distanceUtils.ts # 距离计算工具
│   └── idGenerator.ts  # ID生成器
├── types/              # TypeScript类型定义
└── App.tsx            # 主应用组件
```

## 🎯 使用指南

### 基本操作
1. **浏览地图**: 使用鼠标拖拽平移地图，滚轮缩放
2. **查看城市信息**: 点击城市标记查看详细信息
3. **搜索城市**: 在右侧搜索面板输入城市名称或省份
4. **筛选数据**: 使用热度筛选器按等级筛选城市

### 距离测量
1. **启用功能**: 在左上角勾选"显示距离圆圈"
2. **选择中心**: 点击任意城市作为测量中心
3. **调整参数**: 使用下拉菜单调整圆圈间隔和最大距离
4. **查看距离**: 点击其他城市查看到中心点的距离
5. **清除选择**: 点击"清除中心点"重新开始

### 管理员功能
1. **进入管理模式**: 点击右上角"管理员模式"按钮
2. **添加城市**: 填写城市信息并保存
3. **编辑数据**: 点击城市列表中的编辑按钮
4. **批量操作**: 使用导入/导出功能处理大量数据

## 🔧 配置说明

### 热度计算
城市综合热度 = (搜索热度 + 旅游热度 + 经济热度) / 3

### 热度分级
- 🔥 极高 (90-100)
- 🟠 高 (70-89)
- 🟡 中等 (50-69)
- 🟢 较低 (30-49)
- 🔵 低 (0-29)

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue: [GitHub Issues](https://github.com/a905818999-del/city-data-visualization/issues)
- 项目主页: [GitHub Repository](https://github.com/a905818999-del/city-data-visualization)

## 🙏 致谢

- [Leaflet](https://leafletjs.com/) - 优秀的开源地图库
- [React](https://reactjs.com/) - 强大的前端框架
- [OpenStreetMap](https://www.openstreetmap.org/) - 开放的地图数据
