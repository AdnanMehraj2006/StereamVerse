/* background media wall */

const thumbnails=[
"ylDNZaYy9kY",
"xeXV1KoX034",
"jNQXAC9IVRw",
"ysz5S6PUM-U",
"kJQP7kiw5Fk",
"dQw4w9WgXcQ",
"9bZkp7q19f0",
"3JZ_D3ELwOQ",
"L_jWHffIx5E",
"RgKAFK5djSk"
];

const wall=document.querySelector(".media-wall");

function randomThumbnail(){
let id=thumbnails[Math.floor(Math.random()*thumbnails.length)];
return "https://i.ytimg.com/vi/"+id+"/hqdefault.jpg";
}

function buildWall(){

wall.innerHTML="";

const imgWidth=220;
const imgHeight=160;

const cols=Math.ceil(window.innerWidth/imgWidth);
const rows=Math.ceil(window.innerHeight/imgHeight);

const total=cols*rows;

for(let i=0;i<total;i++){

let img=document.createElement("img");
img.src=randomThumbnail();
wall.appendChild(img);

}

}

function rotateThumbnails(){

const imgs=document.querySelectorAll(".media-wall img");

imgs.forEach(img=>{

img.style.opacity=0;

setTimeout(()=>{

img.src=randomThumbnail();
img.style.opacity=1;

},400);

});

}

buildWall();
setInterval(rotateThumbnails,5000);
window.addEventListener("resize",buildWall);



/* universal video player */

function playVideo(){

let url=document.getElementById("urlInput").value.trim();

let iframe=document.getElementById("framePlayer");
let video=document.getElementById("videoPlayer");

iframe.style.display="none";
video.style.display="none";

iframe.src="";
video.pause();
video.src="";

document.getElementById("placeholder").style.display="none";


/* Google Drive */

if(url.includes("drive.google.com") || url.includes("drive.usercontent")){

let id="";

if(url.includes("id=")){
id=url.split("id=")[1].split("&")[0];
}
else if(url.includes("/d/")){
id=url.split("/d/")[1].split("/")[0];
}

iframe.src="https://drive.google.com/file/d/"+id+"/preview";
iframe.style.display="block";

}


/* HLS stream (.m3u8) */

else if(url.includes(".m3u8")){

video.style.display="block";

if(window.Hls && Hls.isSupported()){

let hls=new Hls();
hls.loadSource(url);
hls.attachMedia(video);

}else{

video.src=url;

}

}


/* DASH stream (.mpd) */

else if(url.includes(".mpd")){

video.style.display="block";

if(window.dashjs){

let player=dashjs.MediaPlayer().create();
player.initialize(video,url,true);

}else{

video.src=url;

}

}


/* direct video */

else if(url.match(/\.(mp4|webm|ogg)$/i)){

video.src=url;
video.style.display="block";

}


/* fallback */

else{

iframe.src=url;
iframe.style.display="block";

}

}



/* placeholder animation control */

const urlInput=document.getElementById("urlInput");
const marquee=document.querySelector(".placeholder-marquee");
const clearBtn=document.getElementById("clearBtn");

function togglePlaceholder(){

if(urlInput.value.trim()!==""){

marquee.style.display="none";
clearBtn.style.display="inline-block";

}else{

marquee.style.display="block";
clearBtn.style.display="none";

}

}

urlInput.addEventListener("input",togglePlaceholder);

urlInput.addEventListener("paste",()=>{
setTimeout(togglePlaceholder,50);
});

urlInput.addEventListener("blur",togglePlaceholder);



/* clear function */

function clearInput(){

urlInput.value="";

let iframe=document.getElementById("framePlayer");
let video=document.getElementById("videoPlayer");

iframe.src="";
video.pause();
video.src="";

iframe.style.display="none";
video.style.display="none";

document.getElementById("placeholder").style.display="flex";

togglePlaceholder();

}



/* linkedin redirect */

document.getElementById("linkedinName").addEventListener("click",function(){
window.open("https://linkedin.com/in/adnan-mehraj-611904344","_blank");
});