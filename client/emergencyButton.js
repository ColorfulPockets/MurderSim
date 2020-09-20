/*
-----------------INCLUDE IN FILE:-------------------------

<audio id="Song 1" src="Song1.mp3" type="audio/mp3"> </audio>
<audio id="Song 2" src="Song2.mp3" type="audio/mp3"> </audio>
<audio id="Song 3" src="Song3.mp3" type="audio/mp3"> </audio>

<div id='div0' style='font-size: 20vw;
    position: fixed;
    top: 200px; left: 50%;
    transform: translate(-50%, -50%);'>
</div>

<h1 id='headline' style='font-size: 6vw' style='font-size: 20vw;
        text-align: center;'>
</h1>

<span id='spanHalf'>
    <span id='taskTimer' style='font-size: 20vw;'></span>
    <button id='hideTask'></button>
</span>
<div id='div2'></div>

<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
<script src="https://code.jquery.com/jquery-1.10.2.js"></script>



MUST INCLUDE: toggleTask()
*/ 

var socket = io();

socket.emit('type', {
    type: 'meeting'
});




var div0 = document.getElementById('div0');
var taskTimer = document.getElementById('taskTimer');
var hideTask = document.getElementById('hideTask');
var div2 = document.getElementById('div2');
var headline = document.getElementById('headline');
var song1 = document.getElementById('Song 1');
var song2 = document.getElementById('Song 2');
var song3 = document.getElementById('Song 3');

taskTimer.hidden = true;
var taskShowing = false;

document.body.style = "background-color:green";

headline.innerHTML = "No Meeting Called";

hideTask.style = 'border-radius: 9vw; height: 18vw; width: 18vw;'
            +   'font-size: 3vw; margin: 2vw;'
            +   'float:right';
hideTask.innerHTML = 'Hide Task';
hideTask.addEventListener('click', toggleTask);
hideTask.hidden = true;

var emergencyButton = document.createElement('button');
emergencyButton.id = "emergencyButton";
emergencyButton.innerHTML = "CALL MEETING";
emergencyButton.className = "emergencyButton";
// sizes based on view width
emergencyButton.style = "border-radius: 40vw;"
                    +   " height: 80vw;"
                    +   " width: 80vw;"
                    // These next three lines center it somehow
                    +   "position: fixed;"
                    +   "top: 80vw; left: 50%;"
                    +   "transform: translate(-50%, -50%);"
                    +   " background-color: pink;"
                    +   " font-size: 75px";
emergencyButton.addEventListener("click", emitCallMeeting);
div2.appendChild(emergencyButton);

var showTask = document.createElement('button');
showTask.innerHTML = 'Show Task';
showTask.style = 'border-radius: 10vw; height: 20vw; width: 20vw;'
            +   'position: fixed; top: 15vw; left: 85%;'
            +   'transform: translate(-50%, -50%);'
            +   'font-size: 3vw';
div2.appendChild(showTask);
showTask.addEventListener("click", function() {
    // set up sounds
    song1.play();
    song1.pause();
    song2.play();
    song2.pause();
    song3.play();
    song3.pause();

    toggleTask()
});

// listens for timer updates
socket.on('updateTimer', function(data) {
    var timer = new Date(data.date);
    div0.innerHTML = timer.toISOString().substr(14,5);
    taskTimer.innerHTML = timer.toISOString().substr(14,5);
})

// listens for callMeeting
socket.on('callMeeting', function () {
    callMeeting();
    if (taskShowing) {
        toggleTask();
    }
    showTask.hidden = true;
})

// listens for endMeeting
socket.on('endMeeting', function () {
    endMeeting();
    if (!taskShowing) {
        toggleTask();
    }
})

// song is an integer which selects which song should play
var song = 0;
socket.on('songSelect', function(data) {
    song = data.song;
})


// These functions emit signals without creating a loop where those signals then call themselves
function emitCallMeeting() {
    socket.emit('callMeeting');
}

function emitEndMeeting() {
    socket.emit('endMeeting');
}

// Calls emergency meeting
function callMeeting() {

    document.body.style = "background-color:red";

    switch (song) {
        case 0: song1.currentTime = 0; 
            song1.volume = 0.25;
            song1.play();
            break;
        case 1: song2.currentTime = 0;
            song2.volume = 0.25;
            song2.play();
            break;
        case 2: song3.currentTime = 0;
            song3.volume = 0.15;
            song3.play();
            break;
        default: break;
    }

    headline.innerHTML = "EMERGENCY MEETING";

    var emergencyButton = document.getElementById('emergencyButton');

    if (typeof(emergencyButton) != 'undefined' && emergencyButton != null) {
        emergencyButton.innerHTML = "End Meeting";

        // removes the onclick event from the emergency button and replaces
        emergencyButton.removeEventListener("click", emitCallMeeting);
        emergencyButton.addEventListener("click", emitEndMeeting);
    }
}

function endMeeting() {
    song1.pause();
    song2.pause();
    song3.pause();

    showTask.hidden = false;

    document.body.style = "background-color:green";

    headline.innerHTML = "No Meeting Called";
    
    var emergencyButton = document.getElementById('emergencyButton');

    if (typeof(emergencyButton) != 'undefined' && emergencyButton != null) {
        emergencyButton.innerHTML = "CALL MEETING";

        // removes the onclick event from the emergency button and replaces
        emergencyButton.removeEventListener("click", emitEndMeeting);
        emergencyButton.addEventListener("click", emitCallMeeting);
    }
}