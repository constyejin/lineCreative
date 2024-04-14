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
});


