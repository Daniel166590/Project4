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
    vec4(0.15, 0.4, 0.15, 1.0) // Dark Green 9
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

function cylinder(numSlices, radius, height) {
    // Create the cylinder
    var angle = 2 * Math.PI / numSlices;

    // Create the top of the cylinder
    for (var i = 0; i < numSlices; i++) {
        var x1 = radius * Math.cos(i * angle);
        var y1 = radius * Math.sin(i * angle);
        var x2 = radius * Math.cos((i + 1) * angle);
        var y2 = radius * Math.sin((i + 1) * angle);

        // Top face, now at y = height (above the base)
        pointsArray.push(vec4(0, height, 0, 1.0));  // Center of top face
        colorsArray.push(colors[8]);
        pointsArray.push(vec4(x1, height, y1, 1.0));  // Edge of top face
        colorsArray.push(colors[8]);
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Edge of top face
        colorsArray.push(colors[8]);
    }

    // Create the bottom of the cylinder (this stays at y = 0, the base)
    for (var i = 0; i < numSlices; i++) {
        var x1 = radius * Math.cos(i * angle);
        var y1 = radius * Math.sin(i * angle);
        var x2 = radius * Math.cos((i + 1) * angle);
        var y2 = radius * Math.sin((i + 1) * angle);

        // Bottom face, now at y = 0 (fixed base)
        pointsArray.push(vec4(0, 0, 0, 1.0));  // Center of bottom face
        colorsArray.push(colors[8]);
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Edge of bottom face
        colorsArray.push(colors[8]);
        pointsArray.push(vec4(x2, 0, y2, 1.0));  // Edge of bottom face
        colorsArray.push(colors[8]);
    }

    // Create the sides of the cylinder
    for (var i = 0; i < numSlices; i++) {
        var x1 = radius * Math.cos(i * angle);
        var y1 = radius * Math.sin(i * angle);
        var x2 = radius * Math.cos((i + 1) * angle);
        var y2 = radius * Math.sin((i + 1) * angle);

        // Side faces, going from bottom (y = 0) to top (y = height)
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x1, height, y1, 1.0));  // Top edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge
        colorsArray.push(colors[6]);

        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x2, 0, y2, 1.0));  // Bottom edge
        colorsArray.push(colors[6]);
    }
}

function sphere(numSlices, radius, xOffset, yOffset, zOffset) {
    var angleStep = Math.PI / numSlices;  // angle between slices (latitude)
    var numStacks = numSlices;  // Number of stacks (longitude)

    // Loop through each stack (latitude) to create the sphere
    for (var i = 0; i < numStacks; i++) {
        var phi1 = angleStep * i - Math.PI / 2;  // Latitude angle for this stack
        var phi2 = angleStep * (i + 1) - Math.PI / 2;  // Latitude angle for next stack

        // Loop through each slice (longitude) to generate vertices around the circle
        for (var j = 0; j < numSlices; j++) {
            var theta1 = 2 * Math.PI * j / numSlices;  // Longitude angle for this slice
            var theta2 = 2 * Math.PI * (j + 1) / numSlices;  // Longitude angle for next slice

            // Calculate the vertices for the first stack (latitude) triangle
            var x1 = radius * Math.cos(phi1) * Math.cos(theta1) + xOffset;
            var y1 = radius * Math.sin(phi1) + yOffset;
            var z1 = radius * Math.cos(phi1) * Math.sin(theta1);

            var x2 = radius * Math.cos(phi1) * Math.cos(theta2) + xOffset;
            var y2 = radius * Math.sin(phi1) + yOffset;
            var z2 = radius * Math.cos(phi1) * Math.sin(theta2);

            var x3 = radius * Math.cos(phi2) * Math.cos(theta1) + xOffset;
            var y3 = radius * Math.sin(phi2) + yOffset;
            var z3 = radius * Math.cos(phi2) * Math.sin(theta1);

            var x4 = radius * Math.cos(phi2) * Math.cos(theta2) + xOffset;
            var y4 = radius * Math.sin(phi2) + yOffset;
            var z4 = radius * Math.cos(phi2) * Math.sin(theta2);

            // Add the four vertices of the current rectangle (two triangles)
            pointsArray.push(vec4(x1, y1, z1, 1.0));
            colorsArray.push(colors[3]);
            pointsArray.push(vec4(x2, y2, z2, 1.0));
            colorsArray.push(colors[3]);
            pointsArray.push(vec4(x3, y3, z3, 1.0));
            colorsArray.push(colors[3]);

            pointsArray.push(vec4(x2, y2, z2, 1.0));
            colorsArray.push(colors[3]);
            pointsArray.push(vec4(x4, y4, z4, 1.0));
            colorsArray.push(colors[3]);
            pointsArray.push(vec4(x3, y3, z3, 1.0));
            colorsArray.push(colors[3]);
        }
    }
}

// Function to create a rectangle with adjustable dimensions and positioning
function adjustableRectangle(length, width, height, xOffset, yOffset, zOffset) {
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
            colorsArray.push(colors[7]); // Assign a default color
        }
    }
}

