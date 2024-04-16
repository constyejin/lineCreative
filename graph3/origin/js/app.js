import {setCommonRoot, autoScale, toggleFullScreen} from './common.js';
// import anime from "./anime.js";

var metaUrl = import.meta.url;
var root = null;


window.addEventListener('script-loaded', function(ev) {	
  if (root) return;
  const u = new URL(metaUrl);
  const param = u.searchParams.get("embed-unique");

  if (param && param !== ev.detail.unique) return;

  const shadowRoot = ev.detail.root; // 커스텀 이벤트에 담겨진 shadowRoot 객체
  root = shadowRoot;

  setCommonRoot(root, {});
	autoScale();
	
	window.addEventListener("resize", function () {
		autoScale();
	});

	root.querySelector("#fullScreenButton").addEventListener("click", () => {
    toggleFullScreen();
  });

  // select-unit active
  let selectUnitTxt = root.querySelectorAll('.select-unit-txt');
  let selectUnit = root.querySelector('.select-unit');
  let selectUnitItem = selectUnit.querySelectorAll('li');
  let rowItem = root.querySelectorAll('.left-box-2 .row');
 
  function selectActive(selectItem) {
    root.querySelector('#viewWrap').addEventListener('click', function(e) {
      if (e.target == selectUnit || e.target == selectItem) {
        selectUnit.classList.add('active');
      } else {
        selectUnit.classList.remove('active');
      }
    });
    
    selectUnitItem.forEach(function(i) {
      i.classList.remove('active');

      i.addEventListener('click', function() {
        this.classList.add('active');
        selectUnitTxt.innerHTML = this.innerHTML;
      })
    })
  }

  selectUnitTxt.forEach(function(item, num) {
    item.addEventListener('click', function() {
      if(num == 0) {
        selectUnit.style.top = '186px';
      } else if(num == 1) {
        selectUnit.style.top = '246px';
      }
      selectUnitTxt = item;
      selectActive(selectUnitTxt);
    })
  })

  // 그래프 칸 수에 따라 팝업 포지션 변경 (기본 3개)
  rowItem.forEach(function(item) {
    let rowItemLeng = item.querySelectorAll('li').length;

    let defaultLeftValue = 582;
    let additionalLeftValue = -78 * (rowItemLeng - 1);
    let leftValue = defaultLeftValue + additionalLeftValue;
    selectUnit.style.left = leftValue + 'px';

    let btnMinus = root.querySelector('.btn-minus');
    let btnPlus = root.querySelector('.btn-plus');
  
    btnMinus.addEventListener('click', function() {
      if (rowItemLeng > 2) {        
        item.querySelector('li:last-child').remove();
        rowItemLeng = item.querySelectorAll('li').length;
        additionalLeftValue = -78 * (rowItemLeng - 1);
        leftValue = defaultLeftValue + additionalLeftValue;
        selectUnit.style.left = leftValue + 'px';
      }

      if(rowItemLeng < 8) {
        btnPlus.querySelector('img').src = new URL('../img/Status=On-1.png', metaUrl).href;
      }

      if(rowItemLeng <= 2) {
        btnMinus.querySelector('img').src = new URL('../img/Status=Off.png', metaUrl).href;
      }
    })

    btnPlus.addEventListener('click', function() {
      if (rowItemLeng < 8) {
        // 새로운 li 요소 생성
        let newLi = document.createElement('li');
        // 새로운 li에 내용 추가
        newLi.textContent = '';
        // li를 마지막으로 추가
        item.appendChild(newLi);
        // 추가 후 다시 left 값을 업데이트
        rowItemLeng = item.querySelectorAll('li').length;
        additionalLeftValue = -78 * (rowItemLeng - 1);
        leftValue = defaultLeftValue + additionalLeftValue;
        selectUnit.style.left = leftValue + 'px';
      }

      if(rowItemLeng > 2) {
        btnMinus.querySelector('img').src = new URL('../img/Status=On.png', metaUrl).href;
      }

      if (rowItemLeng === 8) {
        btnPlus.querySelector('img').src = new URL('../img/Status=Off-1.png', metaUrl).href;
      }
    })
  })


  // 물결선 checked
  let checkBox = root.querySelector('.check-break');

  checkBox.addEventListener('click', function(e){
    e.preventDefault();

    this.querySelector('.checkbox-img').classList.toggle('checked');

    let inputCheck = this.querySelector("input[type='checkbox']")
    if(this.querySelector('.checkbox-img').classList.contains('checked')) {
      inputCheck.checked = true;
    } else {
      inputCheck.checked = false;
    }
  })
});



