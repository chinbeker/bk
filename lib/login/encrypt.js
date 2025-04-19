const Encrypt = (()=>{
const ele = Object.create(null);
let e = Object.create(null);
const GenerateRSAKey = async ()=>{
    try {
        const key = Object.create(null);
        const cryptoKeys = await window.crypto.subtle.generateKey(
            {name: "RSA-OAEP", modulusLength: 2048,publicExponent: new Uint8Array([0x01, 0x00, 0x01]),hash: "SHA-256"},
            true,["encrypt", "decrypt"]
        );
        const exportKeys = Object.create(null);
        const publicKey = await window.crypto.subtle.exportKey("spki", cryptoKeys.publicKey);
        Reflect.set(exportKeys, 'PublicKey', window.btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey))));
        const privateKey = await window.crypto.subtle.exportKey("pkcs8", cryptoKeys.privateKey);
        Reflect.set(exportKeys, 'PrivateKey', window.btoa(String.fromCharCode.apply(null, new Uint8Array(privateKey))));
        Reflect.set(key, 'CryptoKeys', cryptoKeys);
        Reflect.set(key, 'ExportKeys', exportKeys);
        return key;
    } catch (error) {
        throw new Error('\u521b\u5efa\u5bc6\u94a5\u65f6\u51fa\u9519');
    }
}
Reflect.set(e, 'GenerateKey', GenerateRSAKey);
const ImportRSAPublicKey = async (publicKey)=>{
    const binary = Uint8Array.from(window.atob(publicKey), c => c.charCodeAt(0)).buffer;
    return await window.crypto.subtle.importKey("spki", binary, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["encrypt"]);
}
Reflect.set(e, 'ImportPublicKey', ImportRSAPublicKey);
const ImportRSAPrivateKey = async (privateKey)=>{
    const binary = Uint8Array.from(window.atob(privateKey), c => c.charCodeAt(0)).buffer;
    return await window.crypto.subtle.importKey("pkcs8", binary, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["decrypt"]);
}
Reflect.set(e, 'ImportPrivateKey', ImportRSAPrivateKey);
const EncryptRSA = async (publicKey, plaintext)=>{
    if (publicKey == undefined || publicKey == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
    if (Object.prototype.toString.call(publicKey) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
    if (plaintext == undefined || plaintext == null) {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a');}
    if (typeof plaintext !== 'string') {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u5fc5\u987b\u662f\u5b57\u7b26\u4e32\u7c7b\u578b');}
    try {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(plaintext);
        const plaintextLength = bytes.length;
        plaintext = null;
        if (plaintextLength > 141) {
            const encryptChunks = [];
            const decoder = new TextDecoder('utf-8');
            let i = 0;
            while (i < plaintextLength){
                const encrypted = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey,
                    encoder.encode(decoder.decode(bytes.slice(i, i+141)))
                );
                encryptChunks.push(window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted))));
                i += 141;
            }
            return encryptChunks.join('');
        } else {
            const encrypted = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey, bytes);
            return window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
        }
    } catch (error) {
        throw new Error('\u52a0\u5bc6\u5931\u8d25');
    }
}
Reflect.set(e, 'Encrypt', EncryptRSA);
const DecryptRSA = async (privateKey, ciphertext)=>{
    if (privateKey == undefined || privateKey == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
    if (Object.prototype.toString.call(privateKey) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
    if (ciphertext == undefined || ciphertext == null) {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u4e0d\u80fd\u4e3a\u7a7a');}
    if (typeof ciphertext !== 'string') {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u5fc5\u987b\u4e3a\u5b57\u7b26\u4e32');}
    const ciphertextLength = new TextEncoder().encode(ciphertext).length;
    try {
        const decoder = new TextDecoder('utf-8');
        if (ciphertextLength > 344){
            const decryptChunks = [];
            let i = 0;
            while (i < ciphertextLength) {
                const binary = window.atob(ciphertext.substring(i, i+344));
                const bytes = new Uint8Array(binary.length);
                for (let i = 0;i < binary.length;i ++){bytes[i] = binary.charCodeAt(i);}
                const decrypted = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, bytes.buffer);
                decryptChunks.push(decoder.decode(decrypted));
                i += 344;
            }
            return decryptChunks.join('');
        } else {
            const binary = window.atob(ciphertext);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0;i < binary.length;i ++) {bytes[i] = binary.charCodeAt(i);}
            const decrypted = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, bytes.buffer);
            return decoder.decode(decrypted);
        }
    } catch (error) {
        throw new Error('\u89e3\u5bc6\u5931\u8d25');
    }
}
Reflect.set(e, 'Decrypt', DecryptRSA);
Reflect.set(ele, 'RSA', e);
e = Object.create(null);
const GenerateAESKey = async ()=>{
    try {
        const key = Object.create(null);
        const cryptoKey = await window.crypto.subtle.generateKey({name: "AES-GCM",length: 256}, true, ["encrypt", "decrypt"])
        Reflect.set(key, 'CryptoKey', cryptoKey);
        const raw = await window.crypto.subtle.exportKey("raw", cryptoKey);
        Reflect.set(key, 'RawKey', raw);
        Reflect.set(key, 'JwkKey', await window.crypto.subtle.exportKey("jwk", cryptoKey));
        Reflect.set(key, 'ExportKey', window.btoa(String.fromCharCode.apply(null, new Uint8Array(raw))));
        return key;
    } catch (error) {
        throw new Error('\u521b\u5efa\u5bc6\u94a5\u65f6\u51fa\u9519');
    }
}
Reflect.set(e, 'GenerateKey', GenerateAESKey);
const ImportAESKey = async (base64Key)=>{
    const binary = window.atob(base64Key);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {bytes[i] = binary.charCodeAt(i);}
    return await window.crypto.subtle.importKey("raw", bytes.buffer, {name: "AES-GCM"}, true, ["encrypt", "decrypt"]);
}
Reflect.set(e, 'ImportKey', ImportAESKey);
const EncryptAES = async (key, plaintext)=>{
    if (key == undefined || key == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
    if (Object.prototype.toString.call(key) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
    if (plaintext == undefined || plaintext == null) {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a');}
    if (typeof plaintext !== 'string') {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u5fc5\u987b\u662f\u5b57\u7b26\u4e32\u7c7b\u578b');}
    try {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await window.crypto.subtle.encrypt({name: "AES-GCM",iv: iv, tagLength: 128}, key, new TextEncoder().encode(plaintext));
        const decrypted = Object.create(null);
        Reflect.set(decrypted, 'IV', window.btoa(String.fromCharCode.apply(null, new Uint8Array(iv))));
        Reflect.set(decrypted, 'Data', window.btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext))));
        return decrypted;
    } catch (error) {
        throw new Error('\u52a0\u5bc6\u5931\u8d25');
    }
}
Reflect.set(e, 'Encrypt', EncryptAES);
const DecryptAES = async (key, iv, ciphertext)=>{
    if (key == undefined || key == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
    if (Object.prototype.toString.call(key) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
    if (iv == undefined || iv == null) {throw new Error('\u52a0\u5bc6\u5411\u91cf\u4e0d\u80fd\u4e3a\u7a7a');}
    if (typeof iv !== 'string') {throw new Error('\u52a0\u5bc6\u5411\u91cf\u5fc5\u987b\u4e3a\u5b57\u7b26\u4e32');}
    if (ciphertext == undefined || ciphertext == null) {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u4e0d\u80fd\u4e3a\u7a7a');}
    if (typeof ciphertext !== 'string') {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u5fc5\u987b\u4e3a\u5b57\u7b26\u4e32');}
    try {
        const ivBinary = window.atob(iv);
        const ivBytes = new Uint8Array(ivBinary.length);
        for (let i = 0;i < ivBinary.length;i ++) {ivBytes[i] = ivBinary.charCodeAt(i);};
        const ciphertextBinary = window.atob(ciphertext);
        const ciphertextBytes = new Uint8Array(ciphertextBinary.length);
        for (let i = 0;i < ciphertextBinary.length;i ++) {ciphertextBytes[i] = ciphertextBinary.charCodeAt(i);};
        const decrypted = await window.crypto.subtle.decrypt({name: "AES-GCM", iv: ivBytes.buffer, tagLength: 128},key,ciphertextBytes);
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        throw new Error('\u89e3\u5bc6\u5931\u8d25');
    }
}
Reflect.set(e, 'Decrypt', DecryptAES);
Reflect.set(ele, 'AES', e);
e = null;
return ele;
})();
