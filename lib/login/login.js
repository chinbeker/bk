const Server = Object.create(null);
(async ()=>{
    const TypeOf = (target)=>{
        if (target === undefined) {return 'undefined';}
        if (target === null) {return 'null';}
        if (typeof target === 'object') {
            return Object.prototype.toString.call(target).replace(/^\[object (\S+)\]$/, '$1');
        } else {return typeof target;}
    };
    const KeyValuePairToUrlParam = (target)=>{
        if (!target) {return '';} let param = '?';
        if (typeof target === 'string') {try {target = JSON.parse(target);for (const [key, value] of Object.entries(target)) {
            param += (encodeURIComponent(key)+'='+encodeURIComponent(value)+'&');}} catch (error) {return '?'+target;}
        } else if (TypeOf(target) === 'Object') {
            for (const [key, value] of Object.entries(target)) {param += (encodeURIComponent(key)+'='+encodeURIComponent(value)+'&');}
        } else if (TypeOf(target) === 'Map') {
            for (const [key, value] of target) {param += (encodeURIComponent(key)+'='+encodeURIComponent(value)+'&');}
        } else if (typeof target === 'number') {return target; } else {return '';}
        return param.slice(0, -1);
    };
    const KeyValuePairToJSON = (target)=>{
        if (!target) {return '{}';}
        if (typeof target === 'string') {
            try{JSON.parse(target);return target;} catch (error) {return '{}';}
        } else if (TypeOf(target) === 'Object') {
            try {return JSON.stringify(target);} catch (error) {return '{}';}
        } else if (TypeOf(target) === 'Map') {
            const obj = {};for (const [key,value] of target) {obj[key] = value;}
            return JSON.stringify(obj);
        } else {return '{}';}
    };
    const GetRequestText = (url, param, resolveCallBack, rejectCallBack)=>{
        if (!url) {return 'Error';}
        if (!resolveCallBack) {resolveCallBack = (data)=>{console.log(data);};}
        if (!rejectCallBack) {rejectCallBack = ()=>{console.log('Error');}}
        if (param){url += KeyValuePairToUrlParam(param);}
        fetch(url).then(response => {
            if (response.redirected){location.replace(response.url);return false;} else {return response.text();}
        }).then(data=>resolveCallBack(data)).catch(()=>rejectCallBack());
    };
    const PostJsonRequestJSON = (url, param, resolveCallBack, rejectCallBack)=>{
        if (!url || !param) {return 'Error';}
        if (!resolveCallBack) {resolveCallBack = (data)=>{console.log(data);}}
        if (!rejectCallBack) {rejectCallBack = ()=>{console.log('Error');}}
        if (param) {param = KeyValuePairToJSON(param);}
        fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8,text/plain; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: param
            }
        ).then(response => {
            if (response.redirected){location.replace(response.url);return false;} else {return response.json();}
        }).then(data=>resolveCallBack(data)).catch(()=>rejectCallBack());
    };
    const InputRequiredMessage = (ele)=>{
        if (ele === 'Account') {return '\u8bf7\u8f93\u5165\u8d26\u53f7';
        } else if (ele === 'Password') { return '\u8bf7\u8f93\u5165\u5bc6\u7801';}
    };
    const InputMinlengthMessage = (ele)=>{
        if (ele === 'Account') {return '\u8d26\u53f7\u4e0d\u80fd\u5c11\u4e8e4\u4e2a\u5b57\u7b26';
        } else if (ele === 'Password') {return '\u5bc6\u7801\u4e0d\u80fd\u5c11\u4e8e6\u4e2a\u5b57\u7b26';}
    };
    const FormInputValidation = (ele, danger)=>{
        const state = ele.validity;
        if (state.valueMissing) {
            danger.innerHTML = ele.getAttribute('data-val-required') || InputRequiredMessage(ele.name);
        } else if (state.patternMismatch){
            danger.innerHTML = '\u8f93\u5165\u4e0d\u6b63\u786e';
        } else if (state.typeMismatch) {
            danger.innerHTML = '\u8f93\u5165\u9519\u8bef';
        } else if (state.tooShort || (ele.hasAttribute('data-val-minlength-min') && ele.value.length < parseInt(ele.getAttribute('data-val-minlength-min')))) {
            danger.innerHTML = ele.getAttribute('data-val-minlength') || InputMinlengthMessage(ele.name);
        } else if (state.valid) {
            danger.innerHTML = '';
        } else {danger.innerHTML = ele.validationMessage;}
    };
    document.documentElement.oncontextmenu=(event)=>{event.preventDefault();event.stopPropagation();return false;};
    const Account = document.querySelector('input[name="Account"]');
    const Password = document.querySelector('input[name="Password"]');
    const SecretKey = document.querySelector('input[name="Key"]');
    const AccountMessage = document.querySelector('.text-danger[data-valmsg-for="Account"]');
    const PasswordMessage = document.querySelector('.text-danger[data-valmsg-for="Password"]');
    const ValidateMessage = document.querySelector('.text-danger[data-validation-summary="Login"]');

    if (Account.hasAttribute('data-val-minlength-min')){Account.setAttribute('minlength',Account.getAttribute('data-val-minlength-min'));}
    if (Password.hasAttribute('data-val-minlength-min')){Password.setAttribute('minlength',Password.getAttribute('data-val-minlength-min'));}
    const pattern = {account : new RegExp('[a-zA-Z0-9]{1,30}'),password : new RegExp('[a-zA-Z0-9!@#$%^&*,.?<>;: ]{1,20}')};
    Account.setAttribute('pattern',pattern.account.toString().replaceAll('/',''));
    Password.setAttribute('pattern',pattern.password.toString().replaceAll('/',''));
    if (Account.hasAttribute('data-val-required')){
        Account.required = true;
        if (!Account.hasAttribute('placeholder')){Account.setAttribute('placeholder', Account.getAttribute('data-val-required'));}
        if (!Account.hasAttribute('title')){Account.setAttribute('title', Account.getAttribute('data-val-required'));}
    }
    if (Password.hasAttribute('data-val-required')){
        Password.required = true;
        if (!Password.hasAttribute('placeholder')){Password.setAttribute('placeholder', Password.getAttribute('data-val-required'));}
        if (!Password.hasAttribute('title')){Password.setAttribute('title', Password.getAttribute('data-val-required'));}
    }
    Account.oninput = ()=>{
        if (AccountMessage.innerHTML){AccountMessage.innerHTML = "";}
        if (ValidateMessage.innerHTML){ValidateMessage.innerHTML = "";}
    };
    Account.onblur = ()=>{if (Account.validity.patternMismatch){AccountMessage.innerHTML = '\u8f93\u5165\u4e0d\u6b63\u786e';}};
    Account.oninvalid = ()=>{FormInputValidation(Account, AccountMessage);};
    Account.onkeydown = (event)=>{if(event.keyCode==13){Password.focus();}};

    Password.oninput = ()=>{
        if (PasswordMessage.innerHTML){PasswordMessage.innerHTML = "";}
        if (ValidateMessage.innerHTML){ValidateMessage.innerHTML = "";}
    };
    Password.onblur = ()=>{if (Password.validity.patternMismatch){PasswordMessage.innerHTML = '\u8f93\u5165\u4e0d\u6b63\u786e';}};
    Password.oninvalid = ()=>{FormInputValidation(Password, PasswordMessage);};
    Password.onkeydown = (event)=>{if(event.keyCode==13){Login.click();}};

    const FormValidationMessage = (message)=>{
        if (message){ValidateMessage.innerHTML = message;} else {ValidateMessage.innerHTML = '\u670d\u52a1\u5668\u8fde\u63a5\u5931\u8d25';}
    };
    const Login = document.querySelector('button[type="button"][value="Login"]');
    Login.onclick = async (event)=>{
        event.preventDefault(); event.stopPropagation();
        if (Server.ConnectState){
            const acc = Account.value.trim().replace(' ','');
            const pwd = Password.value.trim();
            const inputInvalid = document.querySelectorAll('input[name]:invalid');
            if (inputInvalid.length > 0) {
                inputInvalid.forEach(input => {input.checkValidity();});
                inputInvalid[0].focus();
            } else if ((pattern.account.test(acc)) && (pattern.password.test(pwd))) {
                const user = {
                    'Account': await Encrypt.RSA.Encrypt(Server.ServerPublicKey, acc),
                    'Password': await Encrypt.RSA.Encrypt(Server.ServerPublicKey, pwd),
                    'Key': SecretKey.value
                };
                PostJsonRequestJSON('/Login', user, (data)=>{
                    if (data.message){FormValidationMessage(data.message);}
                }, ()=>{FormValidationMessage();});
            } else {FormValidationMessage('\u8d26\u53f7\u6216\u5bc6\u7801\u683c\u5f0f\u9519\u8bef');}
        } else {FormValidationMessage();}
    };
    Reflect.set(Server,'ConnectState',true);
    Reflect.set(Server,'LocalRSAKey', await Encrypt.RSA.GenerateKey());
    Reflect.set(Server,'LocalAESKey', await Encrypt.AES.GenerateKey());
    GetRequestText('/Login/Key', null, async (data)=>{
        Reflect.set(Server,'ServerPublicKey', await Encrypt.RSA.ImportPublicKey(data.trim()));
    }, ()=>{ServerConnectState=false;FormValidationMessage();});
})();
