const DialogStyle = document.createElement('style');
DialogStyle.setAttribute('type', 'text/css');
DialogStyle.innerHTML = `
dialog {
    --dialog-header-bgcolor: #E81123;
    --dialog-page-width: 40em;
    --dialog-page-height: 100%;
    --dialog-page-title-color: balck;
    --dialog-page-title-bgcolor: white;
    --dialog-page-top-radius: 0;
    --dialog-page-bottom-radius: 0;
}
dialog {padding: 0;color: inherit;border-width: 0;border-style: none;}
dialog.page {
    width: 100%;
    inset-block-start: initial;
    height: 100%;
    max-height: 100%;
}
dialog:not(.page) {box-shadow: 0px 4px 15px 2px rgba(46,46,46,0.52);}
.dialog-box {max-height: 75vh;display: flex;flex-direction: column;}
.dialog-page-box {height: 100%;display: flex;flex-direction: column;}
.dialog-box > header, .dialog-box > footer {flex: none;}
.dialog-box > div {flex: auto;overflow-y: auto;}
.dialog-box > header {
    padding-left: 1.4em;
    line-height: 2.5em;
    color: white;
    border-top-left-radius: 0.2em;
    border-top-right-radius: 0.2em;
    background-color: var(--dialog-header-bgcolor);
}
.dialog-box > footer {
    margin-top: 1.8em;
    margin-bottom: 1.1em;
    padding: 0 1.5em;
    display: flex;
    column-gap: 1em;
}
.dialog-box > div {margin-top: 2em;padding: 0 1.5em;}
.dialog-box > div > p {min-height: 2em;}
.dialog-box > div > label > span {display: block;}
.dialog-box > div > label > input {
    box-sizing: border-box;
    margin-top: 0.4em;
    padding: 0.6em;
    width: 100%;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(204,204,204);
    border-radius: 0.22em;
    background-color: white;
}
input[type="text"]:focus {border-color: rgb(110,168,246) !important;}
.dialog-box > footer > button {padding-inline: 2em;line-height: 2.2em;}
.dialog-box > footer > button[value="false"] {color: initial;background-color: #E5E5E5;}
.dialog-box > footer > button[value="false"]:hover {background-color: #D5D5D5;}
.dialog-box > footer > button[value="false"]:active {background-color: #BFBFBF;}
.dialog-page-body {flex: auto;overflow: auto;}
.dialog-page-head {
    flex: none;
    display: flex;
    padding: 0.2em 0.2em 0;
    align-items: center;
    justify-content: space-between;
    background-color: var(--dialog-page-title-bgcolor);
}
.dialog-page-head > span {font-weight: bold;color: var(--dialog-page-title-color);;}
.dialog-page-head > button[value="close"] {
    outline: none;
    appearance: none;
    padding: 0 0.5em;
    font-size: 1.05em;
    line-height: 1.5em;
    color: #505050;
    background-color: var(--dialog-page-title-bgcolor);
}
.dialog-page-head > button:hover {color: #f05252;background-color: #e7e7e7;}
@media all and (orientation: landscape) {
    dialog.page {
        max-width: var(--dialog-page-width);
        border-bottom-right-radius: var(--dialog-page-bottom-radius);
        border-bottom-left-radius: var(--dialog-page-bottom-radius);
        box-shadow: 0px 4px 15px 2px rgba(46,46,46,0.52);
    }
    dialog.page::backdrop {background-color: rgba(0,0,0,0.5);}
    dialog:not(.page)::backdrop {background-color: rgba(0,0,0,0.3);}
    dialog:not(.page) {width: 32em;max-width: 90%;border-radius: 0.2em;}
    .dialog-box > footer {justify-content: flex-end;}
}
@media all and (orientation: portrait) {
    dialog.page {
        max-width: none;
        height: var(--dialog-page-height);
        border-top-left-radius: var(--dialog-page-top-radius);
        border-top-right-radius: var(--dialog-page-top-radius);
    }
    dialog::backdrop {background-color: rgba(0,0,0,0.65);}
    dialog:not(.page) {width: 80%;border-radius: 0.35em;}
    .dialog-box > header {display: none;}
    .dialog-box > footer {justify-content: center;}
}`;
document.head.appendChild(DialogStyle);
const dialogShow = (dialog) => {dialog.showModal();document.body.style.overflow = "hidden";}
const dialogClose = (dialog) => {document.body.style.overflow = "auto";dialog.close();}
const Alert = (message='',title='\u63d0\u793a') => {
    return new Promise((resolve, reject)=>{
        const dialog = document.createElement('dialog');
        dialog.innerHTML = `<div class="dialog-box"><header inert>${title}</header><div><p inert>${message}</p></div><footer></footer></div>`;
        const button = document.createElement('button');
        button.setAttribute('type','button');
        button.setAttribute('value','true');
        button.innerHTML = '\u786e\u5b9a';
        button.onclick = ()=>{dialogClose(dialog);dialog.remove();resolve(true);};
        dialog.lastElementChild.lastElementChild.appendChild(button);
        document.body.appendChild(dialog);
        dialogShow(dialog);button.blur();
    });
};
const Confirm = (message='',title='\u786e\u8ba4') => {
    return new Promise((resolve, reject)=>{
        const dialog = document.createElement('dialog');
        dialog.innerHTML = `<div class="dialog-box"><header inert>${title}</header><div><p inert>${message}</p></div><footer></footer></div>`;
        const  btnConfirm = document.createElement('button');
        btnConfirm.setAttribute('type','button');
        btnConfirm.setAttribute('value','true');
        btnConfirm.innerHTML = '\u786e\u5b9a';
        btnConfirm.onclick = ()=>{dialogClose(dialog);dialog.remove();resolve(true);};
        dialog.lastElementChild.lastElementChild.appendChild(btnConfirm);
        const  btnCancel = document.createElement('button');
        btnCancel.setAttribute('type','button');
        btnCancel.setAttribute('value','false');
        btnCancel.innerHTML = '\u53d6\u6d88';
        btnCancel.onclick = ()=>{dialogClose(dialog);dialog.remove();resolve(false);};
        dialog.lastElementChild.lastElementChild.appendChild(btnCancel);
        document.body.appendChild(dialog);
        dialogShow(dialog);btnConfirm.blur();
    });
};
const Prompt = (message='\u8bf7\u8f93\u5165\uff1a',title='\u8f93\u5165') => {
    return new Promise((resolve, reject)=>{
        const dialog = document.createElement('dialog');
        dialog.innerHTML = `<div class="dialog-box"><header inert>${title}</header></div>`;
        const div = document.createElement('div');
        const label = document.createElement('label');
        const span = document.createElement('span');
        const input = document.createElement('input');
        span.innerHTML = message;
        input.setAttribute('type','text');
        input.setAttribute('name','prompt');
        input.setAttribute('required','');
        input.setAttribute('autocomplete','off');
        input.setAttribute('title','\u8bf7\u8f93\u5165');
        label.appendChild(span);
        label.appendChild(input);
        div.appendChild(label);
        dialog.lastElementChild.appendChild(div);
        const foot = document.createElement('footer');
        const btnConfirm = document.createElement('button');
        const btnCancel = document.createElement('button');
        btnConfirm.setAttribute('type','button');
        btnConfirm.setAttribute('value','true');
        btnConfirm.innerHTML = '\u786e\u5b9a';
        btnConfirm.onclick = ()=>{if(input.validity.valid){
            resolve(input.value);input.blur();dialogClose(dialog);dialog.remove();}else{input.focus();}};
        btnCancel.setAttribute('type','button');
        btnCancel.setAttribute('value','false');
        btnCancel.innerHTML = '\u53d6\u6d88';
        btnCancel.onclick = ()=>{input.blur();dialogClose(dialog);dialog.remove();;resolve(false);};
        foot.appendChild(btnConfirm);
        foot.appendChild(btnCancel);
        dialog.lastElementChild.appendChild(foot);
        document.body.appendChild(dialog);
        dialogShow(dialog);
        input.focus();
    });
};
const CreateDialogPage = (title='') => {
    document.querySelectorAll('dialog.page').forEach(ele=>ele.remove());
    const dialog = document.createElement('dialog');
    dialog.className = 'page';
    dialog.innerHTML = `<div class="dialog-page-box"><div class="dialog-page-head"><span inert>${title}</span></div></div>`;
    const button = document.createElement('button');
    button.setAttribute('type','button');
    button.setAttribute('value','close');
    button.innerHTML = '\u2715';
    button.onclick = ()=>{dialogClose(dialog);};
    dialog.firstElementChild.firstElementChild.appendChild(button);
    const body = document.createElement('div');
    body.className = 'dialog-page-body';
    dialog.firstElementChild.appendChild(body);
    document.body.appendChild(dialog);
    const GetRequestHTML = (url)=>{
        if (!url) {return 'Error';}
        if (!dialog) {return 'Error';}
        fetch(url).then(response => {if (response.ok && !response.redirected) {return response.text();}
        }).then((data)=>{body.innerHTML = data;dialogShow(dialog);}).catch(()=>console.log('Error'));
    };
    return GetRequestHTML;
};
export {Alert, Confirm, Prompt, Page};