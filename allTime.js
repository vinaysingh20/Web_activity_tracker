const allTDispArea = document.getElementById('allTDispArea');

document.addEventListener('DOMContentLoaded',()=>{
    allTDispArea.innerHTML = '';
    chrome.storage.local.get({allTabs:[]},(res)=>{
        let arr = res.allTabs;
        arr = sortTabs(arr);
        for(let i = 0; i < arr.length; i++){
            let tab = arr[i];
            let counter = arr[i].counter;
            let timeStr = getTimeStringBig(counter);
            let favicon = tab.favicon;
            let domain = tab.domain;
            let placeholder = tab.limit === 0 ? 'Blacklisted!' : '';
            let htmlc = html(timeStr,placeholder,favicon,domain);
            allTDispArea.insertAdjacentHTML('beforeend',htmlc);
        }
    });
});