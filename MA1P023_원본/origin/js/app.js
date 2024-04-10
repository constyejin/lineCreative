import {setCommonRoot, autoScale, toggleFullScreen, createDraggable, getScale} from './common.js';
import anime from "./anime.js";

var metaUrl = import.meta.url;
var root = null;

var pieces = [];

var selectedPiece = null;
var page1, page2, btnPageNext, btnPagePrev;
var allowDropDistance = 150;

function init() {
  startGuideAnim();
  // 퍼즐 회전판 초기화 및 이벤트 등록
  root.addEventListener('mousedown', () => stopGuideAnim());
  root.addEventListener('touchdown', () => stopGuideAnim());

  root.querySelector('#viewWrap').addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  root.querySelector('#btn-rotate-left').addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    onClickRotateLeft()
  }, false);
  root.querySelector('#btn-rotate-right').addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    onClickRotateRight();
  }, false);

  root.querySelector('.btn-done').addEventListener('click', e => {
    onClickDoneButton();
  });

  // 퍼즐 페이지 초기화
  page1 = root.querySelector('.page-one');
  page2 = root.querySelector('.page-two');
  btnPageNext = root.querySelector('#btn-page-next');
  btnPagePrev = root.querySelector('#btn-page-prev');
  btnPageNext.addEventListener('click', function () {
    hideRotateArea();
    page1.classList.remove('active');
    page2.classList.add('active');
  });
  btnPagePrev.addEventListener('click', function () {
    hideRotateArea();
    page2.classList.remove('active');
    page1.classList.add('active');
  });


  // 퍼즐 조각 초기화 및 이벤트 등록
  pieces = root.querySelectorAll('div.puzzle-piece');
  pieces.forEach((element, index) => {
    // 원래 있던 자리 저장
    element.orgSlot = element.parentElement;

    // 처음부터 역삼각형 모양인 조각 표시
    var isInverse = element.getAttribute('data-inversed') == 'true';
    if (isInverse) {
      element.querySelector('img').classList.add('inverse');
    }
    element.orgSlot.setAttribute('data-placeholder-inverse', isInverse);

    // 조각을 드래그가능 엘리먼트로 전환
    createDraggable(element, (closestDropzone, orderedDropzones) => {
      onDroppedAnswerSlot(element, closestDropzone, orderedDropzones);
    }, { useClosest: true, allowDistance: allowDropDistance});

    // 조각회전버튼 표시 관련 이벤트 등록
    element.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    element.addEventListener('mousedown', () => setSelectedPiece(element), false);
    element.addEventListener('touchdown', () => setSelectedPiece(element), false);
    element.addEventListener('touchmove', () => hideRotateArea(), {passive : true});

    element.addEventListener('dragstart', () => {
      element.classList.add('dragging');
      hideRotateArea();
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('dragging');
    });
  });

  root.addEventListener('click', e => {
      setSelectedPiece(null);
  });
}

// 퍼즐이 드랍되었을 때
function onDroppedAnswerSlot(piece, closestDropzone, orderedDropzones) {
  //console.log('droped slot: ', answerSlot);
  var dragArea = root.querySelector('#puzzle-drag-area');
  var dropArea = root.querySelector('#puzzle-drop-area');
  var answerPanel = dropArea.querySelector('.answer-panel');

  if (closestDropzone === dragArea) {
    resetPiecePosition(piece);
    return;
  }

  // 모양이 맞는 정답판 중 가장 가까운 조각 찾기
  var inversedStart = piece.getAttribute('data-inversed') == 'true';  // 역삼각형으로 시작했는지?
  var angle = parseInt(piece.getAttribute('data-angle'));   // 시계방향으로 몇 도 회전했는지
  var inversedPiece = (angle / 60) % 2 == 1 ? true : false;
  inversedPiece = inversedStart ? !inversedPiece : inversedPiece;

  // 거리순으로 정렬된 같은모양 슬롯
  var sameShapeSlots = Array.from(orderedDropzones) 
    .filter(d => {
      // 조각이 슬롯에 들어갈 수 있는 모양인지 체크
      var inversedSlot = d.getAttribute('data-inversed') == 'true';
      var sameShape =  inversedSlot == inversedPiece;
      return sameShape;
    });

  var answerSlot = sameShapeSlots[0];

  // 거리 초과이면 취소
  if (answerSlot.distanceFromTouch > (allowDropDistance * (100 / getScale()))) {
    return;
  }

  var otherPiece = answerSlot.querySelector('.puzzle-piece')
  // 찾은 정답칸이 가장 가까운 드랍존이 아니면서 이미 퍼즐도 들어있으면 취소 (사용성)
  if (closestDropzone != answerSlot && otherPiece != null) {
    return;
  }

  // 정답 슬롯에 이미 조각 있으면 들어있는 조각 되돌림
  if (otherPiece != null) {
    // console.log('조각이 이미 있음 ', otherPiece);
    resetPiecePosition(otherPiece);
  }
  
  // 정답 슬롯에 넣고 셀렉트 효과 지움
  setSelectedPiece(null);
  answerSlot.appendChild(piece);


  // 모든 조각이 정답판에 들어가있는지?
  // var isAllAnswer = Array.from(pieces).every(p => p.parentElement.hasAttribute('data-correct')); 

 var isAllAnswer = Array.from(answerPanel.querySelectorAll('.answer-slot')).every(piece => piece.querySelector('.puzzle-piece') !== null); 

  if (isAllAnswer) {
    showDoneButton();
  } else {
    hideDoneButton();
  }


}


function showDoneButton() {
  root.querySelector('.btn-done').classList.add('active');
}

