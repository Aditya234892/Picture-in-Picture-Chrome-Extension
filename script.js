function findLargestRectangleVideoTag() {
  const videosArray = Array.from(document.querySelectorAll("video"));
  // console.log(document.querySelectorAll("video"));
  
  const readyToPlayVideos = videosArray.filter((video) => {
    return video.readyState != 0 && video.disablePictureInPicture == false;
  });
  // console.log(readyToPlayVideos);

  const videos = readyToPlayVideos.sort((a, b) => {    
    const v1VideoRectangle = a.getClientRects()[0] || { width: 0, height: 0 }; 
    //a.getClientRects() will return a list of DOMRect Objects
    
    const v2VideoRectangle = b.getClientRects()[0] || { width: 0, height: 0 };
    return (
      v2VideoRectangle.width * v2VideoRectangle.height - v1VideoRectangle.width * v1VideoRectangle.height );
    });
  // console.log(videos);

  if (videos.length === 0) {
    return;
  }
  return videos[0];
}

async function requestForPIP(video) {
  await video.requestPictureInPicture();  
  video.setAttribute("pipEnabled", true);
  video.addEventListener(
    "leavepictureinpicture",
    (event) => {
      video.removeAttribute("pipEnabled");
    });
  const resizeOb = new ResizeObserver(checkAndUpdatePIPVideo);
  resizeOb.observe(video);
}

function checkAndUpdatePIPVideo(entries, observer) { //This fucntion is used for If a suitable video is found and it’s not already in PiP mode, it switches the PiP to this new video. Without ResizeObserver, once a video enters PiP mode, it will stay in PiP mode even if the size of the window or video changes, or if a larger video becomes available. This means you won’t be dynamically switching PiP mode to the largest available video as the viewport changes.
  const observedVideo = entries[0].target; 
  if (!document.querySelector("[pipEnabled]")) {
    observer.unobserve(observedVideo);
    return;
  }
  const video = findLargestRectangleVideoTag();
  if (video && !video.hasAttribute("pipEnabled")) {
    observer.unobserve(observedVideo);
    requestForPIP(video);
  }
}

(async () => {
  const video = findLargestRectangleVideoTag();
  if (!video) {
    return;
  }
  if (video.hasAttribute("pipEnabled")) {
    document.exitPictureInPicture();
    return;
  }
  await requestForPIP(video);
})();
