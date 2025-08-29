
        // DOM elements
        const fileInput = document.getElementById('file-input');
        const fileName = document.getElementById('file-name');
        const formatSelect = document.getElementById('format-select');
        const qualitySelect = document.getElementById('quality-select');
        const resolutionSelect = document.getElementById('resolution-select');
        const convertBtn = document.getElementById('convert-btn');
        const downloadBtn = document.getElementById('download-btn');
        const resetBtn = document.getElementById('reset-btn');
        const originalPreview = document.getElementById('original-preview');
        const convertedPreview = document.getElementById('converted-preview');
        const originalFormat = document.getElementById('original-format');
        const originalSize = document.getElementById('original-size');
        const convertedFormat = document.getElementById('converted-format');
        const convertedSize = document.getElementById('converted-size');
        const statusText = document.getElementById('status-text');
        const dropZone = document.getElementById('drop-zone');
        const progressBar = document.getElementById('progress-bar');
        const progressContainer = document.querySelector('.progress-bar');
        
        // State variables
        let originalVideoFile = null;
        let convertedVideoData = null;
        
        // Event listeners
        fileInput.addEventListener('change', handleFileSelect);
        convertBtn.addEventListener('click', convertVideo);
        downloadBtn.addEventListener('click', downloadVideo);
        resetBtn.addEventListener('click', resetAll);
        
        // Drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect({ target: fileInput });
            }
        });
        
        // Click on drop zone to open file dialog
        dropZone.addEventListener('click', (e) => {
            if (e.target === dropZone || !e.target.closest('label')) {
                fileInput.click();
            }
        });
        
        // Functions
        function handleFileSelect(event) {
            const file = event.target.files[0];
            
            if (!file) return;
            
            // Check if file is a video
            if (!file.type.match('video.*')) {
                statusText.textContent = 'Please select a valid video file.';
                return;
            }
            
            // Update selected file text
            fileName.textContent = file.name;
            
            // Show progress bar
            progressContainer.style.display = 'block';
            progressBar.style.width = '10%';
            
            // Create object URL for the video
            const videoURL = URL.createObjectURL(file);
            
            // Display original video
            originalPreview.innerHTML = '';
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.src = videoURL;
            videoElement.style.maxWidth = '100%';
            videoElement.style.maxHeight = '100%';
            originalPreview.appendChild(videoElement);
            
            // Update original file info
            const fileSize = formatFileSize(file.size);
            originalFormat.textContent = file.type.split('/')[1].toUpperCase();
            originalSize.textContent = fileSize;
            
            // Store original video
            originalVideoFile = file;
            
            progressBar.style.width = '100%';
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                convertBtn.disabled = false;
                statusText.textContent = 'Video loaded. Adjust settings and click "Convert Video".';
            }, 500);
        }
        
        function convertVideo() {
            if (!originalVideoFile) {
                statusText.textContent = 'Please select a video first.';
                return;
            }
            
            statusText.textContent = 'Converting video...';
            convertBtn.disabled = true;
            progressContainer.style.display = 'block';
            progressBar.style.width = '10%';
            
            // Get conversion settings
            const outputFormat = formatSelect.value;
            const quality = qualitySelect.value;
            const resolution = resolutionSelect.value;
            
            // Simulate conversion process (in a real app, this would use a video conversion library)
            const conversionSteps = [20, 40, 60, 80, 100];
            let currentStep = 0;
            
            const conversionInterval = setInterval(() => {
                if (currentStep >= conversionSteps.length) {
                    clearInterval(conversionInterval);
                    finishConversion(outputFormat, quality, resolution);
                    return;
                }
                
                progressBar.style.width = `${conversionSteps[currentStep]}%`;
                
                switch(currentStep) {
                    case 0:
                        statusText.textContent = 'Analyzing video...';
                        break;
                    case 1:
                        statusText.textContent = 'Processing video frames...';
                        break;
                    case 2:
                        statusText.textContent = 'Encoding video...';
                        break;
                    case 3:
                        statusText.textContent = 'Optimizing output...';
                        break;
                }
                
                currentStep++;
            }, 800);
        }
        
        function finishConversion(outputFormat, quality, resolution) {
            // Simulate conversion results
            const originalSizeBytes = originalVideoFile.size;
            
            // Calculate size based on quality
            let sizeMultiplier;
            switch(quality) {
                case 'high':
                    sizeMultiplier = 0.9;
                    break;
                case 'medium':
                    sizeMultiplier = 0.7;
                    break;
                case 'low':
                    sizeMultiplier = 0.5;
                    break;
                default:
                    sizeMultiplier = 0.7;
            }
            
            // Calculate converted size
            const convertedSizeBytes = Math.round(originalSizeBytes * sizeMultiplier);
            
            // Update converted file info
            convertedFormat.textContent = outputFormat.toUpperCase();
            convertedSize.textContent = formatFileSize(convertedSizeBytes);
            
            // Display converted video preview
            convertedPreview.innerHTML = '';
            const convertedIcon = document.createElement('i');
            convertedIcon.className = 'fas fa-check-circle';
            convertedIcon.style.fontSize = '48px';
            convertedIcon.style.color = '#27ae60';
            convertedPreview.appendChild(convertedIcon);
            
            // Store converted data (in a real app, this would be the actual converted video)
            convertedVideoData = {
                format: outputFormat,
                size: convertedSizeBytes
            };
            
            progressBar.style.width = '100%';
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                convertBtn.disabled = false;
                downloadBtn.disabled = false;
                
                const savings = originalSizeBytes - convertedSizeBytes;
                const percent = (savings / originalSizeBytes * 100).toFixed(1);
                
                if (savings > 0) {
                    statusText.textContent = `Conversion complete! Saved ${formatFileSize(savings)} (${percent}%)`;
                } else {
                    statusText.textContent = 'Conversion complete!';
                }
            }, 500);
        }
        
        function downloadVideo() {
            if (!convertedVideoData) {
                statusText.textContent = 'Please convert a video first.';
                return;
            }
            
            // Create a dummy download (in a real app, this would be the actual converted video)
            const downloadLink = document.createElement('a');
            
            // Create a dummy video blob (in a real app, this would be the actual converted video)
            const blob = new Blob(['This is a simulation. In a real application, this would be the converted video file.'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            downloadLink.href = url;
            downloadLink.download = `converted-video.${convertedVideoData.format}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            statusText.textContent = 'Download started!';
        }
        
        function resetAll() {
            // Reset everything
            fileInput.value = '';
            originalVideoFile = null;
            convertedVideoData = null;
            fileName.textContent = 'No file selected';
            statusText.textContent = 'Ready to convert. Select a video to begin.';
            convertBtn.disabled = true;
            downloadBtn.disabled = true;
            progressContainer.style.display = 'none';
            
            // Reset previews
            originalPreview.innerHTML = '<i class="fas fa-video"></i>';
            convertedPreview.innerHTML = '<i class="fas fa-sync-alt"></i>';
            
            // Reset file info
            originalFormat.textContent = '-';
            originalSize.textContent = '-';
            convertedFormat.textContent = '-';
            convertedSize.textContent = '-';
            
            // Reset controls
            formatSelect.value = 'mp4';
            qualitySelect.value = 'medium';
            resolutionSelect.value = 'original';
        }
        
        // Helper functions
        function formatFileSize(bytes) {
            if (bytes < 1024) {
                return bytes + ' bytes';
            } else if (bytes < 1048576) {
                return (bytes / 1024).toFixed(1) + ' KB';
            } else {
                return (bytes / 1048576).toFixed(1) + ' MB';
            }
        }
