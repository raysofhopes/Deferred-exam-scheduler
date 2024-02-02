import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5001/upload', formData);
            setFileName(response.data.fileName); // Store fileName for later download
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/download/${encodeURIComponent(fileName)}`, { responseType: 'blob' });
            const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'data.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file');
        }
    };

    return (
        <div className="App">
            <h2>Upload an Excel File</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {fileName && <button onClick={handleDownload}>Download File</button>}
        </div>
    );
}

export default App;
