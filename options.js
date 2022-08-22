const resetBL = document.getElementById('resetBL');
const submitTime = document.getElementById('submitTime');
const reset = document.getElementById('reset');
const resetAll = document.getElementById('resetAll');

document.addEventListener('DOMContentLoaded',function(){

    reset.addEventListener('click',(e)=>{
        alert.innerHTML = '';
        chrome.storage.local.set({tabs:[]},()=>{});
        chrome.storage.local.set({bl:[]},()=>{
            textArea.innerHTML = '';
            blacklist.value = '';
        });
    });

    resetAll.addEventListener('click',(e)=>{
        alert.innerHTML = '';
        chrome.storage.local.set({tabs:[]},()=>{});
        chrome.storage.local.set({allTabs:[]},()=>{});
        chrome.storage.local.set({s:15600},()=>{});
        chrome.storage.local.set({bl:[]},()=>{
            textArea.innerHTML = '';
            blacklist.value = '';
        });
    });

    submitTime.addEventListener('click',(e)=>{
        let st = stringToSec(resetTime[0].value);
        chrome.storage.local.get(['s'], ()=> {
            chrome.storage.local.set({s:st});
          
        });
    });
    
    submit.addEventListener('click',(e)=>{
        alert.innerHTML = '';
        let x = blacklist.value;

        let ss = stringToSec(time[0].value);
        if(x){
            chrome.storage.local.get({tabs:[]},(result)=>{
                let arr = result.tabs;
                let tab = arr.find(t=> t.domain === x);
                if(tab){
                    tab.blacklist = true;
                    tab.limit = ss;
                    chrome.storage.local.set({tabs:arr},()=>{});
                } else {
                    chrome.storage.local.get({allTabs:[]},(res) =>{
                        let allArr = res.allTabs;
                        let alltab = allArr.find(t => t.domain === x);
                        if(!alltab){
                            let alldomain = x;
                            let allfavicon = null;
                            let tb = new Tab(alldomain,allfavicon,0);
                            tb.blacklist = false;
                            tb.limit = -1;
                            faviconValidator(tb,{});
                            allArr.push(tb);
                            chrome.storage.local.set({allTabs:allArr},()=>{});
                        }
                    });
                    addNewTab(x,null,arr,ss,true);
                }
                addBlackList(x);
            });
            blacklist.value = '';
            time[0].value = '';
        } else {
            alert.insertAdjacentHTML("afterbegin", `<div class="alert alert-danger">
                                                        Enter A domain name to be blacklisted!!!
                                                    </div>`);
        }
    });

    resetBL.addEventListener('click', (e)=> {
        resetBlacklist();
    });    

    chrome.storage.local.get({bl:[]},result=>{
        let arr = result.bl;
        viewBlackList(arr);
    });
});