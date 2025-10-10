import React, { useState, useRef } from 'react';
import { City } from '../types/City';
import './BatchOperations.css';

interface BatchOperationsProps {
  cities: City[];
  onImport: (cities: City[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportPreview {
  validCities: City[];
  errors: ValidationError[];
  totalRows: number;
}

// 扩展城市数据库，用于智能匹配
const EXTENDED_CITY_DATABASE = [
  // 直辖市
  { name: '北京', province: '北京市', aliases: ['北京市', 'Beijing', 'Peking'] },
  { name: '上海', province: '上海市', aliases: ['上海市', 'Shanghai'] },
  { name: '天津', province: '天津市', aliases: ['天津市', 'Tianjin'] },
  { name: '重庆', province: '重庆市', aliases: ['重庆市', 'Chongqing'] },
  
  // 省会城市
  { name: '广州', province: '广东省', aliases: ['广州市', 'Guangzhou', 'Canton'] },
  { name: '深圳', province: '广东省', aliases: ['深圳市', 'Shenzhen'] },
  { name: '杭州', province: '浙江省', aliases: ['杭州市', 'Hangzhou'] },
  { name: '南京', province: '江苏省', aliases: ['南京市', 'Nanjing', 'Nanking'] },
  { name: '武汉', province: '湖北省', aliases: ['武汉市', 'Wuhan'] },
  { name: '成都', province: '四川省', aliases: ['成都市', 'Chengdu'] },
  { name: '西安', province: '陕西省', aliases: ['西安市', 'Xian', "Xi'an"] },
  { name: '郑州', province: '河南省', aliases: ['郑州市', 'Zhengzhou'] },
  { name: '济南', province: '山东省', aliases: ['济南市', 'Jinan'] },
  { name: '青岛', province: '山东省', aliases: ['青岛市', 'Qingdao'] },
  { name: '大连', province: '辽宁省', aliases: ['大连市', 'Dalian'] },
  { name: '沈阳', province: '辽宁省', aliases: ['沈阳市', 'Shenyang'] },
  { name: '长春', province: '吉林省', aliases: ['长春市', 'Changchun'] },
  { name: '哈尔滨', province: '黑龙江省', aliases: ['哈尔滨市', 'Harbin'] },
  { name: '石家庄', province: '河北省', aliases: ['石家庄市', 'Shijiazhuang'] },
  { name: '太原', province: '山西省', aliases: ['太原市', 'Taiyuan'] },
  { name: '呼和浩特', province: '内蒙古自治区', aliases: ['呼和浩特市', 'Hohhot'] },
  { name: '兰州', province: '甘肃省', aliases: ['兰州市', 'Lanzhou'] },
  { name: '西宁', province: '青海省', aliases: ['西宁市', 'Xining'] },
  { name: '银川', province: '宁夏回族自治区', aliases: ['银川市', 'Yinchuan'] },
  { name: '乌鲁木齐', province: '新疆维吾尔自治区', aliases: ['乌鲁木齐市', 'Urumqi'] },
  { name: '拉萨', province: '西藏自治区', aliases: ['拉萨市', 'Lhasa'] },
  { name: '昆明', province: '云南省', aliases: ['昆明市', 'Kunming'] },
  { name: '贵阳', province: '贵州省', aliases: ['贵阳市', 'Guiyang'] },
  { name: '南宁', province: '广西壮族自治区', aliases: ['南宁市', 'Nanning'] },
  { name: '海口', province: '海南省', aliases: ['海口市', 'Haikou'] },
  { name: '福州', province: '福建省', aliases: ['福州市', 'Fuzhou'] },
  { name: '南昌', province: '江西省', aliases: ['南昌市', 'Nanchang'] },
  { name: '长沙', province: '湖南省', aliases: ['长沙市', 'Changsha'] },
  { name: '合肥', province: '安徽省', aliases: ['合肥市', 'Hefei'] },
];

const BatchOperations: React.FC<BatchOperationsProps> = ({ cities, onImport }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 导出CSV
  const handleExport = () => {
    const headers = [
      'ID', '城市名称', '省份', '纬度', '经度', 
      '搜索热度', '旅游热度', '经济热度', '人口', 'GDP'
    ];
    
    const csvContent = [
      headers.join(','),
      ...cities.map(city => [
        city.id,
        `"${city.name}"`,
        `"${city.province}"`,
        city.lat || '',
        city.lng || '',
        city.searchHeat || '',
        city.travelHeat || '',
        city.economicHeat || '',
        city.population || '',
        city.gdp || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cities_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 智能匹配城市信息
  const smartMatchCity = (cityName: string, provinceName?: string) => {
    const normalizedCityName = cityName.trim().replace(/市$/, '');
    const normalizedProvinceName = provinceName?.trim().replace(/省$|市$|自治区$|特别行政区$/, '');

    // 首先尝试精确匹配
    let match = EXTENDED_CITY_DATABASE.find(city => 
      city.name === normalizedCityName || city.aliases.includes(cityName.trim())
    );

    // 如果有省份信息，进一步筛选
    if (match && normalizedProvinceName) {
      const provinceMatch = EXTENDED_CITY_DATABASE.find(city => 
        (city.name === normalizedCityName || city.aliases.includes(cityName.trim())) &&
        city.province.includes(normalizedProvinceName)
      );
      if (provinceMatch) {
        match = provinceMatch;
      }
    }

    return match;
  };

  // 验证城市数据
  const validateCityData = (data: any[], startRow: number = 2): ImportPreview => {
    const validCities: City[] = [];
    const errors: ValidationError[] = [];
    let currentId = Math.max(...cities.map(c => c.id), 0) + 1;

    data.forEach((row, index) => {
      const rowNumber = startRow + index;
      const city: Partial<City> = {};
      
      // 验证必填字段
      if (!row.name && !row['城市名称'] && !row['city'] && !row['City']) {
        errors.push({
          row: rowNumber,
          field: '城市名称',
          message: '城市名称不能为空',
          value: row.name || row['城市名称'] || row['city'] || row['City']
        });
        return;
      }

      // 提取城市名称
      const cityName = row.name || row['城市名称'] || row['city'] || row['City'];
      const provinceName = row.province || row['省份'] || row['Province'];
      
      // 智能匹配城市信息
      const matchedCity = smartMatchCity(cityName, provinceName);
      
      city.id = row.id || row['ID'] || currentId++;
      city.name = cityName.trim();
      city.province = provinceName?.trim() || matchedCity?.province || '未知省份';
      
      // 验证并转换数值字段
      const numericFields = [
        { key: 'lat', names: ['lat', '纬度', 'latitude', 'Latitude'], required: false },
        { key: 'lng', names: ['lng', '经度', 'longitude', 'Longitude'], required: false },
        { key: 'searchHeat', names: ['searchHeat', '搜索热度', 'search_heat', 'Search Heat'], required: false },
        { key: 'travelHeat', names: ['travelHeat', '旅游热度', 'travel_heat', 'Travel Heat'], required: false },
        { key: 'economicHeat', names: ['economicHeat', '经济热度', 'economic_heat', 'Economic Heat'], required: false },
        { key: 'population', names: ['population', '人口', 'Population'], required: false },
        { key: 'gdp', names: ['gdp', 'GDP', 'Gdp'], required: false }
      ];

      numericFields.forEach(field => {
        const value = field.names.reduce((acc, name) => acc || row[name], undefined);
        
        if (value !== undefined && value !== null && value !== '') {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            errors.push({
              row: rowNumber,
              field: field.names[0],
              message: `${field.names[0]} 必须是有效数字`,
              value: value
            });
          } else if (field.key.includes('Heat') && numValue < 0) {
            errors.push({
              row: rowNumber,
              field: field.names[0],
              message: `${field.names[0]} 不能为负数`,
              value: numValue
            });
          } else {
            (city as any)[field.key] = numValue;
          }
        }
      });

      // 验证ID唯一性
      if (cities.some(existingCity => existingCity.id === city.id) || 
          validCities.some(newCity => newCity.id === city.id)) {
        errors.push({
          row: rowNumber,
          field: 'ID',
          message: `ID ${city.id} 已存在`,
          value: city.id
        });
        city.id = currentId++;
      }

      validCities.push(city as City);
    });

    return {
      validCities,
      errors,
      totalRows: data.length
    };
  };

  // 检测文本编码和乱码
  const detectGarbledText = (text: string): boolean => {
    // 检测常见的乱码模式
    const garbledPatterns = [
      /[\u00C0-\u00FF]{2,}/, // 连续的拉丁扩展字符
      /\?{2,}/, // 连续的问号
      /\ufffd/, // 替换字符
      /[\u0080-\u00FF]{3,}/ // 连续的高位字符
    ];
    
    return garbledPatterns.some(pattern => pattern.test(text));
  };

  // 尝试不同编码解析文件
  const tryParseWithEncoding = async (file: File, encoding: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      
      if (encoding === 'utf-8') {
        reader.readAsText(file, 'utf-8');
      } else if (encoding === 'gbk' || encoding === 'gb2312') {
        // 对于GBK/GB2312，我们尝试使用TextDecoder
        const arrayReader = new FileReader();
        arrayReader.onload = (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const decoder = new TextDecoder(encoding);
            const text = decoder.decode(arrayBuffer);
            resolve(text);
          } catch (error) {
            // 如果TextDecoder失败，回退到UTF-8
            reader.readAsText(file, 'utf-8');
          }
        };
        arrayReader.readAsArrayBuffer(file);
        return;
      } else {
        reader.readAsText(file, encoding);
      }
    });
  };

  // 处理CSV文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      const encodings = ['utf-8', 'gbk', 'gb2312', 'utf-16'];
      let csvText = '';
      let bestEncoding = 'utf-8';
      
      // 尝试不同编码
      for (const encoding of encodings) {
        try {
          const text = await tryParseWithEncoding(file, encoding);
          if (!detectGarbledText(text)) {
            csvText = text;
            bestEncoding = encoding;
            break;
          }
        } catch (error) {
          console.warn(`Failed to parse with ${encoding}:`, error);
        }
      }
      
      if (!csvText) {
        // 如果所有编码都失败，使用UTF-8作为最后尝试
        csvText = await tryParseWithEncoding(file, 'utf-8');
      }

      // 解析CSV
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        alert('CSV文件格式错误：至少需要包含标题行和一行数据');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      const preview = validateCityData(data);
      setImportPreview(preview);
      setShowPreview(true);
      
    } catch (error) {
      console.error('文件解析错误:', error);
      alert('文件解析失败，请检查文件格式');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 确认导入
  const handleConfirmImport = () => {
    if (importPreview?.validCities) {
      onImport(importPreview.validCities);
      setShowPreview(false);
      setImportPreview(null);
    }
  };

  // 取消导入
  const handleCancelImport = () => {
    setShowPreview(false);
    setImportPreview(null);
  };

  return (
    <div className="batch-operations">
      <div className="batch-operations-header">
        <h3>批量操作</h3>
      </div>
      
      <div className="batch-operations-actions">
        <div className="export-section">
          <h4>导出数据</h4>
          <button 
            className="export-btn"
            onClick={handleExport}
            title="导出当前所有城市数据为CSV文件"
          >
            📥 导出CSV
          </button>
        </div>
        
        <div className="import-section">
          <h4>导入数据</h4>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="import-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            title="从CSV文件导入城市数据"
          >
            {isImporting ? '📤 解析中...' : '📤 导入CSV'}
          </button>
          <div className="import-tips">
            <p>支持的CSV格式：</p>
            <ul>
              <li>必填：城市名称</li>
              <li>可选：省份、纬度、经度、各类热度、人口、GDP</li>
              <li>支持UTF-8、GBK、GB2312编码</li>
              <li>支持智能城市信息匹配</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 导入预览弹窗 */}
      {showPreview && importPreview && (
        <div className="import-preview-overlay">
          <div className="import-preview-modal">
            <div className="import-preview-header">
              <h3>导入预览</h3>
              <button 
                className="close-btn"
                onClick={handleCancelImport}
              >
                ✕
              </button>
            </div>
            
            <div className="import-preview-stats">
              <p>总行数: {importPreview.totalRows}</p>
              <p>有效数据: {importPreview.validCities.length}</p>
              <p>错误数量: {importPreview.errors.length}</p>
            </div>

            {/* 错误列表 */}
            {importPreview.errors.length > 0 && (
              <div className="validation-errors">
                <h4>验证错误</h4>
                <div className="error-list">
                  {importPreview.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="error-item">
                      <span className="error-row">第{error.row}行</span>
                      <span className="error-field">{error.field}</span>
                      <span className="error-message">{error.message}</span>
                      <span className="error-value">值: {String(error.value)}</span>
                    </div>
                  ))}
                  {importPreview.errors.length > 10 && (
                    <p className="error-more">还有 {importPreview.errors.length - 10} 个错误...</p>
                  )}
                </div>
              </div>
            )}

            {/* 预览表格 */}
            <div className="import-preview-table">
              <h4>数据预览 (前10条)</h4>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>城市名称</th>
                    <th>省份</th>
                    <th>搜索热度</th>
                    <th>旅游热度</th>
                    <th>经济热度</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.validCities.slice(0, 10).map((city, index) => (
                    <tr key={index}>
                      <td>{city.id}</td>
                      <td>{city.name}</td>
                      <td>{city.province}</td>
                      <td>{city.searchHeat || '-'}</td>
                      <td>{city.travelHeat || '-'}</td>
                      <td>{city.economicHeat || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="import-preview-actions">
              <button 
                className="cancel-btn"
                onClick={handleCancelImport}
              >
                取消
              </button>
              <button 
                className="confirm-btn"
                onClick={handleConfirmImport}
                disabled={importPreview.validCities.length === 0}
              >
                确认导入 ({importPreview.validCities.length} 条)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchOperations;