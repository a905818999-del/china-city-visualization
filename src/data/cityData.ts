// 城市数据和热度配置
export interface CityInfo {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  population: number;
  gdp: number;
  area: number;
  heatLevel: number;
  staticHeatLevel?: number;
  dynamicHeatLevel?: number;
}

// 热度等级配置
export const HEAT_LEVELS = {
  VERY_LOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  VERY_HIGH: 5
} as const;

// 计算城市热度等级
export function calculateHeatLevel(city: CityInfo): number {
  // 基于人口、GDP和面积的综合评分
  const populationScore = Math.log10(city.population) / 8; // 归一化到0-1
  const gdpScore = Math.log10(city.gdp) / 6; // 归一化到0-1
  const densityScore = Math.log10(city.population / city.area) / 5; // 人口密度
  
  const totalScore = (populationScore * 0.4 + gdpScore * 0.4 + densityScore * 0.2);
  
  if (totalScore >= 0.8) return HEAT_LEVELS.VERY_HIGH;
  if (totalScore >= 0.6) return HEAT_LEVELS.HIGH;
  if (totalScore >= 0.4) return HEAT_LEVELS.MEDIUM;
  if (totalScore >= 0.2) return HEAT_LEVELS.LOW;
  return HEAT_LEVELS.VERY_LOW;
}

// 动态热度计算函数
export function calculateDynamicHeatLevels(cities: CityInfo[]): CityInfo[] {
  return cities.map(city => ({
    ...city,
    dynamicHeatLevel: calculateDynamicHeatLevel(city, cities)
  }));
}

export function calculateDynamicHeatLevel(city: CityInfo, allCities: CityInfo[]): number {
  // 计算相对排名
  const populationRank = allCities.filter(c => c.population > city.population).length + 1;
  const gdpRank = allCities.filter(c => c.gdp > city.gdp).length + 1;
  const densityRank = allCities.filter(c => (c.population / c.area) > (city.population / city.area)).length + 1;
  
  const totalCities = allCities.length;
  const avgRank = (populationRank + gdpRank + densityRank) / 3;
  const percentile = 1 - (avgRank / totalCities);
  
  if (percentile >= 0.8) return HEAT_LEVELS.VERY_HIGH;
  if (percentile >= 0.6) return HEAT_LEVELS.HIGH;
  if (percentile >= 0.4) return HEAT_LEVELS.MEDIUM;
  if (percentile >= 0.2) return HEAT_LEVELS.LOW;
  return HEAT_LEVELS.VERY_LOW;
}

// 重新计算所有城市的热度等级
export function recalculateCityHeatLevels(cities: CityInfo[]): CityInfo[] {
  return cities.map(city => {
    const staticHeatLevel = calculateHeatLevel(city);
    const dynamicHeatLevel = calculateDynamicHeatLevel(city, cities);
    return {
      ...city,
      staticHeatLevel,
      dynamicHeatLevel,
      heatLevel: Math.round((staticHeatLevel + dynamicHeatLevel) / 2)
    };
  });
}

// 城市数据库
export const CITY_DATABASE: CityInfo[] = [
  {
    name: '北京',
    province: '北京市',
    latitude: 39.9042,
    longitude: 116.4074,
    population: 21893095,
    gdp: 4610600,
    area: 16410.54,
    heatLevel: 5
  },
  {
    name: '上海',
    province: '上海市',
    latitude: 31.2304,
    longitude: 121.4737,
    population: 26875500,
    gdp: 4465500,
    area: 6340.5,
    heatLevel: 5
  },
  {
    name: '成都',
    province: '四川省',
    latitude: 30.5728,
    longitude: 104.0668,
    population: 20937757,
    gdp: 2191200,
    area: 14335,
    heatLevel: 4
  },
  {
    name: '重庆',
    province: '重庆市',
    latitude: 29.5647,
    longitude: 106.5507,
    population: 32054159,
    gdp: 2910300,
    area: 82402.95,
    heatLevel: 4
  },
  {
    name: '广州',
    province: '广东省',
    latitude: 23.1291,
    longitude: 113.2644,
    population: 18676605,
    gdp: 2882200,
    area: 7434.4,
    heatLevel: 5
  },
  {
    name: '深圳',
    province: '广东省',
    latitude: 22.5431,
    longitude: 114.0579,
    population: 17560061,
    gdp: 3238700,
    area: 1997.47,
    heatLevel: 5
  },
  {
    name: '西安',
    province: '陕西省',
    latitude: 34.3416,
    longitude: 108.9398,
    population: 12952907,
    gdp: 1143600,
    area: 10108,
    heatLevel: 4
  },
  {
    name: '杭州',
    province: '浙江省',
    latitude: 30.2741,
    longitude: 120.1551,
    population: 12196154,
    gdp: 1810000,
    area: 16853.57,
    heatLevel: 4
  },
  {
    name: '南京',
    province: '江苏省',
    latitude: 32.0603,
    longitude: 118.7969,
    population: 9314685,
    gdp: 1641400,
    area: 6587.02,
    heatLevel: 4
  },
  {
    name: '武汉',
    province: '湖北省',
    latitude: 30.5928,
    longitude: 114.3055,
    population: 13648000,
    gdp: 1886500,
    area: 8569.15,
    heatLevel: 4
  },
  {
    name: '苏州',
    province: '江苏省',
    latitude: 31.2989,
    longitude: 120.5853,
    population: 12748262,
    gdp: 2274600,
    area: 8657.32,
    heatLevel: 4
  },
  {
    name: '青岛',
    province: '山东省',
    latitude: 36.0671,
    longitude: 120.3826,
    population: 10071722,
    gdp: 1441700,
    area: 11293,
    heatLevel: 3
  },
  {
    name: '大连',
    province: '辽宁省',
    latitude: 38.9140,
    longitude: 121.6147,
    population: 7450785,
    gdp: 777100,
    area: 12573.85,
    heatLevel: 3
  },
  {
    name: '厦门',
    province: '福建省',
    latitude: 24.4798,
    longitude: 118.0894,
    population: 5163970,
    gdp: 701100,
    area: 1699.39,
    heatLevel: 3
  },
  {
    name: '银川',
    province: '宁夏回族自治区',
    latitude: 38.4872,
    longitude: 106.2309,
    population: 2859074,
    gdp: 209800,
    area: 9025.38,
    heatLevel: 2
  },
  {
    name: '西宁',
    province: '青海省',
    latitude: 36.6171,
    longitude: 101.7782,
    population: 2467965,
    gdp: 156200,
    area: 7665,
    heatLevel: 2
  },
  {
    name: '拉萨',
    province: '西藏自治区',
    latitude: 29.6520,
    longitude: 91.1721,
    population: 867891,
    gdp: 67800,
    area: 31662,
    heatLevel: 1
  }
];

// 获取热度等级对应的颜色
export function getHeatLevelColor(level: number): string {
  switch (level) {
    case HEAT_LEVELS.VERY_HIGH:
      return '#ff0000'; // 红色
    case HEAT_LEVELS.HIGH:
      return '#ff6600'; // 橙红色
    case HEAT_LEVELS.MEDIUM:
      return '#ffcc00'; // 黄色
    case HEAT_LEVELS.LOW:
      return '#66ff66'; // 浅绿色
    case HEAT_LEVELS.VERY_LOW:
      return '#0066ff'; // 蓝色
    default:
      return '#808080'; // 灰色
  }
}

// 搜索城市
export function searchCities(query: string, cities: CityInfo[] = CITY_DATABASE): CityInfo[] {
  if (!query.trim()) return cities;
  
  const lowerQuery = query.toLowerCase();
  return cities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.province.toLowerCase().includes(lowerQuery)
  );
}

// 按热度等级筛选城市
export function filterCitiesByHeatLevel(heatLevel: number, cities: CityInfo[] = CITY_DATABASE): CityInfo[] {
  return cities.filter(city => city.heatLevel === heatLevel);
}

// 获取城市统计信息
export function getStatistics(cities: CityInfo[] = CITY_DATABASE) {
  const totalCities = cities.length;
  const heatDistribution = {
    [HEAT_LEVELS.VERY_HIGH]: cities.filter(c => c.heatLevel === HEAT_LEVELS.VERY_HIGH).length,
    [HEAT_LEVELS.HIGH]: cities.filter(c => c.heatLevel === HEAT_LEVELS.HIGH).length,
    [HEAT_LEVELS.MEDIUM]: cities.filter(c => c.heatLevel === HEAT_LEVELS.MEDIUM).length,
    [HEAT_LEVELS.LOW]: cities.filter(c => c.heatLevel === HEAT_LEVELS.LOW).length,
    [HEAT_LEVELS.VERY_LOW]: cities.filter(c => c.heatLevel === HEAT_LEVELS.VERY_LOW).length
  };
  
  const topCities = cities
    .sort((a, b) => b.heatLevel - a.heatLevel || b.population - a.population)
    .slice(0, 10);
  
  const averageHeat = calculateAverageHeat(cities);
  
  return {
    totalCities,
    heatDistribution,
    topCities,
    averageHeat
  };
}

// 计算平均热度
export function calculateAverageHeat(cities: CityInfo[] = CITY_DATABASE): number {
  if (cities.length === 0) return 0;
  const totalHeat = cities.reduce((sum, city) => sum + city.heatLevel, 0);
  return Math.round((totalHeat / cities.length) * 100) / 100;
}

// 获取热度最高的城市
export function getTopCity(cities: CityInfo[] = CITY_DATABASE): CityInfo | null {
  if (cities.length === 0) return null;
  return cities.reduce((top, city) => 
    city.heatLevel > top.heatLevel || 
    (city.heatLevel === top.heatLevel && city.population > top.population) 
      ? city : top
  );
}