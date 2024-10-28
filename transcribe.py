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

# def format_time(seconds: float):
#     milisec = seconds % 100
#     seconds /= 100
#     hours = math.floor(seconds / 3600)
#     seconds %= 3600
#     minutes = math.floor(seconds / 60)
#     seconds %= 60
#     seconds = math.floor(seconds)
#     time = f"{hours:02}:{minutes:02}:{seconds},{milisec:03}"
#     return time

# def save_subtitles(segments: list, input_filepath: str):
#     subtitle_filepath, _ = os.path.splitext(input_filepath)
#     subtitle_filepath += ".srt"
#     with open(subtitle_filepath, "w", encoding='utf-8') as subtitles:
#         for index, segment in enumerate(segments):
#             t0 = format_time(segment.t0)
#             t1 = format_time(segment.t1)
#             subtitle_section = f"{index + 1}\n{t0} --> {t1}\n{segment.text}\n"
#             subtitles.write(subtitle_section)


# def add_subtitles(input_filepath: str):
#     filename, _ = os.path.splitext(input_filepath)
#     subtitle_filepath = filename +  ".srt"
#     output_filepath = filename + "_legendado.mp4" 
#     ffmpeg.input(input_filepath).output(output_filepath, vf=f"subtitles={subtitle_filepath}", acodec='copy').run(overwrite_output=True)
#
# def generate_subtitles_video(input_filepath: str):
#     filename, _ = os.path.splitext(input_filepath)
#     output_filepath = filename + ".mp4"
#      
#     input_audio = ffmpeg.input(input_filepath).audio
#     input_video = ffmpeg.input('color=c=black:s=1920x1080:d=10', f='lavfi').video
#     output = ffmpeg.output(input_video, input_audio, output_filepath, vcodec='libx264', acodec='aac')
#
#     ffmpeg.run(output, overwrite_output=True)
#
#     add_subtitles(output_filepath)
#
#
#

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


file = open("full_transcript.txt", "w")
file.write(transcription)
file.close()
