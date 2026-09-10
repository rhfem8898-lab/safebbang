(() => {
  window.IDEAL_RADAR_ASSET_MANIFEST={
    version:23,
    female:{
      bangs:{
        '없음':{status:'ready-no-layer',src:null},
        '시스루':{status:'pending-binary',src:'./assets/female/bangs/bangs_01.webp'},
        '일자':{status:'pending-binary',src:'./assets/female/bangs/bangs_02.webp'},
        '가르마':{status:'pending-binary',src:'./assets/female/bangs/bangs_03.webp'},
        '측면':{status:'pending-binary',src:'./assets/female/bangs/bangs_04.webp'}
      },
      hair:{
        '기본 생머리':{status:'pending-binary',src:'./assets/female/hair/hair_01.webp'},
        '웨이브':{status:'pending-binary',src:'./assets/female/hair/hair_02.webp'},
        '포니테일':{status:'pending-binary',src:'./assets/female/hair/hair_03.webp'},
        '로우번':{status:'pending-binary',src:'./assets/female/hair/hair_04.webp'},
        '하프업':{status:'pending-binary',src:'./assets/female/hair/hair_05.webp'},
        '단발':{status:'pending-binary',src:'./assets/female/hair/hair_06.webp'},
        '양갈래':{status:'pending-binary',src:'./assets/female/hair/hair_07.webp'},
        '똥머리':{status:'pending-binary',src:'./assets/female/hair/hair_08.webp'}
      }
    }
  };
  window.IDEAL_RADAR_PARTS=window.IDEAL_RADAR_PARTS||{};
  const manifest=window.IDEAL_RADAR_ASSET_MANIFEST.female;
  ['bangs','hair'].forEach(field=>{
    window.IDEAL_RADAR_PARTS[field]=window.IDEAL_RADAR_PARTS[field]||{};
    Object.entries(manifest[field]).forEach(([value,item])=>{
      if(item.status==='ready'&&item.src) window.IDEAL_RADAR_PARTS[field][value]=item.src;
    });
  });
})();