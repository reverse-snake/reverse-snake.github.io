var body = document.body;
var html = document.documentElement;
var body = html.getElementsByTagName('body')[0];
var table = body.getElementsByTagName('table')[0];

var size = 30; // Size of cell
var height = 10;
var width = 15;

if (isMobile) {
	size = 75;
	height = 15;
	width = 10;
	refreshRate = 350;
}
console.log('Width: '+width, ' Height: '+height);
table.setAttribute('height', height*size + 'px');
table.setAttribute('width', width*size + 'px');
for (var i=0; i<height; i+=1) {
	var row = table.insertRow(i);
	for (var j=0; j<width; j+=1) {
		var cell = row.insertCell(j);
		cell.setAttribute('name', j+'_'+i);
		var btn = document.createElement('button');
		btn.setAttribute('class', 'invisible');
		btn.setAttribute('onclick', 'placeFood('+j+','+i+')');
		cell.appendChild(btn);
	}
}

function updateBoard() {
	for (var r=0; r<table.rows.length; r++) {
		for (var c=0; c<table.rows[r].cells.length; c++) {
			var cell = table.rows[r].cells[c];
			if (inSnake(cell.getAttribute('name'))) {
				cell.setAttribute('class', 'snakecell');
			} else if (cell.getAttribute('name') == food[0]+'_'+food[1]) {
        cell.setAttribute('class', 'foodcell');
      } else {
				cell.setAttribute('class', 'emptycell');
			}
			cell.setAttribute('height', size+'px');
			cell.setAttribute('width', size+'px');
		}
	}
}

updateBoard();
