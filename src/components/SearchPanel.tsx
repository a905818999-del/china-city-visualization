import React, { useState } from 'react';
import styled from 'styled-components';
import { CityData } from '../types';

const PanelWrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 15px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ResultsSection = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
`;

const CityItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.isSelected ? '#eff6ff' : 'transparent'};
  border: 2px solid ${props => props.isSelected ? '#3b82f6' : 'transparent'};
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

const CityName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const CityInfo = styled.div`
  font-size: 12px;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeatBadge = styled.span<{ level: number }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
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

const ClearButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

interface SearchPanelProps {
  cities: CityData[];
  onSearch: (query: string) => void;
  onFilter: (heatLevel?: number) => void;
  onCitySelect: (city: CityData) => void;
  selectedCity?: CityData | null;
  searchResults: CityData[];
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  cities,
  onSearch,
  onFilter,
  onCitySelect,
  selectedCity,
  searchResults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeatLevel, setSelectedHeatLevel] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value;
    setSelectedHeatLevel(level);
    onFilter(level ? parseInt(level) : undefined);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedHeatLevel('');
    onSearch('');
    onFilter(undefined);
  };

  const heatLevelNames = {
    1: '冷门',
    2: '一般', 
    3: '人多',
    4: '火爆',
    5: '超火爆'
  };

  return (
    <PanelWrapper>
      <Title>城市搜索</Title>
      
      <SearchInput
        type="text"
        placeholder="搜索城市名称或省份..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      
      <FilterSection>
        <FilterLabel>按热度等级筛选</FilterLabel>
        <FilterSelect value={selectedHeatLevel} onChange={handleFilterChange}>
          <option value="">全部等级</option>
          <option value="5">超火爆 (200+)</option>
          <option value="4">火爆 (130-200)</option>
          <option value="3">人多 (60-130)</option>
          <option value="2">一般 (20-60)</option>
          <option value="1">冷门 (0-20)</option>
        </FilterSelect>
      </FilterSection>

      {(searchQuery || selectedHeatLevel) && (
        <ClearButton onClick={handleClear}>
          清除筛选条件
        </ClearButton>
      )}

      <ResultsSection>
        <FilterLabel>
          搜索结果 ({searchResults.length} 个城市)
        </FilterLabel>
        {searchResults.map((city) => (
          <CityItem
            key={city.id}
            isSelected={selectedCity?.id === city.id}
            onClick={() => onCitySelect(city)}
          >
            <CityName>{city.name}</CityName>
            <CityInfo>
              <span>{city.province}</span>
              <HeatBadge level={city.heatLevel}>
                {heatLevelNames[city.heatLevel as keyof typeof heatLevelNames]}
              </HeatBadge>
            </CityInfo>
            <CityInfo style={{ marginTop: '4px' }}>
              <span>热度: {Math.round(city.overallHeat)}</span>
            </CityInfo>
          </CityItem>
        ))}
        
        {searchResults.length === 0 && (searchQuery || selectedHeatLevel) && (
          <div style={{ 
            textAlign: 'center', 
            color: '#9ca3af', 
            padding: '20px',
            fontStyle: 'italic'
          }}>
            未找到匹配的城市
          </div>
        )}
      </ResultsSection>
    </PanelWrapper>
  );
};

export default SearchPanel;