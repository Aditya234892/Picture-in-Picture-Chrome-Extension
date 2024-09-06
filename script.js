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
}

