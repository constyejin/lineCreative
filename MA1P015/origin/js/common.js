/* default */
var metaUrl = import.meta.url;
var root = null;
var scale = 0;
var animation;
var scaleTotalV = 0;

export function setCommonRoot(shadowRoot, functions) {
	root = shadowRoot;
    console.log('embed-test', root, functions);
};

export function toggleFullScreen() {
  var doc = document;
  var docEl = root.firstElementChild;

  var requestFullScreen = doc.documentElement.requestFullscreen || doc.mozRequestFullScreen || doc.webkitRequestFullScreen || doc.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
    // 전체화면 이미지로 변경
    root.querySelector('#fullScreenButton > img').src = new URL('../img/btn-fullscreen-off.png', metaUrl).href;
    if(scaleTotalV==0){
        resetAnimation();
        restartAnimation();
    }
  } else {
    cancelFullScreen.call(doc);
    // 일반 이미지로 변경
    root.querySelector('#fullScreenButton > img').src = new URL('../img/btn-fullscreen-on.png', metaUrl);
    if(scaleTotalV==0){
        resetAnimation();
        restartAnimation();
    }
  }
}

export function autoScale(){
    const findWidth = root.querySelector('#viewWrap');
    const width = findWidth.offsetWidth; // 너비
    const height = findWidth.offsetHeight; // 높이
    const givenWidth = 1087; // 주어진 너비
    const givenHeight = 476 // 주어진 높이
    const targetWidth = width; // 원하는 너비
    const targetHeight = height; // 원하는 높이
    // 주어진 너비에서의 스케일 계산
    const calculatedScaleWidth = (targetWidth / givenWidth) * 100;
    const calculatedScaleHeight = (targetHeight / givenHeight) * 100;
    // width, height 중에서 더 작은 값을 기준으로 스케일 적용
    const calculatedScale = Math.min(calculatedScaleWidth, calculatedScaleHeight);
    const wrap = root.querySelector(".wrap");
    wrap.style.transform = "scale(" + calculatedScale + "%)";
    scale = calculatedScale;
}