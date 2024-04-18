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

  selectUnitTxt.forEach(function(item, num) {
    item.addEventListener('click', function() {
      if(num == 0) {
        selectUnit.style.top = '186px';
      } else if(num == 1) {
        selectUnit.style.top = '246px';
      }
      selectUnitTxt = item;
      // console.log(selectUnitTxt)
      selectActive(item);
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
        console.log(clickCount)
      }

      if (rowItemLeng < 9) {
        let newLi = document.createElement('li');
        newLi.textContent = '';
        item.appendChild(newLi);
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



  // Title 값 입력
  let titleInput = root.querySelector('.title input');
  let editIcon = root.querySelector('.title img');
  let graphTitle = root.querySelector('.graph-title .title');

  titleInput.addEventListener('focus', function() {
    editIcon.style.display = 'none';
  });

  titleInput.addEventListener('blur', function() {
    if (titleInput.value.trim() !== '') {
      editIcon.style.display = 'none';
      graphTitle.querySelector('img').style.display = 'none';
      graphTitle.querySelector('span').innerHTML = titleInput.value;
    } else {
      editIcon.style.display = 'block';
      graphTitle.querySelector('img').style.display = 'block';
      graphTitle.querySelector('span').innerHTML = '';
    }
  });


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

  root.querySelector('.copy-btn').addEventListener('click', function() {
    openPopup();
  })

  root.querySelector('.btn-exit').addEventListener('click', function() {
    closePopup();
  })



  // Reset
	// root.querySelector('.reset-btn').addEventListener('click', function() {
    
	// });
});



