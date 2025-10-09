import React, { useState, useEffect } from 'react';
import { CityData } from '../types';
import { CITY_DATABASE, calculateHeatLevel } from '../data/cityData';
import { generateCityId, isValidCityId, isCityIdExists } from '../utils/idGenerator';
import BatchOperations from './BatchOperations';
import './CityDataAdmin.css';

interface CityDataAdminProps {
  onDataUpdate?: (cities: CityData[]) => void;
}

const CityDataAdmin: React.FC<CityDataAdminProps> = ({ onDataUpdate }) => {
  const [cities, setCities] = useState<CityData[]>(CITY_DATABASE);
  const [editingCity, setEditingCity] = useState<CityData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | ''>('');
  const [autoGenerateId, setAutoGenerateId] = useState(true);

  // 新城市的默认数据
  const getNewCityTemplate = (): CityData => ({
    id: '',
    name: '',
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

  // 过滤城市列表
  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === '' || city.heatLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  // 自动生成ID
  const handleAutoGenerateId = () => {
    if (editingCity && editingCity.name) {
      const generatedId = generateCityId(editingCity.name, cities);
      setEditingCity({...editingCity, id: generatedId});
    }
  };

  // 验证ID
  const validateId = (id: string): string | null => {
    if (!id) return '城市ID不能为空';
    if (!isValidCityId(id)) return 'ID只能包含小写字母、数字和下划线';
    if (!isAddingNew && editingCity && id !== editingCity.id && isCityIdExists(id, cities)) {
      return '该ID已存在';
    }
    if (isAddingNew && isCityIdExists(id, cities)) {
      return '该ID已存在';
    }
    return null;
  };

  // 保存城市数据
  const saveCity = (cityData: CityData) => {
    // 验证ID
    const idError = validateId(cityData.id);
    if (idError) {
      alert(idError);
      return;
    }

    // 自动计算综合热度和热度等级
    const overallHeat = Math.max(cityData.searchHeat, cityData.travelHeat, cityData.economicHeat);
    const heatLevel = calculateHeatLevel(overallHeat);
    
    const updatedCity = {
      ...cityData,
      overallHeat,
      heatLevel,
      // 如果启用自动生成且ID为空，则自动生成
      id: cityData.id || (autoGenerateId ? generateCityId(cityData.name, cities) : `city_${Date.now()}`)
    };

    let updatedCities;
    if (isAddingNew) {
      updatedCities = [...cities, updatedCity];
    } else {
      updatedCities = cities.map(city => 
        city.id === (editingCity?.id || updatedCity.id) ? updatedCity : city
      );
    }

    setCities(updatedCities);
    setEditingCity(null);
    setIsAddingNew(false);
    
    // 通知父组件数据更新
    if (onDataUpdate) {
      onDataUpdate(updatedCities);
    }
  };

  // 删除城市
  const deleteCity = (cityId: string) => {
    if (window.confirm('确定要删除这个城市吗？')) {
      const updatedCities = cities.filter(city => city.id !== cityId);
      setCities(updatedCities);
      
      if (onDataUpdate) {
        onDataUpdate(updatedCities);
      }
    }
  };

  // 开始编辑
  const startEdit = (city: CityData) => {
    setEditingCity({ ...city });
    setIsAddingNew(false);
  };

  // 开始添加新城市
  const startAddNew = () => {
    const newCity = getNewCityTemplate();
    setEditingCity(newCity);
    setIsAddingNew(true);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingCity(null);
    setIsAddingNew(false);
  };

  // 处理批量数据更新
  const handleBatchDataUpdate = (updatedCities: CityData[]) => {
    setCities(updatedCities);
    if (onDataUpdate) {
      onDataUpdate(updatedCities);
    }
  };

  return (
    <div className="city-data-admin">
      <div className="admin-header">
        <h2>城市数据管理平台</h2>
        <button className="btn btn-primary" onClick={startAddNew}>
          + 添加新城市
        </button>
      </div>

      {/* 搜索和过滤 */}
      <div className="admin-filters">
        <div className="filter-group">
          <label>搜索城市：</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入城市名称或省份"
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label>热度等级：</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value === '' ? '' : Number(e.target.value))}
            className="filter-select"
          >
            <option value="">全部等级</option>
            <option value={1}>1级 - 冷门</option>
            <option value={2}>2级 - 一般</option>
            <option value={3}>3级 - 人多</option>
            <option value={4}>4级 - 火爆</option>
            <option value={5}>5级 - 超火爆</option>
          </select>
        </div>
      </div>

      {/* 批量调整功能 */}
      <BatchOperations 
        cities={cities}
        onDataUpdate={handleBatchDataUpdate}
      />

      {/* 编辑表单 */}
      {editingCity && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h3>{isAddingNew ? '添加新城市' : '编辑城市信息'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveCity(editingCity);
            }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>城市ID *</label>
                  <div className="id-input-group">
                    <input
                      type="text"
                      value={editingCity.id}
                      onChange={(e) => setEditingCity({...editingCity, id: e.target.value})}
                      placeholder="输入城市ID或点击自动生成"
                      required
                      className={validateId(editingCity.id) ? 'error' : ''}
                    />
                    <button 
                      type="button" 
                      onClick={handleAutoGenerateId}
                      className="btn btn-small btn-generate"
                      disabled={!editingCity.name}
                      title={!editingCity.name ? '请先输入城市名称' : '根据城市名称自动生成ID'}
                    >
                      自动生成
                    </button>
                  </div>
                  {validateId(editingCity.id) && (
                    <span className="error-message">{validateId(editingCity.id)}</span>
                  )}
                  <small className="help-text">
                    ID应为小写字母、数字和下划线的组合，如：beijing, shanghai
                  </small>
                </div>
                <div className="form-group">
                  <label>城市名称 *</label>
                  <input
                    type="text"
                    value={editingCity.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setEditingCity({...editingCity, name: newName});
                      // 如果启用自动生成且ID为空，实时生成ID
                      if (autoGenerateId && newName && !editingCity.id) {
                        const generatedId = generateCityId(newName, cities);
                        setEditingCity(prev => prev ? {...prev, name: newName, id: generatedId} : null);
                      }
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>省份 *</label>
                  <input
                    type="text"
                    value={editingCity.province}
                    onChange={(e) => setEditingCity({...editingCity, province: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>纬度 *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingCity.latitude}
                    onChange={(e) => setEditingCity({...editingCity, latitude: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>经度 *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingCity.longitude}
                    onChange={(e) => setEditingCity({...editingCity, longitude: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>搜索热度</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCity.searchHeat}
                    onChange={(e) => setEditingCity({...editingCity, searchHeat: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>旅游热度</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCity.travelHeat}
                    onChange={(e) => setEditingCity({...editingCity, travelHeat: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>经济热度</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCity.economicHeat}
                    onChange={(e) => setEditingCity({...editingCity, economicHeat: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>人口</label>
                  <input
                    type="number"
                    value={editingCity.population || ''}
                    onChange={(e) => setEditingCity({...editingCity, population: Number(e.target.value) || undefined})}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 城市列表 */}
      <div className="cities-table">
        <div className="table-header">
          <div>城市</div>
          <div>省份</div>
          <div>搜索热度</div>
          <div>旅游热度</div>
          <div>经济热度</div>
          <div>综合热度</div>
          <div>热度等级</div>
          <div>人口</div>
          <div>操作</div>
        </div>
        {filteredCities.map(city => (
          <div key={city.id} className="table-row">
            <div className="city-name">{city.name}</div>
            <div>{city.province}</div>
            <div>{Math.round(city.searchHeat)}</div>
            <div>{city.travelHeat}</div>
            <div>{city.economicHeat}</div>
            <div>{Math.round(city.overallHeat)}</div>
            <div className={`heat-level level-${city.heatLevel}`}>
              {city.heatLevel}级
            </div>
            <div>{city.population ? Math.round(city.population / 10000) + '万' : '-'}</div>
            <div className="actions">
              <button 
                onClick={() => startEdit(city)}
                className="btn btn-small btn-edit"
              >
                编辑
              </button>
              <button 
                onClick={() => deleteCity(city.id)}
                className="btn btn-small btn-delete"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-stats">
        <p>共 {filteredCities.length} 个城市</p>
      </div>
    </div>
  );
};

export default CityDataAdmin;