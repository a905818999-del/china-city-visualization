import { CityData } from '../types';
import { CITY_DATABASE } from '../data/cityData';

const STORAGE_KEY = 'city_data_custom';

export class CityDataService {
  private static instance: CityDataService;
  private cities: CityData[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): CityDataService {
    if (!CityDataService.instance) {
      CityDataService.instance = new CityDataService();
    }
    return CityDataService.instance;
  }

  // 从本地存储加载数据
  private loadData(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cities = JSON.parse(stored);
      } else {
        // 如果没有存储的数据，使用默认数据
        this.cities = [...CITY_DATABASE];
        this.saveData();
      }
    } catch (error) {
      console.error('加载城市数据失败:', error);
      this.cities = [...CITY_DATABASE];
    }
  }

  // 保存数据到本地存储
  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cities));
    } catch (error) {
      console.error('保存城市数据失败:', error);
    }
  }

  // 获取所有城市数据
  public getAllCities(): CityData[] {
    return [...this.cities];
  }

  // 根据ID获取城市
  public getCityById(id: string): CityData | undefined {
    return this.cities.find(city => city.id === id);
  }

  // 添加新城市
  public addCity(city: CityData): boolean {
    try {
      // 检查ID是否已存在
      if (this.cities.some(c => c.id === city.id)) {
        throw new Error(`城市ID "${city.id}" 已存在`);
      }

      // 检查城市名称是否已存在
      if (this.cities.some(c => c.name === city.name && c.province === city.province)) {
        throw new Error(`城市 "${city.name}" 在 "${city.province}" 已存在`);
      }

      this.cities.push(city);
      this.saveData();
      return true;
    } catch (error) {
      console.error('添加城市失败:', error);
      return false;
    }
  }

  // 更新城市数据
  public updateCity(id: string, updatedCity: CityData): boolean {
    try {
      const index = this.cities.findIndex(city => city.id === id);
      if (index === -1) {
        throw new Error(`未找到ID为 "${id}" 的城市`);
      }

      // 如果更改了ID，检查新ID是否已存在
      if (updatedCity.id !== id && this.cities.some(c => c.id === updatedCity.id)) {
        throw new Error(`城市ID "${updatedCity.id}" 已存在`);
      }

      this.cities[index] = updatedCity;
      this.saveData();
      return true;
    } catch (error) {
      console.error('更新城市失败:', error);
      return false;
    }
  }

  // 删除城市
  public deleteCity(id: string): boolean {
    try {
      const index = this.cities.findIndex(city => city.id === id);
      if (index === -1) {
        throw new Error(`未找到ID为 "${id}" 的城市`);
      }

      this.cities.splice(index, 1);
      this.saveData();
      return true;
    } catch (error) {
      console.error('删除城市失败:', error);
      return false;
    }
  }

  // 批量更新城市数据
  public updateAllCities(cities: CityData[]): boolean {
    try {
      this.cities = [...cities];
      this.saveData();
      return true;
    } catch (error) {
      console.error('批量更新城市数据失败:', error);
      return false;
    }
  }

  // 搜索城市
  public searchCities(query: string): CityData[] {
    const lowerQuery = query.toLowerCase();
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.province.toLowerCase().includes(lowerQuery) ||
      city.id.toLowerCase().includes(lowerQuery)
    );
  }

  // 按热度等级过滤城市
  public filterByHeatLevel(level: number): CityData[] {
    return this.cities.filter(city => city.heatLevel === level);
  }

  // 获取统计信息
  public getStatistics() {
    const total = this.cities.length;
    const heatDistribution = this.cities.reduce((acc, city) => {
      acc[city.heatLevel] = (acc[city.heatLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const averageHeat = this.cities.reduce((sum, city) => sum + city.overallHeat, 0) / total;
    
    const topCities = [...this.cities]
      .sort((a, b) => b.overallHeat - a.overallHeat)
      .slice(0, 10);

    return {
      total,
      heatDistribution,
      averageHeat,
      topCities
    };
  }

  // 重置为默认数据
  public resetToDefault(): boolean {
    try {
      this.cities = [...CITY_DATABASE];
      this.saveData();
      return true;
    } catch (error) {
      console.error('重置数据失败:', error);
      return false;
    }
  }

  // 导出数据
  public exportData(): string {
    return JSON.stringify(this.cities, null, 2);
  }

  // 导入数据
  public importData(jsonData: string): boolean {
    try {
      const importedCities = JSON.parse(jsonData) as CityData[];
      
      // 验证数据格式
      if (!Array.isArray(importedCities)) {
        throw new Error('导入的数据格式不正确');
      }

      // 验证每个城市数据的必要字段
      for (const city of importedCities) {
        if (!city.id || !city.name || !city.province || 
            typeof city.latitude !== 'number' || typeof city.longitude !== 'number') {
          throw new Error('导入的城市数据缺少必要字段');
        }
      }

      this.cities = importedCities;
      this.saveData();
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

// 导出单例实例
export const cityDataService = CityDataService.getInstance();