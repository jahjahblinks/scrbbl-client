import socketio

siow = socketio.Client(logger=True, engineio_logger=True)

@siow.event
def connection():
    print('server connection established')

@siow.event
def send_message(msg):
    print('message received with ', msg)
    siow.emit('send_message', msg)

@siow.event
def clear_board():
    print('clearboard')
    siow.emit('clear', )

@siow.event
def setName(name):
    #print('message received with ', paintObj)
    siow.emit('setName', name)

@siow.event
def disconnect():
    print('disconnected from server')

siow.connect('https://scrbbl-server.herokuapp.com/') #'http://192.168.68.117:5050') 

#siow.wait()