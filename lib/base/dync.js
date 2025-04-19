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
    const inline = 28.57;
    const orient = screen.orientation;
    const root = document.documentElement;
    const font = Object.create(null);
    document.addEventListener('touchstart', function(){}, {passive:true});
    root.oncontextmenu = (event)=>{
        event.preventDefault(); event.stopPropagation(); return false;
    };
    const init = parseFloat(getComputedStyle(root).getPropertyValue('font-size')) || 15.4;
    if (orient.type.startsWith('p') || !landscape.matches){root.classList.add('portrait');}
    const angle=()=>{
        if (screen.orientation.angle == 90 || screen.orientation.angle == 270) {
            document.documentElement.classList.remove('portrait');
        } else {
            document.documentElement.classList.add('portrait');
        }
    };
    const desktop = ()=>{
        if(screen.orientation.angle == 0 || screen.orientation.angle == 180){
            document.documentElement.style.fontSize = font.portrait;
            document.documentElement.classList.add('portrait');
        } else {
            document.documentElement.style.fontSize = font.landscape;
            document.documentElement.classList.remove('portrait');
        }
    };
    const min = Boolean((screen.width / init) < inline || (screen.height / init) < inline);
    if (orient.type.startsWith('p') && (orient.angle == 0 || orient.angle == 180)){
        screen.orientation.onchange = angle;
        if (min) {
            font.portrait = (top.innerWidth / inline) + 'px';
            root.style.fontSize=font.portrait;
            if (top.innerWidth > screen.width){
                font.landscape = (top.innerWidth / screen.height * (screen.width / inline)) +'px';
                screen.orientation.onchange = desktop;
            }
        }
    } else if (orient.type.startsWith('l') && (orient.angle == 90 || orient.angle == 270)){
        screen.orientation.onchange = angle;
        if (min) {
            if (top.innerWidth > screen.width){
                font.portrait = (top.innerWidth / inline) + 'px';
                font.landscape = (top.innerWidth / screen.width * (screen.height / inline)) + 'px';
                root.style.fontSize = font.landscape;
                screen.orientation.onchange = desktop;
            } else {
                font.portrait = (screen.height / inline) + 'px';
                root.style.fontSize = font.portrait;
            }
        }
    } else {
        landscape.onchange = ()=>{
            if (landscape.matches){
                document.documentElement.classList.remove('portrait');
            }else{
                document.documentElement.classList.add('portrait');
            }
        };
    }
})();
