const generateButton = document.getElementById('generateButton');

async function generateImage() {
    const prompt = document.getElementById('promptInput').value;
    const loading = document.getElementById('loading');
    const imageContainer = document.getElementById('imageContainer');
    const errorDiv = document.getElementById('error');

    // Clear previous results
    imageContainer.innerHTML = '';
    errorDiv.textContent = '';

    if (!prompt) {
        errorDiv.textContent = 'Please enter a prompt';
        return;
    }

    try {
        loading.style.display = 'block';
        generateButton.disabled = true;

        // Call our backend server
        const response = await fetch('https://image-generator-production-656b.up.railway.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '5px';
        imageContainer.appendChild(img);
    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
    } finally {
        loading.style.display = 'none';
        generateButton.disabled = false;
    }
}

generateButton.addEventListener('click', generateImage);