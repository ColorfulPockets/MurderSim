/*
    INCLUDE:
    
    <div id='playerSelect'></div>

    INCLUDE THIS SCRIPT AFTER EMERGENCYBUTTON
    (since that sets up socket.io)

    MUST DEFINE taskID, must include playerSelected()  (what happens after player is selected)
*/

var playerSelectDiv = document.getElementById('playerSelect');
playerSelectDiv.style = 'position: fixed; top: 2.5vh; left: 2.5vw;'
                    +   'right: 2.5vw; border-style: solid; '
                    +   'border-width: 5px; background-color: lightgrey'
playerSelectDiv.hidden = true;

var playerList = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 
                'Player 5', 'Player 6', 'Player 8', 'Player 8'];

socket.on('playerList', function(data) {
    playerList = data.playerList;
})

for (var i in playerList) {
    var player = playerList[i];
    playerButton(player, playerSelectDiv);
}

function playerButton(value, container) {
    var button = document.createElement('button');
    button.style = "width: 21vw; height: 21vw; font-size: 5vw; text-align: center; "
                +   "-webkit-appearance: none; border-radius: 0; padding: 0;"
                +   "background-color: lightblue; margin: 1vw";
    button.innerHTML = value;
    container.appendChild(button);
    button.addEventListener('click', function() {
        socket.emit('playerDidTask', {
            player: value,
            task: taskID
        });
        playerSelected();
        playerSelectDiv.hidden = true;
    });
}