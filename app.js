// Store initial virtual screen dimensions
const INITIAL_SCREEN = {
    width: 16,
    height: 9,
    aspectRatio: 16 / 9
};

// Get DOM elements
const virtualScreen = document.getElementById('virtual-screen');
const uploadedImage = document.getElementById('uploaded-image');
const formOverlay = document.getElementById('form-overlay');
const cameraDistanceOverlay = document.getElementById('camera-distance-overlay');
const imageInput = document.getElementById('image-input');
const cameraDistanceSlider = document.getElementById('camera-distance-slider');
const cameraDistanceValue = document.getElementById('camera-distance-value');
const previewText = document.getElementById('preview-text');
const menuBtn = document.getElementById('menu-btn');
const menuDropdown = document.getElementById('menu-dropdown');
const changeImageBtn = document.getElementById('change-image-btn');
const cameraDistanceBtn = document.getElementById('camera-distance-btn');
const cameraRig = document.getElementById('camera-rig');

// Current image aspect ratio
let currentImageAspect = null;
let currentImageURL = null;

// Menu toggle
menuBtn.addEventListener('click', () => {
    menuDropdown.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('show');
    }
});

// Change image button
changeImageBtn.addEventListener('click', () => {
    formOverlay.classList.remove('hidden');
    cameraDistanceOverlay.classList.add('hidden');
    menuDropdown.classList.remove('show');
    imageInput.value = '';
    previewText.textContent = 'Choose a local image file';
});

// Camera distance button
cameraDistanceBtn.addEventListener('click', () => {
    cameraDistanceOverlay.classList.remove('hidden');
    formOverlay.classList.add('hidden');
    menuDropdown.classList.remove('show');
});

// Camera distance slider
cameraDistanceSlider.addEventListener('input', () => {
    const value = cameraDistanceSlider.value;
    cameraDistanceValue.textContent = value;
    cameraRig.setAttribute('position', `0 0 ${value}`);
});

// Close form overlay when clicking outside of it
formOverlay.addEventListener('click', (e) => {
    // Check if the click target is the modal-background or the close button
    if (e.target.classList.contains('modal-background') || e.target.classList.contains('modal-close')) {
        formOverlay.classList.add('hidden');
        // Optionally clear the input and reset preview text if needed
        imageInput.value = '';
        previewText.textContent = 'Choose a local image file';
    }
});

// Close camera distance overlay when clicking outside of it
cameraDistanceOverlay.addEventListener('click', (e) => {
    // Check if the click target is the modal-background or the close button
    if (e.target.classList.contains('modal-background') || e.target.classList.contains('modal-close')) {
        cameraDistanceOverlay.classList.add('hidden');
    }
});

// Image preview update and automatic upload
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        previewText.textContent = e.target.files[0].name;
        handleImageUpload(e);
    }
});

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        currentImageURL = e.target.result;

        // Load image to get actual dimensions
        const img = new Image();
        img.onload = () => {
            loadImageToScene(img);
        };
        img.src = currentImageURL;
    };
    reader.readAsDataURL(file);
}

function loadImageToScene(image) {
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const imageAspect = imageWidth / imageHeight;

    let finalWidth, finalHeight;

    // Compare image aspect ratio with initial screen aspect ratio
    if (imageAspect > INITIAL_SCREEN.aspectRatio) {
        // Image is wider - fit by height, adjust width
        finalHeight = INITIAL_SCREEN.height;
        finalWidth = finalHeight * imageAspect;
    } else {
        // Image is taller or same - fit by width
        finalWidth = INITIAL_SCREEN.width;
        finalHeight = finalWidth / imageAspect;
    }

    // Update virtual screen visibility
    virtualScreen.setAttribute('visible', 'false');
    uploadedImage.setAttribute('visible', 'true');

    // Set image dimensions and source
    uploadedImage.setAttribute('width', finalWidth);
    uploadedImage.setAttribute('height', finalHeight);
    uploadedImage.setAttribute('src', currentImageURL);

    // Hide form overlay
    formOverlay.classList.add('hidden');

    // Keep aspect ratio stored for reference
    currentImageAspect = imageAspect;

    console.log(`Image loaded: ${finalWidth}x${finalHeight}, Aspect: ${imageAspect.toFixed(2)}`);
}

// Reset scene functionality
function resetScene() {
    virtualScreen.setAttribute('visible', 'true');
    uploadedImage.setAttribute('visible', 'false');
    uploadedImage.removeAttribute('src');

    currentImageAspect = null;
    currentImageURL = null;
}

// Keyboard shortcut (press 'R' to reset)
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetScene();
        formOverlay.classList.remove('hidden');
        cameraDistanceOverlay.classList.add('hidden');
    }
});

console.log('Virtual Screen VR App initialized');
console.log('Initial screen dimensions:', INITIAL_SCREEN);
