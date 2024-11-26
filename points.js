
function tri(a, b, c, colorIndex = 1) {
    let normal = Newell([a, b, c]);
    pointsArray.push(a);
    normalsArray.push(normal);
    pointsArray.push(b);
    normalsArray.push(normal);
    pointsArray.push(c);
    normalsArray.push(normal);
    for (let i = 0; i < 3; i++)
        colorsArray.push(colors[colorIndex]);
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

function makeConePoints() {
    v = [
        vec4(1, 0, 0, 1),
        vec4(1, 1, 0, 1)
    ];

	// //Setup initial points matrix
	// for (var i = 0; i<25; i++)
	// {
    //     vertices.push(vec4(v[i][0], v[i][1], v[i][2], 1));
	// }

	var r;
    var t=Math.PI/12;

    // sweep the original curve another "angle" degree
    for (var j = 0; j < 24; j++) {
        var angle = (j+1)*t;

        // for each sweeping step, generate 25 new points corresponding to the original points
        for(var i = 0; i < 25 ; i++ )
        {
            r = vertices[i][0];
            vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
        }
    }

    var N=25;
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i<24; i++) { // slices
        for (var j=0; j<24; j++) { // layers
                quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
        }
    }
}
