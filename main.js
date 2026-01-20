function l(s) { return document.getElementById(s); }
function b64_to_utf8(str) {
	try{return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''));}
	catch(err)
	{return '';}
} 
function utf8_to_b64(str) {
	try{return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
		return String.fromCharCode(parseInt(p1, 16))
	}));}
	catch(err)
	{return '';}
}
function oxfordsJoin(arr, func) {
    if (!arr) return '';
    if (!Array.isArray(arr)) return String(arr);
    const items = arr.map(i => String(i));
    const len = items.length;
    func = func ?? (s => s);
    if (len === 0) return '';
    if (len === 1) return func(items[0]);
    if (len === 2) return func(items[0]) + ' and ' + func(items[1]);
    return items.slice(0, -1).join(', ') + ', and ' + func(items[len - 1]);
}

let save = '';
let saveVer = 0;
function importSave(saveText) {
    const errorEl = l('errorImporting');
    errorEl.style.display = 'none';
    saveText = unescape(saveText);
    l('convertSuccess').innerText = '';
    try {
        if (!saveText || !saveText.trim()) { throw new Error('No save provided'); }
        
        const b64 = saveText.replace('!END!', '').trim();
        const decoded = b64_to_utf8(b64);
        const version = decoded.split('||')[0];
        if (!version) { throw new Error('Invalid save'); }
        l('curVersion').textContent = 'Current version: v' + version;
        
        const select = l('versionSelect');
        let selectStr = ''
        ALL_VERSIONS.forEach(v => {
            selectStr += '<option value="'+v+'"'+((v == version)?' selected':'')+'>' + v + '</option>';
        });
        select.innerHTML = selectStr;
        save = decoded;
        saveVer = version;

        generateQuickConvertButtons(parseFloat(version));

        l('results').style.display = 'block';
    } catch (err) {
        errorEl.style.display = 'block';
        errorEl.textContent = 'Error importing save: ' + (err.message || err);
        l('results').style.display = 'none';
    }
}

function generateQuickConvertButtons(version) {
    l('quickConverts').innerHTML = '';
    if (!PLATFORMS_VERSION_LIST_REVERSE_MAP[(version.toFixed(3)).toString()]) { return; }

    let str = '';

    const sortedList = Object.keys(PLATFORMS_VERSION_LIST_REVERSE_MAP).sort((a, b) => Number(a) - Number(b));
    for (let i = sortedList.indexOf(version.toFixed(3)) - 1; i >= 0; i--) { 
        const verStr = sortedList[i];
        const applicableVersions = PLATFORMS_VERSION_LIST_REVERSE_MAP[sortedList[i]];
        
        str += '<button onclick="exportSave('+verStr+')">' + 'Quick convert to '+oxfordsJoin(applicableVersions, s => PLATFORMS_VERSION_NAMES[s])+' (v'+verStr+')</button>';
        str += '<br>';
    }

    if (!str) { return; }

    str = str.slice(str, str.length - ('<br>').length);
    
    l('quickConverts').innerHTML = str;
}

function exportSave(toVersion) {
    const errorEl = l('errorExporting');
    errorEl.style.display = 'none';
    l('convertSuccess').innerText = '';
    try {
        if (!save) { throw new Error('No save loaded'); }
        if (!save.includes('||')) { throw new Error('Malformed save data'); }
        if (toVersion == saveVer) { l('convertSuccess').innerText = 'Save is already at version v' + saveVer + '!'; return; }

        const rest = save.split('||').slice(1).join('||');
        const newVer = Number(toVersion).toFixed(3);
        const newDecoded = newVer + '||' + rest;

        const newB64 = escape(utf8_to_b64(newDecoded) + '!END!');

        l('convertSuccess').innerText = 'Successfully converted to v' + newVer + '!';
        l('outputField').value = newB64;
        l('outputField').focus();
        l('outputField').select();
    } catch (err) {
        errorEl.style.display = 'block';
        errorEl.textContent = 'Error exporting save: ' + (err.message || err);
    }
}

function exportSaveFromVersionSelect() {
    exportSave(l('versionSelect').value);
}