// Daniel Powers
// Project 4: Stage II
// Extruded Shape Trashcan

var canvas;
var gl;
var image;
var program;

var eye ;
var near = -30;
var far = 30;
//var dr = 5.0 * Math.PI/180.0;

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var modelView, projection;
var viewerPos;
var flag = true;

var pointsArray = [];
var colorsArray = [];

var numWallPoints = 0; // Number of points for the wall
var numLightPostPoints = 0; // Number of points for the light post
var currentIndex = 0; // Used to track objects in the points and colors arrays

// Vertex positions for a cube (brick)
var vertices = [
    // Brick vertices (Brick wall)
    vec4(-0.5, -0.5,  0.5, 1.0), // 0
    vec4(-0.5,  0.5,  0.5, 1.0), // 1
    vec4(0.5,  0.5,  0.5, 1.0), // 2
    vec4(0.5, -0.5,  0.5, 1.0), // 3
    vec4(-0.5, -0.5, -0.5, 1.0), // 4
    vec4(-0.5,  0.5, -0.5, 1.0), // 5
    vec4( 0.5,  0.5, -0.5, 1.0), // 6
    vec4( 0.5, -0.5, -0.5, 1.0) // 7
];

// Colors for each face
var colors = [
    vec4(0.4, 0.1, 0.2, 1.0), // Red 0
    vec4(0.0, 1.0, 0.0, 1.0), // Green 1
    vec4(0.2, 0.2, 0.5, 1.0), // Blue 2
    vec4(1.0, 1.0, 0.65, 1.0), // Off-Yellow 3
    vec4(1.0, 0.0, 1.0, 1.0), // Magenta 4
    vec4(0.0, 1.0, 1.0, 1.0), // Cyan 5
    vec4(0.4, 0.4, 0.4, 1.0), // Light Gray 6
    vec4(0.3, 0.3, 0.3, 1.0), // Light-Dark Gray 7
    vec4(0.2, 0.2, 0.2, 1.0), // Dark Gray 8
    vec4(0.15, 0.4, 0.15, 1.0), // Dark Green 9
    vec4(0.2, 0.2, 0.2, 1.0) // Black 10
];

// Function to create triangles for a quad
function quad(a, b, c, d, colorIndex) {
    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);

    pointsArray.push(vertices[b]);
    colorsArray.push(colors[colorIndex]);

    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);

    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);

    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);

    pointsArray.push(vertices[d]);
    colorsArray.push(colors[colorIndex]);
}

// Function to create a rectangle with adjustable dimensions and positioning
function adjustableRectangle(length, width, height, xOffset, yOffset, zOffset, colorIndex = 0) {
    // Half dimensions to center the rectangle
    var halfLength = length / 2;
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    // Define the 8 vertices of the rectangle with offsets
    var vertices = [
        vec4(-halfLength + xOffset, -halfHeight + yOffset, -halfWidth + zOffset, 1.0), // 0: Bottom-back-left
        vec4(halfLength + xOffset, -halfHeight + yOffset, -halfWidth + zOffset, 1.0),  // 1: Bottom-back-right
        vec4(halfLength + xOffset, halfHeight + yOffset, -halfWidth + zOffset, 1.0),   // 2: Top-back-right
        vec4(-halfLength + xOffset, halfHeight + yOffset, -halfWidth + zOffset, 1.0),  // 3: Top-back-left
        vec4(-halfLength + xOffset, -halfHeight + yOffset, halfWidth + zOffset, 1.0),  // 4: Bottom-front-left
        vec4(halfLength + xOffset, -halfHeight + yOffset, halfWidth + zOffset, 1.0),   // 5: Bottom-front-right
        vec4(halfLength + xOffset, halfHeight + yOffset, halfWidth + zOffset, 1.0),    // 6: Top-front-right
        vec4(-halfLength + xOffset, halfHeight + yOffset, halfWidth + zOffset, 1.0)    // 7: Top-front-left
    ];

    // Define the 6 faces of the rectangle using triangles
    var faces = [
        // Back face
        [0, 1, 2, 0, 2, 3],
        // Front face
        [4, 5, 6, 4, 6, 7],
        // Bottom face
        [0, 4, 5, 0, 5, 1],
        // Top face
        [3, 7, 6, 3, 6, 2],
        // Left face
        [0, 3, 7, 0, 7, 4],
        // Right face
        [1, 5, 6, 1, 6, 2]
    ];

    // Loop through each face and push the vertices into the points array
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        for (var j = 0; j < face.length; j++) {
            pointsArray.push(vertices[face[j]]);
            colorsArray.push(colors[colorIndex]); // Assign a default color
        }
    }
}

// Function to draw a mesh, including bricks and grout
function Draw() {
    DrawRoad();
}

// Added one other object
function DrawRoad() {
    // Sidewalk
    adjustableRectangle(10, 50, 1.5, 0, -.5, 0, 6); // length, width, height, xOffset, yOffset, zOffset, color

    // Road Surface
    adjustableRectangle(20, 50, 0.5, 15, -1.0, 0, 10); // length, width, height, xOffset, yOffset, zOffset, color

    // Striped lines on the road
    adjustableRectangle(1, 5, 0.8, 15, -1.0, -20, 3); // length, width, height, xOffset, yOffset, zOffset, color
    adjustableRectangle(1, 5, 0.8, 15, -1.0, -10, 3); // length, width, height, xOffset, yOffset, zOffset, color
    adjustableRectangle(1, 5, 0.8, 15, -1.0, 0, 3); // length, width, height, xOffset, yOffset, zOffset, color
    adjustableRectangle(1, 5, 0.8, 15, -1.0, 10, 3); // length, width, height, xOffset, yOffset, zOffset, color
    adjustableRectangle(1, 5, 0.8, 15, -1.0, 20, 3); // length, width, height, xOffset, yOffset, zOffset, color
}

// Added one other object
function RenderRoad() {
    // Apply transformations: translation and scaling
    let translation = translate(0, 0.25, 0);
    let scale = scale4(1, 1, 1); // Adjust the size of the light post
    let trashCanPostModelViewMatrix = mult(modelViewMatrix, mult(translation, scale));

    // Pass the transformation matrix to the shader
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trashCanPostModelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, currentIndex, 252);

    currentIndex += 252;
}

function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // Set the camera's position
    eye = vec3(
        AllInfo.radius * Math.cos(AllInfo.phi),
        AllInfo.radius * Math.sin(AllInfo.theta),
        AllInfo.radius * Math.sin(AllInfo.phi)
    );

    modelViewMatrix = lookAt(eye, at, up);

    projectionMatrix = ortho(
        left * AllInfo.zoomFactor - AllInfo.translateX,
        right * AllInfo.zoomFactor - AllInfo.translateX,
        bottom * AllInfo.zoomFactor - AllInfo.translateY,
        ytop * AllInfo.zoomFactor - AllInfo.translateY,
        near, far
    );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Objects to be rendered
    RenderRoad();


    //requestAnimationFrame(render);

    // Debugging
    console.log("Points: " + pointsArray.length + "\nColors: " + colorsArray.length + "\nCurrent Index: " + currentIndex);
    currentIndex = 0; // Reset the current index for the next frame
}

// no need to change after this point
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 4,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.5, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    // !!
    // program needs to be global
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    Draw();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);

	// color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });
    render();
}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
