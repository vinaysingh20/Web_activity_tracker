const mychart = document.getElementById('ctx2');
let arr = [];

chrome.storage.local.get({allTabs:[]},(res)=>{
    arr = res.allTabs;
    console.log(res.allTabs);
    arr = sortTabs(arr);
    let dispArr = (arr.length >= 8)? arr.slice(0,8):arr;
    let totalSum =  arr.reduce((a,b)=> a+b.counter,0);
    let dispArrSum = dispArr.reduce((a,b)=> a+b.counter,0);

    let lbl = dispArr.map(tab => {
        return tab.domain;
    });
    let ctr = dispArr.map(tab =>{
        return (tab.counter*100/totalSum).toFixed(2);
    });
    if (dispArr.length === 8) {
        lbl.push("Others");
        let otherTimePercent =  (((totalSum-dispArrSum)*100)/totalSum).toFixed(2);
        ctr.push(otherTimePercent);
    }

    let myChart = new Chart(mychart, {
        type: 'doughnut',
        data: {
            labels: lbl,
            datasets: [{
                label: 'time spent',
                data: ctr,
                backgroundColor: [
                    'rgb(210,210,250)',
                    '#FF2937',
                    '#FF7030',
                    '#FFB629',
                    '#ADDB29',
                    '#5BFF29',
                    '#29F8FF',
                    '#6D91FF',
                    '#B029FF'
                ].reverse(),
                borderWidth: 5
            }]
        },
        options: {
            legend: {
                position: 'right'
            }
        }
    });
    
});