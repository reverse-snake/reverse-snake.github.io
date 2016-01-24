var body = document.body;
var html = document.documentElement;
var table = document.getElementsByClassName('snaketable')[0];

var size = 30; // Size of cell
var height = 10;
var width = 15;

table.setAttribute('height', height*size + 'px');
table.setAttribute('width', width*size + 'px');
table.setAttribute('cellspacing', '1px');
table.setAttribute('cellpadding', '0px');
for (var i=0; i<height; i+=1) {
	var row = table.insertRow(i);
	for (var j=0; j<width; j+=1) {
		var cell = row.insertCell(j);
		cell.setAttribute('name', j+'_'+i);
		var btn = document.createElement('button');
		btn.setAttribute('class', 'invisible');
		btn.setAttribute('onmousedown', 'placeFood('+j+','+i+')');
		btn.style.height = size+'px';
		btn.style.width = size+'px';
		cell.appendChild(btn);
	}
}

function updateBoard() {
	for (var r=0; r<table.rows.length; r++) {
		for (var c=0; c<table.rows[r].cells.length; c++) {
			var cell = table.rows[r].cells[c];
			if (inSnakeTwice(cell.getAttribute('name'))) {
				cell.setAttribute('class', 'impactcell');
			} else if (inSnake(cell.getAttribute('name'))) {
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
	score.innerHTML = (snake.length - level - 3);
	var minutes, seconds;
	if (startTime.length == []) { // Before stage start
		time.innerHTML = '0:00';
	} else if (stopTime == []) { // After stage end
		minutes = (stopTime[0] - startTime[0] + 60) % 60;
		seconds = (stopTime[1] - startTime[1] + 60) % 60;
		time.innerHTML = minutes + ':' + (seconds<10?'0':'')+seconds;
	} else { // Stage in progress
		var minutes = (new Date().getMinutes() - startTime[0] + 60) % 60;
		var seconds = (new Date().getSeconds() - startTime[1] + 60) % 60;
		time.innerHTML = minutes + ':' + (seconds<10?'0':'')+seconds;
	}
}

updateBoard();
