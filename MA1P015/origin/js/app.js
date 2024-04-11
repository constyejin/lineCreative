import { setCommonRoot, autoScale } from "./common.js";
import anime from "./anime.js";

var metaUrl = import.meta.url;
var root = null;
var timer = null;

window.addEventListener("script-loaded", function (ev) {
  if (root) return;
  const u = new URL(metaUrl);
  const param = u.searchParams.get("embed-unique");

  if (param && param !== ev.detail.unique) return;

  const shadowRoot = ev.detail.root; // 커스텀 이벤트에 담겨진 shadowRoot 객체
  root = shadowRoot;

  setCommonRoot(root, {});

  var currentStep = -1;

  const actionPerStep = [
    {
      text: "1은 소수가 아니므로 지운다.",
      leftActive: false,
      rightActive: true,
    },
    {
      text: "남은 자연수 중에서 가장 작은 수 2는 남기고 2의 배수를 모두 지운다.",
      leftActive: true,
      rightActive: true,
    },
    {
      text: "남은 자연수 중에서 가장 작은 수 3은 남기고 3의 배수를 모두 지운다.",
      leftActive: true,
      rightActive: true,
    },
    {
      text: "남은 자연수 중에서 가장 작은 수 5는 남기고 5의 배수를 모두 지운다.",
      leftActive: true,
      rightActive: true,
    },
    {
      text: "이와 같은 방법으로 남은 자연수 중에서 가장 작은 수는 남기고<br/>그 수의 배수를 모두 지우면 소수만 남는다.",
      leftActive: true,
      rightActive: false,
    },
  ];

  const guidedHand = root.querySelector(".guide_hand");
  const backgroundImage = root.querySelector(".image_container > svg");

  const text = root.querySelector("#text");

  const arrowLeft = root.querySelector("#arrow-left");
  const arrowLeftImg = arrowLeft.querySelector("img");

  const arrowRight = root.querySelector("#arrow-right");
  const arrowRightImg = arrowRight.querySelector("img");

  const stepperItems = root.querySelectorAll(".stepper-item");

  let guidedHandAnimationInit = true;
  var guidedHandAnimation;

  const setAnimateGuideHand = () => {
    guidedHandAnimation = anime({
      targets: guidedHand,
      opacity: [1, 0],
      loop: guidedHandAnimationInit ? 2 : 3,
      duration: 1000,
      easing: "easeInOutQuad",
      autoplay: false,
      complete: () => {
        setTimeout(() => {
          if (guidedHandAnimationInit) {
            guidedHandAnimationInit = false;
            guidedHandAnimation.pause();
            setAnimateGuideHand();
          } else {
            guidedHandAnimation.play();
          }
        }, 3000);
      },
    });
    guidedHandAnimation.play();
  };

  autoScale();
  setAnimateGuideHand();

  /**
   * full screen toggle call back
   */
  function toggleFullScreen() {
    var doc = document;
    var docEl = root.firstElementChild;

    var requestFullScreen =
      doc.documentElement.requestFullscreen ||
      doc.mozRequestFullScreen ||
      doc.webkitRequestFullScreen ||
      doc.msRequestFullscreen;
    var cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;
    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
      // 전체화면 이미지로 변경
      root.querySelector("#fullScreenButton > img").src = new URL(
        "../img/btn-fullscreen-off.svg",
        metaUrl
      ).href;
    } else {
      cancelFullScreen.call(doc);
      // 일반 이미지로 변경
      root.querySelector("#fullScreenButton > img").src = new URL(
        "../img/btn-fullscreen-on.svg",
        metaUrl
      );
    }
  }

  /**
   * toggle left / right arrow
   * @param {*} leftActive activate left arrow
   * @param {*} rightActive activate right arrow
   */
  const toggleArrow = (leftActive, rightActive) => {
    guidedHandAnimation.pause();
    guidedHand.style.opacity = 0;
    leftActive
      ? arrowLeft.removeAttribute("disabled")
      : arrowLeft.setAttribute("disabled", true);
    if (rightActive) {
      arrowRight.removeAttribute("disabled");
      guidedHandAnimationInit = true;
      setAnimateGuideHand();
    } else {
      arrowRight.setAttribute("disabled", true);
    }
    arrowLeftImg.src = new URL(
      `../img/arrow-left-${leftActive ? "active" : "disabled"}.svg`,
      metaUrl
    ).href;
    arrowRightImg.src = new URL(
      `../img/arrow-right-${rightActive ? "active" : "disabled"}.svg`,
      metaUrl
    ).href;
  };

  /**
   * comment out numbers
   * @param {*} number
   */
  const commentOutNumbers = (number) => {
    // comment out multiples
    backgroundImage.querySelectorAll(`.multiple_${number}`).forEach((elem) => {
      elem.setAttribute("fill", "#D0A86D");
      elem.setAttribute("stroke", "#D0A86D");
      anime({
        targets: elem,
        opacity: 1,
        easing: "easeInOutQuad",
        duration: 1500,
        direction: "normal",
        loop: 1,
      });
    });

    // remove highlighter
    anime({
      targets: backgroundImage.querySelector(`.no_${number}.circle`),
      opacity: [1, 0],
      easing: "easeInOutQuad",
      duration: 1500,
      direction: "normal",
      loop: 1,
    });
  };

  /**
   * deactivate numbers
   * @param {*} number
   */
  const deactivateNumbers = (number) => {
    const num = backgroundImage.querySelector(`.no_${number}.number`);
    const circle = backgroundImage.querySelector(`.no_${number}.circle`);

    num.setAttribute("fill", "#3D1C04");
    circle.setAttribute("stroke", "");
    backgroundImage
      .querySelectorAll(`.multiple_${number}.crossout`)
      .forEach((elem) => {
        elem.setAttribute("stroke", "");
      });
  };

  /**
   * animate numbers
   * @param {*} number
   * @param {*} duration
   */
  const animateNumbers = (number, duration) => {
    const num = backgroundImage.querySelector(`.no_${number}.number`);
    const filter = backgroundImage.querySelector(`.no_${number}.filter`);
    const circle = backgroundImage.querySelector(`.no_${number}.circle`);

    filter.setAttribute("filter", `url(#no_${number}_highlighter)`);
    num.setAttribute("fill", "#CE0000");
    anime({
      targets: filter,
      opacity: [0, 1, 0, 1],
      easing: "easeInOutQuad",
      duration: 1700,
      direction: "normal",
      loop: 1,
    }).finished.then(() => {
      filter.setAttribute("filter", "");
      num.setAttribute("fill", "#3D1C04");
      circle.setAttribute("stroke", "#CE0000");
      anime({
        targets: [circle, num],
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 1500,
        direction: "normal",
        loop: 1,
      }).finished.then(() => {
        // cross out multiples
        const arr = backgroundImage.querySelectorAll(
          `.multiple_${number}.crossout`
        );
        const len = arr.length;
        let idx = 0;
        const loop = () => {
          const elem = arr[idx++];
          if (!elem) {
            setTimeout(() => {
              toggleArrow(
                actionPerStep[currentStep].leftActive,
                actionPerStep[currentStep].rightActive
              );
            }, 500);
            return true;
          }
          elem.setAttribute("stroke", "#CE0000");
          elem.setAttribute("stroke-dasharray", "300");
          anime({
            targets: elem,
            strokeDashoffset: [-150, 0],
            easing: "linear",
            duration: duration,
            direction: "normal",
          }).finished.then(() => {
            loop();
          });
        };
        loop();
      });
    });
  };

  /**
   * activate numbers
   * @param {*} number
   */
  const activateNumber = (number) => {
    const num = backgroundImage.querySelector(`.no_${number}.number`);
    const circle = backgroundImage.querySelector(`.no_${number}.circle`);
    num.setAttribute("fill", "#3D1C04");
    circle.setAttribute("stroke", "#CE0000");
    circle.setAttribute("style", "opacity: 1");
    backgroundImage
      .querySelectorAll(`.multiple_${number}.crossout`)
      .forEach((c) => {
        c.setAttribute("stroke", "#CE0000");
      });
    backgroundImage
      .querySelectorAll(`.multiple_${number}.number`)
      .forEach((n) => {
        n.setAttribute("fill", "#3D1C04");
        n.setAttribute("stroke", "");
      });
  };

  window.addEventListener("resize", function () {
    autoScale();
  });

  // toggle full screen mode
  root.querySelector("#fullScreenButton").addEventListener("click", () => {
    toggleFullScreen();
  });

  // reset step to 0
  root.querySelector(".reset_btn").addEventListener("click", () => {
    if (currentStep === -1) {
      return;
    }

    stepperItems[currentStep].classList.remove("active");
    text.innerHTML = "에라토스테네스의 체";

    toggleArrow(false, true);

    currentStep = -1;

    backgroundImage.querySelectorAll(`.crossout`).forEach((c) => {
      c.setAttribute("stroke", "");
    });
    backgroundImage.querySelectorAll(`.number`).forEach((n) => {
      n.setAttribute("fill", "#3D1C04");
      n.setAttribute("stroke", "");
    });
    backgroundImage.querySelectorAll(`.circle`).forEach((n) => {
      n.setAttribute("stroke", "");
    });
  });

  /**
   * left arrow click
   */
  arrowLeft.addEventListener("click", () => {
    if (currentStep) {
      currentStep--;
      if (currentStep < 5) {
        switch (currentStep) {
          case 0:
            backgroundImage
              .querySelectorAll(".no_1.crossout")
              .forEach((elem) => {
                elem.setAttribute("fill", "#CE0000");
                elem.setAttribute("stroke", "#CE0000");
              });
            backgroundImage.querySelectorAll(".no_1.number").forEach((elem) => {
              elem.setAttribute("fill", "#3D1C04");
              elem.setAttribute("stroke", "");
            });
            deactivateNumbers(2);
            break;
          case 1:
            activateNumber(2);
            deactivateNumbers(3);
            break;
          case 2:
            activateNumber(3);
            deactivateNumbers(5);
            break;
          case 3:
            activateNumber(5);
            break;
        }
      }
      stepperItems[currentStep + 1].classList.remove("active");
      stepperItems[currentStep].classList.add("active");
      text.innerHTML = actionPerStep[currentStep].text;
      setTimeout(() => {
        toggleArrow(
          actionPerStep[currentStep].leftActive,
          actionPerStep[currentStep].rightActive
        );
      }, 1000);
    }
  });

  /**
   * right arrow click
   */
  arrowRight.addEventListener("click", () => {
    currentStep++;
    toggleArrow(false, false);

    if (currentStep > -1) {
      switch (currentStep) {
        case 0:
          const element = backgroundImage.querySelector(".no_1.crossout");
          element.setAttribute("stroke", "#CE0000");
          element.setAttribute("stroke-dasharray", "300");
          anime({
            targets: element,
            strokeDashoffset: [-150, 0],
            easing: "linear",
            duration: 500,
            direction: "normal",
            loop: 1,
          }).finished.then(() => {
            setTimeout(() => {
              toggleArrow(
                actionPerStep[currentStep].leftActive,
                actionPerStep[currentStep].rightActive
              );
            }, 500);
          });
          break;
        case 1:
          // comment out 1
          backgroundImage.querySelectorAll(".no_1").forEach((elem) => {
            elem.setAttribute("fill", "#D0A86D");
            elem.setAttribute("stroke", "#D0A86D");
          });
          setTimeout(() => animateNumbers(2, 1000), 2500);
          break;
        case 2:
          commentOutNumbers(2);
          setTimeout(() => animateNumbers(3, 1000), 2500);
          break;
        case 3:
          commentOutNumbers(3);
          setTimeout(() => animateNumbers(5, 500), 2500);
          break;
        case 4:
          commentOutNumbers(5);
          setTimeout(() => {
            const arr = backgroundImage.querySelectorAll(".no_p.circle");
            const len = arr.length;
            let idx = 0;
            const loop = () => {
              const circle = arr[idx++];
              if (!circle) {
                anime({
                  targets: arr,
                  opacity: 0,
                  easing: "easeInOutQuad",
                  duration: 1500,
                  direction: "normal",
                  loop: 1,
                }).finished.then(() => {
                  arr.forEach((c) => {
                    c.setAttribute("stroke", "#D0A86D");
                  });
                  toggleArrow(
                    actionPerStep[currentStep].leftActive,
                    actionPerStep[currentStep].rightActive
                  );
                });
                return true;
              }
              circle.setAttribute("stroke", "#CE0000");
              anime({
                targets: [circle],
                opacity: [0, 1],
                easing: "easeInOutQuad",
                duration: 500,
                direction: "normal",
                loop: 1,
              }).finished.then(() => {
                loop();
              });
            };
            loop();
          }, 2500);

          break;
        default:
          break;
      }
    }
    if (currentStep) {
      stepperItems[currentStep - 1].classList.remove("active");
    }
    stepperItems[currentStep].classList.add("active");
    text.innerHTML = actionPerStep[currentStep].text;
  });
});
