var canvas, gl, image, program;

var eye, near = -30, far = 30;

var left = -2.0, right = 2.0;
var ytop = 2.0, bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewStack = [];

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);


// light and material
var lightPosition = vec4(2, 2, 2, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 0, 0, 1, 1.0 );
var materialShininess = 50.0;

var modelView, projection, viewerPos, flag = true;

var pointsArray = [], colorsArray = [], normalsArray = [];

var textures = [];
var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 1),
];

// define the colors
var colors = [
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
    vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left)
];

// no need to change after this point
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 1.5,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.45,
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

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    makePoints();

    initBuffers();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    SetupLightingMaterial();

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", zoom);
    document.getElementById("gl-canvas").addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    render();
}

function makePoints() {
    makeCubePoints();
    console.log(colorsArray.length);
    makeCarPoints();
    console.log(colorsArray.length);
    ExtrudedTriangle();
    console.log(colorsArray.length);
    extrudedCircle();
    console.log(colorsArray.length);
}

let rot = 0;
function render() {
    let vm_t = [-1, 0, -1], vm_r = [0, 0, 1, 0], vm_s = [1, 1, 1];
    let car_t = [1, 0, 0], car_r = [45, 0, 1, 0], car_s = [1, 1, 1];

    // Specify the color for clearing <canvas>
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

	eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));

    modelViewMatrix = lookAt(eye, at , up);
	projectionMatrix = ortho(left*AllInfo.zoomFactor - AllInfo.translateX,
                              right*AllInfo.zoomFactor - AllInfo.translateX,
                              bottom*AllInfo.zoomFactor - AllInfo.translateY,
                              ytop*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);

    drawVendingMachine(vm_t, vm_r, vm_s);
    // drawTriagnle([1, 1, 1]);

    drawCar(car_t, car_r, car_s);
    drawCar([-3, 1, 1], car_r, [2, 2, 2]);
    
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

function initBuffers() {

    // normals for lighting
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    // vertices buffer
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

    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
    
    texture0 = gl.createTexture();

}