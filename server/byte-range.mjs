export function byteRange(header,size){
 if(!header)return null;
 const match=/^bytes=(\d*)-(\d*)$/.exec(header);
 if(!match||(!match[1]&&!match[2])||size<=0)return false;
 const first=match[1]?Number(match[1]):null,last=match[2]?Number(match[2]):null;
 if((first!==null&&!Number.isSafeInteger(first))||(last!==null&&!Number.isSafeInteger(last)))return false;
 const start=first===null?Math.max(0,size-last):first;
 const end=first===null?size-1:Math.min(last??size-1,size-1);
 return start>=size||end<start?false:{start,end};
}
