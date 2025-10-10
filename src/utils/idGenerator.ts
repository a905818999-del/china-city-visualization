import { CityData } from '../types';

// 中文字符到拼音的映射表（常用城市名称）
const PINYIN_MAP: Record<string, string> = {
  // 直辖市
  '北京': 'beijing',
  '上海': 'shanghai',
  '天津': 'tianjin',
  '重庆': 'chongqing',
  
  // 省会城市
  '广州': 'guangzhou',
  '深圳': 'shenzhen',
  '成都': 'chengdu',
  '杭州': 'hangzhou',
  '武汉': 'wuhan',
  '西安': 'xian',
  '苏州': 'suzhou',
  '郑州': 'zhengzhou',
  '南京': 'nanjing',
  '济南': 'jinan',
  '青岛': 'qingdao',
  '大连': 'dalian',
  '宁波': 'ningbo',
  '厦门': 'xiamen',
  '福州': 'fuzhou',
  '沈阳': 'shenyang',
  '长沙': 'changsha',
  '合肥': 'hefei',
  '南昌': 'nanchang',
  '石家庄': 'shijiazhuang',
  '太原': 'taiyuan',
  '哈尔滨': 'haerbin',
  '长春': 'changchun',
  '昆明': 'kunming',
  '南宁': 'nanning',
  '贵阳': 'guiyang',
  '兰州': 'lanzhou',
  '西宁': 'xining',
  '银川': 'yinchuan',
  '乌鲁木齐': 'wulumuqi',
  '拉萨': 'lasa',
  '呼和浩特': 'huhehaote',
  '海口': 'haikou',
  '三亚': 'sanya',
  
  // 其他重要城市
  '无锡': 'wuxi',
  '常州': 'changzhou',
  '扬州': 'yangzhou',
  '徐州': 'xuzhou',
  '温州': 'wenzhou',
  '嘉兴': 'jiaxing',
  '金华': 'jinhua',
  '绍兴': 'shaoxing',
  '台州': 'taizhou',
  '湖州': 'huzhou',
  '珠海': 'zhuhai',
  '佛山': 'foshan',
  '东莞': 'dongguan',
  '中山': 'zhongshan',
  '江门': 'jiangmen',
  '惠州': 'huizhou',
  '汕头': 'shantou',
  '潮州': 'chaozhou',
  '揭阳': 'jieyang',
  '梅州': 'meizhou',
  '清远': 'qingyuan',
  '韶关': 'shaoguan',
  '河源': 'heyuan',
  '阳江': 'yangjiang',
  '茂名': 'maoming',
  '湛江': 'zhanjiang',
  '肇庆': 'zhaoqing',
  '云浮': 'yunfu',
  '烟台': 'yantai',
  '威海': 'weihai',
  '临沂': 'linyi',
  '潍坊': 'weifang',
  '淄博': 'zibo',
  '东营': 'dongying',
  '济宁': 'jining',
  '泰安': 'taian',
  '聊城': 'liaocheng',
  '德州': 'dezhou',
  '滨州': 'binzhou',
  '菏泽': 'heze',
  '枣庄': 'zaozhuang',
  '日照': 'rizhao',
  '莱芜': 'laiwu',
  '洛阳': 'luoyang',
  '开封': 'kaifeng',
  '安阳': 'anyang',
  '新乡': 'xinxiang',
  '焦作': 'jiaozuo',
  '濮阳': 'puyang',
  '许昌': 'xuchang',
  '漯河': 'luohe',
  '三门峡': 'sanmenxia',
  '南阳': 'nanyang',
  '商丘': 'shangqiu',
  '信阳': 'xinyang',
  '周口': 'zhoukou',
  '驻马店': 'zhumadian',
  '鹤壁': 'hebi',
  '平顶山': 'pingdingshan',
  '宜昌': 'yichang',
  '襄阳': 'xiangyang',
  '荆州': 'jingzhou',
  '黄石': 'huangshi',
  '十堰': 'shiyan',
  '随州': 'suizhou',
  '恩施': 'enshi',
  '黄冈': 'huanggang',
  '咸宁': 'xianning',
  '荆门': 'jingmen',
  '孝感': 'xiaogan',
  '鄂州': 'ezhou',
  '仙桃': 'xiantao',
  '潜江': 'qianjiang',
  '天门': 'tianmen',
  '神农架': 'shennongjia'
};

/**
 * 简单的中文转拼音函数（基于映射表）
 * @param chinese 中文城市名
 * @returns 拼音字符串
 */
function chineseToPinyin(chinese: string): string {
  // 首先检查映射表
  if (PINYIN_MAP[chinese]) {
    return PINYIN_MAP[chinese];
  }
  
  // 如果映射表中没有，使用简单的转换规则
  // 移除常见的城市后缀
  const cleanName = chinese.replace(/[市县区]/g, '');
  
  // 如果清理后的名称在映射表中
  if (PINYIN_MAP[cleanName]) {
    return PINYIN_MAP[cleanName];
  }
  
  // 最后的备选方案：使用城市名的简化版本
  // 这里可以根据需要扩展更复杂的转换逻辑
  return chinese.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 生成唯一的城市ID
 * @param cityName 城市名称
 * @param existingCities 现有城市数据列表
 * @returns 唯一的城市ID
 */
export function generateCityId(cityName: string, existingCities: CityData[]): string {
  // 获取基础拼音ID
  let baseId = chineseToPinyin(cityName);
  
  // 如果基础ID为空或无效，使用备选方案
  if (!baseId || baseId.length === 0) {
    baseId = `city_${Date.now()}`;
  }
  
  // 检查ID是否已存在
  const existingIds = new Set(existingCities.map(city => city.id));
  
  // 如果ID不存在，直接返回
  if (!existingIds.has(baseId)) {
    return baseId;
  }
  
  // 如果ID已存在，添加数字后缀
  let counter = 1;
  let uniqueId = `${baseId}_${counter}`;
  
  while (existingIds.has(uniqueId)) {
    counter++;
    uniqueId = `${baseId}_${counter}`;
  }
  
  return uniqueId;
}

/**
 * 批量生成城市ID
 * @param cityNames 城市名称列表
 * @param existingCities 现有城市数据列表
 * @returns 城市名称到ID的映射
 */
export function generateCityIds(cityNames: string[], existingCities: CityData[]): Record<string, string> {
  const result: Record<string, string> = {};
  const allCities = [...existingCities];
  
  for (const cityName of cityNames) {
    const id = generateCityId(cityName, allCities);
    result[cityName] = id;
    
    // 将新生成的ID添加到临时列表中，避免重复
    allCities.push({
      id,
      name: cityName,
      province: '',
      latitude: 0,
      longitude: 0,
      searchHeat: 0,
      travelHeat: 0,
      economicHeat: 0,
      overallHeat: 0,
      heatLevel: 1,
      population: 0
    });
  }
  
  return result;
}

/**
 * 验证城市ID是否有效
 * @param id 城市ID
 * @returns 是否有效
 */
export function isValidCityId(id: string): boolean {
  // ID应该只包含小写字母、数字和下划线
  return /^[a-z0-9_]+$/.test(id) && id.length > 0;
}

/**
 * 检查城市ID是否已存在
 * @param id 城市ID
 * @param existingCities 现有城市数据列表
 * @returns 是否已存在
 */
export function isCityIdExists(id: string, existingCities: CityData[]): boolean {
  return existingCities.some(city => city.id === id);
}