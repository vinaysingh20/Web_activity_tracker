let url = new URL(document.URL);
let blockSiteUrl = url.searchParams.get("XTYZA@K");
const x = document.getElementById('idd');
x.innerText = blockSiteUrl;
let t1 = blockSiteUrl.split('www.');
let tit = (t1[1] || t1[0]);
document.getElementById('title').innerText = tit;