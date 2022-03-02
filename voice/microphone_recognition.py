#!/usr/bin/env python3

# NOTE: this example requires PyAudio because it uses the Microphone class

import sconfig
import speech_recognition as sr

# obtain audio from the microphone
#r = sr.Recognizer()
#with sr.Microphone() as source:
    #print("Say something!")
    #audio = r.listen(source)

#list = []

def mr():
    # recognize speech using Google Speech Recognition
    r = sr.Recognizer()
    harvard = sr.AudioFile('audio.wav')
    with harvard as source:
        audio = r.record(source)
    thing = ''
    try:
        # for testing purposes, we're just using the default API key
        # to use another API key, use r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")
        # instead of r.recognize_google(audio)
        google = r.recognize_google(audio)
        print("Google Speech Recognition thinks you said " + google)
        thing.append(google)
    except sr.UnknownValueError:
        thing.append("Could not understand audio. Please try again!")
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))

    return (thing)