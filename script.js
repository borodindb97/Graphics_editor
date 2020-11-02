// Документ
var doc = document;

// Канвас
var canv = doc.getElementById('canvas');
var ctx = canv.getContext('2d');

// Переменные
var coordinates = {
    xCoordinate : 0,
    yCoordinate : 0
};

var system = {
    instrument: '',
    instrumentSize: '2',
    instrumentColor: 'black'
};

var startLine = false;

// Функции
function getCoordinates(evt){
    coordinates.xCoordinate = evt.offsetX;
    coordinates.yCoordinate = evt.offsetY;
    doc.getElementById('xCoordinate').innerText = coordinates.xCoordinate;
    doc.getElementById('yCoordinate').innerText = coordinates.yCoordinate;
}

function clickPanel(evt){
    if (evt.target.classList.contains('button')){
        system.instrument = doc.getElementById(evt.target.id).innerText;
        doc.getElementById('instrumentNow').innerText = system.instrument;
        console.log(system);
    } else if (evt.target.id == 'brushSize'){
        system.instrumentSize = doc.getElementById('brushSize').value;
        console.log(system);
    } else if (evt.target.id == 'instrumentColor'){
        system.instrumentColor = doc.getElementById('instrumentColor').value;
        console.log(system);
    } else if (evt.target.id == 'canvasWidth'){
        doc.getElementById('container').style.width = parseInt(doc.getElementById('canvasWidth').value) + 103 + 'px';
        doc.getElementById('canvas').style.width = doc.getElementById('canvasWidth').value + 'px';
        doc.getElementById('canvas').setAttribute('width', doc.getElementById('canvasWidth').value);
        if (doc.getElementById('canvasWidth').value != 498){
            doc.getElementById('figures').style.borderLeft = '1px black solid';
        } else if (doc.getElementById('canvasWidth').value == 498){
            doc.getElementById('figures').style.borderLeft = '';
        }
    } else if (evt.target.id == 'canvasHeight'){
        doc.getElementById('container').style.height = parseInt(doc.getElementById('canvasHeight').value) + 200 + 'px';
        doc.getElementById('canvas').style.height =  doc.getElementById('canvasHeight').value + 'px';
        doc.getElementById('canvas').setAttribute('height', doc.getElementById('canvasHeight').value);
        doc.getElementsByClassName('rightPanel')[0].style.height = doc.getElementById('canvasHeight').value + 'px';
    } else if (evt.target.id == 'clear'){
        clear();
    } else if (evt.target.id == 'download'){
        let image = canv.toDataURL('image/png');
        console.log(image);
        let download = doc.getElementById('download');
        download.href = image;
        download.download = 'Image.png';
        // download.dispatchEvent(event);
    }
}

function drawDown(evt){
    system.instrumentColor = doc.getElementById('instrumentColor').value;
    if (system.instrument == 'Кисть'){
        drawBrush(evt);
    } else if (system.instrument == 'Ластик'){
        drawEraser(evt);
    }
}

function drawClick(evt) {
    system.instrumentColor = doc.getElementById('instrumentColor').value;
    if (system.instrument == 'Прямая'){
        drawLine(evt);
    } else if (system.instrument == 'Круг'){
        drawCircle();
    } else if (system.instrument == 'Квадрат'){
        drawRect();
    } else if (system.instrument == 'Треугольник'){
        drawTriangle();
    }
}

function drawBrush(evt) {
    canv.onmousemove = function (evt) {
        ctx.beginPath();
        ctx.fillStyle = system.instrumentColor;
        ctx.arc(coordinates.xCoordinate, coordinates.yCoordinate, system.instrumentSize, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}

function drawLine(evt) {
    if (startLine){
        ctx.lineTo(coordinates.xCoordinate, coordinates.yCoordinate);
        ctx.strokeStyle = system.instrumentColor;
        ctx.lineWidth = system.instrumentSize;
        ctx.stroke();
        startLine = !startLine;
    } else {
        ctx.beginPath();
        ctx.moveTo(coordinates.xCoordinate, coordinates.yCoordinate);
        startLine = !startLine;
    }

}

function drawEraser(evt) {
    canv.onmousemove = function () {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(coordinates.xCoordinate, coordinates.yCoordinate, system.instrumentSize, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}

function drawFigures() {
    ctx.beginPath();
    ctx.strokeStyle = system.instrumentColor;
    ctx.lineWidth = 1;
}

function drawCircle() {
    drawFigures();
    ctx.arc(coordinates.xCoordinate, coordinates.yCoordinate, system.instrumentSize, 0, 2*Math.PI, true);
    ctx.stroke();
}

function drawRect() {
    drawFigures();
    ctx.strokeRect(coordinates.xCoordinate - system.instrumentSize/2, coordinates.yCoordinate - system.instrumentSize/2, system.instrumentSize, system.instrumentSize);
}

function drawTriangle() {
    drawFigures();
    ctx.moveTo(coordinates.xCoordinate - system.instrumentSize/2, coordinates.yCoordinate + 0.866 * system.instrumentSize * 0.33);
    ctx.lineTo(coordinates.xCoordinate, coordinates.yCoordinate - 0.866 * system.instrumentSize * 0.66);
    ctx.lineTo(coordinates.xCoordinate + system.instrumentSize/2, coordinates.yCoordinate + 0.866 * system.instrumentSize * 0.33);
    ctx.lineTo(coordinates.xCoordinate - system.instrumentSize/2, coordinates.yCoordinate + 0.866 * system.instrumentSize * 0.33);
    ctx.stroke();
}

function clear() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, doc.getElementById('canvasWidth').value, doc.getElementById('canvasHeight').value);
    ctx.fill();
}

function stopDraw(){
    canv.onmousemove = null;
}

// События
canv.addEventListener('mousemove', getCoordinates);
doc.addEventListener('click', clickPanel);
canv.addEventListener('mousedown', drawDown);
doc.addEventListener('mouseup', stopDraw);
canv.addEventListener('click', drawClick);
