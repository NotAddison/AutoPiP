// --- [ FUNCTION: Get Video ] --- //
function hasPlayingVideo() {
  const videos = Array.from(document.querySelectorAll('video'))
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false)
    .filter(video => video.currentTime > 0 && !video.paused && !video.ended)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0]||{width:0,height:0};
      const v2Rect = v2.getClientRects()[0]||{width:0,height:0};
      return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
    });

  if (videos.length === 0) return false;
  return true;
}

hasPlayingVideo();