/* default */
var metaUrl = import.meta.url;
var root = null;
var viewWrap;
var scale = 0;
var animation;
var scaleTotalV = 0;
var dropzones;

export function setCommonRoot(shadowRoot, functions) {
	root = shadowRoot;
    viewWrap = root.querySelector('#viewWrap');
    dropzones = Array.from(root.querySelectorAll('.dropzone'));
    console.log('embed-test', root, functions);
};

/* default end */
export function autoScale(){
    const findWidth = root.querySelector('#viewWrap');
    const width = findWidth.offsetWidth; // 너비
    const height = findWidth.offsetHeight; // 높이
    const givenWidth = 1087; // 주어진 너비
    const givenHeight = 612; // 주어진 높이
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

export function getScale() {
    return scale;
}

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
        //   resetAnimation();
        //   restartAnimation();
      }
    } else {
      cancelFullScreen.call(doc);
      // 일반 이미지로 변경
      root.querySelector('#fullScreenButton > img').src = new URL('../img/btn-fullscreen-on.png', metaUrl);
      if(scaleTotalV==0){
        //   resetAnimation();
        //   restartAnimation();
      }
    }
}

export function calcDistance(x1, x2, y1, y2) {
    var a = parseFloat(x1) - parseFloat(x2);
    var b = parseFloat(y1) - parseFloat(y2);
    return Math.sqrt( a*a + b*b );
};

/**
 * useClosest true이면 allowDistance 이내의 가장 가까운 드랍존에 드랍 (드랍존 영역 밖이어도)
 * useClosest false이면 드랍존 내부에만 드랍
 */
