import React from 'react';
import styled from 'styled-components';
import { CityData } from '../types';

const PanelWrapper = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 50%;
  right: ${props => props.isVisible ? '20px' : '-400px'};
  transform: translateY(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 350px;
  backdrop-filter: blur(10px);
  transition: right 0.3s ease-in-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h2`
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const InfoValue = styled.span`
  color: #1f2937;
  font-weight: 600;
  font-size: 14px;
`;

const HeatLevelBadge = styled.div<{ level: number }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${props => {
    switch (props.level) {
      case 5: return '#991b1b';
      case 4: return '#ef4444';
      case 3: return '#f59e0b';
      case 2: return '#10b981';
      case 1: return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const HeatBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
`;

const HeatFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => props.color};
  transition: width 0.3s ease;
`;

const CoordinateInfo = styled.div`
  background-color: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
`;

const CoordinateText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #64748b;
  font-family: 'Courier New', monospace;
`;

interface CityDetailPanelProps {
  city: CityData | null;
  isVisible: boolean;
  onClose: () => void;
}

const CityDetailPanel: React.FC<CityDetailPanelProps> = ({ city, isVisible, onClose }) => {
  if (!city) return null;

  const heatLevelNames = {
    1: '冷门',
    2: '一般',
    3: '人多', 
    4: '火爆',
    5: '超火爆'
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return Math.round(num / 10000) + '万';
    }
    return num.toLocaleString();
  };

  const getHeatPercentage = (heat: number) => {
    // 基于最大热度值计算百分比
    const maxHeat = 1000; // 假设最大热度为1000
    return Math.min((heat / maxHeat) * 100, 100);
  };

  const getHeatColor = (level: number) => {
    switch (level) {
      case 5: return '#991b1b';
      case 4: return '#ef4444';
      case 3: return '#f59e0b';
      case 2: return '#10b981';
      case 1: return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <PanelWrapper isVisible={isVisible}>
      <Header>
        <Title>{city.name}</Title>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Header>

      <InfoSection>
        <SectionTitle>基本信息</SectionTitle>
        <InfoItem>
          <InfoLabel>所属省份</InfoLabel>
          <InfoValue>{city.province}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>热度等级</InfoLabel>
          <HeatLevelBadge level={city.heatLevel}>
            {heatLevelNames[city.heatLevel as keyof typeof heatLevelNames]}
          </HeatLevelBadge>
        </InfoItem>
        {city.population && (
          <InfoItem>
            <InfoLabel>人口</InfoLabel>
            <InfoValue>{formatNumber(city.population)}人</InfoValue>
          </InfoItem>
        )}
        {city.gdp && (
          <InfoItem>
            <InfoLabel>GDP</InfoLabel>
            <InfoValue>{formatNumber(city.gdp)}万元</InfoValue>
          </InfoItem>
        )}
      </InfoSection>

      <InfoSection>
        <SectionTitle>热度指标</SectionTitle>
        <InfoItem>
          <InfoLabel>综合热度</InfoLabel>
          <InfoValue>{Math.round(city.overallHeat)}</InfoValue>
        </InfoItem>
        <HeatBar>
          <HeatFill 
            percentage={getHeatPercentage(city.overallHeat)} 
            color={getHeatColor(city.heatLevel)}
          />
        </HeatBar>
        
        <InfoItem style={{ marginTop: '15px' }}>
          <InfoLabel>搜索热度</InfoLabel>
          <InfoValue>{Math.round(city.searchHeat)}</InfoValue>
        </InfoItem>
        <HeatBar>
          <HeatFill 
            percentage={getHeatPercentage(city.searchHeat)} 
            color="#3b82f6"
          />
        </HeatBar>
        
        <InfoItem style={{ marginTop: '15px' }}>
          <InfoLabel>旅游热度</InfoLabel>
          <InfoValue>{Math.round(city.travelHeat)}</InfoValue>
        </InfoItem>
        <HeatBar>
          <HeatFill 
            percentage={getHeatPercentage(city.travelHeat)} 
            color="#10b981"
          />
        </HeatBar>
        
        <InfoItem style={{ marginTop: '15px' }}>
          <InfoLabel>经济热度</InfoLabel>
          <InfoValue>{Math.round(city.economicHeat)}</InfoValue>
        </InfoItem>
        <HeatBar>
          <HeatFill 
            percentage={getHeatPercentage(city.economicHeat)} 
            color="#f59e0b"
          />
        </HeatBar>
      </InfoSection>

      <InfoSection>
        <SectionTitle>地理位置</SectionTitle>
        <CoordinateInfo>
          <CoordinateText>
            纬度: {city.latitude.toFixed(4)}°N
          </CoordinateText>
          <CoordinateText>
            经度: {city.longitude.toFixed(4)}°E
          </CoordinateText>
        </CoordinateInfo>
      </InfoSection>
    </PanelWrapper>
  );
};

export default CityDetailPanel;