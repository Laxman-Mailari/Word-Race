// @ Laxman M

var gameLevel = 1
var word = ""

const textElement = document.getElementById('text')
const inputElement = document.getElementById('inputData')
const timerElement = document.getElementById('timer')
const stackElement = document.getElementById('stacknum')

window.requestAnimation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
/*
window.stopAnimation = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;

window.animStartTime = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime;
*/


// Game
var Game = function(p) {
	"use strict";
	if( p instanceof Platform) {
		this.platform = p;
		this.username = '';
	}
};
Game.prototype.loop = 0;
Game.prototype.init = function() {};


var xhr = new XMLHttpRequest();
function getNextWord() {
	//var obj = g;
	request_data = JSON.stringify({"level" : gameLevel, "num" : n});
	function show()
	{	
		if(xhr.readyState==4 && xhr.status==200)
            {
				var resp = JSON.parse(xhr.responseText);
				word = resp["result"];
				console.log("result : "+word)
            }
	}
	
	xhr.onreadystatechange = show;
	xhr.open("GET","http://127.0.0.1:5000/getNextWord/"+request_data,false); // it is synchronous request( waiting till result return from server).
	xhr.send();
}


// timer
function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000); // getting updated seconds from startTime.using Math.floor() we are getting integer value.
  }

let startTime
function startTimer() {
  timerElement.innerText = 0
  startTime = new Date()
  setInterval(() => {
    timer.innerText = getTimerTime()
  }, 1000)
}
async function renderNewQuote() {
	getNextWord()
  	const quote = word;
  	textElement.innerHTML = ''
  	quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    textElement.appendChild(characterSpan)
  })
  inputElement.value = null
  startTimer()
}


function getN(){
	if(gameLevel == 1){
		return 5;
	}
	else{
		return 10;
	}
}
var n;
var totaltime = 0;

// Play Game
Game.prototype.play = function(g) {
	
	if(g instanceof Game) {
		inputElement.addEventListener('input', () => {
			const arrayQuote = textElement.querySelectorAll('span')
			const arrayValue = inputElement.value.split('')
		  
			let correct = true
			arrayQuote.forEach((characterSpan, index) => {
			  const character = arrayValue[index]
			  if (character == null) {
				characterSpan.classList.remove('correct')
				characterSpan.classList.remove('incorrect')
				correct = false
			  } else if (character === characterSpan.innerText) {
				characterSpan.classList.add('correct')
				characterSpan.classList.remove('incorrect')
			  } else {
				characterSpan.classList.remove('correct')
				characterSpan.classList.add('incorrect')
				correct = false
			  }
			})
			// after player finish the word type giving 250 m.sec timeout.otherwise the player typed last alphabet is not visible to player.
			setTimeout(function(){
				if (correct && n >= 0){
					n--;
					totaltime += parseInt(timerElement.innerText);
					stackElement.innerHTML = n;
					g.platform.soundManager.warning.play();
					renderNewQuote();
	
					if(n==0){
						//window.alert(totaltime);
						g.platform.switchState(g.platform.overState);
					}
				}

			}, 250); 
			
		  })
		stackElement.innerHTML = n;
		renderNewQuote();
		
	}
};

// STATE
var State = function() {
	"use strict";
	this.enter = function() {};
	this.leave = function() {};
};
State.prototype.loop;
State.prototype.hideMenu = function() { $('#menu').find('li').each(function() { $(this).hide(); }); $('#main').hide(); };
State.prototype.showState = function(el) { $('#main').show(); el.fadeIn(300); };


// -------- Menu State -----------
var MenuState = function(g) {
	"use strict";
	if(g instanceof Game) { 
		this.game = g;
		this.screen = $('#menuscreen');
		this.gameMode = $('#gameMode');
		
		this.enter = function() {
			$(document).off('keyup');
			var obj = g;
			this.hideMenu();
			this.showState(this.screen);
			
			this.gameMode.children().on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				switch(this.id) {
					case 'easy':
						gameLevel = 1;
						obj.platform.mode =1;
						break;
					case 'medium':
						gameLevel = 2;
						obj.platform.mode =2;
						break;
					case 'hard':
						gameLevel = 3;
						obj.platform.mode =3;
						break;
					default:
						gameLevel = 1;
						obj.platform.mode = 1;
						break;
				}
				n = getN();
				g.platform.soundManager.goal.play();
				// Switching the state to PlayState
				obj.platform.switchState(obj.platform.playState);
				
				return false;
			});
		};
	}
};
MenuState.prototype = new State();

