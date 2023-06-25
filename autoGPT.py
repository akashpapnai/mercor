#!/usr/bin/env python3
import json
from bardapi import Bard
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()

token = os.getenv("TOKEN")
bard = Bard(token=token)

def Resolve(question:str)->str:
    return bard.get_answer(question)['content']



@app.route('/get_result', methods=['POST'])
def process():
    data = json.loads(request.data.decode('utf-8'))
    print(data['question'])
    processed_data = Resolve(data['question']) 
    return jsonify({ "answer" : processed_data})

if __name__=='__main__':
    app.run()

