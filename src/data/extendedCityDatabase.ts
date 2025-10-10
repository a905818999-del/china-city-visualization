// 扩展的中国城市地理信息数据库
export interface ExtendedCityInfo {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  aliases?: string[]; // 城市别名
}

// 中国主要城市地理信息数据库
export const EXTENDED_CITY_DATABASE: ExtendedCityInfo[] = [
  // 直辖市
  { name: '北京', province: '北京市', latitude: 39.9042, longitude: 116.4074, aliases: ['北京市', '京'] },
  { name: '上海', province: '上海市', latitude: 31.2304, longitude: 121.4737, aliases: ['上海市', '沪'] },
  { name: '天津', province: '天津市', latitude: 39.3434, longitude: 117.3616, aliases: ['天津市', '津'] },
  { name: '重庆', province: '重庆市', latitude: 29.5647, longitude: 106.5507, aliases: ['重庆市', '渝'] },

  // 省会城市
  { name: '石家庄', province: '河北省', latitude: 38.0428, longitude: 114.5149, aliases: ['石家庄市'] },
  { name: '太原', province: '山西省', latitude: 37.8706, longitude: 112.5489, aliases: ['太原市'] },
  { name: '呼和浩特', province: '内蒙古自治区', latitude: 40.8414, longitude: 111.7519, aliases: ['呼和浩特市', '呼市'] },
  { name: '沈阳', province: '辽宁省', latitude: 41.8057, longitude: 123.4315, aliases: ['沈阳市'] },
  { name: '长春', province: '吉林省', latitude: 43.8171, longitude: 125.3235, aliases: ['长春市'] },
  { name: '哈尔滨', province: '黑龙江省', latitude: 45.8038, longitude: 126.5349, aliases: ['哈尔滨市'] },
  { name: '南京', province: '江苏省', latitude: 32.0603, longitude: 118.7969, aliases: ['南京市'] },
  { name: '杭州', province: '浙江省', latitude: 30.2741, longitude: 120.1551, aliases: ['杭州市'] },
  { name: '合肥', province: '安徽省', latitude: 31.8206, longitude: 117.2272, aliases: ['合肥市'] },
  { name: '福州', province: '福建省', latitude: 26.0745, longitude: 119.2965, aliases: ['福州市'] },
  { name: '南昌', province: '江西省', latitude: 28.6820, longitude: 115.8579, aliases: ['南昌市'] },
  { name: '济南', province: '山东省', latitude: 36.6512, longitude: 117.1201, aliases: ['济南市'] },
  { name: '郑州', province: '河南省', latitude: 34.7466, longitude: 113.6254, aliases: ['郑州市'] },
  { name: '武汉', province: '湖北省', latitude: 30.5928, longitude: 114.3055, aliases: ['武汉市'] },
  { name: '长沙', province: '湖南省', latitude: 28.2282, longitude: 112.9388, aliases: ['长沙市'] },
  { name: '广州', province: '广东省', latitude: 23.1291, longitude: 113.2644, aliases: ['广州市'] },
  { name: '南宁', province: '广西壮族自治区', latitude: 22.8170, longitude: 108.3669, aliases: ['南宁市'] },
  { name: '海口', province: '海南省', latitude: 20.0444, longitude: 110.1999, aliases: ['海口市'] },
  { name: '成都', province: '四川省', latitude: 30.5728, longitude: 104.0668, aliases: ['成都市'] },
  { name: '贵阳', province: '贵州省', latitude: 26.6470, longitude: 106.6302, aliases: ['贵阳市'] },
  { name: '昆明', province: '云南省', latitude: 25.0389, longitude: 102.7183, aliases: ['昆明市'] },
  { name: '拉萨', province: '西藏自治区', latitude: 29.6520, longitude: 91.1721, aliases: ['拉萨市'] },
  { name: '西安', province: '陕西省', latitude: 34.3416, longitude: 108.9398, aliases: ['西安市'] },
  { name: '兰州', province: '甘肃省', latitude: 36.0611, longitude: 103.8343, aliases: ['兰州市'] },
  { name: '西宁', province: '青海省', latitude: 36.6171, longitude: 101.7782, aliases: ['西宁市'] },
  { name: '银川', province: '宁夏回族自治区', latitude: 38.4872, longitude: 106.2309, aliases: ['银川市'] },
  { name: '乌鲁木齐', province: '新疆维吾尔自治区', latitude: 43.8256, longitude: 87.6168, aliases: ['乌鲁木齐市', '乌市'] },

  // 重要地级市
  { name: '深圳', province: '广东省', latitude: 22.5431, longitude: 114.0579, aliases: ['深圳市'] },
  { name: '青岛', province: '山东省', latitude: 36.0671, longitude: 120.3826, aliases: ['青岛市'] },
  { name: '大连', province: '辽宁省', latitude: 38.9140, longitude: 121.6147, aliases: ['大连市'] },
  { name: '宁波', province: '浙江省', latitude: 29.8683, longitude: 121.5440, aliases: ['宁波市'] },
  { name: '厦门', province: '福建省', latitude: 24.4798, longitude: 118.0894, aliases: ['厦门市'] },
  { name: '苏州', province: '江苏省', latitude: 31.2989, longitude: 120.5853, aliases: ['苏州市'] },
  { name: '无锡', province: '江苏省', latitude: 31.4912, longitude: 120.3119, aliases: ['无锡市'] },
  { name: '佛山', province: '广东省', latitude: 23.0218, longitude: 113.1219, aliases: ['佛山市'] },
  { name: '东莞', province: '广东省', latitude: 23.0489, longitude: 113.7447, aliases: ['东莞市'] },
  { name: '珠海', province: '广东省', latitude: 22.2711, longitude: 113.5767, aliases: ['珠海市'] },
  { name: '中山', province: '广东省', latitude: 22.5152, longitude: 113.3927, aliases: ['中山市'] },
  { name: '惠州', province: '广东省', latitude: 23.1115, longitude: 114.4152, aliases: ['惠州市'] },
  { name: '江门', province: '广东省', latitude: 22.5751, longitude: 113.0946, aliases: ['江门市'] },
  { name: '汕头', province: '广东省', latitude: 23.3540, longitude: 116.6816, aliases: ['汕头市'] },
  { name: '湛江', province: '广东省', latitude: 21.2707, longitude: 110.3594, aliases: ['湛江市'] },
  { name: '温州', province: '浙江省', latitude: 27.9944, longitude: 120.6994, aliases: ['温州市'] },
  { name: '嘉兴', province: '浙江省', latitude: 30.7463, longitude: 120.7550, aliases: ['嘉兴市'] },
  { name: '台州', province: '浙江省', latitude: 28.6568, longitude: 121.4281, aliases: ['台州市'] },
  { name: '金华', province: '浙江省', latitude: 29.1028, longitude: 119.6474, aliases: ['金华市'] },
  { name: '绍兴', province: '浙江省', latitude: 30.0023, longitude: 120.5810, aliases: ['绍兴市'] },
  { name: '常州', province: '江苏省', latitude: 31.7976, longitude: 119.9462, aliases: ['常州市'] },
  { name: '徐州', province: '江苏省', latitude: 34.2058, longitude: 117.2840, aliases: ['徐州市'] },
  { name: '南通', province: '江苏省', latitude: 32.0162, longitude: 120.8945, aliases: ['南通市'] },
  { name: '扬州', province: '江苏省', latitude: 32.3932, longitude: 119.4215, aliases: ['扬州市'] },
  { name: '盐城', province: '江苏省', latitude: 33.3775, longitude: 120.1573, aliases: ['盐城市'] },
  { name: '淮安', province: '江苏省', latitude: 33.5975, longitude: 119.0153, aliases: ['淮安市'] },
  { name: '连云港', province: '江苏省', latitude: 34.5967, longitude: 119.2216, aliases: ['连云港市'] },
  { name: '泰州', province: '江苏省', latitude: 32.4849, longitude: 119.9153, aliases: ['泰州市'] },
  { name: '镇江', province: '江苏省', latitude: 32.2044, longitude: 119.4520, aliases: ['镇江市'] },
  { name: '宿迁', province: '江苏省', latitude: 33.9630, longitude: 118.2757, aliases: ['宿迁市'] },
  { name: '烟台', province: '山东省', latitude: 37.4638, longitude: 121.4478, aliases: ['烟台市'] },
  { name: '潍坊', province: '山东省', latitude: 36.7069, longitude: 119.1019, aliases: ['潍坊市'] },
  { name: '临沂', province: '山东省', latitude: 35.1041, longitude: 118.3563, aliases: ['临沂市'] },
  { name: '淄博', province: '山东省', latitude: 36.8133, longitude: 118.0549, aliases: ['淄博市'] },
  { name: '济宁', province: '山东省', latitude: 35.4154, longitude: 116.5874, aliases: ['济宁市'] },
  { name: '泰安', province: '山东省', latitude: 36.1943, longitude: 117.1291, aliases: ['泰安市'] },
  { name: '威海', province: '山东省', latitude: 37.5128, longitude: 122.1201, aliases: ['威海市'] },
  { name: '德州', province: '山东省', latitude: 37.4513, longitude: 116.3574, aliases: ['德州市'] },
  { name: '聊城', province: '山东省', latitude: 36.4563, longitude: 115.9808, aliases: ['聊城市'] },
  { name: '滨州', province: '山东省', latitude: 37.3835, longitude: 117.9708, aliases: ['滨州市'] },
  { name: '菏泽', province: '山东省', latitude: 35.2333, longitude: 115.4697, aliases: ['菏泽市'] },
  { name: '枣庄', province: '山东省', latitude: 34.8107, longitude: 117.3238, aliases: ['枣庄市'] },
  { name: '东营', province: '山东省', latitude: 37.4613, longitude: 118.6747, aliases: ['东营市'] },
  { name: '日照', province: '山东省', latitude: 35.4164, longitude: 119.5269, aliases: ['日照市'] },
  { name: '莱芜', province: '山东省', latitude: 36.2140, longitude: 117.6770, aliases: ['莱芜市'] },

  // 江西省重要城市
  { name: '景德镇', province: '江西省', latitude: 29.2947, longitude: 117.2142, aliases: ['景德镇市'] },
  { name: '九江', province: '江西省', latitude: 29.7050, longitude: 115.9929, aliases: ['九江市'] },
  { name: '萍乡', province: '江西省', latitude: 27.6229, longitude: 113.8520, aliases: ['萍乡市'] },
  { name: '新余', province: '江西省', latitude: 27.8175, longitude: 114.9307, aliases: ['新余市'] },
  { name: '鹰潭', province: '江西省', latitude: 28.2386, longitude: 117.0338, aliases: ['鹰潭市'] },
  { name: '赣州', province: '江西省', latitude: 25.8452, longitude: 114.9404, aliases: ['赣州市'] },
  { name: '宜春', province: '江西省', latitude: 27.8043, longitude: 114.3916, aliases: ['宜春市'] },
  { name: '上饶', province: '江西省', latitude: 28.4444, longitude: 117.9434, aliases: ['上饶市'] },
  { name: '吉安', province: '江西省', latitude: 27.1138, longitude: 114.9865, aliases: ['吉安市'] },
  { name: '抚州', province: '江西省', latitude: 27.9838, longitude: 116.3583, aliases: ['抚州市'] },

  // 河北省重要城市
  { name: '唐山', province: '河北省', latitude: 39.6243, longitude: 118.1944, aliases: ['唐山市'] },
  { name: '秦皇岛', province: '河北省', latitude: 39.9398, longitude: 119.6006, aliases: ['秦皇岛市'] },
  { name: '邯郸', province: '河北省', latitude: 36.6253, longitude: 114.5389, aliases: ['邯郸市'] },
  { name: '邢台', province: '河北省', latitude: 37.0682, longitude: 114.5086, aliases: ['邢台市'] },
  { name: '保定', province: '河北省', latitude: 38.8738, longitude: 115.4648, aliases: ['保定市'] },
  { name: '张家口', province: '河北省', latitude: 40.7681, longitude: 114.8794, aliases: ['张家口市'] },
  { name: '承德', province: '河北省', latitude: 40.9739, longitude: 117.9616, aliases: ['承德市'] },
  { name: '沧州', province: '河北省', latitude: 38.3037, longitude: 116.8386, aliases: ['沧州市'] },
  { name: '廊坊', province: '河北省', latitude: 39.5237, longitude: 116.7030, aliases: ['廊坊市'] },
  { name: '衡水', province: '河北省', latitude: 37.7161, longitude: 115.6656, aliases: ['衡水市'] },

  // 河南省重要城市
  { name: '洛阳', province: '河南省', latitude: 34.6197, longitude: 112.4540, aliases: ['洛阳市'] },
  { name: '开封', province: '河南省', latitude: 34.7971, longitude: 114.3074, aliases: ['开封市'] },
  { name: '安阳', province: '河南省', latitude: 36.1034, longitude: 114.3927, aliases: ['安阳市'] },
  { name: '鹤壁', province: '河南省', latitude: 35.7554, longitude: 114.2974, aliases: ['鹤壁市'] },
  { name: '新乡', province: '河南省', latitude: 35.3026, longitude: 113.9268, aliases: ['新乡市'] },
  { name: '焦作', province: '河南省', latitude: 35.2158, longitude: 113.2418, aliases: ['焦作市'] },
  { name: '濮阳', province: '河南省', latitude: 35.7615, longitude: 115.0291, aliases: ['濮阳市'] },
  { name: '许昌', province: '河南省', latitude: 34.0357, longitude: 113.8260, aliases: ['许昌市'] },
  { name: '漯河', province: '河南省', latitude: 33.5816, longitude: 114.0460, aliases: ['漯河市'] },
  { name: '三门峡', province: '河南省', latitude: 34.7732, longitude: 111.2008, aliases: ['三门峡市'] },
  { name: '南阳', province: '河南省', latitude: 32.9909, longitude: 112.5285, aliases: ['南阳市'] },
  { name: '商丘', province: '河南省', latitude: 34.4140, longitude: 115.6564, aliases: ['商丘市'] },
  { name: '信阳', province: '河南省', latitude: 32.1470, longitude: 114.0757, aliases: ['信阳市'] },
  { name: '周口', province: '河南省', latitude: 33.6204, longitude: 114.6496, aliases: ['周口市'] },
  { name: '驻马店', province: '河南省', latitude: 32.9804, longitude: 114.0220, aliases: ['驻马店市'] },
  { name: '平顶山', province: '河南省', latitude: 33.7453, longitude: 113.1929, aliases: ['平顶山市'] },

  // 湖北省重要城市
  { name: '黄石', province: '湖北省', latitude: 30.2200, longitude: 115.0770, aliases: ['黄石市'] },
  { name: '十堰', province: '湖北省', latitude: 32.6470, longitude: 110.7878, aliases: ['十堰市'] },
  { name: '宜昌', province: '湖北省', latitude: 30.7026, longitude: 111.2900, aliases: ['宜昌市'] },
  { name: '襄阳', province: '湖北省', latitude: 32.0090, longitude: 112.1441, aliases: ['襄阳市', '襄樊'] },
  { name: '鄂州', province: '湖北省', latitude: 30.3966, longitude: 114.8909, aliases: ['鄂州市'] },
  { name: '荆门', province: '湖北省', latitude: 31.0354, longitude: 112.2044, aliases: ['荆门市'] },
  { name: '孝感', province: '湖北省', latitude: 30.9264, longitude: 113.9269, aliases: ['孝感市'] },
  { name: '荆州', province: '湖北省', latitude: 30.3269, longitude: 112.2386, aliases: ['荆州市'] },
  { name: '黄冈', province: '湖北省', latitude: 30.4477, longitude: 114.8722, aliases: ['黄冈市'] },
  { name: '咸宁', province: '湖北省', latitude: 29.8418, longitude: 114.3225, aliases: ['咸宁市'] },
  { name: '随州', province: '湖北省', latitude: 31.6904, longitude: 113.3741, aliases: ['随州市'] },

  // 湖南省重要城市
  { name: '株洲', province: '湖南省', latitude: 27.8274, longitude: 113.1513, aliases: ['株洲市'] },
  { name: '湘潭', province: '湖南省', latitude: 27.8294, longitude: 112.9443, aliases: ['湘潭市'] },
  { name: '衡阳', province: '湖南省', latitude: 26.8981, longitude: 112.6072, aliases: ['衡阳市'] },
  { name: '邵阳', province: '湖南省', latitude: 27.2377, longitude: 111.4690, aliases: ['邵阳市'] },
  { name: '岳阳', province: '湖南省', latitude: 29.3570, longitude: 113.1287, aliases: ['岳阳市'] },
  { name: '常德', province: '湖南省', latitude: 29.0319, longitude: 111.6990, aliases: ['常德市'] },
  { name: '张家界', province: '湖南省', latitude: 29.1274, longitude: 110.4790, aliases: ['张家界市'] },
  { name: '益阳', province: '湖南省', latitude: 28.5701, longitude: 112.3550, aliases: ['益阳市'] },
  { name: '郴州', province: '湖南省', latitude: 25.7706, longitude: 113.0322, aliases: ['郴州市'] },
  { name: '永州', province: '湖南省', latitude: 26.4204, longitude: 111.6085, aliases: ['永州市'] },
  { name: '怀化', province: '湖南省', latitude: 27.5500, longitude: 109.9780, aliases: ['怀化市'] },
  { name: '娄底', province: '湖南省', latitude: 27.7281, longitude: 112.0088, aliases: ['娄底市'] },

  // 四川省重要城市
  { name: '绵阳', province: '四川省', latitude: 31.4678, longitude: 104.6794, aliases: ['绵阳市'] },
  { name: '德阳', province: '四川省', latitude: 31.1270, longitude: 104.3982, aliases: ['德阳市'] },
  { name: '南充', province: '四川省', latitude: 30.7953, longitude: 106.0847, aliases: ['南充市'] },
  { name: '广安', province: '四川省', latitude: 30.4564, longitude: 106.6333, aliases: ['广安市'] },
  { name: '遂宁', province: '四川省', latitude: 30.5133, longitude: 105.5713, aliases: ['遂宁市'] },
  { name: '内江', province: '四川省', latitude: 29.5804, longitude: 105.0661, aliases: ['内江市'] },
  { name: '乐山', province: '四川省', latitude: 29.5820, longitude: 103.7615, aliases: ['乐山市'] },
  { name: '自贡', province: '四川省', latitude: 29.3528, longitude: 104.7787, aliases: ['自贡市'] },
  { name: '泸州', province: '四川省', latitude: 28.8718, longitude: 105.4433, aliases: ['泸州市'] },
  { name: '宜宾', province: '四川省', latitude: 28.7602, longitude: 104.6308, aliases: ['宜宾市'] },
  { name: '攀枝花', province: '四川省', latitude: 26.5804, longitude: 101.7183, aliases: ['攀枝花市'] },
  { name: '巴中', province: '四川省', latitude: 31.8691, longitude: 106.7536, aliases: ['巴中市'] },
  { name: '达州', province: '四川省', latitude: 31.2090, longitude: 107.5023, aliases: ['达州市'] },
  { name: '广元', province: '四川省', latitude: 32.4336, longitude: 105.8430, aliases: ['广元市'] },
  { name: '雅安', province: '四川省', latitude: 29.9877, longitude: 103.0013, aliases: ['雅安市'] },
  { name: '眉山', province: '四川省', latitude: 30.0481, longitude: 103.8311, aliases: ['眉山市'] },
  { name: '资阳', province: '四川省', latitude: 30.1222, longitude: 104.6419, aliases: ['资阳市'] },

  // 安徽省重要城市
  { name: '芜湖', province: '安徽省', latitude: 31.3260, longitude: 118.3721, aliases: ['芜湖市'] },
  { name: '蚌埠', province: '安徽省', latitude: 32.9164, longitude: 117.3896, aliases: ['蚌埠市'] },
  { name: '淮南', province: '安徽省', latitude: 32.6473, longitude: 117.0181, aliases: ['淮南市'] },
  { name: '马鞍山', province: '安徽省', latitude: 31.6895, longitude: 118.5069, aliases: ['马鞍山市'] },
  { name: '淮北', province: '安徽省', latitude: 33.9717, longitude: 116.7989, aliases: ['淮北市'] },
  { name: '铜陵', province: '安徽省', latitude: 30.9299, longitude: 117.8160, aliases: ['铜陵市'] },
  { name: '安庆', province: '安徽省', latitude: 30.5255, longitude: 117.0570, aliases: ['安庆市'] },
  { name: '黄山', province: '安徽省', latitude: 29.7144, longitude: 118.3376, aliases: ['黄山市'] },
  { name: '滁州', province: '安徽省', latitude: 32.3173, longitude: 118.3162, aliases: ['滁州市'] },
  { name: '阜阳', province: '安徽省', latitude: 32.8986, longitude: 115.8144, aliases: ['阜阳市'] },
  { name: '宿州', province: '安徽省', latitude: 33.6341, longitude: 116.9640, aliases: ['宿州市'] },
  { name: '六安', province: '安徽省', latitude: 31.7346, longitude: 116.5078, aliases: ['六安市'] },
  { name: '亳州', province: '安徽省', latitude: 33.8712, longitude: 115.7825, aliases: ['亳州市'] },
  { name: '池州', province: '安徽省', latitude: 30.6600, longitude: 117.4890, aliases: ['池州市'] },
  { name: '宣城', province: '安徽省', latitude: 30.9525, longitude: 118.7581, aliases: ['宣城市'] },

  // 福建省重要城市
  { name: '泉州', province: '福建省', latitude: 24.8740, longitude: 118.6758, aliases: ['泉州市'] },
  { name: '漳州', province: '福建省', latitude: 24.5110, longitude: 117.6470, aliases: ['漳州市'] },
  { name: '莆田', province: '福建省', latitude: 25.4540, longitude: 119.0077, aliases: ['莆田市'] },
  { name: '三明', province: '福建省', latitude: 26.2654, longitude: 117.6387, aliases: ['三明市'] },
  { name: '南平', province: '福建省', latitude: 26.6357, longitude: 118.1780, aliases: ['南平市'] },
  { name: '龙岩', province: '福建省', latitude: 25.0918, longitude: 117.0174, aliases: ['龙岩市'] },
  { name: '宁德', province: '福建省', latitude: 26.6617, longitude: 119.5270, aliases: ['宁德市'] },

  // 其他重要城市
  { name: '包头', province: '内蒙古自治区', latitude: 40.6562, longitude: 109.8403, aliases: ['包头市'] },
  { name: '鞍山', province: '辽宁省', latitude: 41.1086, longitude: 122.9945, aliases: ['鞍山市'] },
  { name: '抚顺', province: '辽宁省', latitude: 41.8654, longitude: 123.9574, aliases: ['抚顺市'] },
  { name: '本溪', province: '辽宁省', latitude: 41.2979, longitude: 123.7703, aliases: ['本溪市'] },
  { name: '丹东', province: '辽宁省', latitude: 40.1290, longitude: 124.3540, aliases: ['丹东市'] },
  { name: '锦州', province: '辽宁省', latitude: 41.1190, longitude: 121.1353, aliases: ['锦州市'] },
  { name: '营口', province: '辽宁省', latitude: 40.6674, longitude: 122.2352, aliases: ['营口市'] },
  { name: '阜新', province: '辽宁省', latitude: 42.0118, longitude: 121.6708, aliases: ['阜新市'] },
  { name: '辽阳', province: '辽宁省', latitude: 41.2694, longitude: 123.2364, aliases: ['辽阳市'] },
  { name: '盘锦', province: '辽宁省', latitude: 41.1245, longitude: 122.0699, aliases: ['盘锦市'] },
  { name: '铁岭', province: '辽宁省', latitude: 42.2230, longitude: 123.8442, aliases: ['铁岭市'] },
  { name: '朝阳', province: '辽宁省', latitude: 41.5718, longitude: 120.4516, aliases: ['朝阳市'] },
  { name: '葫芦岛', province: '辽宁省', latitude: 40.7556, longitude: 120.8560, aliases: ['葫芦岛市'] },
];

