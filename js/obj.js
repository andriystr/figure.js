function Polygon(){
	let points = [];
	let len = (o1, o2)=> Math.sqrt(Math.pow(o1.x-o2.x, 2)+Math.pow(o1.y-o2.y, 2));
	let perimeter = (o1, o2, o3)=> (len(o1, o2) + len(o2, o3) + len(o1, o3));
	this.getPoint = i =>{
		if(points.length > 0)
			return ({x : points[i].x, y : points[i].y});
		else
			return null;
	}
	this.size = ()=> points.length;
	this.add = (x, y) =>{
		x = +x;
		y = +y;
		if( isNaN(x) && isNaN(y) )throw("Class Polygon Error: x: " + x + ", y: " + y);
		points.push({x : x, y : y});
	}
	this.del = i =>{
		points.splice(i, 1);
	}
	this.movePoint = (i, x, y)=>{
		x = +x;
		y = +y;
		if( isNaN(x) && isNaN(y) )throw("Class Polygon Error: x: " + x + ", y: " + y);
		points[i] = {x : x, y : y};
	}
	this.getArea = ()=>{
		let arr = points;
		let r = 0;
		for(let i = 1; i < arr.length - 1 && arr.length > 2; i++){
			let p = (perimeter(arr[0], arr[i], arr[i + 1]) / 2);
			r += Math.sqrt(p*(p - len(arr[0], arr[i]) )*(p - len(arr[i], arr[i + 1]))*(p - len(arr[0], arr[i + 1])));
		}
		return r;
	}
	this.getPerimeter = ()=>{
		let arr = points;
		let r = 0;
		for(let i = 1; i < arr.length; i++){
			r += len(arr[i-1], arr[i]);
		}
		r += len(arr[0], arr[arr.length-1]);
		return r;
	}
}

function Table(o){
	let newElem = s => document.createElement(s);
	if(!o.elem)throw("Class Table Error: elem no HTML element!!!");
	let rows = [];
	let rowsHTML = [];
	let head = o.head || ['1', '2'];
	this.size = ()=>rows.length;
	this.sizeColum = ()=> head.length;
	let headHTML = [];
	let headAttr = o.headAttrs || o.headAttr || null;
	for(let i = 0; i < this.sizeColum(); i++){
		let e = head[i];
		let th = newElem("th");
		if(typeof e == "object")
			th.append(e);
		else
			th.innerHTML = e;
		if(headAttr && headAttr[i])headAttr[i].forEach(e =>{
			th.setAttribute(e.name, (e.value || e.val));
		});
		headHTML.push(th);
	}
	let elem = o.elem;
	let table = newElem("table");
	elem.append(table);
	let input = o.input || null;
	let attr = o.attrs || o.attr || null;
	this.getElem = ()=> elem;
	this.getRows = ()=> rows;
	this.getRowsHTML = ()=> rowsHTML;
	this.getHead = ()=> head;
	this.getHeadHTML = ()=> headHTML;
	this.getOut = ()=> out;
	let inputFilter = o.inputFilter || null;
	let beforInput = o.beforInput || null;
	this.setFilter = f =>{
		if(typeof f == "function")inputFilter = f;
	}
	this.setBeforInput = f =>{
		if(typeof f == "function")beforInput = f;
	}
	/*let focus = e =>{
		
	}*/
	let blur = e =>{
		let el = e.target;
		let i = el.cell.i;
		let arr = el.cell.arr;
		if(typeof inputFilter == "function")
			el.innerHTML = arr[i] = inputFilter(el.innerHTML, arr[i]);
		else
			arr[i] = el.innerHTML;
		if(typeof beforInput == "function")beforInput(this);
	}
	let show = ()=>{
		let thead = newElem("thead");
		headHTML.forEach(e =>{
			thead.append(e);
		});
		let tbody = newElem("tbody");
		rowsHTML.splice(0);
		for(let i = 0; i < rows.length; i++){
			let el = rows[i];
			let tr = newElem("tr");
			let tmp = [];
			for(let j = 0; j < el.length; j++){
				let e = el[j];
				let td = newElem("td");
				if(attr && attr[j])attr[j].forEach(e =>{
					td.setAttribute(e.name, (e.value || e.val));
				});
				if(input && input[j]){
					td.setAttribute("contenteditable", "");
					td.cell = {i : j, arr : el};
					//td.addEventListener("focus", focus, false);
					td.addEventListener("blur", blur, false);
				}
				if(typeof e == "object")
					td.append(e);
				else
					td.innerHTML = e;
				tr.append(td);
				tmp.push(td);
			}
			rowsHTML.push(tmp);
			tbody.append(tr);
		}
		table.innerHTML = "";
		table.append(thead);
		table.append(tbody);
	}
	this.update = (i, n)=>{
		let less = (this.sizeColum() > n.length) ? n.length : this.sizeColum();
		for(let j = 0; j < less; j++){
			if(n[j] == null)continue;
			rows[i][j] = n[j];
		}
		show();
	}
	this.add = n =>{
		let tmp = [];
		let less = (this.sizeColum() > n.length) ? n.length : this.sizeColum();
		for(let j = 0; j < less; j++){
			tmp.push(n[j]);
		}
		rows.push(tmp);
		show();
	}
	this.del = i =>{
		rows.splice(i, 1);
		rowsHTML.splice(i, 1);
		show();
	}
	this.readRow = i =>{
		let tmp = [];
		rows[i].forEach(e =>{
			tmp.push(e);
		});
		return tmp;
	}
	show();
}

