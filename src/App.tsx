import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChinaMap from './components/ChinaMap';
import SearchPanel from './components/SearchPanel';
import CityDetailPanel from './components/CityDetailPanel';
import CityDataAdmin from './components/CityDataAdmin';
import { CityData } from './types';
import { CITY_DATABASE, searchCities, filterCitiesByHeatLevel, calculateAverageHeat, getTopCity, calculateDynamicHeatLevels, recalculateCityHeatLevels } from './data/cityData';
import { cityDataService } from './services/cityDataService';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ModeToggle = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.9);
    color: #3b82f6;
  }
`;

const Logo = styled.h1`
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 30px;
  color: white;
  font-size: 14px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
`;

const StatLabel = styled.div`
  opacity: 0.9;
  font-size: 12px;
`;

const LoadingOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fee2e2;
  color: #dc2626;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  z-index: 2000;
`;

function App() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [isDetailPanelVisible, setIsDetailPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [dynamicHeatLevels, setDynamicHeatLevels] = useState(calculateDynamicHeatLevels(CITY_DATABASE));

  // 初始化应用
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        console.log('开始加载数据...');
        
        // 直接获取数据，不需要延迟
        const loadedCities = cityDataService.getAllCities();
        console.log('加载的城市数据:', loadedCities.length, '个城市');
        
        setCities(loadedCities);
        setFilteredCities(loadedCities);
        
        // 重新计算动态热度等级
        const updatedDynamicLevels = calculateDynamicHeatLevels(loadedCities);
        setDynamicHeatLevels(updatedDynamicLevels);
        
        setError(null);
        console.log('数据加载完成');
      } catch (err) {
        console.error('数据加载错误:', err);
        setError('数据加载失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
        console.log('设置加载状态为 false');
      }
    };

    initializeApp();
  }, []);

  // 数据更新处理
  const handleDataUpdate = (updatedCities: CityData[]) => {
    // 重新计算动态热度分级
    const updatedDynamicLevels = calculateDynamicHeatLevels(updatedCities);
    setDynamicHeatLevels(updatedDynamicLevels);
    
    // 基于新的分级标准重新计算所有城市的热度等级
    const recalculatedCities = recalculateCityHeatLevels(updatedCities);
    
    setCities(recalculatedCities);
    setFilteredCities(recalculatedCities);
    
    // 更新服务中的数据
    cityDataService.updateAllCities(recalculatedCities);
  };

  // 模式切换
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setSelectedCity(null);
    setIsDetailPanelVisible(false);
  };

  // 搜索处理
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCities(cities);
      return;
    }
    
    // 使用当前的cities数据进行搜索，而不是静态数据库
    const lowerQuery = query.toLowerCase();
    const results = cities.filter(city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.province.toLowerCase().includes(lowerQuery) ||
      city.id.toLowerCase().includes(lowerQuery)
    );
    setFilteredCities(results);
  };

  // 筛选处理
  const handleFilter = (heatLevel?: number) => {
    if (!heatLevel) {
      setFilteredCities(cities);
      return;
    }
    
    // 使用当前的cities数据进行筛选，而不是静态数据库
    const results = cities.filter(city => city.heatLevel === heatLevel);
    setFilteredCities(results);
  };

  // 城市选择处理
  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setIsDetailPanelVisible(true);
  };

  // 关闭详情面板
  const handleCloseDetailPanel = () => {
    setIsDetailPanelVisible(false);
    setTimeout(() => setSelectedCity(null), 300);
  };

  // 计算统计数据
  const stats = {
    totalCities: cities.length,
    avgHeat: cities.reduce((sum, city) => sum + city.overallHeat, 0) / cities.length,
    topCity: cities.reduce((max, city) => city.overallHeat > max.overallHeat ? city : max, cities[0]),
    heatDistribution: cities.reduce((acc, city) => {
      acc[city.heatLevel] = (acc[city.heatLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  };

  if (error) {
    return (
      <AppContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <HeaderLeft>
            <Logo>中国城市数据可视化</Logo>
            <ModeToggle 
              className={isAdminMode ? 'active' : ''}
              onClick={toggleAdminMode}
            >
              {isAdminMode ? '地图模式' : '管理模式'}
            </ModeToggle>
          </HeaderLeft>
          <HeaderStats>
            <StatItem>
              <StatValue>{cities.length}</StatValue>
              <StatLabel>城市总数</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{Math.round(calculateAverageHeat(cities))}</StatValue>
              <StatLabel>平均热度</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{getTopCity(cities)?.name || '暂无'}</StatValue>
              <StatLabel>热度最高</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>100%</StatValue>
              <StatLabel>数据覆盖</StatLabel>
            </StatItem>
          </HeaderStats>
        </HeaderContent>
      </Header>

      <LoadingOverlay isVisible={isLoading}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '20px', color: '#6b7280' }}>正在加载城市数据...</p>
        </div>
      </LoadingOverlay>

      {!isLoading && (
        isAdminMode ? (
          <CityDataAdmin 
            cities={cities}
            onDataUpdate={handleDataUpdate}
          />
        ) : (
          <>
            <ChinaMap
              cities={filteredCities}
              selectedCity={selectedCity}
              onCitySelect={(city) => {
                setSelectedCity(city);
                setIsDetailPanelVisible(true);
              }}
              dynamicHeatLevels={dynamicHeatLevels}
            />

            <SearchPanel
              onSearch={handleSearch}
              onFilter={handleFilter}
              cities={cities}
              searchResults={filteredCities}
              selectedCity={selectedCity}
              onCitySelect={(city) => {
                setSelectedCity(city);
                setIsDetailPanelVisible(true);
              }}
            />

            <CityDetailPanel
              city={selectedCity}
              isVisible={isDetailPanelVisible}
              onClose={() => {
                setIsDetailPanelVisible(false);
                setSelectedCity(null);
              }}
            />
          </>
        )
      )}
    </AppContainer>
  );
}

export default App;