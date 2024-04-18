import {setCommonRoot, autoScale, toggleFullScreen} from './common.js';
// import anime from "./anime.js";

var metaUrl = import.meta.url;
var root = null;

window.addEventListener('script-loaded', function(ev) {	
  if (root) return;
  const u = new URL(metaUrl);
  const param = u.searchParams.get("embed-unique");

  if (param && param !== ev.detail.unique) return;

  const shadowRoot = ev.detail.root;
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
      i.addEventListener('click', function() {
        selectUnitItem.forEach(function(item) {
          item.classList.remove('active');
        });

        this.classList.add('active');
        selectUnitTxt.innerHTML = this.innerHTML;


        // if (i.innerHTML === selectItem.innerHTML) {
        //   this.classList.add('active');
        // } else {
        //   selectUnitItem.forEach(function(item) {
        //     item.classList.remove('active');
        //   });
        // }

      })
    })
  }


  // 팝업 포지션 변경 (기본 3개)
  selectUnitTxt.forEach(function(item, num) {
    item.addEventListener('click', function() {
      if(num == 0) {
        selectUnit.style.top = '186px';
      } else if(num == 1) {
        selectUnit.style.top = '246px';
      }
      selectUnitTxt = item;
      selectActive(item);
    })
  })

  rowItem.forEach(function(item) {
    let rowItemLeng = item.querySelectorAll('li').length;

    let defaultLeftValue = 582;
    let additionalLeftValue = -78 * (rowItemLeng - 1);
    let leftValue = defaultLeftValue + additionalLeftValue;
    selectUnit.style.left = leftValue + 'px';

    let btnMinus = root.querySelector('.btn-minus');
    let btnPlus = root.querySelector('.btn-plus');
    let maxNotice = root.querySelector('.max-notice');
    
    let clickCount = 3;

    btnMinus.addEventListener('click', function() {
      if (clickCount >= 9) {
        clickCount -= 2;
      } else  if(clickCount > 1) {
        clickCount--;
      }

      if (rowItemLeng > 2) {        
        item.querySelector('li:last-child').remove();
        rowItemLeng = item.querySelectorAll('li').length;
        additionalLeftValue = -78 * (rowItemLeng - 1);
        leftValue = defaultLeftValue + additionalLeftValue;
        selectUnit.style.left = leftValue + 'px';
      }

      if(rowItemLeng < 9) {
        btnPlus.querySelector('img').src = new URL('../img/Status=On-1.png', metaUrl).href;
        maxNotice.style.display = 'none';
        selectUnit.classList.remove('last');
      }

      if(rowItemLeng <= 2) {
        btnMinus.querySelector('img').src = new URL('../img/Status=Off.png', metaUrl).href;
      }
    })


    // 칸 플러스, 마이너스
    btnPlus.addEventListener('click', function() {
      if(clickCount < 9) {
        clickCount++;
      }

      if (rowItemLeng < 9) {
        let newItem = `
          <li>
            <input type="text">
          </li>
        `;

        item.insertAdjacentHTML('beforeend', newItem);
        
        rowItemLeng = item.querySelectorAll('li').length;
        additionalLeftValue = -78 * (rowItemLeng - 1);
        leftValue = defaultLeftValue + additionalLeftValue;
        selectUnit.style.left = leftValue + 'px'
      }

      if(rowItemLeng > 2) {
        btnMinus.querySelector('img').src = new URL('../img/Status=On.png', metaUrl).href;
      }

      if (rowItemLeng === 9) {
        btnPlus.querySelector('img').src = new URL('../img/Status=Off-1.png', metaUrl).href;

        if (selectUnit) {
          selectUnit.classList.add('last');
          selectUnit.style.left = '110px';
        }
      }

      if(clickCount >= 9) {
        maxNotice.style.display = 'block';
        setTimeout(function() {
          maxNotice.style.display = 'none';
        },3000)
      }
    })
  })


  // Title show / hide
  let titleInput = root.querySelector('.title input');
  let editIcon = root.querySelector('.title img');
  let graphTitle = root.querySelector('.graph-title .title');

  function showTitle() {
    editIcon.style.display = 'none';
    graphTitle.querySelector('img').style.display = 'none';
    graphTitle.querySelector('span').innerHTML = titleInput.value;
  }

  function hideTitle() {
    titleInput.value = ''
    editIcon.style.display = 'block';
    graphTitle.querySelector('img').style.display = 'block';
    graphTitle.querySelector('span').innerHTML = '';
  }

  titleInput.addEventListener('focus', () => {
    editIcon.style.display = 'none';
  });

  titleInput.addEventListener('blur', () => {
    if (titleInput.value.trim() !== '') {
      showTitle();
    } else {
      hideTitle();
    }
  });


  // 물결선 checked
  let checkBox = root.querySelector('.check-break');
  let checkBoxImg = checkBox.querySelector('.checkbox-img');
  let inputCheck = checkBox.querySelector("input[type='checkbox']");

  function showWaveLine() {
    inputCheck.checked = true;
  }

  function hideWaveLine() {
    inputCheck.checked = false;
    checkBoxImg.classList.remove('checked');
  }
  
  checkBox.addEventListener('click', (e) => {
    e.preventDefault();
    checkBoxImg.classList.toggle('checked');

    if(checkBoxImg.classList.contains('checked')) {
      showWaveLine();
    } else {
      hideWaveLine();
    }
  })


  // 꺾은선그래프 자료 모음 팝업 open, close
  let popup = root.querySelector('.popup');
  let overlay = root.querySelector('.overlay');

  function openPopup() {
    popup.classList.add('active');
    overlay.classList.add('active');
  }

  function closePopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
  }

  root.querySelector('.copy-btn').addEventListener('click', () => {
    openPopup();
  })

  root.querySelector('.btn-exit').addEventListener('click', () => {
    closePopup();
  })



  // Reset
  let resetBtn = root.querySelector('.reset-btn');
	resetBtn.addEventListener('click', () => {
    // 타이틀 초기화
    hideTitle();

    // 물결선 초기화
    hideWaveLine();
	});
});



