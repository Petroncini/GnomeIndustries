import math
import os
import sys

import ffmpeg
from pywhispercpp.model import Model


def transcribe(audio_filepath: str) -> list:
    model = Model('./model-medium-pt-q4_0.bin', n_threads=6) # TODO: usar q8_0 my_north_ai large-v3-pt 

    print("LOADED MODEL\n")
    segments = model.transcribe(audio_filepath)
    for segment in segments:
        print(segment.text)
    return segments

def extract(video_filepath: str):
    video = ffmpeg.input(video_filepath)
    audio_filepath, _ = os.path.splitext(video_filepath)
    audio_filepath += ".mp3"
    video.output(audio_filepath, acodec='mp3').run(overwrite_output=True)
    return audio_filepath

input_file = sys.argv[1]
_, input_format = os.path.splitext(input_file)
if input_format == ".mp4":
    audio = extract(input_file)
else:
    audio = input_file
audio_segments = transcribe(audio)

transcription = ""

for segment in audio_segments:
    transcription += segment.text + " "


file = open("instrucoes_chefe.txt", "w")
file.write(transcription)
file.close()
