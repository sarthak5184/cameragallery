let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";

let recorder;
let constraints = {
    video: true,
    audio: true
}
let chunks=[];// media data in chunks

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);
        recorder.addEventListener("start", (e) => {
            chunks = [];
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
        recorder.addEventListener("stop", (e) => {
            // Conversion of media chunks data to video
            let blob = new Blob(chunks,{ type: "video/mp4" });
            if(db)
            {
              let videoId=shortid();
              let dbTransaction=db.transaction("video","readwrite");
              let videoStore=dbTransaction.objectStore("video");// transaction se direct objectstore me jaana
              let videoEntry={
                id:`vid-${videoId}`,
                blobData:blob
              }
              videoStore.add(videoEntry);
            }
            // let videoURL=URL.createObjectURL(blob);
            // let a = document.createElement("a");
            // a.href = videoURL;
            // a.download = "stream.mp4";
            // a.click();
        })
    })
recordBtnCont.addEventListener("click",(e)=>{
   if(!recorder) return;

   recordFlag=!recordFlag;
   if(recordFlag==true)
   { // start
     recorder.start();//recording started
     recordBtn.classList.add("scale-record");//animations added
     startTimer();
   }
   else{
     // stop
     recorder.stop();//recording removed
     recordBtn.classList.remove("scale-record");// animation removed
     stopTimer();
   }
})
// downloading image from url 
captureBtnCont.addEventListener("click",(e)=>{
  let canvas=document.createElement("canvas");
  // captureBtn.classList.add("scale-capture");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let tool=canvas.getContext('2d')
  tool.drawImage(video,0,0,canvas.width,canvas.height);

  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageurl = canvas.toDataURL();
  if(db)
  {
    let imageID=shortid();
    let dbTransaction=db.transaction("image","readwrite");
    let imageStore=dbTransaction.objectStore("image");// transaction se direct objectstore me jaana
    let imageEntry={
      id:`img-${imageID}`,
      url:imageurl
    }
    imageStore.add(imageEntry);
  }
  // let a = document.createElement("a");
  // a.href = imageurl;
  // a.download = "image.jpg";
  // a.click();
})
let timerID;
let counter=0;
let timer=document.querySelector(".timer")

function startTimer(){
  timer.style.display="block";
  function displaytimer(){
    let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600; // remaining value

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60; // remaining value

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

    counter++;
  }
 timerId=setInterval(displaytimer,1000);
}
function stopTimer(){
  clearInterval(timerId);
  timer.innerText="00:00:00";
  timer.style.display="none";
}
// filtering logic
// Filtering logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        // Get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})


