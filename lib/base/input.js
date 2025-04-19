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
    const orient = screen.orientation;
    const root = document.documentElement;
    document.addEventListener('touchstart', function(){}, {passive:true});
    const font = Object.create(null);
    font.inline = 28.57;
    font.initial = parseFloat(getComputedStyle(root).getPropertyValue('font-size')) || 15.4;
    if ((screen.width / font.initial) < font.inline || (screen.height / font.initial) < font.inline){
        if (orient.type.startsWith('p') && (orient.angle == 0 || orient.angle == 180)){
            font.portrait = (top.innerWidth / font.inline) + 'px';
            root.style.fontSize = font.portrait;
            if (top.innerWidth > screen.width){
                font.landscape=(top.innerWidth/screen.height*(screen.width/font.inline))+'px';
                orient.onchange=()=>{
                    if (orient.angle==0 || orient.angle==180){
                        root.style.fontSize = font.portrait;
                        document.body.classList.remove('portrait');
                    } else {
                        root.style.fontSize = font.landscape;
                        document.body.classList.add('portrait');
                    }
                };
            }
        }
        if (orient.type.startsWith('l') && (orient.angle == 90 || orient.angle == 270)){
            font.landscape = (top.innerWidth / screen.width * (screen.height / font.inline)) + 'px';
            root.style.fontSize = font.landscape;
            if (top.innerWidth > screen.width){
                font.portrait = (top.innerWidth / font.inline) + 'px';
                orient.onchange = ()=>{
                    if (orient.angle == 90 || orient.angle == 270){
                        root.style.fontSize = font.landscape;
                        document.body.classList.add('portrait');
                    } else {
                        root.style.fontSize=font.portrait;
                        document.body.classList.remove('portrait');
                    }
                };
            }
        }
    };
    document.addEventListener('DOMContentLoaded',()=>{
        document.querySelectorAll('a[data-href]').forEach((el)=>{
            if (el.hasAttribute('data-href') && el.getAttribute('data-href').trim() !==''){
                if (el.hasAttribute('data-target')){
                    const target=el.getAttribute('data-target');
                    if (target === 'self'){
                        el.addEventListener('click', (e)=>{
                            e.preventDefault();
                            self.location.replace(e.currentTarget.dataset.href);
                        });
                    } else if (target === 'blank'){
                        el.addEventListener('click', (e)=>{
                            e.preventDefault();
                            top.open(e.currentTarget.dataset.href,'_blank');
                        });
                    } else if (target === 'top'){
                        el.addEventListener('click', (e)=>{
                            e.preventDefault();
                            top.location.replace(e.currentTarget.dataset.href);
                        });
                    } else if (target === 'parent'){
                        el.addEventListener('click', (e)=>{
                            e.preventDefault();
                            parent.location.replace(e.currentTarget.dataset.href);
                        });
                    } else if (self.frames[el.dataset.target]){
                        el.addEventListener('click', (e)=>{
                            e.preventDefault();
                            self.frames[e.currentTarget.dataset.target].location.replace(e.currentTarget.dataset.href);
                        });
                    }
                } else {
                    el.addEventListener('click', (e)=>{
                        e.preventDefault();
                        self.location.assign(e.currentTarget.dataset.href);
                    });
                }
            }
        });
    },
    {once:true});
})();
