const blacklist = document.getElementById('blacklist');
const submit = document.getElementById('submit');
const textArea = document.getElementById('textArea');
const alert = document.getElementById('alert');


let notification5m = {
    type: "basic",
    iconUrl: "icon48.png",
    title: "Site is BlacListed",
    message: "5 min left !!!",
};

let notification1m = {
    type: "basic",
    iconUrl: "icon48.png",
    title: "Site is BlackListed",
    message: "1 min left !!!",
};

function getHostName(url){
    return url.split('/')[2];
}

function getTimeStringSmall(count){
    if (count >= 60 && count < 3600){
        let min = Math.floor(count/60);
        return min+'m';
    }
    else if (count >= 3600){
        let hr = Math.floor(count/3600);
        return hr+'h';
    }
    return count+'s';
}

function getTimeStringBig(count){
    let h = Math.floor(count/3600);
    h = prepended_number = String(h).padStart(2, '0');
    let m = Math.floor((count%3600)/60);
    m = prepended_number = String(m).padStart(2, '0');
    let s = count%60;
    s = prepended_number = String(s).padStart(2, '0');
    let timeStr = (h+'h '+m+'m '+s+'s');
    return timeStr;
}

function getTimeLong(count){
    let h = Math.floor(count/3600);
    h = prepended_number = String(h).padStart(2, '0');
    let m = Math.floor((count%3600)/60);
    m = prepended_number = String(m).padStart(2, '0');
    let s = count%60;
    s = prepended_number = String(s).padStart(2, '0');
    return [h,m,s];
}

function stringToSec(str){
    let ss = -1;    
    let hh = parseInt((str).split(':')[0]);
    let mm = parseInt((str).split(':')[1]);
    ss = hh*3600 + mm*60;
    if(isNaN(ss)){
        ss = 0;
    }
    return ss;
}

function redirectBack(activeTab){
    let url = activeTab.url;
    let index = url.indexOf("XTYZA@K");
    let val = '';
    if(index !== -1){
        index = index+8;
        for(let x = index; x < url.length; x++){
            val  = val + url[x];
        }
    }
    let dmn = val;
    if(index !== -1){
        chrome.storage.local.get({bl:[]},(res)=>{
            let arr = res.bl;
            let dm = arr.find(el => el === dmn);
            if(!dm){
                chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
                    chrome.tabs.update({url: `http://${dmn}`});
                });
            }
        });
    }
}

function showBadge(limit,counter){
    if(limit < 0 || limit > 60){
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 255, 0, 0] });
        chrome.browserAction.setBadgeText({text: getTimeStringSmall(counter)});
    }
    if(limit > 0 && limit <= 60) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: limit + 's'});
    }
}

function showNotification(limit){
    if(limit === 300){
        chrome.notifications.create('limit',notification5m);
    }
    if(limit === 60){
        chrome.notifications.create('limit',notification1m);
    }
}

function blacklistRedirection(arr,tab){
    chrome.browserAction.setBadgeText({text: ''});
    let blockUrl = chrome.runtime.getURL("block.html") + '?XTYZA@K=' + tab.domain;
    chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
        chrome.tabs.update(tab.id, { url: blockUrl });
        chrome.storage.local.set({tabs:arr},()=>{});
    });
}

function counterAndLimitManager(tab){
    if(tab.limit > 0){
        tab.limit--;
    }
    tab.counter++;
}

function faviconValidator(tab,activeTab){
    // console.log(tab.favicon);
    activeTab.favIconUrl = activeTab.favIconUrl || "chrome://favicon";
    if((tab.favicon !== undefined  && tab.favicon !== null )&& tab.favicon !== "chrome://favicon"){
        return;
    }
    tab.favicon = activeTab.favIconUrl;
}

function blacklistAndStorageUpdate(tab,arr){
    if(tab.blacklist === true && tab.limit !== -1 && tab.limit === 0){
        blacklistRedirection(arr,tab);
    } else {
        chrome.storage.local.set({tabs:arr},()=>{});
    }
}

function isValidUrl(url){
    let begStr = url.substr(0,4);
    return begStr === 'http';
}

