import {setCommonRoot, autoScale, toggleFullScreen} from './common.js';

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


  let switchBtn = root.querySelector('.switch-btn');
  let switchCheck = switchBtn.querySelector('input');
  let sliderTxt = switchBtn.querySelector('.slider-txt');

  let table1 = root.querySelector('.table-1');
  let table2 = root.querySelector('.table-2');

  switchBtn.addEventListener('click', () => {
    if(!switchCheck.checked) {
      switch1();
    } else {
      switch2();
    }
  })

  function switch1(check) {
    sliderTxt.innerHTML = '표1';
    switchCheck.disabled = check;
    switchBtn.classList.remove('switch-2');
    table2.classList.remove('active');
    table1.classList.add('active');
    root.querySelector('.left-box-3').style.marginTop = '14px';
    root.querySelector('.line').style.marginTop = '40px';
    root.querySelectorAll('.table-title')[1].style.marginTop = '24px';
    root.querySelector('.graph-area').style.marginTop = '20px';
  }

  let table1ValX = root.querySelectorAll('.table-1 .row-header li');
  let valuesX1 = [];

  table1ValX.forEach((li, num) => {
    if(num !== 0) {
     li.querySelector('input').addEventListener('blur', function() {
        valuesX1.push(this.value);
        console.log(valuesX1);
     })
    }
  })



  function switch2() {
    sliderTxt.innerHTML = '표2';
    // switchCheck.disabled = check;
    switchBtn.classList.add('switch-2');
    table1.classList.remove('active');
    table2.classList.add('active');
    root.querySelector('.left-box-3').style.marginTop = '8px';
    root.querySelector('.line').style.marginTop = '36px';
    root.querySelectorAll('.table-title')[1].style.marginTop = '0';
    root.querySelector('.graph-area').style.marginTop = '8px';
  }


  let selectUnitTxt = root.querySelectorAll('.select-unit-txt');
  let selectUnit = root.querySelector('.select-unit');
  let selectUnitItem = selectUnit.querySelectorAll('li');
  let rowItem = root.querySelectorAll('.left-box-2 .row');
      
  let unitTxt = root.querySelectorAll('.unit-txt');
  let unitTxtX = unitTxt[0].querySelector('span');
  let unitTxtY = unitTxt[1].querySelector('span');

 
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

        let unitTxt = root.querySelectorAll('.select-unit-txt')
        if(table1.classList.contains('active')) {
          unitTxtX.innerHTML = unitTxt[0].innerHTML;
          unitTxtY.innerHTML = unitTxt[1].innerHTML;
        } else if(table2.classList.contains('active')) {
          unitTxtX.innerHTML = unitTxt[2].innerHTML;
          unitTxtY.innerHTML = unitTxt[3].innerHTML;
        }
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


  // X, Y 단위값 그래프에 적용
  let val = root.querySelectorAll('.val');
  let xTxt = root.querySelector('.graph-x-txt');
  let yTxt = root.querySelector('.graph-y-txt');

  val.forEach((item, num) => {
    item.addEventListener('blur', () => {
      if(num % 2 == 0) {
        xTxt.innerHTML = item.value;
      } else {
        yTxt.innerHTML = item.value;
      }
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

  let graph1Title = ['']
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
  let waveLine = root.querySelector('.wave-line');

  function showWaveLine() {
    inputCheck.checked = true;
    waveLine.classList.add('active');
  }

  function hideWaveLine() {
    inputCheck.checked = false;
    checkBoxImg.classList.remove('checked');
    waveLine.classList.remove('active');
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


  // Chart.js
  let myCt = root.getElementById('myChart').getContext('2d');
  console.log(myCt)

  let chartData = {
    labels: [null, '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', null],
    datasets: [
      {
        label: '가격1',
        fill: false,
        data: [null, 10, 18, 20],
        borderColor: '#EF848C', // 선 색상 
        pointBackgroundColor: '#B73750', // 데이터 포인트 색상 
        borderWidth: 6, // 선 두께 
        pointRadius: 7, // 데이터 포인트 반지름 
        pointBorderWidth : 0,
      },
      // {
      //   label: '가격2',
      //   fill: false,
      //   data: [
      //       5500, 5500, 5500, 5500, 5500, 5500, 5500
      //   ],
      //   pointRadius: [
      //       3, 3, 3, 3, 3, 3, 3
      //   ],
      //   backgroundColor: 'skyblue',
      //   borderColor: 'skyblue',
      //   borderWidth: 2,
      // }
    ],
  }

  let stepSize = updateStepSize(50);

  function updateStepSize(fiveRow) {
    let stepCount = 8;
    let stepSize = [];

    for (let i = 1; i <= stepCount; i++) {
      stepSize.push(fiveRow * i);
    }
    return stepSize;
  }

  var yTicks = [];
  function chartDraw() {
    new Chart(myCt, {
      type: 'line', 
      data: chartData,
      options: {
        responsive: false,

        legend: {
          display: false,
        },

        plugins: {
          legend: {
            display: false,
          }
        },

        scales: {
          x : {
            // min : 0,
            // max : 8,
            grid : {
              display : true,
              drawBorder: false,
              color: '#ACAFBF', 
              borderWidth: 2,
            },
            ticks: {
              display : false,
              position: 'bottom',
              padding: 30,
              color : '#222',
              font : {
                size : 28,
                weight : 'bold',
                family : 'NanumSquareRound'
              },
              callback: function(value, index, values) {
                const labels = this.chart.data.labels;
                return labels[index];
              },
            }
          },

          y : {
            min : 0,
            max : 600,
            // beginAtZero: true,
            grid : {
              display : false,
              drawBorder: false,
            },
            ticks: {
              display : true,
              position: 'left', 
              padding: 0,
              stepSize : stepSize[0],
              fontSize: 28, 
              color : '#222',
              font : {
                size : 28,
                weight : 'bold',
                family : 'NanumSquareRound'
              },
              afterBuildTicks: function(scale, ticks) {
                // 첫 번째와 마지막 tick 값을 제외
                yTicks = ticks.slice(1, ticks.length - 1);
              }
            },  
          },
        }
      }
    });

    // chartData에서 x축 labels 값을 가져옴
    var labels = chartData.labels;
    labels = labels.slice(1, labels.length - 1);
    // HTML 요소를 추가할 부모 요소 선택
    var parentElement = root.querySelector(".value-x");

    // 각 레이블에 대해 HTML 요소 추가
    for (var i = 0; i < labels.length; i++) {
      // 새로운 span 요소의 HTML 코드 생성
      var newElementHTML = '<li>' + labels[i] + '</li>';

      // span 요소의 HTML 코드를 부모 요소에 추가
      parentElement.insertAdjacentHTML('beforeend', newElementHTML);
    }


// HTML 요소를 추가할 부모 요소 선택
var parentElementY = document.querySelector(".graph-y-left");

// 각 y tick에 대해 HTML 요소 추가
for (var i = 0; i < yTicks.length; i++) {
  // 새로운 span 요소의 HTML 코드 생성
  var newElementHTML = '<li>' + yTicks[i] + '</;>';

  // span 요소의 HTML 코드를 부모 요소에 추가
  parentElementY.insertAdjacentHTML('beforeend', newElementHTML);
}


  }


  chartDraw();
  // root.querySelector('.graph-all').addEventListener('click', () => {
  //   chartDraw();
  // })



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
    // switch1();

    unitTxtX.innerHTML = '';
    unitTxtY.innerHTML = '';

    xTxt.innerHTML = '';
    yTxt.innerHTML = '';
    // 타이틀 초기화
    hideTitle();

    // 물결선 초기화
    hideWaveLine();
	});
});



