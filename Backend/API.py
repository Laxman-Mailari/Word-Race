'''
@ Laxman M
'''
import sys
from flask import Flask
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
from flask import render_template
from pymongo import MongoClient
import random
from flask_cors import CORS
import json


app = Flask(__name__)
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.wordRace    # database name "wordRace"
CORS(app)
num = 1


@app.route('/',methods=['GET'])
def test():
    return jsonify("Testing")


# using level number the collection name is returned
def getTableName(level):
    if level == 1:
        return "easy"
    elif level == 2:
        return "medium"
    else:
        return "hard"


# this API is returns the return the Json object of word. 
@app.route('/getNextWord/<request_data>',methods=['GET'])
def getNextWord(request_data):
    data  = json.loads(request_data)
    print(data)
    level= data["level"]

    num = data["num"]
    table_name = getTableName(int(level))
    ref_db = db[table_name]
    query = ref_db.find({"number" : num})
    output = '' 
    for temp in query:
        print(temp["name"])
        output = temp["name"]

    return jsonify({"result" : output})


# API uodates the score of the player to database
@app.route('/updateScore/<data>',methods=['GET'])
def updateScore(data):
    data = json.loads(data)
    name = data["name"]
    score = data["score"]
    ref_db = db["leaderBoard"]
    check = ref_db.find({"name" : name})
    temp = 0
    for i in check:
        if i["name"]:
            temp += 1
            prev_score = i["score"]
            prev_max = i["max"]
            prev_count = i["count"]
    if temp>0:
        pre_max = max(prev_max,score)
        prev_score = ((prev_score  * prev_count)+ score) // (prev_count+1)
        pre_count = prev_count + 1

        myquery = { "name": name }
        newvalues = { "$set": { "score":  prev_score, "max" : pre_max, "count" : pre_count} }
        ref_db.update_one(myquery, newvalues)

    else:
        query = ref_db.insert({"name" : name, "score" : score, "max" : score, "count" : 1})
    
    return json.dumps('ok'),200


# API returns the top 5 scores from the database
@app.route('/get_topScores', methods = ['GET'])
def getTopScore():
    ref_db = db["leaderBoard"]
    query = ref_db.find().sort("score" ,-1).limit(5)
    result = []
    for i in query:
        result.append({"name" : i["name"],"score" : i["score"],"max" : i["max"]})
    print(result)
    return jsonify({"result" : result})



if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)




