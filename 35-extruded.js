var canvas;
var gl;

var eye = [5, 2, 5]; // Camera along x-axis
var at = [0,0, 0];  // Looking at origin
var up = [0, 1, 0];  // Up direction along y-axis

var pointsArray = [];
var normalsArray = [];

var theta = [0, 0, 0];
var thetaLoc;

var xAxis = 0, yAxis = 1, zAxis = 2;
var axis = yAxis; // Default rotation around y-axis

var lightPosition = vec4(5, 2, 5, 0.0);
var lightAmbient = vec4(0.3, 0.3, 0.3, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
var materialDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 50.0;

var ambientProduct, diffuseProduct, specularProduct;
var modelView, projection;
var program;

var flag = true;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Initialize the trashcan
    ExtrudedCylinder();

    // Buffer setup
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    projection = ortho(-3, 3, -3, 3, -20, 20);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function () { axis = xAxis; };
    document.getElementById("ButtonY").onclick = function () { axis = yAxis; };

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));

    render();
};

function ExtrudedCylinder() {
    var radius = 2.5;
    var height = 4;
    var segments = 30;
    var alpha = (2 * Math.PI) / segments;

    vertices = [];
    for (var i = 0; i < segments; i++) {
        var angle = i * alpha;
        vertices.push(vec4(radius * Math.cos(angle), 0, radius * Math.sin(angle), 1));
    }

    var N = vertices.length;
    for (var i = 0; i < N; i++) {
        vertices.push(vec4(vertices[i][0], height, vertices[i][2], 1));
    }

    for (var i = 0; i < N; i++) {
        quad(i, (i + 1) % N, (i + 1) % N + N, i + N);
    }

    var baseIndices = [];
    var topIndices = [];
    for (var i = 0; i < N; i++) {
        baseIndices.push(i);
        topIndices.push(i + N);
    }

    polygon(baseIndices);
    polygon(topIndices.reverse());
}

function quad(a, b, c, d) {
    var indices = [a, b, c, d];
    var normal = Newell(indices);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[b]);
    normalsArray.push(normal);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);

    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
}

function polygon(indices) {
    var normal = Newell(indices);
    var first = indices[0];

    for (var i = 1; i < indices.length - 1; i++) {
        pointsArray.push(vertices[first]);
        normalsArray.push(normal);
        pointsArray.push(vertices[indices[i]]);
        normalsArray.push(normal);
        pointsArray.push(vertices[indices[i + 1]]);
        normalsArray.push(normal);
    }
}

function Newell(indices) {
    var L = indices.length;
    var x = 0, y = 0, z = 0;

    for (var i = 0; i < L; i++) {
        var current = indices[i];
        var next = indices[(i + 1) % L];

        x += (vertices[current][1] - vertices[next][1]) *
            (vertices[current][2] + vertices[next][2]);
        y += (vertices[current][2] - vertices[next][2]) *
            (vertices[current][0] + vertices[next][0]);
        z += (vertices[current][0] - vertices[next][0]) *
            (vertices[current][1] + vertices[next][1]);
    }

    return normalize(vec3(x, y, z));
}

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag) theta[axis] += 2.0;

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
    requestAnimFrame(render);
};
