const drawingArea = document.querySelector('.drawing-area');
let canvas = new fabric.Canvas('tshirt-canvas');

canvas.setDimensions({ width: '100%', height: '100%' }, { cssOnly: true });

function updateTshirtImage(imageURL) {
    fabric.Image.fromURL(imageURL, function (img) {
        img.scaleToHeight(200);
        img.scaleToWidth(200);
        canvas.centerObject(img);
        canvas.add(img);
        canvas.renderAll();
    });
}

document.body.addEventListener('click', (e) => {
    if (document.querySelector('.upper-canvas')) {
        if (e.target != document.querySelector('.upper-canvas')) {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            drawingArea.classList.remove('focused');
        } else {
            drawingArea.classList.add('focused');
        }
    }
});

drawingArea.addEventListener('mouseover', function () {
    if (!this.classList.contains('focused')) {
        this.classList.add('focused');
    }
});

document.getElementById("tshirt-design").addEventListener("change", function () {
    const design = this.value;
    if (design != '') {
        updateTshirtImage(design);
    }
}, false);

document.getElementById('tshirt-custompicture').addEventListener("change", function (e) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const imgObj = new Image();
        imgObj.src = event.target.result;

        // When the picture loads, create the image in Fabric.js
        imgObj.onload = function () {
            const img = new fabric.Image(imgObj);

            img.scaleToHeight(200);
            img.scaleToWidth(200);
            canvas.centerObject(img);
            canvas.add(img);
            canvas.renderAll();
        };
    };

    // If the user selected a picture, load it
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
}, false);

// Delete selected design using DEL key
document.addEventListener("keydown", function (e) {
    var keyCode = e.keyCode;
    if (keyCode == 46) {
        canvas.remove(canvas.getActiveObject());
    }
}, false);

// Delete selected design using button key
const handleDesignDeletion = () => {
    canvas.remove(canvas.getActiveObject());
}

// Define as node the T-Shirt Div
const node = document.getElementById('tshirt-div');

document.querySelector('#download-btn').addEventListener('click', function (e) {
    domtoimage.toPng(node).then(function (dataUrl) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();

        const anchor = document.createElement('a');
        anchor.href = dataUrl;
        anchor.download = "front-side";
        anchor.click();
    });
});

const addCustomTextForm = document.querySelector('#add-custom-text-form'),
    customTextInput = document.querySelector('#custom-text'),
    fontSelector = document.querySelector('#font-selector'), 
    fontColorSelector = document.querySelector('#font-color-selector'), 
    textShowerDiv = document.querySelector('.text-shower');

const showText = (e) => {
    const text = e.target.value;
    (text.trim() === '') ? textShowerDiv.classList.add('hide') : textShowerDiv.classList.remove('hide');
    textShowerDiv.innerText = text;
}

const handleFontChange = (e) => {
    const font = e.target.value.trim();
    textShowerDiv.style.fontFamily = font;
}

const handleFontColorChange = (e) => {
    const fontColor = e.target.value.trim();
    textShowerDiv.style.color = fontColor;
}

addCustomTextForm.onsubmit = (e) => {
    e.preventDefault();

    const customTextVal = customTextInput.value;
    if (customTextVal.trim() !== '') {
        const font = fontSelector.value;
        const fontColor = fontColorSelector.value;
        const fabricText = new fabric.IText(customTextVal, {
            fontSize: 30,
            fontFamily: font,
            fontWeight: 'bold',
            stroke: fontColor,
            strokeWidth: 0.5,
            textAlign: "center",
            editable: false,
            fill: fontColor
        });
        canvas.add(fabricText);
        canvas.renderAll();
    }
}