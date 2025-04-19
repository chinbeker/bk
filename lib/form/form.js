let formStyleToggle;
(()=>{
    const validation = (ele, item, danger, msg='') =>{const validity = ele.validity;
        if (validity.valid){item.classList.remove('invalid');danger.innerHTML = '';
        } else {item.classList.add('invalid');
            if (validity.valueMissing) {danger.innerHTML = msg;
            } else if (validity.patternMismatch) {danger.innerHTML = "\u8f93\u5165\u4e0d\u6b63\u786e";
            } else if (validity.typeMismatch) {danger.innerHTML = "\u683c\u5f0f\u9519\u8bef";
            } else if (validity.rangeOverflow) {const step = parseFloat(ele.step) || 1;
                const min = parseFloat(ele.min) || 0;const dou = (parseFloat(ele.max)-min)/step;const int = Math.floor(dou);
                if ((dou-int)<1) {danger.innerHTML = `\u503c\u5fc5\u987b\u5c0f\u4e8e\u6216\u7b49\u4e8e${step*int+min}`;
                } else {danger.innerHTML = `\u503c\u5fc5\u987b\u5c0f\u4e8e\u6216\u7b49\u4e8e${ele.max}`;}
            } else if (validity.rangeUnderflow) {
                danger.innerHTML = `\u503c\u5fc5\u987b\u5927\u4e8e\u6216\u7b49\u4e8e${ele.min}`;
            } else if (validity.stepMismatch) {const step = parseFloat(ele.step) || 1;
                if (step==1) {danger.innerHTML = '\u5fc5\u987b\u8f93\u5165\u6574\u6570';
                } else {const min = parseFloat(ele.min) || 0;const dou = (parseFloat(ele.value)-min)/step;const int = Math.floor(dou);
                if ((dou-int)<1){danger.innerHTML = `\u503c\u65e0\u6548\uff0c\u4e0b\u4e00\u4e2a\u6b63\u786e\u503c\u4e3a${step*(int+1)+min}`;}}
            } else if (validity.badInput) {danger.innerHTML = "\u8f93\u5165\u9519\u8bef";
            } else if (validity.tooLong) {
                danger.innerHTML = ele.getAttribute('data-val-maxlength') || `\u6700\u591a\u8f93\u5165${ele.getAttribute('maxlength')}\u4e2a\u5b57\u7b26`;
            } else if (validity.tooShort) {
                danger.innerHTML = ele.getAttribute('data-val-minlength') || `\u81f3\u5c11\u8f93\u5165${ele.getAttribute('minlength')}\u4e2a\u5b57\u7b26`;
            } else {danger.innerHTML = ele.validationMessage;}
        }
    };
    const getAddressOptions = (el, value)=>{
        el.innerHTML = '<option value="" hidden></option>';
        let url = 'https://dmfw.mca.gov.cn/9095/xzqh/getList?maxLevel=1';
        if (value) {url='https://dmfw.mca.gov.cn/9095/xzqh/getList?code='+value+'&maxLevel=1';}
        fetch(url).then(response=>response.json()).then(data=>{
            const address = data.data.children;
            const options = document.createDocumentFragment();
            for (let i = 0;i < address.length;i ++){
                const option = document.createElement("option");option.value = address[i].code;
                const name = document.createTextNode(address[i].name);
                option.appendChild(name);options.appendChild(option);
            }
            el.appendChild(options);
        }).catch(()=>console.log('Error'));
    };
    const fields = {};
    const pattern = new RegExp('text|search|number|password|tel|url|email|date|month|time|datetime|file');
    const inputMsg = '\u6b64\u9879\u4e3a\u5fc5\u586b\u9879';
    const selectMsg = '\u6b64\u9879\u4e3a\u5fc5\u9009\u9879';
    let eles = document.querySelectorAll('input');
    eles.forEach(ele => {
        if (ele.hasAttribute('data-val-minlength-min')){ele.setAttribute('minlength',ele.getAttribute('data-val-minlength-min'));}
        if (!ele.hasAttribute('title')) {
            switch (ele.type){
                case 'text' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u6587\u5b57');break;}
                case 'number' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u6570\u5b57');break;}
                case 'search' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u641c\u7d22\u5185\u5bb9');break;}
                case 'password' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u5bc6\u7801');break;}
                case 'tel' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u7535\u8bdd\u53f7\u7801');break;}
                case 'url' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u7f51\u5740');break;}
                case 'email' : {ele.setAttribute('title','\u8bf7\u8f93\u5165\u7535\u5b50\u90ae\u7bb1');break;}
                case 'date' : {ele.setAttribute('title','\u8bf7\u9009\u62e9\u65e5\u671f');break;}
                case 'month' : {ele.setAttribute('title','\u8bf7\u9009\u62e9\u5e74\u6708');break;}
                case 'time' : {ele.setAttribute('title','\u8bf7\u9009\u62e9\u65f6\u95f4');break;}
                case 'datetime' : {ele.setAttribute('title','\u8bf7\u9009\u62e9\u65e5\u671f\u548c\u65f6\u95f4');break;}
                case 'datetime-local' : {ele.setAttribute('title','\u8bf7\u9009\u62e9\u65e5\u671f\u548c\u65f6\u95f4');break;}
                case 'color' : {ele.setAttribute('title','\u8bf7\u70b9\u51fb\u83b7\u53d6\u989c\u8272');break;}
                case 'range' : {ele.setAttribute('title','\u8bf7\u62d6\u52a8\u83b7\u53d6\u6570\u503c');break;}
            }
        }
        if (ele.hasAttribute('name')){
            const item = document.querySelector(`.form-item[data-name="${ele.getAttribute('name')}"]`);
            const danger = document.querySelector(`.text-danger[data-valmsg-for="${ele.getAttribute('name')}"]`);
            if (ele.type === 'radio') {
                ele.required = true;
                const msg = ele.getAttribute('data-val-required') || selectMsg;
                ele.onchange = ()=>{item.classList.remove('invalid');danger.innerHTML='';};
                ele.oninvalid = function(event){event.preventDefault();this.classList.add('first');validation(this,item,danger,msg);};
            } else if (ele.type === 'checkbox') {
                ele.required = false;
                const msg = ele.getAttribute('data-val-required') || selectMsg;
                ele.onchange = ()=>{item.classList.remove('invalid');danger.innerHTML='';};
                ele.oninvalid = function(event){event.preventDefault();validation(this,item,danger,msg);};
            } else if (pattern.test(ele.type)) {
                const req = document.querySelector(`.form-item[data-name="${ele.getAttribute('name')}"] .field-title`);
                if (ele.hasAttribute('required')){req.classList.add('required');} else {req.classList.remove('required');}
                if (ele.type==='number' && ele.getAttribute('value')==='0') {ele.setAttribute('value','');}
                if (ele.dataset.type === 'check'){
                    const msg = '\u6b64\u9879\u4e3a\u5fc5\u9009\u9879\uff0c\u81f3\u5c11\u9009\u62e9\u4e00\u9879';
                    const options = document.querySelectorAll(`input[type=checkbox][data-name="${ele.getAttribute('name')}"]`);
                    fields[ele.getAttribute('name')] = {item,field:ele,options,danger,msg};
                    ele.oninvalid = function(event){event.preventDefault();this.classList.add('first');validation(this,item,danger,msg);};
                } else if (ele.dataset.type === 'select'){
                    const show = document.querySelector(`input[data-type="select"][data-name="${ele.getAttribute('name')}"]`);
                    if (ele.required){show.required=true;} else {show.required=false;}
                    const msg = ele.getAttribute('data-val-required') || selectMsg;
                    ele.oninvalid = function(event){event.preventDefault();
                        this.classList.add('first');show.classList.add('invalid');item.classList.add('invalid');danger.innerHTML=msg;
                    };
                } else if (ele.dataset.type === 'addr') {
                    const msg = ele.getAttribute('data-val-required') || selectMsg;
                    fields[ele.getAttribute('name')] = {item,field:ele,danger,msg};
                    ele.oninvalid = function(event){event.preventDefault();this.classList.add('first');validation(this,item,danger,msg);};
                } else if (ele.dataset.type === 'address') {
                    const msg = ele.getAttribute('data-val-required') || inputMsg;
                    const el = fields[ele.getAttribute('name')];
                    el['item'] = item;el['field'] = ele;el['danger'] = danger;
                    ele.oninvalid = function(event){event.preventDefault();this.classList.add('first');validation(this,item,danger,msg);};
                } else {
                    if (!ele.hasAttribute('placeholder')){ele.setAttribute('placeholder','\u8bf7\u8f93\u5165');}
                    const msg = ele.getAttribute('data-val-required') || inputMsg;
                    ele.addEventListener('blur',function(){this.classList.add('first');},{once:true});
                    ele.onblur = function(){validation(this,item,danger,msg);};
                    ele.oninput = ()=>{item.classList.remove('invalid');if (danger.innerHTML){danger.innerHTML='';}};
                    ele.oninvalid = function(event){event.preventDefault();this.classList.add('first');validation(this,item,danger,msg);};
                }
            }
        } else if (ele.type === 'checkbox' && ele.hasAttribute('data-name')) {
            ele.onchange = function(){
                fields[this.getAttribute('data-name')].item.classList.remove('invalid');
                fields[this.getAttribute('data-name')].danger.innerHTML='';
                let value = '[';
                fields[this.getAttribute('data-name')].options.forEach(option => {
                    if (option.checked){value += `,${option.value}`}
                });
                fields[this.getAttribute('data-name')].field.value = value.replace('[,','');
            };
        } else if (ele.dataset.type === 'select'){
            if (!ele.hasAttribute('placeholder')){ele.setAttribute('placeholder','\u8bf7\u9009\u62e9');}
            const datalist = ele.nextElementSibling.children[0];
            const field = document.querySelector(`input[name="${ele.getAttribute('data-name')}"]`);
            const item = document.querySelector(`.form-item[data-name="${ele.getAttribute('data-name')}"]`);
            const danger = document.querySelector(`.text-danger[data-valmsg-for="${ele.getAttribute('data-name')}"]`);
            const msg = field.getAttribute('data-val-required') || selectMsg;
            datalist.addEventListener('mousedown',event=>{
                event.preventDefault();event.stopPropagation();
                for (let i = 0;i < datalist.children.length;i ++){
                    if (datalist.children[i].hasAttribute('selected')){datalist.children[i].removeAttribute('selected');break;}
                }
                if (event.target != event.currentTarget){event.target.setAttribute('selected','');
                    ele.value = event.target.textContent.trim();
                    field.value = event.target.dataset.value;
                    ele.classList.add('selected');
                    item.classList.remove('invalid');ele.classList.remove('invalid');danger.innerHTML='';
                    datalist.parentElement.classList.remove('open');
                }
            });
            ele.onclick = ()=>{datalist.parentElement.classList.toggle('open');};
            ele.addEventListener('blur',function(){this.classList.add('first');
                if (this.value===''){item.classList.add('invalid');this.classList.add('invalid');danger.innerHTML=msg;}
            },{once:true});
            ele.onblur = ()=>{datalist.parentElement.classList.remove('open');};
            field.onfocus = ()=>{field.blur();ele.focus();};
        } else if (ele.hasAttribute('data-address-for')) {
            const msg = ele.getAttribute('data-val-required') || '\u8bf7\u8f93\u5165\u8be6\u7ec6\u5730\u5740';
            fields[ele.getAttribute('data-address-for')] = {'detail':ele};
            if (ele.hasAttribute('required')){
                ele.addEventListener('blur',function(){this.classList.add('first');},{once:true});
                ele.onblur = function(){const el = fields[this.getAttribute('data-address-for')];validation(this,el.item,el.danger,msg);};
            } else {
                ele.onblur = function(){
                    if(this.value.length == 0){this.classList.remove('first');} else {this.classList.add('first');}
                    const el = fields[this.getAttribute('data-address-for')];validation(this,el.item,el.danger);
                };
            }
            ele.oninput = function(){
                const el = fields[this.getAttribute('data-address-for')];el.item.classList.remove('invalid');
                if (el.danger.innerHTML){el.danger.innerHTML='';}el.field.value = el.value+this.value;
            };
            ele.oninvalid = function(event){event.preventDefault();
                this.classList.add('first');const el = fields[this.getAttribute('data-address-for')];validation(this,el.item,el.danger,msg);
            };
        } else if (pattern.test(ele.type)){
            ele.addEventListener('blur',function(){this.classList.add('first');},{once:true});
        }
    });

    eles = document.querySelectorAll('textarea');
    eles.forEach(ele => {
        if (!ele.hasAttribute('title')){ele.setAttribute('title','\u8bf7\u8f93\u5165\u6587\u5b57\u5185\u5bb9');}
        ele.addEventListener('blur', function(){this.classList.add('first');},{once:true});
        ele.oninvalid = function(){this.classList.add('first');};
        if (ele.hasAttribute("name")) {
            const req = document.querySelector(`.form-item[data-name="${ele.getAttribute('name')}"] .field-title`);
            if (ele.hasAttribute('required')){req.classList.add('required');} else {req.classList.remove('required');}
            const item = document.querySelector(`.form-item[data-name="${ele.getAttribute('name')}"]`);
            const danger = document.querySelector(`.text-danger[data-valmsg-for="${ele.getAttribute('name')}"]`);
            const msg = ele.getAttribute('data-val-required') || inputMsg;
            ele.onblur = function(){validation(this,item,danger,msg);};
            ele.oninput = ()=>{item.classList.remove('invalid');if (danger.innerHTML){danger.innerHTML='';}};
            ele.oninvalid = function(event){event.preventDefault();this.classList.add('first');validation(this,item,danger,msg);};
        }
    });

    eles = document.querySelectorAll("select");
    eles.forEach(ele => {
        let msg = ele.getAttribute('data-val-required') || selectMsg;
        if (!ele.hasAttribute('title')){ele.setAttribute('title','\u8bf7\u9009\u62e9');}
        ele.addEventListener('blur', function(){this.classList.add('selected');},{once:true});
        ele.onchange = function(){this.classList.add('selected');};
        ele.oninvalid = function(){this.classList.add('selected');};
        if (ele.hasAttribute('data-address-for') && ele.hasAttribute('data-address-name')){
            fields[ele.getAttribute('data-address-for')][ele.getAttribute('data-address-name')] = ele;
            if (ele.getAttribute('data-address-name') === 'province'){
                msg = ele.getAttribute('data-val-required') || '\u8bf7\u9009\u62e9\u7701\u4efd';
                if (ele.dataset.type === 'addr') {
                    ele.onchange = function(){this.classList.add('selected');
                        const el = fields[this.getAttribute('data-address-for')];
                        el.item.classList.remove('invalid');el.danger.innerHTML='';
                        el.city.value = '';el.county.value = '';el.field.value = '';
                        getAddressOptions(el.city, this.value);
                    };
                } else if (ele.dataset.type === 'address'){
                    ele.onchange = function(){this.classList.add('selected');
                        const el = fields[this.getAttribute('data-address-for')];
                        el.item.classList.remove('invalid');el.danger.innerHTML='';
                        el.city.value='';el.county.value='';el.detail.value='';el.field.value='';el.detail.readOnly=true;
                        getAddressOptions(el.city, this.value);
                    };
                }
            } else if (ele.getAttribute('data-address-name') === 'city') {
                msg = ele.getAttribute('data-val-required') || '\u8bf7\u9009\u62e9\u57ce\u5e02';
                if (ele.dataset.type === 'addr') {
                    ele.onchange = function(){this.classList.add('selected');
                        const el = fields[this.getAttribute('data-address-for')];
                        el.item.classList.remove('invalid');el.danger.innerHTML='';
                        el.county.value = '';el.field.value = '';
                        el.field.value = el.province.selectedOptions[0].textContent+this.selectedOptions[0].textContent;
                        getAddressOptions(el.county, this.value);
                    };
                } else if (ele.dataset.type === 'address'){
                    ele.onchange = function(){this.classList.add('selected');
                        const el = fields[this.getAttribute('data-address-for')];
                        el.item.classList.remove('invalid');el.danger.innerHTML='';
                        el.county.value='';el.detail.value='';el.field.value='';el.detail.readOnly=false;
                        el['value'] = el.province.selectedOptions[0].textContent+this.selectedOptions[0].textContent;
                        el.field.value = el.value;
                        getAddressOptions(el.county, this.value);
                    };
                }
            } else if (ele.getAttribute('data-address-name') === 'county') {
                msg = ele.getAttribute('data-val-required') || '\u8bf7\u9009\u62e9\u533a\u53bf';
                if (ele.dataset.type === 'addr') {
                    ele.onchange = function(){this.classList.add('selected');
                        const el = fields[this.getAttribute('data-address-for')];
                        el.item.classList.remove('invalid');el.danger.innerHTML='';
                        el.field.value = el.province.selectedOptions[0].textContent+el.city.selectedOptions[0].textContent+this.selectedOptions[0].textContent;
                    };
                } else if (ele.dataset.type === 'address'){
                    ele.onchange = function(){this.classList.add('selected');
                        const el = fields[this.getAttribute('data-address-for')];
                        el.item.classList.remove('invalid');el.danger.innerHTML='';
                        el.detail.value='';el.detail.readOnly=false;
                        el['value'] = el.province.selectedOptions[0].textContent+el.city.selectedOptions[0].textContent+this.selectedOptions[0].textContent
                        el.field.value = el.value;
                    };
                }
            }
            ele.onblur = function(){const el = fields[this.getAttribute('data-address-for')];validation(this,el.item,el.danger,msg);};
            ele.oninvalid = function(event){event.preventDefault();this.classList.add('selected');
                const el = fields[this.getAttribute('data-address-for')];validation(this,el.item,el.danger,msg);
            };
        } else if (ele.hasAttribute('name')){
            const req = document.querySelector(`.form-item[data-name="${ele.getAttribute('name')}"] .field-title`);
            if (ele.hasAttribute('required')){req.classList.add('required');} else {req.classList.remove('required');}
            const item = document.querySelector(`.form-item[data-name="${ele.getAttribute('name')}"]`);
            const danger = document.querySelector(`.text-danger[data-valmsg-for="${ele.getAttribute('name')}"]`);
            ele.onchange = function(){this.classList.add('selected');item.classList.remove('invalid');danger.innerHTML='';};
            ele.onblur = function(){validation(this,item,danger,msg);};
            ele.oninvalid = function(event){event.preventDefault();this.classList.add('selected');validation(this,item,danger,msg);};
        }
    });
    eles = document.querySelector('.form-button > button[type="reset"]');
    if (eles){eles.onclick = ()=>{
        document.querySelectorAll('.form-item.invalid, input.invalid').forEach(ele=>{ele.classList.remove('invalid');});
        document.querySelectorAll('input.first, textarea.first').forEach(ele=>{ele.classList.remove('first');});
        document.querySelectorAll('select.selected').forEach(ele=>{ele.classList.remove('selected');});
        document.querySelectorAll('.text-danger').forEach(ele=>{ele.innerHTML='';});
    }}
    eles = document.querySelector('.form-button > button[type="submit"]');
    if (eles) {eles.onclick = ()=>{
        const invalid = document.querySelector('input:invalid, select:invalid, textarea:invalid');if (invalid){invalid.focus();}
    };}
    eles = document.querySelectorAll('.form-group');
    formStyleToggle = ()=>{eles.forEach((group)=>{group.classList.toggle('nowrap');});}
})();
