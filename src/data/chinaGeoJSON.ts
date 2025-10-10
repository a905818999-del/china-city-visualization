// 中国地理数据 - 优化版本，包含国界和省界
export const chinaGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "中华人民共和国",
        "level": "country"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [73.557692, 39.371115],
          [73.557692, 53.560815],
          [134.773911, 53.560815],
          [134.773911, 18.159829],
          [73.557692, 18.159829],
          [73.557692, 39.371115]
        ]]
      }
    }
  ]
};

// 省份边界数据（简化版）
export const provincesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "北京市",
        "adcode": "110000"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [115.7, 39.4],
          [117.4, 39.4],
          [117.4, 41.6],
          [115.7, 41.6],
          [115.7, 39.4]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "上海市",
        "adcode": "310000"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [120.9, 30.7],
          [122.2, 30.7],
          [122.2, 31.9],
          [120.9, 31.9],
          [120.9, 30.7]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "天津市",
        "adcode": "120000"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [116.8, 38.8],
          [118.4, 38.8],
          [118.4, 40.3],
          [116.8, 40.3],
          [116.8, 38.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "重庆市",
        "adcode": "500000"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [105.3, 28.2],
          [110.2, 28.2],
          [110.2, 32.2],
          [105.3, 32.2],
          [105.3, 28.2]
        ]]
      }
    }
  ]
};
