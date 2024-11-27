// Daniel Powers
// Project 4: Stage I
// Objects: Brick Hedge Wall, Light Post

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
var modelViewStack = [];
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var modelView, projection;
var viewerPos;
var flag = true;

var lightPosition = vec4(50, 100, 50, 1);

var lightAmbient = vec4(0.7, 0.7, 0.7, 1.0 );
var lightDiffuse = vec4(0.95, 0.95, 0.95, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 0, 0, 1, 1.0 );
var materialShininess = 50.0;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var currentIndex = 0; // Used to track objects in the points and colors arrays

let lampColorToggled = false; // State variable to track if the function has been called

// Vertex positions for a cube (brick)
var v = [
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

// no need to change after this point
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 10,
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
    //
    //  Load shaders and initialize attribute buffers
    //
    // !!
    // program needs to be global
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    Draw();
    makeCubePoints();
    makeCarPoints();
    extrudedCircle();
    SurfaceRevPoints();
    DrawRoad();
    DrawTrashCan();


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);

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

        document.addEventListener('keydown', function(event) {
            if (event.key === 'a' || event.key === 'A') {
                // Toggle the state on key press
                if (lampColorToggled) {
                    // Call ColorLampPostBulb again (or reset it if you need to) to toggle the color change off
                    lampColorToggled = false;  // Reset the state
                } else {
                    lampColorToggled = true;  // Set state to true to avoid multiple calls
                }
            }
        });

        render();
    });

    render();
}

function render() {
    gl.clearColor(0.05, 0.05, 0.05, 1.0);
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
    
    // RENDERING OBJECTS
    modelViewStack.push(modelViewMatrix); // save 1

    modelViewStack.push(modelViewMatrix); // save 2
    let wall_t = translate(-4, 0, 15);
    let wall_r = rotate(90, 0, 1, 0);
    let wall_s = scale4(2, 2, 2);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, wall_t), wall_r), wall_s);
    RenderWall(10, 15, 0.65, 0.35, 3, 0, 0, 0.3); // #rows, #cols, brickWidth, brickHeight, xPosition, yPosition, zPosition, scale

    modelViewMatrix = modelViewStack.pop(); // restore 2

    // translating and rendering light post
    modelViewStack.push(); // save 2

    let lamp_t = translate(4, 0.5, -6);
    let lamp_r = rotate(180, 0, 1, 0);
    let lamp_s = scale4(1.5, 1.5, 1.5);
    
    modelViewMatrix = mult(mult(mult(modelViewMatrix, lamp_t), lamp_r), lamp_s);

    RenderLightPost(lampCurrentColor);
    modelViewMatrix = modelViewStack.pop(); // restore 2

    // draw vending machine
    drawVendingMachine([-3, 0, 2], [0, 0, 1, 0], [4, 4, 4]); // translate, rotate, scale

    // draw car
    drawCar([7, 0.5, 5], [90, 0, 1, 0], [5, 5, 5]); // translate, rotate, scale

    // change color and draw traffic cone
    drawSurfaceRevolution([10, 0, 16], [0, 0, 1, 0], [2, 2, 2]); // translate, rotate, scale
    
    // draw road
    RenderRoad();

    // draw trash can
    modelViewStack.push(modelViewMatrix); // save 2
    let trash_t = translate(-2, 0, -3);
    let trash_r = translate(0, 0, 1, 0);
    let trash_s = scale4(1, 1, 1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, trash_t), trash_r), trash_s);

    RenderTrashCan();
    modelViewMatrix = modelViewStack.pop(); // restore 2

    modelViewMatrix = modelViewStack.pop(); // restore 1

    //requestAnimationFrame(render);

    // Debugging
    console.log("Points: " + pointsArray.length + "\nColors: " + colorsArray.length + "\nCurrent Index: " + currentIndex + '\n');
    console.log("Animation Toggle: " + lampColorToggled + '\n');
    currentIndex = 0; // Reset the current index for the next frame
}


function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

function Newell(vertices)
{
   var L=vertices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=i;
       nextIndex = (i+1)%L;

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}



// Flashing lamp code
var lampLightColor = vec4(0.8, 0.8, 0.8, 1.0); // Light yellow
var lampDarkColor = vec4(0.0, 0.0, 0.0, 1.0); // Dark yellow
var lampCurrentColor = lampLightColor; // Start with light color
var time = 0; // Variable to track time for sine wave

setInterval(() => {
    time += 0.1; // Increment time (adjust speed of flashing)
    var sineValue = Math.sin(time); // Get sine value (from -1 to 1)
    var intensity = (sineValue + 1) / 2; // Map the sine wave to a range of 0 to 1
    
    // Interpolate between light and dark colors based on sine wave intensity
    lampCurrentColor = mix(lampDarkColor, lampLightColor, intensity); 
    
    render(); // Re-render the scene to apply the new color
}, 16); // Update roughly every 16ms for smooth animation (60fps)