function addNewTab(domain,favicon,arr,limit,blacklist=false){
    let tb = new Tab(domain,favicon,0);
    tb.blacklist = blacklist;
    tb.limit = limit;
    faviconValidator(tb,{});
    arr.push(tb);
    chrome.storage.local.set({tabs:arr},()=>{});
}

function deleteFromList(e){
    var domain = e.path[1].firstChild.data;
  
    var target = e.path[1];
    chrome.storage.local.get({tabs:[]},res=>{
        let arr = res.tabs;

        let node = arr.find(x => x.domain === domain);
        
        if(node){
            
            node.blacklist = false;
            node.limit = -1;
        }
        chrome.storage.local.set({tabs:arr});
       
    });

    chrome.storage.local.get({bl:[]}, res=>{
        let arr = res.bl;
        let index = arr.indexOf(domain);
        arr.splice(arr.indexOf(domain),1);
        chrome.storage.local.set({bl:arr});
    });

    textArea.removeChild(target);
    alert.innerHTML = '';
}

function addToList(domainName){
    let li = document.createElement('li');
    let btn = document.createElement('BUTTON');
    btn.className = "btn btn-danger btn-sm";
    btn.style.cssText = "margin-left:5px;"
    btn.innerText = "X";
    btn.addEventListener('click',(e)=>{
        deleteFromList(e);
    });
    li.innerText = domainName;
    textArea.appendChild(li).appendChild(btn);
}

function viewBlackList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addToList(items[i]);
        }
    }
}

function updateBlackList(domainName){
    chrome.storage.local.get({bl:[]},result=>{
        let arr = result.bl;
        arr.push(domainName);
        chrome.storage.local.set({bl:arr},()=>{});
    });
}

function present(domain){
    chrome.storage.local.get({bl:[]},res=>{
        let arr = res.bl;
        let ps = arr.find(x=> x === domain);
        if(ps){
            alert.insertAdjacentHTML("afterbegin",`<div class="alert alert-danger">
            <strong>Warning</strong> The hostname already present in the list!!!
            </div>`);
        } else {
            addToList(domain);
            updateBlackList(domain);
        }
    });
}

function addBlackList(domainName){
    present(domainName); 
}

function sortTabs(arr){
   let p =  arr.sort((a,b)=>{
        return (b.counter - a.counter);
    });
    return p;
}

function html(timeStr,placeholder,favicon,domain){
    return  `<div class = "row">
                <div class = 'col-auto'>
                    <img src="${favicon}" style = "height:30px;width:30px" class="img-thumbnail">
                </div>
                <div class = 'col-5' style="margin-left:0;">
                    ${domain}
                </div>
                <div class = 'col-3' style = "align-item:right; color:red;">
                    ${placeholder}
                </div>
                <div class = 'col-auto' align-item:right;>
                    ${timeStr}
                </div>
            </div>`;
}

function dispCurActiveDomain(tab){
    let counter = tab.counter;
    let limit = tab.limit;
    let checkOneMinLeft = false;
    let domain = tab.domain;
    let favicon = tab.favicon;
    if(favicon === undefined) favicon = 'chrome://favicon';
    if(limit <= 60 && limit > 0){
        checkOneMinLeft = true;
    }
    setInterval(() => {
        let timeStr = getTimeStringBig(counter);
        activetab.innerHTML = '';
        let htmlc;
        if(limit === -1 || limit === 0){
            placeholder = (limit === 0) ? 'Blacklisted!':'';
            htmlc = html(timeStr,placeholder,favicon,domain);
        }
        else{
            htmlc = html(timeStr,getTimeStringBig(limit),favicon,domain);
        }
        htmlc += `<hr>`;
        activetab.innerHTML = htmlc;
        if(limit > 0 || limit === -1){
            counter++;
        }
        if(limit>0) limit--;
    }, 1000);
}

function resetBlacklist(){
    chrome.storage.local.set({bl:[]});
    chrome.storage.local.get({tabs:[]}, res => {
        let arr = res.tabs;
        arr.forEach(element => {
            element.blacklist = false;
            element.limit = -1;
        });
        chrome.storage.local.set({tabs:arr});
        textArea.innerHTML = "";
    });
}


function removeData(){
    chrome.storage.local.set({tabs:[]},()=>{});
    chrome.storage.local.set({bl:[]},()=>{});
}
