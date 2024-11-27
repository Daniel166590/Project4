// POINTS.JS
// functions relating to creating points and then pushing the points
// into the pointsArray


// ==================== Adrian's functions ======================= //

function tri(a, b, c, colorIndex = 1) {
    let normal = Newell([a, b, c]);
    pointsArray.push(a);
    normalsArray.push(normal);
    pointsArray.push(b);
    normalsArray.push(normal);
    pointsArray.push(c);
    normalsArray.push(normal);
}

function quad(a, b, c, d, color = 1) {
    tri(a, b, c, color);
    tri(c, d, a, color);
}

// define the faces
function makeCubePoints() {
    let v = [
        vec4( 0, 0, 0, 1),  // A 0
        vec4( 1, 0, 1, 1),  // B 1
        vec4( 1, 0, 0, 1),  // C 2
        vec4( 0, 0, 1, 1),  // D 3
        vec4( 0, 1, 0, 1),  // E 4
        vec4( 1, 1, 1, 1),  // F 5
        vec4( 1, 1, 0, 1),  // G 6
        vec4( 0, 1, 1, 1),  // H 7
    ];
    quad(v[2], v[0], v[3], v[1], 1);
    quad(v[6], v[4], v[7], v[5], 2);
    quad(v[5], v[7], v[3], v[1], 3);
    quad(v[6], v[4], v[0], v[2], 4);
    quad(v[5], v[6], v[2], v[1], 5);
    quad(v[7], v[4], v[0], v[3], 5);
}

function makeCarPoints() {
    v = [
        vec4( -1.1, 0, -0.1, 1), // A 0 bottom of car
        vec4(  1, 0, 1.1, 1),    // B 1
        vec4(  1, 0, -0.1, 1),   // C 2
        vec4( -1.1, 0, 1.1, 1),  // D 3

        vec4( -1.00, .5, 0, 1),  // A 4
        vec4( -0.25, .5, 1.05, 1),  // B 5
        vec4( -0.25, .5, -0.05, 1),  // C 6
        vec4( -1.00, .5, 1, 1),  // D 7

        vec4( 0.1, .75, 0, 1),  // C 8
        vec4( 0.1, .75, 1, 1),  // D 9

        vec4( 0.90, 0.7, 0, 1),  // 10
        vec4( 0.90, 0.7, 1, 1),  // 11
    ];

    quad(v[2], v[0],  v[3], v[1], 1); // bottom
    quad(v[6], v[4],  v[7], v[5], 2); // lid
    quad(v[6], v[5],  v[9], v[8], 5); // windshield
    quad(v[9], v[11], v[10], v[8], 2); // top
    quad(v[11], v[10], v[2], v[1], 5); // back

    quad(v[11], v[10], v[2], v[1], 5); // side
    quad(v[11], v[9], v[5], v[1], 3); // side
    tri(v[9], v[1], v[3], 3); // side
    tri(v[3], v[7], v[5], 3); // side

    quad(v[0], v[2], v[10], v[8], 4); // side
    tri(v[0], v[4], v[6], 4); // side

    quad(v[3], v[7], v[4], v[0], 5);
}

function ExtrudedTriangle()
{
    var height=1;
    v = [ vec4(1, 0, 0, 1),
          vec4(0, 0, 1, 1),
          vec4(0, 0, 0, 1)
        ];
    let v_count = v.length;

    // add the second set of points
    // extruded along the Y Axis
    let extrude_factor = [0, height, 0, 0];
    for (var i=0; i < v_count; i++)
        v.push(add(v[i], extrude_factor));
    
    tri(v[2], v[1], v[0], 1);
    tri(v[5], v[4], v[3], 1);
    quad(v[4], v[1], v[0], v[3], 2);
    quad(v[5], v[2], v[1], v[4], 2);
    quad(v[5], v[2], v[0], v[3], 2);
}

