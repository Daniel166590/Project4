// textures.js
// functions related to texturing

const Textures = {
    CONCRETE:   0,
    SLATE:      1,
    SPRUNK:     2,
    WOOD:       3,
    GRASS:      4,
    PLASTIC:    5,
    PEBBLE:     6,
    NONE:    null
}
// binds the images to gl.TEXTURE$,
// if you want more textures, add path to TEX_FILES, and make GLTEX match the amount
function addTextures() {
    const TEX_FILES = [
        "textures/concrete.png",
        // "textures/slate.png",
        "textures/slate-smaller.png", // made slate texture smaller to reduce noisy look
        "textures/sprunk.jpg",
        "textures/wood.png",
        "textures/grass.png",
        "textures/plastic.png",
        "textures/pebble.png",
    ];
    const GLTEX = [
        gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2,
        gl.TEXTURE3, gl.TEXTURE4, gl.TEXTURE5, gl.TEXTURE6]
    var textures = [];
    for (let index = 0; index < TEX_FILES.length; index++) { 
        textures[index] = gl.createTexture();
        textures[index].image = new Image();
        textures[index].image.src = TEX_FILES[index];
        textures[index].image.onload = function() {loadTexture(textures[index], GLTEX[index]);}    
    }
}

function loadTexture(texture, whichTexture) 
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit passed in as parameter "texture"
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // version 1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function changeTexture(texture_index) {
    gl.uniform1i(gl.getUniformLocation(program, "texture"), texture_index);
}

function AddTexPoints() {
    textureCube(); // for wall brick
    textureCube(); // for wall greenery
    textureCube(); // for lamp post base
    textureNothing(7386); // skip lamp post
    textureCube(); // for vending machine
    textureNothing(63+249); // skip car
    textureNothing(138); // skip cone
    textureCube(); // sidewalk
    textureCube(); // road
    textureNothing(18000);
}

// Adds points to TexCoords so that a cube will be textured on all sides
function textureCube() {
    for (let i=0; i < 6; i++) {
        texCoord.push(vec2(0, 1)); // top left
        texCoord.push(vec2(0, 0)); // bottom left
        texCoord.push(vec2(1, 0)); // bottom right
        
        texCoord.push(vec2(0, 1)); // top left
        texCoord.push(vec2(1, 0)); // bottom right
        texCoord.push(vec2(1, 1)); // top right
    }
}

function textureQuad(amnt) {

}

// Adds points to texCoods but they're all [0, 0],
// which will skip an amount of points supplied so they wont get textured.
function textureNothing(amnt) {
    for (let i=0; i<amnt; i++)
    texCoord.push(vec2(0, 0))
}