export function createDraggable(targetEl, onDroppedCallback, option = {useClosest: true, allowDistance: 50}) {
    var orgParent, orgPosition, orgLeft, orgTop;
    var startX, startY;
    function startDrag(touchX, touchY) {
        // 위치 백업
        orgParent = targetEl.parentElement;
        orgPosition = targetEl.style.position;
        orgLeft = targetEl.style.left;
        orgTop = targetEl.style.top;
        
        var rect = targetEl.getBoundingClientRect();
        var offsetX = rect.width * 0.6;
        var offsetY = rect.height * 0.6;
        var newX = touchX - offsetX;
        var newY = touchY - offsetY;

        targetEl.setAttribute('data-touch-offset-x', offsetX);
        targetEl.setAttribute('data-touch-offset-y', offsetY);

        viewWrap.appendChild(targetEl);

        targetEl.style.position = 'absolute';
        targetEl.style.left = (newX) + 'px';
        targetEl.style.top = (newY) + 'px';
        targetEl.style.transform = 'scale(' + scale + '%)';
    }

    function moveDrag(touchX, touchY) {
        var offsetX = parseFloat(targetEl.getAttribute('data-touch-offset-x'));
        var offsetY = parseFloat(targetEl.getAttribute('data-touch-offset-y'));

        var newX = touchX - offsetX;
        var newY = touchY - offsetY;

        targetEl.style.left = (newX) + 'px';
        targetEl.style.top = (newY) + 'px';
    }

    function restoreElementPos() {
        // 요소의 위치 복구
        orgParent.appendChild(targetEl);
        targetEl.style.position = orgPosition;
        targetEl.style.left = orgLeft;
        targetEl.style.top = orgTop;
        targetEl.style.transform = '';
    }

    function endDrag(touchX, touchY) {
        var offsetX = parseFloat(targetEl.getAttribute('data-touch-offset-x'));
        var offsetY = parseFloat(targetEl.getAttribute('data-touch-offset-y'));
        
        // 가장 가까운 드랍존 찾기
        dropzones.forEach(dropzone => {
           var rect = dropzone.getBoundingClientRect();
           var posX = rect.left + (rect.width / 2);
           var posY = rect.top + (rect.height / 2);
           var dist = calcDistance(touchX, posX, touchY, posY);
           dropzone.distanceFromTouch = dist;
        });
        dropzones.sort((a,b) => a.distanceFromTouch > b.distanceFromTouch ? 1 : -1);
        var closestDropzone = dropzones[0];

        if (!closestDropzone.hasAttribute('force-check-dropzone') && option.useClosest) {
            if (closestDropzone.distanceFromTouch <= (option.allowDistance * (100 / scale) )) {
                onDroppedCallback(closestDropzone, dropzones);
            }
        } else {
            var areaRect = closestDropzone.getBoundingClientRect();
            var areaLeft = areaRect.left;
            var areaTop = areaRect.top;
            var areaRight = areaRect.right;
            var areaBottom = areaRect.bottom;
            
            // 터치한 위치가 드롭 영역 내에 있는지 확인
            if (touchX >= areaLeft && touchX <= areaRight &&
                touchY >= areaTop && touchY <= areaBottom) {
                // 드롭 영역 내에 드롭되었을 때 실행할 코드 작성
                onDroppedCallback(closestDropzone);
            }
        }
    }

    // mobile start
    targetEl.addEventListener('touchstart', e => {
        var touchLocation = e.touches[0];
        startDrag(touchLocation.clientX, touchLocation.clientY);
    }, { passive: true });
    targetEl.addEventListener('touchmove', e => {
        var touchLocation = e.touches[0];
        moveDrag(touchLocation.clientX, touchLocation.clientY);
    }, { passive: true });
    targetEl.addEventListener('touchend', e => {
        var touchLocation = e.changedTouches[0];
        restoreElementPos();
        endDrag(touchLocation.clientX, touchLocation.clientY);
    });
    // mobile end

    // desktop start
    var previewEl;
    var imgSize = 166;
    targetEl.addEventListener('dragstart', e => {
        previewEl = targetEl.querySelector('.rotate-holder').cloneNode(true);
        previewEl.classList.add('drag-preview');
        viewWrap.appendChild(previewEl);
        previewEl.style.position = "fixed";
        var previewSize = imgSize * scale / 100;
        previewEl.style.width = previewSize + 'px';
        previewEl.style.height = previewSize + 'px';
        previewEl.style.opacity = 1;
        previewEl.style.zIndex = 9;
        previewEl.style.cursor = 'move';
        
        var img = previewEl.querySelector('img');
        var imgSrc = img.src.slice(img.src.lastIndexOf('/') + 1, img.src.lastIndexOf('.'));
        const imgNum = imgSrc.match(/\d+/)[0];

        img.src = new URL(`../img/selected-piece-${imgNum}.png`, metaUrl).href;
        img.style.width = '90%';
        img.style.height = 'auto';

        // e.dataTransfer.dropEffect = 'move';
        // e.dataTransfer.setDragImage(previewEl, previewSize * 0.5, previewSize * 0.5);
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        previewEl.style.display = 'none';
    }, false);

    targetEl.addEventListener('drag', e => {
        var previewSize = imgSize * scale / 100;
        var inversedStart = targetEl.getAttribute('data-inversed') == 'true';  // 역삼각형으로 시작했는지?
        var angle = parseInt(targetEl.getAttribute('data-angle'));   // 시계방향으로 몇 도 회전했는지
        var inversedPiece = (angle / 60) % 2 == 1 ? true : false;
        inversedPiece = inversedStart ? !inversedPiece : inversedPiece;
        var offsetX = 0, offsetY = 0;
        if (inversedStart) {
            if (inversedPiece) {
                offsetX = 10 * scale / 100;
                offsetY = 1 * scale / 100;
            } else {
                offsetX = -1 * scale / 100;
                offsetY = -30 * scale / 100;
            }
        } else {
            if (inversedPiece) {
                offsetX = 10 * scale / 100;
                offsetY = 30 * scale / 100;
            }
        }
        previewEl.style.left = (e.pageX - (previewSize / 2) + offsetX)  + "px";
        previewEl.style.top = (e.pageY + 5 - (previewSize / 2) + offsetY) +  "px";
        console.log(previewEl.style.top);
        console.log(previewEl.style.left);
        previewEl.style.display = 'block';
    });
    targetEl.addEventListener('dragend', e => {
        previewEl.remove();
        endDrag(e.clientX, e.clientY);
    });
    // desktop end

}


