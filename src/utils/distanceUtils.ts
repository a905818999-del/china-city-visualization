/**
 * 地理距离计算工具函数
 */

/**
 * 使用 Haversine 公式计算两个地理坐标之间的距离
 * @param lat1 第一个点的纬度
 * @param lon1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lon2 第二个点的经度
 * @returns 距离（公里）
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半径（公里）
  
  // 将度数转换为弧度
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * 将度数转换为弧度
 * @param degrees 度数
 * @returns 弧度
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 生成同心圆的半径数组
 * @param maxDistance 最大距离（公里）
 * @param interval 间隔距离（公里，默认500）
 * @returns 半径数组
 */
export function generateCircleRadii(maxDistance: number = 3000, interval: number = 500): number[] {
  const radii: number[] = [];
  for (let radius = interval; radius <= maxDistance; radius += interval) {
    radii.push(radius);
  }
  return radii;
}

/**
 * 计算给定中心点和半径的圆形边界点
 * @param centerLat 中心点纬度
 * @param centerLon 中心点经度
 * @param radiusKm 半径（公里）
 * @param points 边界点数量（默认64）
 * @returns 边界点坐标数组
 */
export function calculateCircleBounds(
  centerLat: number, 
  centerLon: number, 
  radiusKm: number, 
  points: number = 64
): [number, number][] {
  const R = 6371; // 地球半径（公里）
  const bounds: [number, number][] = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const angleRad = toRadians(angle);
    
    // 计算新的纬度
    const newLat = Math.asin(
      Math.sin(toRadians(centerLat)) * Math.cos(radiusKm / R) +
      Math.cos(toRadians(centerLat)) * Math.sin(radiusKm / R) * Math.cos(angleRad)
    );
    
    // 计算新的经度
    const newLon = toRadians(centerLon) + Math.atan2(
      Math.sin(angleRad) * Math.sin(radiusKm / R) * Math.cos(toRadians(centerLat)),
      Math.cos(radiusKm / R) - Math.sin(toRadians(centerLat)) * Math.sin(newLat)
    );
    
    bounds.push([
      newLat * (180 / Math.PI), // 转换回度数
      newLon * (180 / Math.PI)  // 转换回度数
    ]);
  }
  
  return bounds;
}

/**
 * 格式化距离显示
 * @param distanceKm 距离（公里）
 * @returns 格式化的距离字符串
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}米`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}公里`;
  } else {
    return `${Math.round(distanceKm)}公里`;
  }
}