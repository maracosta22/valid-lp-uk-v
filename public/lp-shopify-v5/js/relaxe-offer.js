(()=>{'use strict';
const gift={id:'gift-wall-cleaner',sku:'WALL-CLEANER',name:'Wall Preparation Cleaner',price:15.50,quantity:1,autoGift:true,image:'images/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg'};
function panelCount(lines,skuFor){return lines.filter(x=>skuFor(x).startsWith('PANEL-')).reduce((n,x)=>n+x.quantity,0);}
function unitCents(quantity){const percent=quantity>=12?41:quantity>=6?10:0;return 1450-Math.floor(1450*percent/100);}
function reconcileGift(lines,skuFor){const paid=lines.filter(x=>!x.autoGift);return panelCount(paid,skuFor)>=12?[...paid,{...gift}]:paid;}
function quoteLines(lines,skuFor){const unit=unitCents(panelCount(lines,skuFor));return lines.map(x=>x.autoGift?0:skuFor(x).startsWith('PANEL-')?unit*x.quantity:Math.round(x.price*100)*x.quantity);}
window.RelaxeOffer={panelCount,unitCents,reconcileGift,quoteLines};
})();
