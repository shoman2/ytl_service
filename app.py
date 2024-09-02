from flask import Flask, request, render_template, jsonify
from yt_dlp import YoutubeDL
import os

app = Flask(__name__)

# 다운로드된 파일을 저장할 디렉토리 설정
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    url = request.form.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    ydl_opts = {
    'format': 'bestvideo+bestaudio/best',
    'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
    'merge_output_format': 'mp4',
    'noplaylist': True,
    'quiet': True,
    'ffmpeg_location': '/usr/local/bin/ffmpeg'  # 이 줄을 추가
}

    try:
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info_dict)
        
        response = {
            "title": info_dict.get('title'),
            "duration": info_dict.get('duration'),
            "uploader": info_dict.get('uploader'),
            "upload_date": info_dict.get('upload_date'),
            "view_count": info_dict.get('view_count'),
            "tags": info_dict.get('tags'),
            "description": info_dict.get('description'),
            "thumbnail": info_dict.get('thumbnail'),
            "filename": os.path.basename(filename)
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
