var body = document.body;
var html = document.documentElement;
var body = html.getElementsByTagName("body")[0];
var table = body.getElementsByTagName("table")[0];
var size = 20; // Size of cell
size += 2; // Add border

// Credit to http://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
width -= 100; // Make the table a little smaller so there's a valid border.
height -= 100;
width = size * Math.floor(width/size);
height = size * Math.floor(height/size);
console.log("Width: "+width, " Height: "+height);
table.setAttribute("height", height + "px");
table.setAttribute("width", width + "px");
for (var i=0; i<height; i+=size) {
	var row = document.createElement("tr");
	for (var j=0; j<width; j+=size) {
	  var cell = document.createElement("td");
	  cell.setAttribute("class", "emptycell");
	  cell.setAttribute("name", i+"_"+j);
	  row.appendChild(cell);
	}
	table.appendChild(row);
}

function updateBoard(snake) {
  console.log(snake);
	for (var row in (table.getElementsByTagName("tr"))) {
	  for (var cell in (row.getElementsByTagName("td"))) {
	    var isSnakeCell = false;
	    for (var s in snake) {
  	    if (cell.name == s[0]+"_"+s[1]) {
    	    isSnakeCell = true;
    	    break;
    	  }
	    }
	    console.log(cell);
	    if (isSnakeCell) {
        cell.setAttribute("class", "snakecell");
	    } else {
  	    cell.setAttribute("class", "emptycell");
  	  }
	  }
	}
}