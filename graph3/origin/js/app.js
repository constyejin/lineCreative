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
    //  console.log(selectItem.innerHTML);
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

    // 칸 플러스, 마이너스
    btnPlus.addEventListener('click', function() {
      if (rowItemLeng < 8) {
        let newLi = document.createElement('li');
        newLi.textContent = '';
        item.appendChild(newLi);
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



