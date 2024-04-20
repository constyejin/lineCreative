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


  let selectUnitTxt = root.querySelectorAll('.select-unit-txt');
  console.log(selectUnitTxt)
  let selectUnit = root.querySelector('.select-unit');
  let selectUnitItem = selectUnit.querySelectorAll('li');
  let rowItem = root.querySelectorAll('.left-box-2 .row');

  

  function tableSwitch() {
    
  }

  function table1() {
    
  }

  function table2() {

  }
 
  function selectActive(selectItem) {
    root.querySelector('#viewWrap').addEventListener('click', function(e) {
      if (e.target == selectUnit || e.target == selectItem) {
        selectUnit.classList.add('active');

        selectUnitItem.forEach((i) => {
          if(selectItem.innerHTML == i.innerHTML) {
            i.classList.add('active');
          }
        })
      } else {
        selectUnit.classList.remove('active');

        selectUnitItem.forEach((i) => {
          i.classList.remove('active');
        })
      }
    });
    
    selectUnitItem.forEach(function(i) {
      i.addEventListener('click', function() {
        selectUnitItem.forEach(function(item) {
          item.classList.remove('active');
        });

        this.classList.add('active');
        selectUnitTxt.innerHTML = this.innerHTML;
      })
    })
  }

  // 팝업 포지션 변경 (기본 3개)
  selectUnitTxt.forEach(function(item, num) {
    item.addEventListener('click', function() {      
      if(num == 0) {
        selectUnit.style.top = '186px';
      } else if(num === 1) {
        selectUnit.style.top = '246px';
      } else if(num === 2) {
        selectUnit.style.top = '176px';
      } else if(num === 3) {
        selectUnit.style.top = '216px';
      } 
      selectUnitTxt = item;
      selectActive(item);
    })
  })

  // 칸 플러스, 마이너스, 초기화
  rowItem.forEach((item) => {
    let rowItemLeng = item.querySelectorAll('li').length;
    let maxNotice = root.querySelector('.max-notice');

    let defaultLeftValue = 344;
    let additionalLeftValue = -72 * (rowItemLeng - 4);
    let leftValue = defaultLeftValue + additionalLeftValue;
    selectUnit.style.left = leftValue + 'px';

    let btnMinus = root.querySelector('.btn-minus');
    let btnPlus = root.querySelector('.btn-plus');
    let clickCount = 4;

    btnMinus.addEventListener('click', function() {
      console.log(leftValue)
      if (clickCount == 10) {
        clickCount -= 2;
      } else  if(clickCount > 1) {
        clickCount--;
      }

      if (rowItemLeng > 2) {        
        item.querySelector('li:last-child').remove();
        rowItemLeng = item.querySelectorAll('li').length;
        additionalLeftValue = -78 * (rowItemLeng - 4);
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

    btnPlus.addEventListener('click', function() {
      console.log(leftValue)
      if(clickCount < 10) {
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
        additionalLeftValue = -78 * (rowItemLeng - 4);
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

      if(clickCount >= 10) {
        maxNotice.style.display = 'block';
        setTimeout(function() {
          maxNotice.style.display = 'none';
        },3000)
      }
    })

    root.querySelector('.reset-btn').addEventListener('click', () => {
      btnPlus.querySelector('img').src = new URL('../img/Status=On-1.png', metaUrl).href;
      btnMinus.querySelector('img').src = new URL('../img/Status=On.png', metaUrl).href;
      selectUnit.style.left = 344 + 'px';

      let rowLi = item.querySelectorAll('li');
      rowLi.forEach((li) => {
        let rowInput = li.querySelectorAll('input');
        let rowSpan = li.querySelector('span');

        rowInput.forEach((input) => {
          input.value = '';
        })
        // rowInput.value = '';
        rowSpan ? rowSpan.innerHTML = '' : null;
      });

      if (rowItemLeng > 4) {
        while (rowItemLeng > 4) {
          item.querySelector('li:last-child').remove(); 
          rowItemLeng--; 
          clickCount = 4;
        }
      } 
      else if (rowItemLeng < 4) {
        let diff = 4 - rowItemLeng;
        for (let i = 0; i < diff; i++) {
          let newItem = `
            <li>
              <input type="text">
            </li>
          `;
          item.insertAdjacentHTML('beforeend', newItem);
          clickCount = 4;
        }
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



  // 전체 초기화
  let resetBtn = root.querySelector('.reset-btn');

	resetBtn.addEventListener('click', () => {
    // defaultItem();
    // 타이틀 초기화
    hideTitle();

    // 물결선 초기화
    hideWaveLine();
	});
});



