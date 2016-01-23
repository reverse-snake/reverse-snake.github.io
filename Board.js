var body = document.body;
var html = document.documentElement;
var body = html.getElementsByTagName("body")[0];
var table = body.getElementsByTagName("table")[0];
var size = 20; // Size of cell

// Credit to http://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
width -= 10; // Make the table a little smaller so there's a valid border.
height -= 10;
width = Math.floor(width/size);
height = Math.floor(height/size);
console.log("Width: "+width, " Height: "+height);
table.setAttribute("height", height*size + "px");
table.setAttribute("width", width*size + "px");
for (var i=0; i<height; i+=1) {
	var row = table.insertRow(i);
	for (var j=0; j<width; j+=1) {
		var cell = row.insertCell(j);
		cell.setAttribute("name", j+"_"+i);
		var btn = document.createElement("button");
		btn.setAttribute("class", "invisible");
		btn.setAttribute("onclick", "placeFood("+j+","+i+")");
		cell.appendChild(btn);
	}
}

function updateBoard() {
	for (var r=0; r<table.rows.length; r++) {
		for (var c=0; c<table.rows[r].cells.length; c++) {
			var cell = table.rows[r].cells[c];
			var isSnakeCell = false;
			var isFoodCell = false;
			for (var s=0; s<snake.length; s++) {
				if (cell.getAttribute("name") == snake[s][0]+"_"+snake[s][1]) {
					isSnakeCell = true;
					break;
				}
			}
			if (cell.getAttribute("name") == food[0]+"_"+food[1]) {
  			isFoodCell = true;
			}
			if (isSnakeCell) {
				cell.setAttribute("class", "snakecell");
			} else if (isFoodCell) {
        cell.setAttribute("class", "foodcell");
      } else {
				cell.setAttribute("class", "emptycell");
			}
		}
	}
}