// Tried to create adjustable shapes for more flexibility
function curve90Degrees(radius, width, thickness, smoothness, xOffset, yOffset, zOffset, color) {
    // Constrain smoothness to prevent invalid values
    smoothness = Math.max(0, smoothness);

    // Number of segments is determined by smoothness; 0 smoothness means a right angle
    var numSegments = smoothness > 0 ? smoothness : 1;

    // Calculate the angle increment for the curve
    var angleIncrement = (Math.PI / 2) / numSegments; // 90 degrees divided into segments

    // Arrays to hold the vertices for the outer and inner parts of the curve
    var outerVertices = [];
    var innerVertices = [];

    // Generate the points along the curve for the outer and inner radii
    for (var i = 0; i <= numSegments; i++) {
        var angle = i * angleIncrement; // Current angle in radians
        
        // Outer curve
        var outerX = (radius + thickness / 2) * Math.cos(angle) + xOffset;
        var outerY = (radius + thickness / 2) * Math.sin(angle) + yOffset;
        outerVertices.push(vec4(outerX, outerY, zOffset, 1.0));
        
        // Inner curve
        var innerX = (radius - thickness / 2) * Math.cos(angle) + xOffset;
        var innerY = (radius - thickness / 2) * Math.sin(angle) + yOffset;
        innerVertices.push(vec4(innerX, innerY, zOffset, 1.0));
    }

    // Create the quads for the ribbon with thickness
    for (var i = 0; i < outerVertices.length - 1; i++) {
        var o1 = outerVertices[i];
        var o2 = outerVertices[i + 1];
        var i1 = innerVertices[i];
        var i2 = innerVertices[i + 1];

        // Create the top surface of the ribbon (outer curve to inner curve)
        pointsArray.push(o1);
        colorsArray.push(colors[0]);
        pointsArray.push(i1);
        colorsArray.push(colors[0]);
        pointsArray.push(i2);
        colorsArray.push(colors[0]);

        pointsArray.push(o1);
        colorsArray.push(colors[0]);
        pointsArray.push(i2);
        colorsArray.push(colors[0]);
        pointsArray.push(o2);
        colorsArray.push(colors[0]);

        // Create the bottom surface of the ribbon (extruding along the z-axis)
        pointsArray.push(vec4(o1[0], o1[1], o1[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(i1[0], i1[1], i1[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));
        colorsArray.push(colors[0]);

        pointsArray.push(vec4(o1[0], o1[1], o1[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(o2[0], o2[1], o2[2] + width, 1.0));
        colorsArray.push(colors[0]);

        // Create the sides connecting the top and bottom surfaces
        pointsArray.push(o1);
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(o1[0], o1[1], o1[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(o2[0], o2[1], o2[2] + width, 1.0));
        colorsArray.push(colors[0]);

        pointsArray.push(o1);
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(o2[0], o2[1], o2[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(o2);
        colorsArray.push(colors[0]);

        pointsArray.push(i1);
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(i1[0], i1[1], i1[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));
        colorsArray.push(colors[0]);

        pointsArray.push(i1);
        colorsArray.push(colors[0]);
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));
        colorsArray.push(colors[0]);
        pointsArray.push(i2);
        colorsArray.push(colors[0]);
    }

}

function extrudedCylinder(numSlices, radius, height) {
    var angle = 2 * Math.PI / numSlices;

    // Create the sides of the trash can (the vertical walls)
    for (var i = 0; i < numSlices; i++) {
        // Bottom circle vertices at y = 0
        var x1 = radius * Math.cos(i * angle);
        var y1 = radius * Math.sin(i * angle);
        
        // Top circle vertices at y = height
        var x2 = radius * Math.cos((i + 1) * angle);
        var y2 = radius * Math.sin((i + 1) * angle);
        
        // Create side face triangles
        // Bottom edge (y = 0) to top edge (y = height)
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        colorsArray.push(colors[6]);  // Color for the side
        pointsArray.push(vec4(x1, height, y1, 1.0));  // Top edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge
        colorsArray.push(colors[6]);

        // Bottom edge (y = 0) to top edge (y = height)
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge
        colorsArray.push(colors[6]);
        pointsArray.push(vec4(x2, 0, y2, 1.0));  // Bottom edge
        colorsArray.push(colors[6]);
    }
}

// Function to draw a mesh, including bricks and grout
function Draw() {
    DrawTrashCan();
}

function DrawTrashCan(numSlices = 30, radius = 1, height = 2) {
    extrudedCylinder(numSlices, radius, height);
    sphere(numSlices, radius, 0, 2, 0);
}

function RenderTrashCan() {
    // Apply transformations: translation and scaling
    let translation = translate(0, 0.25, 0);
    let scale = scale4(1, 1, 1); // Adjust the size of the light post
    let trashCanPostModelViewMatrix = mult(modelViewMatrix, mult(translation, scale));

    // Pass the transformation matrix to the shader
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trashCanPostModelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, currentIndex, 5580);

    currentIndex += 5580;
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
    RenderTrashCan();


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