function hideDoneButton() {
  root.querySelector('.btn-done').classList.remove('active');
}

function onClickDoneButton() {
  var incorrectPieces = [];
  pieces.forEach((p, i) => {
    // answer slot
    var answerSlot = p.parentElement;

    var isCorrectSlot = i == answerSlot.getAttribute('data-correct-index');
    var isCorrectAngle = p.getAttribute('data-angle') == answerSlot.getAttribute('data-correct');

    // console.log(isCorrectAngle, isCorrectSlot);

    if (!isCorrectAngle || !isCorrectAngle)
      incorrectPieces.push(p);
  });

  if (incorrectPieces.length == 0) {
    // 정답
    root.querySelector('#correct-answer-bg').classList.add('correct-answer');
  } else {
    // 오답
    hideDoneButton();
    root.querySelector('#correct-answer-bg').classList.remove('correct-answer');
    incorrectPieces.forEach(p => {
      resetPiecePosition(p);
    });
  }
}

function resetPiecePosition(piece) {
  piece.orgSlot.appendChild(piece);
}

function setSelectedPiece(piece) {
  pieces.forEach(p => p.classList.remove('selected'));
  if (piece != null) {
    // 정답판에 들어간 조각인지?
    if (piece.parentElement.hasAttribute('data-correct-index')) {
      hideDoneButton()
      root.querySelector('#correct-answer-bg').classList.remove('correct-answer');
      setSelectedPiece(null);
      return;
    }
    
    selectedPiece = piece;
    selectedPiece.classList.add('selected');
    showRotateArea();
  }
  else {
    selectedPiece = null;
    hideRotateArea();
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function showRotateArea() {
  var selectedPieceIndex = Array.from(pieces).findIndex(p => p === selectedPiece);
  var posX = selectedPieceIndex % 8 < 4 ? 200 : 360;
  var posY = 40 + (140 * (selectedPieceIndex % 4));
  var rotateArea = root.querySelector('#btn-rotate-area');
  rotateArea.classList.add('active');
  rotateArea.style.position = 'fixed';
  rotateArea.style.left = (posX) + 'px';
  rotateArea.style.top = (posY) + 'px';
}

function hideRotateArea() {
  var rotateArea = root.querySelector('#btn-rotate-area');
  rotateArea.classList.remove('active');
}

function onClickRotateRight() {
  rotatePiece(selectedPiece, 60);
}

function onClickRotateLeft() {
  rotatePiece(selectedPiece, 300);
}

function rotatePiece(piece, addedAngle) {
  var prevAngle = parseInt(piece.getAttribute('data-angle'));
  var newAngle = (prevAngle + addedAngle) % 360;
  piece.setAttribute('data-angle', newAngle);

  var inversedStart = piece.getAttribute('data-inversed') == 'true';
  var translateY = (newAngle / 60) % 2 * 39 * (inversedStart ? 1 : -1);

  var pieceImg = piece.querySelector('img');
  pieceImg.style.transform = 'translateY(' + translateY +'px) rotate(' + newAngle + 'deg)';

  // 최종적으로 보이는 모양이 역삼각형인지?
  var inversedPiece = (newAngle / 60) % 2 == 1 ? true : false;
  inversedPiece = inversedStart ? !inversedPiece : inversedPiece;
  // 퍼즐 조각판의 플레이스 홀더 모양 설정
  piece.orgSlot.setAttribute('data-placeholder-inverse', inversedPiece);
}

function onClickReset(){//전체 리셋
  setSelectedPiece(null);
  hideDoneButton();
  hideRotateArea();
  
  // 정답 애니메이션&스타일 초기화
  root.querySelector('#correct-answer-bg').classList.remove('correct-answer');

  pieces.forEach(p => {
    // 퍼즐 위치 처음위치로
    resetPiecePosition(p);

    // 퍼즐들 각도 초기화
    p.setAttribute('data-angle', 0);
    rotatePiece(p, 0);
  });
  startGuideAnim();
}

function startGuideAnim() {
  var hand = root.querySelector('#img-touchguide');
  hand.classList.add('guide-animation');
}

function stopGuideAnim() {
  var hand = root.querySelector('#img-touchguide');
  hand.classList.remove('guide-animation');
}

// 정답 빠른 확인용
function autoAnswer() {
  var answerSlots = Array.from(root.querySelectorAll('.answer-slot'));
  answerSlots.forEach((answerSlot) => {
    var pieceIndex = parseInt(answerSlot.getAttribute('data-correct-index'));
    var pieceAngle = parseInt(answerSlot.getAttribute('data-correct'));
    rotatePiece(pieces[pieceIndex], pieceAngle);
    answerSlot.appendChild(pieces[pieceIndex]);
  });
}

window.addEventListener('script-loaded', function(ev) {
  // 정답 빠른 확인용
  window.autoAnswer = autoAnswer;

  if(root) return;
  const u = new URL(metaUrl);
  const param = u.searchParams.get('embed-unique');
  
  if(param && param !== ev.detail.unique) return;


   const shadowRoot = ev.detail.root; // 커스텀 이벤트에 담겨진 shadowRoot 객체
   root = shadowRoot;

   setCommonRoot(root, {allowDrop});
   
   window.addEventListener('resize', function() {//autoscale
        autoScale();
    });
    
	autoScale();

  init();
    
  // 클릭 이벤트 핸들러 등록
	root.querySelector('.reset_btn').addEventListener('click', function() {
    onClickReset();
	});
	
	// 버튼 클릭 시 전체 화면 토글
	var fullScreenButton = root.querySelector('#fullScreenButton');
	fullScreenButton.addEventListener('click', function() {
		toggleFullScreen();
	});
});



