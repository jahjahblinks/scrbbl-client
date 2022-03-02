#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, request, render_template, Response
from flask_cors import CORS
from flask_socketio import SocketIO
from microphone_recognition import mr
import py_client as pc



app = Flask(__name__)
CORS(app)


@app.route('/audio', methods=['POST', 'GET'])
def guess():
    if request.method == "POST":
        print (request.form.get('name'))
        pc.setName(request.form.get('name')+"7")
        f = request.files['audio_data']
        with open('audio.wav', 'wb') as audio:
            f.save(audio)
        guess = mr()
        if (guess=="clear"):
            pc.clear_board()
        else:
            pc.send_message(guess)
        return "OK"
    else:
        return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)#, port=5051)