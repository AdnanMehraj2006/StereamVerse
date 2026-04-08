/* ================= BACKGROUND MEDIA WALL ================= */

const thumbnails=[
"ylDNZaYy9kY","xeXV1KoX034","jNQXAC9IVRw","ysz5S6PUM-U",
"kJQP7kiw5Fk","dQw4w9WgXcQ","9bZkp7q19f0","3JZ_D3ELwOQ",
"L_jWHffIx5E","RgKAFK5djSk"
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

for(let i=0;i<cols*rows;i++){
let img=document.createElement("img");
img.src=randomThumbnail();
wall.appendChild(img);
}

}

function rotateThumbnails(){

document.querySelectorAll(".media-wall img").forEach(img=>{
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



/* ================= PLAYER ENGINE ================= */

let hlsInstance=null;
let dashInstance=null;

function resetPlayers(video){
if(hlsInstance){
hlsInstance.destroy();
hlsInstance=null;
}

if(dashInstance){
dashInstance.reset();
dashInstance=null;
}

video.pause();
video.removeAttribute("src");
video.load();

}

function playVideo(){

let url=document.getElementById("urlInput").value.trim();

let iframe=document.getElementById("framePlayer");
let video=document.getElementById("videoPlayer");
let placeholder=document.getElementById("placeholder");

/* hide everything */
iframe.style.display="none";
video.style.display="none";

iframe.src="";
resetPlayers(video);

placeholder.style.display="none";


/* ===== GOOGLE DRIVE ===== */

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


/* ===== HLS (.m3u8) ===== */

else if(url.includes(".m3u8")){

video.style.display="block";

if(window.Hls && Hls.isSupported()){

hlsInstance=new Hls();
hlsInstance.loadSource(url);
hlsInstance.attachMedia(video);

}else{

video.src=url;

}

}


/* ===== DASH (.mpd) ===== */

else if(url.includes(".mpd")){

video.style.display="block";

if(window.dashjs){

dashInstance=dashjs.MediaPlayer().create();
dashInstance.initialize(video,url,true);

}else{

video.src=url;

}

}


/* ===== DIRECT VIDEO (FINAL FIX) ===== */

else if(url.match(/\.(mp4|webm|ogg)$/i)){

video.style.display="block";

/* FULL CLEAN RESET */

video.pause();
video.removeAttribute("src");
video.load();

/* ASSIGN SOURCE */

video.src = url;

/* IMPORTANT: wait for metadata */

video.onloadeddata = () => {
    video.play().catch(()=>{});
};

video.load();

}


/* ===== FALLBACK ===== */

else{

iframe.src=url;
iframe.style.display="block";

}

}



/* ================= INPUT + PLACEHOLDER ================= */

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
urlInput.addEventListener("paste",()=>setTimeout(togglePlaceholder,50));
urlInput.addEventListener("blur",togglePlaceholder);



/* ================= CLEAR FUNCTION ================= */

function clearInput(){

let iframe=document.getElementById("framePlayer");
let video=document.getElementById("videoPlayer");
let placeholder=document.getElementById("placeholder");

urlInput.value="";

iframe.src="";
resetPlayers(video);

iframe.style.display="none";
video.style.display="none";

placeholder.style.display="flex";

togglePlaceholder();

}