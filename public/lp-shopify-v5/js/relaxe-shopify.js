(()=>{'use strict';
const config={
  "domain": "https://get.wooddecouk.com",
  "variants": {
    "PANEL-NATURAL": "67926344106175",
    "PANEL-WALNUT": "67926344138943",
    "PANEL-BLACK": "67926344171711",
    "PANEL-GREY": "67926344204479",
    "OAK-PANEL": "67926344270015",
    "WALNUT-PANEL": "67926344302783",
    "ARC-LAMP": "67926344499391",
    "CERAMIC-VASE": "67926344532159",
    "LED-STANDARD": "67926344564927",
    "WALL-CLEANER": "67926344597695",
    "STARWAX-500ML": "67926344630463",
    "LED-UK-OFFER": "67926344663231",
    "XMAS-TREE-8FT": "67926344695999",
    "XMAS-BAUBLES-10": "67926344728767",
    "XMAS-GARLAND-6FT": "67926344761535",
    "XMAS-BERRY-GARLAND": "67926344794303",
    "XMAS-LIGHTS-300": "67926344827071",
    "XMAS-BERRY-WREATH": "67926344859839",
    "SAMPLE-TAUARI-BLACK": "67926344892607",
    "SAMPLE-TAUARI-GREY": "67926344925375",
    "SAMPLE-FREIJO": "67926344958143",
    "SAMPLE-BLANCHONELLA": "67926344990911",
    "SAMPLE-WHITE": "67926345023679",
    "SAMPLE-BLACK": "67926345056447"
  }
};
function checkoutURL(lines){
 if(!Array.isArray(lines)||!lines.length)return '';
 const quantities=new Map();
 for(const line of lines){
  const id=config.variants[line.sku];
  if(!id||!/^\d+$/.test(id))throw new Error('Missing Shopify variant for '+String(line.sku||line.name||'product'));
  if(!Number.isSafeInteger(line.quantity)||line.quantity<1)throw new Error('Invalid product quantity');
  const total=(quantities.get(id)||0)+line.quantity;
  if(!Number.isSafeInteger(total))throw new Error('Invalid total quantity');
  quantities.set(id,total);
 }
 const path=[...quantities].map(([id,quantity])=>`${id}:${quantity}`).join(',');
 const url=new URL(config.domain+'/cart/'+path);
 url.searchParams.set('note','LP: '+lines.map(x=>`${x.sku} x${x.quantity}`).join('; '));
 return url.href;
}
window.RelaxeShopify={domain:config.domain,variants:Object.freeze(config.variants),checkoutURL};
})();
