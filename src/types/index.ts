// 城市数据接口
export interface CityData {
  id: string;
  name: string;
  province: string; // 后台字段，不导出
  latitude: number; // 后台字段，不导出
  longitude: number; // 后台字段，不导出
  searchHeat: number; // 整体日平均值
  travelHeat: number; // 移动日均值
  economicHeat: number; // 资讯指数日均值
  overallHeat: number; // 综合热度
  heatLevel: 1 | 2 | 3 | 4 | 5; // 热度等级
  population?: number; // 高铁路程
  area?: number;
}

// 热度等级定义
export interface HeatLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  color: string;
  range: [number, number];
  description: string;
}

// 地图配置
export interface MapConfig {
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

// 搜索结果
export interface SearchResult {
  cities: CityData[];
  total: number;
  page: number;
  pageSize: number;
}

// 统计数据
export interface Statistics {
  totalCities: number;
  heatDistribution: Record<number, number>;
  topCities: CityData[];
  averageHeat: number;
}