function Figure(elem, canvas){
	if(!elem)throw("Class Figure Error: elem is " + elem);
	let update = () =>{
		let less = tb.size() > pol.size() ? pol.size() : tb.size();
		for(let i = 0; i < less; i++){
			let t = tb.readRow(i);
			let x = t[1];
			let y = t[2];
			pol.movePoint(i, x, y);
		}
		show();
	}
	let move = (i, x, y) =>{
		pol.movePoint(i, x, y);
		tb.update(i, [null, x, y]);
		show();
	}

	let canv = null;
	if(canvas)
		canv = canvas;
	else{
		canv = newElem("canvas");
		elem.append(canv);
	}
	let mv = {
		isMove : false,
		p : -1,
		offsetX : 0,
		offsetY : 0
	};

	let mousemove = e =>{
		let box = canv.getBoundingClientRect();
		let x = e.pageX - (pageXOffset + box.x);
		let y = e.pageY - (pageYOffset + box.y);
		if(mv.isMove)move(mv.p, Math.floor(x + mv.offsetX), Math.floor(y + mv.offsetY));
	}
	
	let len = (o1, o2)=> Math.sqrt(Math.pow(o1.x-o2.x, 2)+Math.pow(o1.y-o2.y, 2));
	
	let o = {
		elem : elem,
		head : ["N", "X", "Y", ""],
		headAttr : [
			null,
			[{name : "style", val : "text-align: right; padding: 0 20px"}],
			[{name : "style", val : "text-align: right; padding: 0 20px"}]
		],
		attr : [
			[{name : "style", val : "color: #888;"}],
			[{name : "style", val : "text-align: right; padding: 0 20px;"}],
			[{name : "style", val : "text-align: right; padding: 0 20px;"}]
		],
		input : [false, true, true]
	};
	
	let tb = new Table(o);
	let pol = new Polygon();
	let addBut = newElem("input");
	addBut.value = "ADD";
	addBut.style.cssText = "color: green";
	addBut.type = "button";
	addBut.onclick = ()=>{
		if(pol.size() < 1)this.add(20, 20);
		else{
			let beg = pol.getPoint(0);
			let end = pol.getPoint(pol.size()-1);
			this.add(Math.floor((beg.x+end.x)/2), Math.floor((beg.y+end.y)/2));
		}
	}
	elem.append(addBut);

	let area = newElem("input");
	area.value = "Area";
	area.style.cssText = "color: green";
	area.type = "button";
	area.onclick = ()=>{
		wnd("Area: " + pol.getArea());
	}
	elem.append(area);

	let Perimeter = newElem("input");
	Perimeter.value = "Perimeter";
	Perimeter.style.cssText = "color: green";
	Perimeter.type = "button";
	Perimeter.onclick = ()=>{
		wnd("Perimeter: " + pol.getPerimeter());
	}
	elem.append(Perimeter);
	let pointRadius = 6;
	let show = ()=>{
		c.clearRect(0, 0, canv.width, canv.height);
		if(pol.size() < 1)return;
		c.beginPath()
		c.lineCap = "round";
		c.lineWidth = 2;
		let p = pol.getPoint(0);
		c.moveTo(p.x, p.y);
		for(let i = 1; i < pol.size(); i++){
			p = pol.getPoint(i);
			c.lineTo(p.x, p.y);
		}
		c.closePath();
		c.fillStyle = "#ccc";
		c.strokeStyle = "#333";
		c.fill();
		c.stroke();
		for(let i = 0; i < pol.size(); i++){
			let p = pol.getPoint(i);
			c.beginPath();
			c.arc(p.x, p.y, pointRadius, 0, Math.PI * 2, false);
			c.fillStyle = "#111";
			c.fill();
			let tx = p.x + "";
			let ty = p.y + "";
			for(;tx.length < 5; tx = " " + tx);
			for(;ty.length < 5; ty += " ");
			c.fillStyle = "#F00";
			c.font = "700 0.8em Arial";
			c.textAlign = "center";
			c.textBaseline = "middle";
			c.fillText(tx + " x " + ty, p.x, p.y - 14);
		}
	}

	canv.addEventListener("mousedown", e =>{
		let fl = false;
		let p;
		let i;
		let box = canv.getBoundingClientRect();
		let curs={
			x : e.pageX - (pageXOffset + box.x),
			y : e.pageY - (pageYOffset + box.y)
		}
		for(i = 0; i < pol.size(); i++){
			p = pol.getPoint(i);
			if(len(p, curs) < pointRadius + 1){
				fl = true;
				break;
			}
		}
		if(fl){
			mv.isMove = true;
			mv.p = i;
			mv.offsetX = curs.x - p.x;
			mv.offsetY = curs.y - p.y;
			canv.addEventListener("mousemove", mousemove, false);
		}
	} , false);
	canv.addEventListener("mouseup", e =>{
		mv.isMove = false;
		mv.p = -1;
		mv.offsetX = 0;
		mv.offsetY = 0;
		canv.removeEventListener("mousemove", mousemove, false);
	} , false);

	let c = canv.getContext("2d");
	elem.style.padding = "0";
	canv.style.margin = "0";

	canv.width = elem.clientWidth;
	canv.height = elem.clientHeight / 2;

	elem.onresize = ()=>{
		canv.width = elem.clientWidth;
		canv.height = elem.clientHeight / 2;
		show();
	}

	tb.setFilter((inp, val) =>{
		if(isNaN(+inp))return val;
		else return inp;
	});
	tb.setBeforInput(()=>{
		update();
	});
	this.add = (x, y)=>{
		pol.add(x, y);
		let but = newElem("input");
		but.value = "DELETE";
		but.style.cssText = "color: red";
		but.type = "button";
		but.onclick = e =>{
			this.del(e.target.parentNode.parentNode.rowIndex);
		}
		tb.add([pol.size(), x, y, but]);
		show();
	}
	this.del = (i)=>{
		pol.del(i);
		tb.del(i);
		for(let j = i; j < tb.getRows().length; j++){
			tb.update(j, [j + 1]);
		}
		show();
	}
}
