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

      {/* 图例和控制面板 */}
      <MapControls>
        <h4 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px' }}>热度等级图例</h4>
        {heatLevels.map((level) => (
          <LegendItem key={level.level} color={level.color}>
            <span style={{ fontSize: '14px', color: '#374151' }}>
              {level.level}级 - {level.name}
            </span>
          </LegendItem>
        ))}
        
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '14px' }}>文字大小</h4>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={textScale}
            onChange={(e) => setTextScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '5px' }}>
            {Math.round(textScale * 100)}%
          </div>
        </div>
      </MapControls>

      {/* 距离测量控制面板 */}
      <DistanceControls>
        <h4 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px' }}>距离测量工具</h4>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#374151' }}>
            <input
              type="checkbox"
              checked={showDistanceCircles}
              onChange={(e) => {
                setShowDistanceCircles(e.target.checked);
                if (!e.target.checked) {
                  setCircleCenter(null);
                }
              }}
              style={{ marginRight: '8px' }}
            />
            启用距离圆圈
          </label>
        </div>

        {showDistanceCircles && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '5px' }}>
                圆圈间隔 (公里):
              </label>
              <input
                type="number"
                min="100"
                max="1000"
                step="100"
                value={circleInterval}
                onChange={(e) => setCircleInterval(Number(e.target.value))}
                style={{ width: '100%', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '5px' }}>
                最大距离 (公里):
              </label>
              <input
                type="number"
                min="500"
                max="5000"
                step="500"
                value={maxCircleDistance}
                onChange={(e) => setMaxCircleDistance(Number(e.target.value))}
                style={{ width: '100%', padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>

            {circleCenter && (
              <div style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600' }}>
                  中心点: {circleCenter.name}
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                  {circleCenter.province}
                </div>
              </div>
            )}

            <button
              onClick={clearCircleCenter}
              disabled={!circleCenter}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: circleCenter ? '#ef4444' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: circleCenter ? 'pointer' : 'not-allowed'
              }}
            >
              清除中心点
            </button>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
              点击任意城市设置为距离测量中心点
            </div>
          </>
        )}
      </DistanceControls>

      {/* 统计面板 */}
      <StatsPanel>
        <h4 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px' }}>数据统计</h4>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
          <p style={{ margin: '5px 0' }}>总城市数: <strong>{stats.total}</strong></p>
          <p style={{ margin: '5px 0' }}>有效坐标: <strong>{stats.validCoordinates}</strong></p>
          <p style={{ margin: '5px 0' }}>平均热度: <strong>{Math.round(stats.avgHeat)}</strong></p>
          
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ margin: '5px 0', fontSize: '13px', color: '#6b7280' }}>各等级分布:</p>
            {Object.entries(stats.byLevel)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([level, count]) => (
                <p key={level} style={{ margin: '3px 0', fontSize: '12px', color: '#6b7280' }}>
                  {level}级: {count}个
                </p>
              ))
            }
          </div>
        </div>
      </StatsPanel>
    </MapWrapper>
  );
};

export default ChinaMap;