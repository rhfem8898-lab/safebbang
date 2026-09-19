
const PLACES = {
1:["태안 신두리 해안사구","Shinduri Coastal Sand Dunes Taean Korea"],2:["태안 청산수목원 팜파스 핑크뮬리","Cheongsan Arboretum Taean pampas"],3:["부안 채석강","Chaeseokgang Buan Korea"],4:["부안 곰소염전","Gomso salt farm Buan Korea"],5:["함평 모악산 꽃무릇축제","Hampyeong red spider lily festival"],6:["영광 백수해안도로","Baeksu Coastal Road Yeonggwang"],7:["고창 청농원 핑크뮬리","Gochang Cheongnongwon pink muhly"],8:["고창 학원농장 메밀 해바라기","Gochang Hakwon Farm buckwheat sunflower"],9:["서천 신성리 갈대밭","Sinseongri reed field Seocheon"],10:["서천 장항송림 맥문동","Janghang pine forest liriope Seocheon"],11:["군산 고군산군도 선유도","Seonyudo Gogunsan islands Gunsan"],12:["보령 무창포 신비의 바닷길","Muchangpo sea parting Boryeong"],13:["태안 꽃지해수욕장 할미할아비바위","Kkotji beach Taean sunset"],14:["영광 백제불교 최초도래지","Yeonggwang Baekje Buddhism First Arrival"],15:["함평 전통 해수찜","Hampyeong traditional seawater spa"],16:["함평 돌머리해수욕장","Dolmeori beach Hampyeong"],17:["함평 주포한옥마을","Jupo Hanok Village Hampyeong"],18:["무안 황토갯벌랜드","Muan tidal flat land Korea"],19:["목포 갓바위","Gatbawi Mokpo"],20:["목포 고하도 해상데크","Gohado sea deck Mokpo"],21:["목포 스카이워크","Mokpo skywalk"],22:["태안 운여해변","Unyeo beach Taean sunset"],23:["태안 안면암 부상탑","Anmyeonam floating pagoda Taean"],24:["태안 안면도 자연휴양림 안면송","Anmyeondo pine forest Korea"],25:["태안 파도리 해식동굴","Padori sea cave Taean"],26:["홍성 남당항 대하축제","Namdanghang shrimp festival Hongseong"],27:["서산 간월암","Ganworam Seosan"],28:["예산 아그로랜드 태신목장","Agroland Taeshin Farm Yesan"],29:["고창 고인돌유적","Gochang Dolmen Site"],30:["고창 운곡람사르습지","Ungok Ramsar Wetland Gochang"],31:["태안 네이처월드 가을꽃박람회","Taean Nature World autumn flower festival"],32:["태안 백사장항 대하랑꽃게랑다리","Baeksajang harbor crab bridge Taean"],33:["당진 삽교호 드론 라이트쇼","Sapgyoho drone light show Dangjin"],34:["서산 해미읍성","Haemieupseong fortress Seosan"],35:["서천 장항스카이워크","Janghang skywalk Seocheon"],36:["서천 한산모시관","Hansan ramie museum Seocheon"],37:["군산 경암동 철길마을","Gyeongamdong railroad village Gunsan"],38:["군산 근대역사문화거리","Gunsan modern history street"],39:["부안 적벽강","Jeokbyeokgang Buan"],40:["부안 내소사 전나무길","Naesosa fir tree road Buan"],41:["고창 선운사 꽃무릇","Seonunsa red spider lily Gochang"],42:["고창 하전갯벌","Hajeon tidal flat Gochang"],43:["고창 해변 승마","Gochang beach horse riding"],44:["고창 고창읍성","Gochang Eupseong fortress"],45:["정읍 구절초 지방정원","Jeongeup Gujeolcho garden"],46:["영광 불갑산 상사화축제","Bulgapsan red spider lily festival Yeonggwang"],47:["영광 법성포 굴비거리","Beopseongpo gulbi Yeonggwang"],48:["함평 고막천 석교","Gomakcheon stone bridge Hampyeong"],49:["함평 자연생태공원","Hampyeong Natural Ecology Park"],50:["무안 회산백련지","Hoesan white lotus pond Muan"],51:["목포 해상케이블카","Mokpo marine cable car"],52:["목포해상 W-SHOW","Mokpo W show fountain fireworks"],53:["나주 전남산림자원연구소 메타세쿼이아","Jeonnam Forest Resources Research Institute Naju"],54:["담양 죽녹원","Juknokwon bamboo forest Damyang"],55:["담양 메타세쿼이아길","Damyang Metasequoia road"]
};