// 根据城市名称查找城市信息（支持模糊匹配和别名）
export function findCityInfo(cityName: string): ExtendedCityInfo | null {
  if (!cityName) return null;
  
  const searchName = cityName.trim();
  
  // 精确匹配
  let city = EXTENDED_CITY_DATABASE.find(c => c.name === searchName);
  if (city) return city;
  
  // 别名匹配
  city = EXTENDED_CITY_DATABASE.find(c => 
    c.aliases && c.aliases.includes(searchName)
  );
  if (city) return city;
  
  // 去掉"市"后缀再匹配
  const nameWithoutSuffix = searchName.replace(/市$/, '');
  city = EXTENDED_CITY_DATABASE.find(c => 
    c.name === nameWithoutSuffix || 
    (c.aliases && c.aliases.some(alias => alias === nameWithoutSuffix))
  );
  if (city) return city;
  
  // 模糊匹配（包含关系）
  city = EXTENDED_CITY_DATABASE.find(c => 
    c.name.includes(searchName) || 
    searchName.includes(c.name) ||
    (c.aliases && c.aliases.some(alias => 
      alias.includes(searchName) || searchName.includes(alias)
    ))
  );
  
  return city || null;
}

// 获取所有城市名称
export function getAllCityNames(): string[] {
  return EXTENDED_CITY_DATABASE.map(city => city.name);
}

// 获取所有省份
export function getAllProvinces(): string[] {
  const provinces = [...new Set(EXTENDED_CITY_DATABASE.map(city => city.province))];
  return provinces.sort();
}