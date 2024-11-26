// drawObject.js

function drawCube(t = [0, 0, 0], r = [0, 0, 1, 0], s = [1, 1, 1]) {
    t = translate(t[0], t[1], t[2]);
    r = rotate(r[0], r[1], r[2], r[3]);
    s = scale4(s[0], s[1], s[2]);

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	gl.drawArrays( gl.TRIANGLES, currentIndex, 36);

    modelViewMatrix = modelViewStack.pop();
}

function drawVendingMachine(trans = [0, 0, 0], rot = [0, 0, 1, 0], scale = [1, 1, 1]) {
    let t = translate(trans[0], trans[1], trans[2]);
    let r = rotate(rot[0], rot[1], rot[2], rot[3]);
    let s = scale4(scale[0], scale[1], scale[2]);

    let counter = 0;
    let colors = [
        vec4(1, .23, 0, 1),
        vec4(0, 1, .41, 1),
        vec4(0, 0, 1, 1),
        vec4(.64, 1, 0, 1),
        vec4(128/255, 0, 128/255, 1)
    ];

    // draw body
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 122/255, 122/255, 122/255, 1.0);
    materialSpecular = vec4( 189/255, 182/255, 175/255, 1.0 );
    materialShiness=20;
    SetupLightingMaterial();    

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);

    drawCube([ 0.0, 0.00, 0.0], rot, [.40, .40, .90]); // bottom part
    drawCube([ 0.0, 0.40, 0.0], rot, [.40, 1, .25]);   // right part
    drawCube([ 0.0, 0.40, 0.8], rot, [.40, 1, .10]);   // left part
    drawCube([ 0.0, 1.40, 0.0], rot, [.40, .10, .90]); // top part
    drawCube([ -0.01, 0.00, 0.0], rot, [.05, 1.40, .90]);// back part
    materialDiffuse = vec4( 50/255, 50/255, 50/255, 1.0);
    SetupLightingMaterial();    
    drawCube([ 0.0, 0.10, 0.2], rot, [.43, .25, .60]);// flap part
    drawCube([ 0.0, 0.60, 0.025], rot, [.43, .5, .20]);// flap part
    
    scale = [.37, 0.025, 0.80]
    item_scale = [0.075, 0.15, 0.075];

    // draw shelves
    for (let i = 1.20; i > 0.40; i -= 0.20) {
        materialDiffuse = vec4( 122/255, 122/255, 122/255, 1.0);
        materialShiness=20;

        SetupLightingMaterial();    
        drawCube([0, i, .05], rot, scale);

        // draw things on shelves
        for (let j = 0; j < .3; j += 0.1) {
            
            for (let k = 0; k < 0.5; k += .1) {
                if (counter >= colors.length) {counter = 0;}
                materialDiffuse = colors[counter];
                materialShiness=5;

                SetupLightingMaterial();
                drawCube([(j + .05), (i + .01), (k + 0.28)], rot, item_scale);
                counter++;
            }
        }
    }

    modelViewMatrix = modelViewStack.pop();
    currentIndex += 36;
}

function drawCar(t = [0, 0, 0], r = [0, 0, 1, 0], s = [1, 1, 1]) {
    t = translate(t[0], t[1], t[2]);
    r = rotate(r[0], r[1], r[2], r[3]);
    s = scale4(s[0], s[1], s[2]);

    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 122/255, 122/255, 122/255, 1.0);
    materialSpecular = vec4( 189/255, 182/255, 175/255, 1.0 );
    materialShiness=20;
    SetupLightingMaterial();    

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	gl.drawArrays( gl.TRIANGLES, currentIndex, 63);
    currentIndex += 63;

    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 12/255, 12/255, 12/255, 1.0);
    materialSpecular = vec4( 189/255, 182/255, 175/255, 1.0 );
    materialShiness=0;
    SetupLightingMaterial();    

    for (let i = 0; i < 2; i++) {
        drawCircle([-.5, 0, (-i+.875)], [90, 1, 0, 0], [.25, .25, .25]);
        drawCircle([ .5, 0, (-i+.875)], [90, 1, 0, 0], [.25, .25, .25]);
    }

    modelViewMatrix = modelViewStack.pop();
}

function drawTriagnle(t = [0, 0, 0], r = [0, 0, 1, 0], s = [1, 1, 1]) {
    t = translate(t[0], t[1], t[2]);
    r = rotate(r[0], r[1], r[2], r[3]);
    s = scale4(s[0], s[1], s[2]);

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	gl.drawArrays( gl.TRIANGLES, 99, 24);

    modelViewMatrix = modelViewStack.pop();
}

function drawCircle(t = [0, 0, 0], r = [0, 0, 1, 0], s = [1, 1, 1]) {
    t = translate(t[0], t[1], t[2]);
    r = rotate(r[0], r[1], r[2], r[3]);
    s = scale4(s[0], s[1], s[2]);

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    
    gl.drawArrays(gl.TRIANGLES, currentIndex, circle_points);

    modelViewMatrix = modelViewStack.pop();
}