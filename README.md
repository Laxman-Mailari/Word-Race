# Word-Race

Word Race is a game designed to improve QWERTY typing rate and efficiency. Words appear one by one at a rate that goes up as time progresses. There is a limited Stack Space that fills up with a certain amount of words. Once a player types a word correctly, that word is removed from stack.

The score is calculated based on how fast the player was able to clear that word. The levelling system is added so that the player can choose the level (easy, medium and hard) . If the stack is empty, it’s game over.


Features used:
1. HTML
2. CSS
3. JavaScript 
4. jQuery
5. Flask
6. MongoDB

How to execute the code:

1. Upload main.html file and static folder to apache server i.e /var/www/html
2. RUN the Backend.you can do it in two way:
  i) in local: create python virtual environment. add the data to database, then run the API.py file in virtual-env
  ii) in docker (done on AWS EC2 ):
      you need to create docker-compose.yml, requirement.txt files along with API.py.
      install docker
      Run your code on one container and run database(MongoDB) on another container.
      store the data on database.
3. Run the main.html

-- Done :) --- 

How to play game:

1. initially javaScript alert message pop-up for asking username.enter username.
2. choose the level
3. start playing the game
.
.

Finally you can see your score and top 5 players score.
      
