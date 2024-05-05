import {setCommonRoot, autoScale, toggleFullScreen} from './common.js';

let metaUrl = import.meta.url;
let root = null;

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

  let myChart = null;

  switchBtn.addEventListener('click', () => {
    if(!switchCheck.checked) {
      switch1();
    } else {
      switch2();
    }
  })


  function switch1() {
    sliderTxt.innerHTML = '표1';
    switchBtn.classList.remove('switch-2');
    table2.classList.remove('active');
    table1.classList.add('active');
    root.querySelector('.left-box-3').style.marginTop = '14px';
    root.querySelector('.line').style.marginTop = '40px';
    root.querySelectorAll('.table-title')[1].style.marginTop = '24px';
    root.querySelector('.graph-area').style.marginTop = '20px';
    reset();
  }

  function switch2() {
    sliderTxt.innerHTML = '표2';
    switchBtn.classList.add('switch-2');
    table1.classList.remove('active');
    table2.classList.add('active');
    root.querySelector('.left-box-3').style.marginTop = '8px';
    root.querySelector('.line').style.marginTop = '36px';
    root.querySelectorAll('.table-title')[1].style.marginTop = '0';
    root.querySelector('.graph-area').style.marginTop = '8px';
    reset();
  }


  // 표1 첫번째 행 입력값 valuesX1 배열에 저장 
  let table1ValX = root.querySelectorAll('.table-1 .row-header li');
  let tableRow1 = root.querySelectorAll('.table-1 .row')[1].querySelectorAll('li');
  let valuesX1 = [];
  let valuesRow1 = [];
  let lastBlurredElement = null;

  function updateTable1ValX() {
    table1ValX = root.querySelectorAll('.table-1 .row-header li');
    // valuesX1 = Array(table1ValX.length).fill(null);

    table1ValX.forEach((li, num) => {
      let inputElement = li.querySelector('input');

      if(num !== 0) {
        inputElement.addEventListener('blur', function() {
          if(this.value !== '') {
            lastBlurredElement = inputElement;
            valuesX1[num - 1] = this.value;
          }
        });
      }
    });

    tableRow1.forEach((li, num) => {
      let inputElement = li.querySelector('input');

      if(num !== 0) {
        inputElement.addEventListener('blur', function() {
          if(this.value !== '') {
            lastBlurredElement = inputElement;
            valuesRow1[num - 1] = this.value;
          }
        });
      }
    });
  }



  // function addBlurEventToElements(elements, values, lastBlurredElement) {
  //   elements.forEach((li, num) => {
  //     let inputElement = li.querySelector('input');

  //     if(num !== 0) {
  //       inputElement.addEventListener('blur', function() {
  //         if(this.value !== '') {
  //           lastBlurredElement = inputElement;
  //           values[num - 1] = this.value;
  //           console.log(values)
  //         }
  //       });
  //     }      
  //   });
  // }

  // function updateTable1ValX() {
  //   addBlurEventToElements(table1ValX, valuesX1, lastBlurredElement);
  //   addBlurEventToElements(tableRow1, valuesRow1, lastBlurredElement);
  // }

  updateTable1ValX();


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

      updateTable1ValX();
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

      updateTable1ValX();
    })

    root.querySelector('.reset-btn').addEventListener('click', () => {
      btnPlus.querySelector('img').src = new URL('../img/Status=On-1.png', metaUrl).href;
      btnMinus.querySelector('img').src = new URL('../img/Status=On.png', metaUrl).href;
      selectUnit.style.left = 344 + 'px';

      // let rowLi = item.querySelectorAll('li');
      // rowLi.forEach((li) => {
      //   let rowInput = li.querySelectorAll('input');
      //   let rowSpan = li.querySelector('span');

      //   rowInput.forEach((input) => {
      //     input.value = '';
      //   })
      //   rowSpan ? rowSpan.innerHTML = '' : null;
      // });

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

  let chartData = {
    labels: valuesX1,
    datasets: [
      {
        label: '그래프1',
        fill: false,
        data: [null, 315219, 223123, 64422,],
        borderColor: '#EF848C', // 선 색상 
        pointBackgroundColor: '#B73750', // 데이터 포인트 색상 
        borderWidth: 6, // 선 두께 
        pointRadius: 7, // 데이터 포인트 반지름 
        pointBorderWidth : 0,
      }
    ],
  }

  let stepSize = updateStepSize(57000);

  function updateStepSize(fiveRow) {
    let stepCount = 8;
    let stepSize = [];

    for (let i = 1; i <= stepCount; i++) {
      stepSize.push(fiveRow * i);
    }
    return stepSize;
  }


  let parentElementX = root.querySelector(".value-x");
  let parentElementY = root.querySelector(".value-y");

  function chartDraw() {
    myChart = new Chart(myCt, {
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
          },
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
              color : '#222',
              callback: function(value, index, values) {
                const labels = this.chart.data.labels;
                return labels[index];
              },
            }
          },

          y : {
            min : 0,
            max : 399000,
            beginAtZero: true,

            grid : {
              display : false,
              drawBorder: false,
            },
            ticks: {
              display : false,
              stepSize : stepSize[0],
              callback: function(value, index, values) {
                return value;
              },
            },  
          },
        },
      }
    });

    // chartData에서 labels 값 .value-x 에 추가
    let labelsX = chartData.labels;
    console.log(labelsX);
    labelsX = labelsX.slice(1, labelsX.length - 1);


    for (let i = 0; i < labelsX.length; i++) {
      let newElementHTML = '<li>' + labelsX[i] + '</li>';
      parentElementX.insertAdjacentHTML('beforeend', newElementHTML);
    }


    // y축 value 값 .value-y 에 추가
    let labelsY = myChart.scales.y.ticks;
    console.log(labelsY); 
    labelsY = labelsY.slice().reverse();

    for (let i = 0; i < labelsY.length; i++) {
      let newElementHTML = '<li>' + labelsY[i].value + '</li>';
      parentElementY.insertAdjacentHTML('beforeend', newElementHTML);
    }
  }


  // chartDraw();
  root.querySelector('.graph-all').addEventListener('click', () => {
    chartDraw();
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
  function reset() {
    valuesX1 = [];

    let inputFields = root.querySelectorAll('input');

    inputFields.forEach(input => {
      input.value = '';
    });

    let spanFields = root.querySelectorAll('span');
    spanFields = Array.from(spanFields).filter(span => {
      return !span.classList.contains('slider-txt') && 
            !span.closest('.popup-content-list') &&
            !span.closest('.check-break');
    });

    spanFields.forEach(span => {
      span.innerHTML = '';
    });
    unitTxtX.innerHTML = '';
    unitTxtY.innerHTML = '';

    xTxt.innerHTML = '';
    yTxt.innerHTML = '';

    // 타이틀 초기화
    hideTitle();

    // 물결선 초기화
    hideWaveLine();

    // chart.js 값 초기화
    if (myChart) {
      myChart.destroy();
      myChart = null;
    }

    chartData.labels = [];
    chartData.datasets.forEach((dataset) => {
      dataset.data = [];
    });

    stepSize = updateStepSize(0);

    parentElementX.innerHTML = '';
    parentElementY.innerHTML = '';
  }

  let resetBtn = root.querySelector('.reset-btn');
	resetBtn.addEventListener('click', () => {
    reset();
	});

});


