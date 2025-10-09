import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap, Marker, Circle } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import { CityData, getHeatLevelColor, HeatLevel } from '../data/cityData';
import { generateCircleRadii, calculateDistance, formatDistance } from '../utils/distanceUtils';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

// 样式组件
const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const MapControls = styled.div`
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 1002;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  &::before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const StatsPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1002;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 250px;
`;

const DistanceControls = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 1002;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 280px;
`;

interface ChinaMapProps {
  cities: CityData[];
  selectedCity: CityData | null;
  onCitySelect: (city: CityData) => void;
  dynamicHeatLevels?: HeatLevel[];
}

// 地图中心点控制组件
const MapController: React.FC<{ center: LatLngExpression; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const ChinaMap: React.FC<ChinaMapProps> = ({ cities, selectedCity, onCitySelect, dynamicHeatLevels }) => {
  const [mapCenter] = useState<LatLngExpression>([35.0, 103.0]); // 优化的中国地理中心
  const [mapZoom] = useState(5.2); // 稍微放大以更好地展示中国领土
  const [useBackupTiles, setUseBackupTiles] = useState(false);
  const [textScale, setTextScale] = useState(1.0); // 独立的文字缩放比例
  
  // 同心圆相关状态
  const [circleCenter, setCircleCenter] = useState<CityData | null>(null);
  const [showDistanceCircles, setShowDistanceCircles] = useState(false);
  const [circleInterval, setCircleInterval] = useState(500); // 默认500公里间隔
  const [maxCircleDistance, setMaxCircleDistance] = useState(2500); // 默认最大2500公里

  // 处理城市点击事件
  const handleCityClick = (city: CityData) => {
    onCitySelect(city); // 保持原有的选择功能
    
    // 如果启用了距离圆圈功能，设置为中心点
    if (showDistanceCircles) {
      setCircleCenter(city);
    }
  };

  // 生成同心圆半径数组
  const circleRadii = generateCircleRadii(maxCircleDistance, circleInterval);

  // 清除同心圆中心
  const clearCircleCenter = () => {
    setCircleCenter(null);
  };

  // 过滤有效坐标的城市
  const validCities = cities.filter(city => 
    city.latitude !== 0 && 
    city.longitude !== 0 && 
    !isNaN(city.latitude) && 
    !isNaN(city.longitude) &&
    city.latitude >= -90 && 
    city.latitude <= 90 &&
    city.longitude >= -180 && 
    city.longitude <= 180
  );

  // 计算统计数据
  const stats = {
    total: cities.length,
    validCoordinates: validCities.length,
    byLevel: validCities.reduce((acc, city) => {
      acc[city.heatLevel] = (acc[city.heatLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    avgHeat: validCities.length > 0 ? validCities.reduce((sum, city) => sum + city.overallHeat, 0) / validCities.length : 0
  };

  // 使用动态热度等级配置或默认配置
  const heatLevels = dynamicHeatLevels || [
    { level: 5, name: '超火爆', color: '#991b1b', range: [200, Infinity], description: '搜索热度极高，超级热门 (200+)' },
    { level: 4, name: '火爆', color: '#ef4444', range: [130, 200], description: '搜索热度很高，非常热门 (130-200)' },
    { level: 3, name: '人多', color: '#f59e0b', range: [60, 130], description: '搜索热度较高，人气旺盛 (60-130)' },
    { level: 2, name: '一般', color: '#10b981', range: [20, 60], description: '搜索热度一般，适度关注 (20-60)' },
    { level: 1, name: '冷门', color: '#3b82f6', range: [0, 20], description: '搜索热度较低，游客较少 (0-20)' }
  ];

  // 创建文字标签图标
  const createTextIcon = (city: CityData) => {
    const heatLevel = heatLevels.find(level => level.level === city.heatLevel);
    const color = heatLevel?.color || '#6b7280';
    const fontSize = Math.round(12 * textScale); // 根据缩放比例调整字体大小
    
    return new DivIcon({
      html: `
        <div style="
          color: ${color};
          font-size: ${fontSize}px;
          font-weight: 700;
          white-space: nowrap;
          text-align: center;
          text-shadow: 1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8), 1px -1px 2px rgba(255,255,255,0.8), -1px 1px 2px rgba(255,255,255,0.8);
          pointer-events: auto;
          cursor: pointer;
          transform-origin: center;
        ">
          ${city.name}
        </div>
      `,
      className: 'city-text-marker',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  return (
    <MapWrapper>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        maxZoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxBounds={[
          [20.0, 75.0], // 西南角 - 收紧边界
          [52.0, 132.0] // 东北角 - 收紧边界
        ]}
        maxBoundsViscosity={1.0}
      >
        {/* 主要地图服务 - 无标签地图 */}
        {!useBackupTiles && (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={10}
            onTileError={() => {
              console.warn('Primary no-label tiles failed, switching to backup service');
              setUseBackupTiles(true);
            }}
          />
        )}
        
        {/* 备用地图服务 - 无标签地图 */}
        {useBackupTiles && (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={10}
          />
        )}

        {/* 同心圆 */}
        {showDistanceCircles && circleCenter && circleRadii.map((radius, index) => {
          const opacity = Math.max(0.3, 1 - (index * 0.15)); // 渐变透明度
          const color = index % 2 === 0 ? '#3b82f6' : '#10b981'; // 交替颜色
          
          return (
            <Circle
              key={index}
              center={[circleCenter.latitude, circleCenter.longitude]}
              radius={radius * 1000} // 转换为米
              pathOptions={{
                color: color,
                weight: 2,
                opacity: opacity,
                fillOpacity: 0.05,
                fillColor: color,
                dashArray: index % 2 === 0 ? undefined : '5, 5' // 交替虚线
              }}
            />
          );
        })}

        {/* 中心点标记 */}
        {showDistanceCircles && circleCenter && (
          <Circle
            center={[circleCenter.latitude, circleCenter.longitude]}
            radius={20000} // 20公里半径的小圆点
            pathOptions={{
              color: '#ef4444',
              weight: 3,
              opacity: 1,
              fillOpacity: 0.8,
              fillColor: '#ef4444'
            }}
          />
        )}

        {/* 城市标记 - 只显示有有效坐标的城市 */}
        {validCities.map((city) => (
            <Marker
              key={city.id}
              position={[city.latitude, city.longitude]}
              icon={createTextIcon(city)}
              eventHandlers={{
                click: () => handleCityClick(city),
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>{city.name}</h3>
                  <p style={{ margin: '5px 0', color: '#6b7280' }}>
                    <strong>省份:</strong> {city.province}
                  </p>
                  <p style={{ margin: '5px 0', color: '#6b7280' }}>
                    <strong>综合热度:</strong> {Math.round(city.overallHeat)}
                  </p>
                  <p style={{ margin: '5px 0', color: '#6b7280' }}>
                    <strong>热度等级:</strong> 
                    <span style={{ 
                      color: heatLevels.find(level => level.level === city.heatLevel)?.color || '#6b7280',
                      fontWeight: 'bold',
                      marginLeft: '5px'
                    }}>
                      {city.heatLevel}级 ({heatLevels.find(level => level.level === city.heatLevel)?.name})
                    </span>
                  </p>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                    <p>坐标: {city.latitude.toFixed(4)}°N, {city.longitude.toFixed(4)}°E</p>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                    <p>搜索热度: {city.searchHeat}</p>
                    <p>旅游热度: {city.travelHeat}</p>
                    <p>经济热度: {city.economicHeat}</p>
                  </div>
                  {/* 如果启用了距离圆圈且有中心点，显示距离信息 */}
                  {showDistanceCircles && circleCenter && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#3b82f6', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                      <p><strong>距离 {circleCenter.name}:</strong> {formatDistance(calculateDistance(
                        circleCenter.latitude, circleCenter.longitude,
                        city.latitude, city.longitude
                      ))}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        <MapController center={mapCenter} zoom={mapZoom} />
      </MapContainer>

      {/* 距离控制面板 */}
      <DistanceControls>
        <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px' }}>距离测量工具</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showDistanceCircles}
              onChange={(e) => setShowDistanceCircles(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px', color: '#374151' }}>显示距离圆圈</span>
          </label>
        </div>

        {circleCenter && (
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1f2937', fontWeight: 'bold' }}>
              中心点: {circleCenter.name}
            </p>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              {circleCenter.province} | 热度: {Math.round(circleCenter.overallHeat)}
            </p>
            <button
              onClick={clearCircleCenter}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#ef4444'
              }}
            >
              清除中心点
            </button>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
            圆圈间隔 (公里):
          </label>
          <select
            value={circleInterval}
            onChange={(e) => setCircleInterval(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={250}>250公里</option>
            <option value={500}>500公里</option>
            <option value={1000}>1000公里</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
            最大距离 (公里):
          </label>
          <select
            value={maxCircleDistance}
            onChange={(e) => setMaxCircleDistance(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={1500}>1500公里</option>
            <option value={2500}>2500公里</option>
            <option value={3500}>3500公里</option>
          </select>
        </div>

        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
          <p style={{ margin: '0 0 5px 0' }}>💡 使用说明:</p>
          <p style={{ margin: '0 0 3px 0' }}>1. 勾选"显示距离圆圈"</p>
          <p style={{ margin: '0 0 3px 0' }}>2. 点击任意城市设为中心</p>
          <p style={{ margin: '0' }}>3. 查看同心圆距离范围</p>
        </div>
      </DistanceControls>

      {/* 图例 */}
      <MapControls>
        <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px' }}>热度图例</h3>
        {heatLevels.map((level) => (
          <LegendItem key={level.level} color={level.color}>
            <span style={{ fontSize: '14px', color: '#374151' }}>
              {level.name} ({level.range[1] === Infinity 
                ? `${Math.round(level.range[0])}+` 
                : `${Math.round(level.range[0])}-${Math.round(level.range[1])}`
              })
            </span>
          </LegendItem>
        ))}
        
        <div style={{ marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '14px' }}>文字缩放</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setTextScale(Math.max(0.5, textScale - 0.1))}
              style={{
                padding: '4px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              A-
            </button>
            <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '40px', textAlign: 'center' }}>
              {Math.round(textScale * 100)}%
            </span>
            <button
              onClick={() => setTextScale(Math.min(2.0, textScale + 0.1))}
              style={{
                padding: '4px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              A+
            </button>
            <button
              onClick={() => setTextScale(1.0)}
              style={{
                padding: '4px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#f3f4f6',
                cursor: 'pointer',
                fontSize: '10px',
                marginLeft: '4px'
              }}
            >
              重置
            </button>
          </div>
        </div>
      </MapControls>

      {/* 统计面板 */}
      <StatsPanel>
        <h4 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>数据统计</h4>
        <p style={{ margin: '5px 0', color: '#6b7280' }}>
          <strong>城市总数:</strong> {stats.total}
        </p>
        <p style={{ margin: '5px 0', color: '#6b7280' }}>
          <strong>地图显示:</strong> {stats.validCoordinates}
        </p>
        <p style={{ margin: '5px 0', color: '#6b7280' }}>
          <strong>平均热度:</strong> {Math.round(stats.avgHeat)}
        </p>
        <div style={{ marginTop: '10px' }}>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#9ca3af' }}>各等级分布:</p>
          {heatLevels.map((level) => (
            <p key={level.level} style={{ margin: '2px 0', fontSize: '12px', color: level.color }}>
              {level.name}: {stats.byLevel[level.level] || 0}个
            </p>
          ))}
        </div>
        <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0', fontSize: '11px', color: '#9ca3af' }}>
            地图服务: {useBackupTiles ? 'Voyager无标签 (备用)' : 'Light无标签 (主要)'}
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              backgroundColor: useBackupTiles ? '#f59e0b' : '#10b981',
              borderRadius: '50%',
              marginLeft: '5px'
            }}></span>
          </p>
        </div>
      </StatsPanel>
    </MapWrapper>
  );
};

export default ChinaMap;