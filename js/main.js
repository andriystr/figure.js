doc.documentElement.style.cssText = "min-height: 100%";
doc.body.style.cssText = "min-height: 100vh";
let f = new Figure(doc.body);

f.add(40, 40);
f.add(140, 40);
f.add(140, 140);
f.add(40, 140);