var circle_points;
function extrudedCircle() {
    const SIZE = 20;
    let height = 1, radius = 1;
	let angle = 2*Math.PI/SIZE;
    let v = [vec4(0, 0, 0, 1)];
    let extrude_factor = [0, height, 0, 0];
    
    // create points for cirle
    for (let i = 0; i <= SIZE; i++) {
        let x = 0 + radius*Math.cos(i*angle);
        let z = 0 + radius*Math.sin(i*angle);
        v.push(vec4(x, 0, z, 1));
    }
    
    // create another cirle but diff y value
    for (let i = 0; i <= SIZE + 1; i++) {
        v.push(add(v[i], extrude_factor));
    }

    // start at 1 to skip (0, 0) vector
    // make faces for top
    let start = v[0]
    for (let i = 1; i <= SIZE; i++) {
        tri(start, v[i], v[i + 1], 1);
    }

    // make faces for bottom
    start = v[SIZE + 2];
    for (let i = SIZE; i <= SIZE * 2 + 2; i++) {
        tri(start, v[i], v[i+1], 1);
    }

    // make sides of shape
    for (let i = 1; i < SIZE+1; i++) {
        tri(v[i+SIZE+3], v[i+1], v[i+SIZE+2], 1);
        tri(v[i+SIZE+2], v[i+1], v[i], 1);
    }

    circle_points = ((v.length - 1) * 3) + ((SIZE) * 6);
    console.log(circle_points);
}

//Sets up the vertices array so the pawn can be drawn
var rev_points
function SurfaceRevPoints()
{
	let v = [
        [.1, 1, 0, 1],
        [.5, 0, 0, 1],
    ];

	let radius, rotate_count = 6;
    let angle_increment = Math.PI / rotate_count;
    let point_count = v.length;

    let rot_points = [...v];

    // take points and rotate them
    for(let i = 0; i < rotate_count * 2; i++) {
        let angle = (i + 1) * angle_increment; // how much to rotate point
        
        // make new rotated points
        for(let j = 0; j < point_count; j++) {
            radius = v[j][0]                       // radius == the x val of current point
            let x = radius * Math.cos(angle);
            let y = v[j][1];
            let z = radius * Math.sin(angle);
            rot_points.push(vec4(x, y, z, 1));
        }
    }

    let tmp = 23;
    for(let i = 0; i < tmp; i++) {
        tri(rot_points[i], rot_points[i + 1], rot_points[i + 2]);
        tri(rot_points[i + 1], rot_points[i + 2], rot_points[i + 3]);
    }
    rev_points = 6 * tmp;
}


// =================== Daniel's functions ========================== //

// Function to draw a mesh, including bricks and grout
function Draw() {
    DrawWall();
    DrawLightPost();
}