function uniq(arr){return [...new Set(arr.filter(Boolean))]}
async function openverse(q){
  try{
    const r=await fetch("https://api.openverse.org/v1/images/?page_size=8&q="+encodeURIComponent(q),{headers:{"User-Agent":"Mozilla/5.0 TripReview/1.0"}});
    if(!r.ok)return [];
    const j=await r.json();
    return (j.results||[]).flatMap(x=>[x.thumbnail,x.url]).filter(Boolean);
  }catch{return []}
}
async function commons(q){
  try{
    const url="https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch="+encodeURIComponent(q)+"&prop=imageinfo&iiprop=url&iiurlwidth=1400&format=json&origin=*";
    const r=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0 TripReview/1.0"}});
    if(!r.ok)return [];
    const j=await r.json();
    return Object.values(j.query?.pages||{}).flatMap(p=>{const i=p.imageinfo?.[0];return [i?.thumburl,i?.url]}).filter(Boolean);
  }catch{return []}
}
async function bing(q){
  try{
    const r=await fetch("https://www.bing.com/images/search?q="+encodeURIComponent(q+" 여행 관광"),{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36","Accept-Language":"ko-KR,ko;q=0.9,en;q=0.7"}});
    if(!r.ok)return [];
    const t=await r.text();
    const out=[];
    for(const m of t.matchAll(/&quot;murl&quot;:&quot;(https?:\\/\\/[^&]+?)&quot;/g)){
      out.push(m[1].replace(/\\u002f/g,"/").replace(/&amp;/g,"&"));
      if(out.length>=10)break;
    }
    return out;
  }catch{return []}
}
async function candidates(id){
  const qs=PLACES[id]||[];
  let urls=[];
  for(const q of qs){urls.push(...await openverse(q));urls.push(...await commons(q));if(urls.length>=6)break}
  if(urls.length<3){for(const q of qs){urls.push(...await bing(q));if(urls.length>=8)break}}
  return uniq(urls);
}
async function proxy(url){
  const r=await fetch(url,{redirect:"follow",headers:{"User-Agent":"Mozilla/5.0","Accept":"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"}});
  if(!r.ok)throw new Error("bad image");
  const ct=r.headers.get("content-type")||"";
  if(!ct.startsWith("image/"))throw new Error("not image");
  const ab=await r.arrayBuffer();
  if(ab.byteLength<2000)throw new Error("tiny image");
  return {ab,ct};
}
module.exports=async function handler(req,res){
  const id=Number(req.query.id), n=Math.max(0,Math.min(2,Number(req.query.n)||0));
  if(!PLACES[id])return res.status(404).end();
  const urls=await candidates(id);
  const order=[...urls.slice(n),...urls.slice(0,n)];
  for(const u of order){
    try{
      const {ab,ct}=await proxy(u);
      res.setHeader("Content-Type",ct);
      res.setHeader("Cache-Control","public, s-maxage=86400, stale-while-revalidate=604800");
      return res.status(200).send(Buffer.from(ab));
    }catch{}
  }
  const label=PLACES[id][0].replace(/[<>&"']/g,"");
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="46%" text-anchor="middle" font-size="42" font-family="sans-serif" fill="#374151">'+label+'</text><text x="50%" y="54%" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#6b7280">사진 검색을 다시 시도합니다</text></svg>';
  res.setHeader("Content-Type","image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control","no-store");
  res.status(200).send(svg);
}
