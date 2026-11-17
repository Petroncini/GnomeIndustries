"""Transcreve um áudio ou vídeo em português com o Whisper (whisper.cpp).

Uso:
    python scripts/transcricao/transcribe.py <entrada.mp3|mp4> [saida.txt]

Sem o segundo argumento, a transcrição vai para full_transcript.txt.
"""
import os
import sys
from pathlib import Path

import ffmpeg
from pywhispercpp.model import Model

# Raiz do repositório, para o script funcionar de qualquer pasta.
ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT / "models" / "model-medium-pt-q4_0.bin"


def transcribe(audio_filepath: str) -> list:
    model = Model(str(MODEL_PATH), n_threads=6)  # TODO: usar q8_0 my_north_ai large-v3-pt

    print("LOADED MODEL\n")
    segments = model.transcribe(audio_filepath)
    for segment in segments:
        print(segment.text)
    return segments


def extract(video_filepath: str) -> str:
    """Extrai o áudio de um vídeo, porque o Whisper só lê áudio."""
    video = ffmpeg.input(video_filepath)
    audio_filepath, _ = os.path.splitext(video_filepath)
    audio_filepath += ".mp3"
    video.output(audio_filepath, acodec='mp3').run(overwrite_output=True)
    return audio_filepath


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "full_transcript.txt"

    _, input_format = os.path.splitext(input_file)
    audio = extract(input_file) if input_format == ".mp4" else input_file

    transcription = ""
    for segment in transcribe(audio):
        transcription += segment.text + " "

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(transcription)


if __name__ == "__main__":
    main()
