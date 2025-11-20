
/* ================== 可自定义区域 ================== */
const BLOGGER_CITY = '深圳';        // 你的城市名（显示用）
const BLOGGER_LAT  = 22.645535;     // 你的纬度
const BLOGGER_LON  = 114.121474;    // 你的经度
const REQ_TIMEOUT  = 5000;          // 单个请求超时 ms
/* ================================================== */
// ——替换你原来的 fetchGeo()——

const timeout = (p, ms) => Promise.race([p, new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')), ms))]);
function greet(){
  const h = new Date().getHours();
  if(h<5) return '夜深了';
  if(h<11) return '早上好';
  if(h<14) return '中午好';
  if(h<18) return '下午好';
  return '晚上好';
}
function kmDistance(lat1, lon1, lat2, lon2){
  if([lat1,lon1,lat2,lon2].some(v => typeof v!=='number' || isNaN(v))) return null;
  const R=6371, toRad=d=>d*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

function getCityName(city){
  if(!city) return '';
  const cityMap = {
    'Beijing': '北京', 'Shanghai': '上海', 'Guangzhou': '广州', 'Shenzhen': '深圳',
    'Hangzhou': '杭州', 'Nanjing': '南京', 'Chengdu': '成都', 'Xi\'an': '西安',
    'Wuhan': '武汉', 'Tianjin': '天津', 'Suzhou': '苏州', 'Chongqing': '重庆',
    'Dongguan': '东莞', 'Foshan': '佛山', 'Jinan': '济南', 'Qingdao': '青岛',
    'Dalian': '大连', 'Xiamen': '厦门', 'Zhengzhou': '郑州', 'Changsha': '长沙',
    'Shenyang': '沈阳', 'Kunming': '昆明', 'Changchun': '长春', 'Harbin': '哈尔滨',
    'Taiyuan': '太原', 'Shijiazhuang': '石家庄', 'Nanning': '南宁', 'Wuxi': '无锡',
    'Hong Kong': '香港', 'Macau': '澳门',
    'Tokyo': '东京', 'Osaka': '大阪', 'Kyoto': '京都', 'Yokohama': '横滨',
    'Seoul': '首尔', 'Busan': '釜山', 'Singapore': '新加坡', 'Bangkok': '曼谷',
    'Kuala Lumpur': '吉隆坡', 'Manila': '马尼拉', 'Jakarta': '雅加达',
    'Ho Chi Minh City': '胡志明市', 'Hanoi': '河内', 'Dhaka': '达卡',
    'Mumbai': '孟买', 'Delhi': '德里', 'Kolkata': '加尔各答', 'Bangalore': '班加罗尔',
    'Chennai': '金奈', 'Hyderabad': '海得拉巴', 'Pune': '浦那', 'Ahmedabad': '艾哈迈达巴德',
    'London': '伦敦', 'Paris': '巴黎', 'Berlin': '柏林', 'Madrid': '马德里',
    'Rome': '罗马', 'Amsterdam': '阿姆斯特丹', 'Brussels': '布鲁塞尔', 'Vienna': '维也纳',
    'Moscow': '莫斯科', 'Istanbul': '伊斯坦布尔', 'Barcelona': '巴塞罗那', 'Munich': '慕尼黑',
    'New York': '纽约', 'Los Angeles': '洛杉矶', 'Chicago': '芝加哥', 'Houston': '休斯顿',
    'Phoenix': '凤凰城', 'Philadelphia': '费城', 'San Antonio': '圣安东尼奥', 'San Diego': '圣迭戈',
    'Toronto': '多伦多', 'Vancouver': '温哥华', 'Montreal': '蒙特利尔', 'Calgary': '卡尔加里',
    'Sydney': '悉尼', 'Melbourne': '墨尔本', 'Brisbane': '布里斯班', 'Perth': '珀斯',
    'Auckland': '奥克兰', 'Wellington': '惠灵顿', 'Cairo': '开罗', 'Johannesburg': '约翰内斯堡',
    'Buenos Aires': '布宜诺斯艾利斯', 'São Paulo': '圣保罗', 'Rio de Janeiro': '里约热内卢',
    'Mexico City': '墨西哥城', 'Lima': '利马', 'Bogotá': '波哥大', 'Caracas': '加拉加斯'
  };
  return cityMap[city] || city;
}

function getCountryName(country){
  if(!country) return '';
  const countryMap = {
    'United States': '美国', 'US': '美国', 'USA': '美国',
    'China': '中国', 'CN': '中国', 'PRC': '中国',
    'Japan': '日本', 'JP': '日本',
    'Korea': '韩国', 'South Korea': '韩国', 'KR': '韩国',
    'India': '印度', 'IN': '印度',
    'Russia': '俄罗斯', 'RU': '俄罗斯',
    'Germany': '德国', 'DE': '德国',
    'United Kingdom': '英国', 'UK': '英国', 'GB': '英国',
    'France': '法国', 'FR': '法国',
    'Canada': '加拿大', 'CA': '加拿大',
    'Australia': '澳大利亚', 'AU': '澳大利亚',
    'Singapore': '新加坡', 'SG': '新加坡',
    'Malaysia': '马来西亚', 'MY': '马来西亚',
    'Thailand': '泰国', 'TH': '泰国',
    'Vietnam': '越南', 'VN': '越南',
    'Philippines': '菲律宾', 'PH': '菲律宾',
    'Indonesia': '印度尼西亚', 'ID': '印度尼西亚',
    'Hong Kong': '香港', 'HK': '香港',
    'Taiwan': '台湾', 'TW': '台湾',
    'Macao': '澳门', 'Macau': '澳门', 'MO': '澳门'
  };
  return countryMap[country] || country;
}

async function fetchGeo(){
    let city='', country='', region='', ip='', org='', lat=null, lon=null;
    
    // try 1: ipwho.is（CORS 友好，数据较全）
    try{
      const d = await timeout(fetch('https://ipwho.is/').then(r=>r.json()), REQ_TIMEOUT);
      if (d && d.success !== false) {
        city = d.city || '';
        country = d.country || '';
        region = d.region || '';
        ip = d.ip || '';
        org = d.connection?.isp || '';
        lat = +d.latitude;
        lon = +d.longitude;
      }
      if(city && country) return {ip, city, region, country, org, lat, lon};
    }catch(e){}
  
    // try 2: ip-api.com（无需 API key）
    try{
      const d = await timeout(fetch('http://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon,query').then(r=>r.json()), REQ_TIMEOUT);
      if (d && d.status === 'success') {
        city = d.city || city;
        country = d.country || country;
        region = d.regionName || region;
        ip = d.query || ip;
        lat = +d.lat || lat;
        lon = +d.lon || lon;
      }
      if(city && country) return {ip, city, region, country, org, lat, lon};
    }catch(e){}
  
    // try 3: geojs
    try{
      const d = await timeout(fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()), REQ_TIMEOUT);
      if (d && (d.city || d.country)) {
        city = d.city || city;
        country = d.country || country;
        region = d.region || region;
        ip = d.ip || ip;
        org = d.organization || org;
        lat = +d.latitude || lat;
        lon = +d.longitude || lon;
      }
      if(city && country) return {ip, city, region, country, org, lat, lon};
    }catch(e){}
  
    // try 4: jsonip -> geojs by ip
    try{
      ip = (await timeout(fetch('https://ipv4.jsonip.com/').then(r=>r.json()), REQ_TIMEOUT)).ip;
      const d2 = await timeout(fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`).then(r=>r.json()), REQ_TIMEOUT);
      city = d2.city || city;
      country = d2.country || country;
      region = d2.region || region;
      org = d2.organization || org;
      lat = +d2.latitude || lat;
      lon = +d2.longitude || lon;
      if(city && country) return {ip, city, region, country, org, lat, lon};
    }catch(e){}
  
    // 全部失败 → 最小信息，避免卡住
    return { ip, city: city || '未知城市', region, country: country || '未知国家', org, lat, lon };
  }


(function init(){
  const root = document.getElementById('visitor-card');
  if(!root) return;
  const body = root.querySelector('.vc-body');
  (async ()=>{
    const geo = await fetchGeo();
    const cityTxt = getCityName(geo.city) || '未知城市';
    const countryTxt = getCountryName(geo.country) || '未知国家';
    const ispTxt = geo.org || '';
    const distKm = kmDistance(geo.lat, geo.lon, BLOGGER_LAT, BLOGGER_LON);
    const distStr = (typeof distKm==='number') ? `${Math.round(distKm)}` : 'NaN';

    // 添加IP遮罩样式
    if(!document.getElementById('visitor-ip-mask-style')){
      const style = document.createElement('style');
      style.id = 'visitor-ip-mask-style';
      style.textContent = `
        .vc-ip-mask {
          filter: blur(4px);
          user-select: none;
          cursor: help;
          transition: filter 0.3s;
        }
        .vc-ip-mask:hover {
          filter: blur(0px);
        }
      `;
      document.head.appendChild(style);
    }

    // 如果城市和国家一样，只显示一个
    const locationTxt = <b>${countryTxt}</b> //cityTxt === countryTxt ? `<b>${cityTxt}</b>` : `<b>${cityTxt}</b> · <small>${countryTxt}</small>`;

    body.innerHTML = `

      <div class="vc-panel" style="text-align: center;">
        <div class="vc-row" style="justify-content: center;">${greet()}，来自</div>
        <div class="vc-row" style="justify-content: center;">${locationTxt}</div>
        <div class="vc-row" style="justify-content: center;">的朋友, 你好呀! </div>
        <div class="vc-row" style="justify-content: center;">你目前距博主约 <b>${distStr}</b> 公里！</div>
        <div class="vc-row" style="justify-content: center;">你的网络IP为: <span class="vc-ip-mask"><b>${geo.ip || '—'}</b></span></div>
        
      </div>

    `;
  })().catch(()=>{
    body.innerHTML = `<div class="vc-row">🙈 获取信息失败，但欢迎常来看看～</div>`;
  });
})();