// ------- play state --------
var PlayState = function(g) {
	"use strict";
	//window.alert("it is play state");
	if(g instanceof Game) {
		this.game = g;
		this.screen = $('#container');
		this.enter = function() {
			$('#container').fadeIn('slow');
			this.hideMenu();
			this.showState(this.screen);
			g.platform.loop = requestAnimation(function() { g.play(g); });
			console.log(g.platform.loop)
		};
		this.leave = function() { $(document).off('keyup'); $('#container').hide(); };
	}
};
PlayState.prototype = new State();


function UpdateScore(name,score){
	var data = JSON.stringify({"name" : name,"score" : score});
	
	function show(){
		if(xhr.readyState==4 && xhr.status==200)
            {
				var resp = JSON.parse(xhr.responseText);
            }
	}
	xhr.onreadystatechange = show;
	xhr.open("GET","http://127.0.0.1:5000/updateScore/"+data,false);
	this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send();
}

function getTopScore(){
	//console.log("it is top scores table")
	var arr = "";
	function show(){
		if(xhr.readyState==4 && xhr.status==200)
            {
				var resp = JSON.parse(xhr.responseText);
				console.log("hey bro " +resp)
				arr = resp.result;
		}
	}
	xhr.onreadystatechange =  show;
	xhr.open('GET',"http://127.0.0.1:5000/get_topScores",false);
	xhr.send();
	return arr
}

// ------ over state ------

var OverState = function(g) {
	"use strict";
	//window.alert("it is over state")
	if(g instanceof Game) { 
		this.game = g;
		this.screen = $('#scorescreen');
		
		this.enter = function() {
			var obj = g;
			g.platform.soundManager.gameover.play();
			var sum = 101;
			if(totaltime <= 100){
				sum = sum - totaltime;
			}
			else{
				sum = 0;
			}
			UpdateScore(g.username,sum);
			
			var res = getTopScore();
			//console.log("dont;try "+res)	
			//console.log(res[0]["name"])
			//console.log(res[0]["score"])

			var i,len,table = "<table width = 100%><tr><th>Sl. No.</th><th>Name</th><th>Avg.Score</th><th>Max</th></tr><hr>";
			for (i = 1, len = res.length; i <= len; i++) {
				table += "<tr>";
				table += '<td>'+ i +'</td>';
				table += '<td>'+res[i-1]["name"]+'</td>';
				table += '<td>'+res[i-1]["score"]+'</td>';
				table += '<td>'+res[i-1]["max"]+'</td>';
				table += "</tr>";
			}
			table += "</table>";
			var result = $('<h5 id="username" >'+ g.username +'  , Here are your scores.</h5><p style="font-size:30px"> Well Done! <span>&#128077;&#128077;</span>&emsp;<span id="score">'+ sum + '</span></p><p id="leaderboard"> Leader Board </p>' + table);
			this.hideMenu();
			$('#gameresult').append(result);
			this.showState(this.screen);
		};
	}
};
OverState.prototype = new State();

// -------- SOUNDMANAGER -----------

var SoundManager = function() {
	"use strict";
	this.sound = {};
};

SoundManager.prototype.play = function() {
	this.sound.pause();
	
	this.sound.play();
};

var GoalSound = function() {};
GoalSound.prototype = new SoundManager();
GoalSound.prototype.sound = document.getElementById('soundGoal');

var FailSound = function() {};
FailSound.prototype = new SoundManager();
FailSound.prototype.sound = document.getElementById('soundFailure');

var WarningSound = function() {};
WarningSound.prototype = new SoundManager();
WarningSound.prototype.sound = document.getElementById('soundNope');

var GameOverSound = function() {};
GameOverSound.prototype = new SoundManager();
GameOverSound.prototype.sound = document.getElementById('soundEnd');


var Platform = function() {
	"use strict";
	var obj = this;
};

Platform.prototype.mode = 1;		//level
Platform.prototype.loop = undefined;

Platform.prototype.switchState = function(state) {
	"use strict";
	if( state instanceof State ) {
		this.current_state.leave();
		this.current_state = state;
		this.current_state.enter();
    } 
};


// ------- >    CODE EXECUTION START FROM HERE

Platform.prototype.init = function() {
	"use strict";
	var username = "";
	do
	{
		username = prompt("Please enter a username in order to register your score?");
	}
	while ((username == '') || (typeof username != 'string'));
	
	this.loop = undefined;
	this.game = new Game(this);
	this.game.username = username;
	this.soundManager = {
		    goal : new GoalSound(),
		    fail : new FailSound(),
		 warning : new WarningSound(),
		gameover : new GameOverSound()
	};
	// objects of different States of the game is created
	this.screen = $('#gamescreen');
	this.menuState = new MenuState(this.game);
	this.playState = new PlayState(this.game);
	this.overState = new OverState(this.game);
	this.current_state = this.menuState;
	
	// swtching the state to MenuState
	this.switchState(this.current_state);
};
