// --- [ FUNCTION: Get Video ] --- //
function getVideos() {
  const videos = Array.from(document.querySelectorAll('video'))
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false)
    .filter(video => video.currentTime > 0 && !video.paused && !video.ended) // Filter: Ensure Video is Playing
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0]||{width:0,height:0};
      const v2Rect = v2.getClientRects()[0]||{width:0,height:0};
      return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
    });

  if (videos.length === 0) return "No Video";
  return videos[0];
}

// --- [ FUNCTION: Req PiP Player ] --- //
async function requestPictureInPicture(video) {
  await video.requestPictureInPicture();
  video.setAttribute('__pip__', true);
  video.addEventListener('leavepictureinpicture', event => {
    video.removeAttribute('__pip__');
  }, { once: true });
  new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
}

// --- [ FUNCTION: Update PiP Video ] --- //
function maybeUpdatePictureInPictureVideo(entries, observer) {
  const observedVideo = entries[0].target;
  if (!document.querySelector('[__pip__]')) {
    observer.unobserve(observedVideo);
    return "Update";
  }
  const video = getVideos();
  if (video && !video.hasAttribute('__pip__')) {
    observer.unobserve(observedVideo);
    requestPictureInPicture(video);
  }
}


// --- [ EXECUTE ] --- //
(async () => {

  // Get Video
  const video = getVideos();
  if (!video) return false;

  // Exit PiP (if already in PiP)
  if (video.hasAttribute('__pip__')) {
    try { document.exitPictureInPicture() } 
    catch (error) {}
    return "Exit";
  }

  // Request PiP
  await requestPictureInPicture(video);
  return true;
})()