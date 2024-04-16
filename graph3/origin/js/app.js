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
  console.log(selectUnitTxt)
  let selectUnit = root.querySelector('.select-unit');
  let selectUnitItem = selectUnit.querySelectorAll('li');

  selectUnitTxt.forEach(function(item, num) {
    item.addEventListener('click', function() {
      console.log(num)
      if(num == 0) {
        selectUnit.style.top = '186px';
      } else if(num == 1) {
        selectUnit.style.top = '246px';
      }
      selectUnitTxt = item;
      selectActive(selectUnitTxt);
    })
  })
 
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



