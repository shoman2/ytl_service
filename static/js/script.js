document.getElementById('download-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const urlInput = document.getElementById('url');
    const resultDiv = document.getElementById('result');
    const url = urlInput.value.trim();

    // URL이 비어 있는지 확인
    if (!url) {
        alert('Please enter a valid YouTube URL.');
        return;
    }

    resultDiv.innerHTML = 'Downloading... Please wait.';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(url)}`
        });

        // 서버로부터 JSON 응답 받기
        const data = await response.json();

        if (response.ok) {
            // 성공적인 경우 결과를 표시
            resultDiv.innerHTML = `
                <h2>${data.title}</h2>
                <p><strong>Duration:</strong> ${Math.floor(data.duration / 60)} minutes ${data.duration % 60} seconds</p>
                <p><strong>Uploader:</strong> ${data.uploader}</p>
                <p><strong>Upload Date:</strong> ${data.upload_date}</p>
                <p><strong>View Count:</strong> ${data.view_count.toLocaleString()}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <img src="${data.thumbnail}" alt="Thumbnail">
                <p><a href="/downloads/${encodeURIComponent(data.filename)}" download>Download File</a></p>
            `;
        } else {
            // 서버 오류 처리
            resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error || 'Unknown error occurred'}</p>`;
        }
    } catch (error) {
        // 네트워크 오류 등 예외 처리
        resultDiv.innerHTML = `<p style="color: red;">An unexpected error occurred.</p>`;
        console.error('Error:', error);
    }
});
