"use strict";
let newElem = s => document.createElement(s);
let log = s => console.log(s);
let doc = document;

let getCoords = elem =>{
	let box = elem.getBoundingClientRect();
	return {
		top : box.top + pageXOffset,
		left : box.left + pageYOffset
	};
}

doc.body.style.margin = "0";

let wnd = s =>{
	let doc = document;
	let newElem = s => doc.createElement(s);
	let win = newElem("div");
	win.style.cssText =`
		min-width: 300px;
		min-height: 100px;
		z-index: 999;
		position: fixed;
		top: 5px;
		left: ${window.innerWidth/2 - win.offsetWidth/2}px;
		border: 2px solid;
		padding: 20px;
		background: #fff;
	`;
	if(typeof s == "object")
		win.append(s);
	else
		win.innerHTML += s + "";
	doc.body.append(win);
	setTimeout(()=>{
		win.style.left = window.innerWidth/2 - win.offsetWidth/2 + "px";
	}, 0);
	win.onclick = e =>{
		e.stopPropagation();
		e.target.remove();
	}
	return win;
}