function DrawTrashCan(numSlices = 30, radius = 1, height = 2) {
    // body
    extrudedCylinder(numSlices, radius, height);
    
    //top
    sphere(numSlices, radius, 0, 2, 0); // radius, xOffset, yOffset, zOffset
    
    // receptical
    console.log(colorsArray.length);
    // radius, width, thickness, smoothness, angleOffset, xOffset, yOffset, zOffset, color
    curve90Degrees(radius * 0.8, 1.0, 1.2, 10, 0.67, 0, -0, -0, colors[0]);
    adjustableRectangle(0.1, 1, 1.2, 1.25, 2.8, 0); // length, width, height, xOffset, yOffset, zOffset
    console.log(colorsArray.length);
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

function DrawWall() {
    // Draw each brick (gray color)
    quad(v[1], v[0], v[3], v[2], v[6]); // Front face of the brick
    quad(v[2], v[3], v[7], v[6], v[7]); // Right face
    quad(v[3], v[0], v[4], v[7], v[8]); // Bottom face
    quad(v[6], v[5], v[1], v[2], v[8]); // Top face
    quad(v[4], v[5], v[6], v[7], v[6]); // Back face
    quad(v[5], v[4], v[0], v[1], v[7]); // Left face
    // Add green between bricks
    quad(v[1], v[0], v[3], v[2], v[9]); // Front face
    quad(v[2], v[3], v[7], v[6], v[9]); // Right face
    quad(v[3], v[0], v[4], v[7], v[9]); // Bottom face
    quad(v[6], v[5], v[1], v[2], v[9]); // Top face
    quad(v[4], v[5], v[6], v[7], v[9]); // Back face
    quad(v[5], v[4], v[0], v[1], v[9]); // Left face

    numWallPoints = 72; // 36 vertices for the bricks, 36 for the green bricks
}

function DrawLightPost() {
    // Draw the base of the light post
    quad(v[1], v[0], v[3], v[2], v[6]); // Front face
    quad(v[2], v[3], v[7], v[6], v[7]); // Right face
    quad(v[3], v[0], v[4], v[7], v[8]); // Bottom face
    quad(v[6], v[5], v[1], v[2], v[8]); // Top face
    quad(v[4], v[5], v[6], v[7], v[6]); // Back face
    quad(v[5], v[4], v[0], v[1], v[7]); // Left face

    // Draw the post (gray color)
    cylinder(100, 0.3, 7.0); // numSlices, radius, height

    // Draw the lamp (yellow colored sphere)
    sphere(25, 0.85, 0, 7, 0); // numSlices, radius, xOffset, yOffset, zOffset

    // Draw the banner arm (dark gray color)
    // Top of the banner arm
    adjustableRectangle(3, 0.25, 0.1, -1.5, 6, 0); // length, width, height, xOffset, yOffset, zOffset
    // Bottom of the banner arm (logrithmic curve)
    curve90Degrees(1.75, 0.2, 0.08, 50, -2, 4.25, -0.095); // radius, width, thickness, smoothness, xOffset, yOffset, zOffset
    curve90Degrees(-0.7, 0.2, 0.08, 50, -0.2, 6, -0.095); // radius, width, thickness, smoothness, xOffset, yOffset, zOffset

}
// Function to create an extruded cylinder with a specified number of slices, radius, and height (Extruded shape)
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
        pointsArray.push(vec4(x1, height, y1, 1.0));  // Top edge
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge

        // Bottom edge (y = 0) to top edge (y = height)
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge
        pointsArray.push(vec4(x2, 0, y2, 1.0));  // Bottom edge
    }
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
        pointsArray.push(vec4(x1, height, y1, 1.0));  // Edge of top face
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Edge of top face
    }

    // Create the bottom of the cylinder (this stays at y = 0, the base)
    for (var i = 0; i < numSlices; i++) {
        var x1 = radius * Math.cos(i * angle);
        var y1 = radius * Math.sin(i * angle);
        var x2 = radius * Math.cos((i + 1) * angle);
        var y2 = radius * Math.sin((i + 1) * angle);

        // Bottom face, now at y = 0 (fixed base)
        pointsArray.push(vec4(0, 0, 0, 1.0));  // Center of bottom face
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Edge of bottom face
        pointsArray.push(vec4(x2, 0, y2, 1.0));  // Edge of bottom face
    }

    // Create the sides of the cylinder
    for (var i = 0; i < numSlices; i++) {
        var x1 = radius * Math.cos(i * angle);
        var y1 = radius * Math.sin(i * angle);
        var x2 = radius * Math.cos((i + 1) * angle);
        var y2 = radius * Math.sin((i + 1) * angle);

        // Side faces, going from bottom (y = 0) to top (y = height)
        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        pointsArray.push(vec4(x1, height, y1, 1.0));  // Top edge
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge

        pointsArray.push(vec4(x1, 0, y1, 1.0));  // Bottom edge
        pointsArray.push(vec4(x2, height, y2, 1.0));  // Top edge
        pointsArray.push(vec4(x2, 0, y2, 1.0));  // Bottom edge
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
            pointsArray.push(vec4(x2, y2, z2, 1.0));
            pointsArray.push(vec4(x3, y3, z3, 1.0));

            pointsArray.push(vec4(x2, y2, z2, 1.0));
            pointsArray.push(vec4(x4, y4, z4, 1.0));
            pointsArray.push(vec4(x3, y3, z3, 1.0));
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
        }
    }
}

// Tried to create adjustable shapes for more flexibility
function curve90Degrees(radius, width, thickness, smoothness, xOffset, yOffset, zOffset) {
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
        pointsArray.push(i1);
        pointsArray.push(i2);

        pointsArray.push(o1);
        pointsArray.push(i2);
        pointsArray.push(o2);

        // Create the bottom surface of the ribbon (extruding along the z-axis)
        pointsArray.push(vec4(o1[0], o1[1], o1[2] + width, 1.0));
        pointsArray.push(vec4(i1[0], i1[1], i1[2] + width, 1.0));
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));

        pointsArray.push(vec4(o1[0], o1[1], o1[2] + width, 1.0));
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));
        pointsArray.push(vec4(o2[0], o2[1], o2[2] + width, 1.0));

        // Create the sides connecting the top and bottom surfaces
        pointsArray.push(o1);
        pointsArray.push(vec4(o1[0], o1[1], o1[2] + width, 1.0));
        pointsArray.push(vec4(o2[0], o2[1], o2[2] + width, 1.0));

        pointsArray.push(o1);
        pointsArray.push(vec4(o2[0], o2[1], o2[2] + width, 1.0));
        pointsArray.push(o2);

        pointsArray.push(i1);
        pointsArray.push(vec4(i1[0], i1[1], i1[2] + width, 1.0));
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));

        pointsArray.push(i1);
        pointsArray.push(vec4(i2[0], i2[1], i2[2] + width, 1.0));
        pointsArray.push(i2);
    }
}
