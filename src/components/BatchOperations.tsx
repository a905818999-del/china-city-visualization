import React, { useState, useRef } from 'react';
import { CityData } from '../types';
import { calculateHeatLevel, CITY_DATABASE } from '../data/cityData';
import { generateCityId, isCityIdExists } from '../utils/idGenerator';
import { findCityInfo } from '../data/extendedCityDatabase';
import './BatchOperations.css';

interface BatchOperationsProps {
  cities: CityData[];
  onDataUpdate: (cities: CityData[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({ cities, onDataUpdate }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importPreview, setImportPreview] = useState<CityData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV导出功能 - 只导出用户可编辑的字段，保护后台字段
  const exportToCSV = () => {
    const headers = [
      'id', 'name', 'searchHeat', 'travelHeat', 'economicHeat', 'population'
    ];
    
    const csvContent = [
      headers.join(','),
      ...cities.map(city => [
        city.id,
        `"${city.name}"`,
        city.searchHeat,
        city.travelHeat,
        city.economicHeat,
        city.population
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `city-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 数据验证函数 - 更新字段验证逻辑
  const validateCityData = (data: any[], startRow: number = 1): ValidationError[] => {
    const errors: ValidationError[] = [];
    const requiredFields = ['name']; // ID可以自动生成，所以不是必填字段
    const numericFields = ['searchHeat', 'travelHeat', 'economicHeat', 'population']; // 只验证用户可编辑的数值字段

    data.forEach((row, index) => {
      const rowNumber = startRow + index;

      // 检查必填字段
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push({
            row: rowNumber,
            field,
            message: `${field} 是必填字段`
          });
        }
      });

      // 检查数值字段
      numericFields.forEach(field => {
        if (row[field] !== undefined && row[field] !== '') {
          const value = parseFloat(row[field]);
          if (isNaN(value)) {
            errors.push({
              row: rowNumber,
              field,
              message: `${field} 必须是有效数字`
            });
          }
        }
      });

      // 检查热度值范围 - 移除0-100限制，只要求非负数
      ['searchHeat', 'travelHeat', 'economicHeat'].forEach(field => {
        if (row[field] !== undefined && row[field] !== '') {
          const value = parseFloat(row[field]);
          if (!isNaN(value) && value < 0) {
            errors.push({
              row: rowNumber,
              field,
              message: `${field} 不能为负数`
            });
          }
        }
      });

      // 检查ID唯一性 - 只对非空ID进行检查
      if (row.id && row.id.toString().trim() !== '') {
        const existingCity = cities.find(city => city.id === row.id);
        if (existingCity) {
          errors.push({
            row: rowNumber,
            field: 'id',
            message: `ID "${row.id}" 已存在`
          });
        }
      }
    });

    return errors;
  };

  // 解析CSV文件
  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  };

  // 尝试不同编码读取文件
  const tryReadWithEncoding = (file: File, encoding: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error(`Failed to read with ${encoding}`));
      
      if (encoding === 'GBK' || encoding === 'GB2312') {
        // 对于GBK/GB2312，我们使用二进制读取然后手动解码
        const binaryReader = new FileReader();
        binaryReader.onload = (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // 尝试使用TextDecoder解码
            try {
              const decoder = new TextDecoder(encoding);
              const text = decoder.decode(uint8Array);
              resolve(text);
            } catch {
              // 如果TextDecoder不支持，回退到UTF-8
              const decoder = new TextDecoder('UTF-8');
              const text = decoder.decode(uint8Array);
              resolve(text);
            }
          } catch (error) {
            reject(error);
          }
        };
        binaryReader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file, encoding);
      }
    });
  };

  // 检测文本是否包含乱码
  const hasGarbledText = (text: string): boolean => {
    // 检测替换字符
    if (text.includes('�')) return true;
    
    // 检测异常的Latin-1字符序列（可能是GBK被错误解码为UTF-8）
    if (/[\u00C0-\u00FF]{2,}/.test(text)) return true;
    
    // 检测其他可能的乱码模式
    if (/[^\u0000-\u007F\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3000-\u303f\uff00-\uffef\s\r\n\t,."'()（）【】《》""''：；，。！？\-_=+*&%$#@!~`|\\\/\[\]{}^]+/.test(text)) {
      return true;
    }
    
    return false;
  };

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('请选择CSV文件');
      return;
    }

    setIsImporting(true);

    try {
      // 尝试不同的编码顺序
      const encodings = ['UTF-8', 'GBK', 'GB2312', 'UTF-16'];
      let csvText = '';
      let successfulEncoding = '';

      for (const encoding of encodings) {
        try {
          csvText = await tryReadWithEncoding(file, encoding);
          
          // 检查是否有乱码
          if (!hasGarbledText(csvText) && csvText.trim().length > 0) {
            successfulEncoding = encoding;
            console.log(`成功使用 ${encoding} 编码读取文件`);
            break;
          }
        } catch (error) {
          console.warn(`使用 ${encoding} 编码读取失败:`, error);
          continue;
        }
      }

      if (!successfulEncoding) {
        // 如果所有编码都失败，使用UTF-8作为最后的尝试
        csvText = await tryReadWithEncoding(file, 'UTF-8');
        successfulEncoding = 'UTF-8';
        console.warn('所有编码尝试都检测到乱码，使用UTF-8继续处理');
      }

      processCsvData(csvText);
    } catch (error) {
      console.error('文件读取错误:', error);
      alert('文件读取失败，请检查文件格式或编码');
      setIsImporting(false);
    }
  };

  // 处理CSV数据的函数
   const processCsvData = (csvText: string) => {
     try {
       const parsedData = parseCSV(csvText);
        
       if (parsedData.length === 0) {
         alert('CSV文件为空或格式不正确');
         setIsImporting(false);
         return;
       }

       // 验证数据
       const errors = validateCityData(parsedData, 2); // 从第2行开始（第1行是标题）
       setValidationErrors(errors);

       if (errors.length === 0) {
         // 转换为CityData格式 - 保护后台字段，移除GDP字段，自动生成ID
         const newCities: CityData[] = parsedData.map(row => {
           const searchHeat = parseFloat(row.searchHeat) || 0;
           const travelHeat = parseFloat(row.travelHeat) || 0;
           const economicHeat = parseFloat(row.economicHeat) || 0;
           const overallHeat = Math.max(searchHeat, travelHeat, economicHeat);

           // 处理ID：如果为空或无效，则自动生成
           let cityId = row.id;
           if (!cityId || cityId.trim() === '') {
             // 获取所有现有的ID（包括当前批次中已生成的ID）
             const existingIds = cities.map(city => city.id);
             cityId = generateCityId(row.name, existingIds);
           }

           // 查找城市数据以保护后台字段
           // 优先级：1. 当前数据中的城市 2. 原始数据库中的城市 3. 扩展数据库 4. 默认值
           const existingCity = cities.find(city => city.id === cityId);
           const originalCity = CITY_DATABASE.find(city => 
             city.id === cityId || 
             city.name === row.name || 
             city.name.includes(row.name) || 
             row.name.includes(city.name)
           );
           
           // 使用扩展数据库进行智能匹配
           const extendedCityInfo = findCityInfo(row.name);

           return {
             id: cityId,
             name: row.name,
             // 保护后台字段：优先使用现有数据，然后是原始数据库，再是扩展数据库，最后是默认值
             province: existingCity?.province || originalCity?.province || extendedCityInfo?.province || '未知省份',
             latitude: existingCity?.latitude || originalCity?.latitude || extendedCityInfo?.latitude || 0,
             longitude: existingCity?.longitude || originalCity?.longitude || extendedCityInfo?.longitude || 0,
             searchHeat,
             travelHeat,
             economicHeat,
             overallHeat,
             heatLevel: calculateHeatLevel(overallHeat),
             population: parseFloat(row.population) || 0
           };
         });

         setImportPreview(newCities);
         setShowPreview(true);
       }
     } catch (error) {
       console.error('解析CSV文件时出错:', error);
       alert('解析CSV文件时出错，请检查文件格式');
     }
     setIsImporting(false);
  };

  // 确认导入数据 - 替换模式：只保留CSV文件中的城市
  const confirmImport = () => {
    // 使用导入的数据替换现有数据，而不是追加
    onDataUpdate(importPreview);
    setShowPreview(false);
    setImportPreview([]);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    alert(`成功导入 ${importPreview.length} 条城市数据，已替换原有数据`);
  };

  // 取消导入
  const cancelImport = () => {
    setShowPreview(false);
    setImportPreview([]);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="batch-operations">
      <div className="batch-operations-header">
        <h3>批量调整功能</h3>
        <p>支持CSV格式的数据导出和导入，自动验证数据完整性</p>
      </div>

      <div className="batch-operations-actions">
        <div className="export-section">
          <h4>数据导出</h4>
          <button 
            className="export-btn"
            onClick={exportToCSV}
            title="导出当前所有城市数据为CSV文件"
          >
            📥 导出CSV文件
          </button>
          <p className="section-desc">将当前所有城市数据导出为CSV格式文件</p>
        </div>

        <div className="import-section">
          <h4>数据导入</h4>
          <div className="import-controls">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="file-input"
            />
            <button 
              className="import-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              📤 {isImporting ? '导入中...' : '选择CSV文件'}
            </button>
          </div>
          <p className="section-desc">
            上传CSV文件导入城市数据。文件应包含以下列：
            <br />
            id (城市ID), name (城市名称), searchHeat (搜索热度), travelHeat (旅游热度), economicHeat (经济热度), population (人口)
            <br />
            <small>注意：province、latitude、longitude为后台字段，不支持导入修改</small>
            <br />
            <small>提示：如果id列为空，系统将根据城市名称自动生成唯一ID</small>
            <br />
            <strong style={{color: '#ef4444'}}>重要：导入将替换所有现有数据，只保留CSV文件中包含的城市</strong>
          </p>
        </div>
      </div>

      {/* 验证错误显示 */}
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h4>数据验证错误</h4>
          <div className="error-list">
            {validationErrors.map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-row">第{error.row}行</span>
                <span className="error-field">{error.field}</span>
                <span className="error-message">{error.message}</span>
              </div>
            ))}
          </div>
          <p className="error-note">请修正以上错误后重新上传文件</p>
        </div>
      )}

      {/* 导入预览 */}
      {showPreview && (
        <div className="import-preview">
          <h4>导入预览</h4>
          <p>即将导入 {importPreview.length} 条城市数据：</p>
          
          <div className="preview-table-container">
            <table className="preview-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>城市名称</th>
                <th>搜索热度</th>
                <th>旅游热度</th>
                <th>经济热度</th>
                <th>人口</th>
              </tr>
            </thead>
              <tbody>
                {importPreview.slice(0, 5).map((city, index) => (
                  <tr key={index}>
                    <td>{city.id}</td>
                    <td>{city.name}</td>
                    <td>{city.searchHeat}</td>
                    <td>{city.travelHeat}</td>
                    <td>{city.economicHeat}</td>
                    <td>{city.population}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {importPreview.length > 5 && (
              <p className="preview-note">... 还有 {importPreview.length - 5} 条数据</p>
            )}
          </div>

          <div className="preview-actions">
            <button className="confirm-btn" onClick={confirmImport}>
              ✅ 确认导入
            </button>
            <button className="cancel-btn" onClick={cancelImport}>
              ❌ 取消导入
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchOperations;