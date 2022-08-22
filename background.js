setInterval(()=>{
    // Fetching current active tab 
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        
        if (currentWindow.focused) {
            let activeTab = currentWindow.tabs.find(t => t.active === true);
            
            // Redirecting back the page removed from blacklist
            redirectBack(activeTab);

            // Managing Current active tab in storage
            chrome.storage.local.get({tabs:[]},(result)=>{
                let arr = result.tabs;
                let tab = arr.find(t=> t.domain === getHostName(activeTab.url));
                chrome.storage.local.get({allTabs:[]},(res)=>{
                    let allArr = res.allTabs;
                    let alltab = allArr.find(t => t.domain === getHostName(activeTab.url));
                    chrome.browserAction.setBadgeText({text: ''});
                    if(tab){
                        showBadge(tab.limit,tab.counter);
                        showNotification(tab.limit);
                        counterAndLimitManager(tab);
                        faviconValidator(tab,activeTab);
                        blacklistAndStorageUpdate(tab,arr);
                        alltab.counter++;
                        faviconValidator(alltab,activeTab);
                        chrome.storage.local.set({allTabs:allArr}, ()=> {});
                    } else {
                        if(alltab){
                            alltab.counter++;
                            faviconValidator(alltab,activeTab);
                            chrome.storage.local.set({allTabs:allArr}, ()=> {});
                        } else {
                            let alldomain = getHostName(activeTab.url);
                            let allfavicon = activeTab.favIconUrl;
                            if(isValidUrl(activeTab.url)){
                                let tb = new Tab(alldomain,allfavicon,0);
                                tb.blacklist = false;
                                tb.limit = -1;
                                faviconValidator(tb,{});
                                allArr.push(tb);
                                chrome.storage.local.set({allTabs:allArr},()=>{});
                            }
                        }
                        let domain = getHostName(activeTab.url);
                        let favicon = activeTab.favIconUrl;
                        if(isValidUrl(activeTab.url)){
                            addNewTab(domain,favicon,arr,-1);
                        }
                    }
                    chrome.storage.local.get(['s'], (res)=>{
                        let ss = res.s;
                        if(!ss) ss = 15600;
                        console.log(ss);
                        let time = getTimeLong(ss)
                        let d = new Date();
                        let h = d.getHours();
                        let m = d.getMinutes();
                        if(h == time[0] && m == time[1]){
                            removeData();
                        }
                    });
                });
            });
        }
    });
},1000);
