function checkpip() {
  const videos = Array.from(document.querySelectorAll('video'))
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false)
    .filter(video => video.currentTime > 0 && !video.paused && !video.ended) // Filter: Ensure Video is Playing
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0]||{width:0,height:0};
      const v2Rect = v2.getClientRects()[0]||{width:0,height:0};
      return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
    });

  if (videos.length >= 0){
    let pipCount = 0;
    videos.forEach(video => { if (video.hasAttribute('__pip__')) pipCount++; });
    if (pipCount > 0) return true; // has pip
    else return false; // no pip found
  }
}

checkpip();