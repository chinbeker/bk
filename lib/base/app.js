const landscape = window.matchMedia('(orientation: landscape)');
const ref = (val, el, func)=>{
    const obj = Object.create(null);
    if (val !== undefined){Reflect.set(obj,'value',val);};
    if (typeof func === 'function'){
        return new Proxy(obj, {
            get: (target)=>{return target['value'];},
            set: (target,prop,value)=>{
                if (target['value'] !== value){
                    func(value,el,target['value']);
                    target['value'] = value;
                }
            }
        });
    };
    return obj;
}
const cfn= (el, func, value)=>{
    if (!el || !func || typeof func !== 'function') {return null;}
    if (value) {
        return (val)=>{func(el,val)};
    } else {
        return ()=>{func(el)};
    }
};
const cev = (el, func)=>{
    if (!el || !func || typeof func !== 'function') {return null;}
    return (event)=>{func(event,el)};
};
const aev = (el, type, func, option=false)=>{
    if (!el || !type || !func || typeof func !== 'function') {return false;}
    el.addEventListener(type, (e)=>{func(e);}, option);
    return true;
};
(()=>{
    history.replaceState(null, null, location.origin + location.pathname);
    const orient=screen.orientation;
    const root=document.documentElement;
    document.addEventListener('touchstart',function(){},{passive:true});
    const font = Object.create(null);
    const inline=28.57;
    const init = parseFloat(getComputedStyle(root).getPropertyValue('font-size')) || 15.4;
    const desktop = ()=>{
        if(screen.orientation.angle == 0 || screen.orientation.angle == 180){
            document.documentElement.style.fontSize=font.portrait;
        } else {
            document.documentElement.style.fontSize=font.landscape;
        }
    };
    if ((screen.width / init) < inline || (screen.height / init) < inline){
        if (orient.type.startsWith('p') && (orient.angle == 0 || orient.angle == 180)){
            font.portrait = (top.innerWidth / inline) + 'px';
            root.style.fontSize = font.portrait;
            if (top.innerWidth > screen.width){
                font.landscape = (top.innerWidth / screen.height * (screen.width / inline)) + 'px';
                orient.onchange=desktop;
            }
        }
        if (orient.type.startsWith('l') && (orient.angle==90 || orient.angle==270)){
            if (top.innerWidth > screen.width){
                font.portrait = (top.innerWidth / inline) + 'px';
                font.landscape = (top.innerWidth / screen.width * (screen.height / inline)) + 'px';
                root.style.fontSize = font.landscape;
                orient.onchange = desktop;
            } else {
                font.portrait = (screen.height / inline)+'px';
                root.style.fontSize = font.portrait;
            }
        }
    };
})();
