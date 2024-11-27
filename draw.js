// drawObject.js
// functions that render the objects

// ==================== Adrian's functions ======================= //

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
    currentIndex += 63; // push points for car body

    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 12/255, 12/255, 12/255, 1.0);
    materialSpecular = vec4( 189/255, 182/255, 175/255, 1.0 );
    materialShiness=0;
    SetupLightingMaterial();    

    for (let i = 0; i < 2; i++) {
        drawCircle([-.5, 0, (-i+.875)], [90, 1, 0, 0], [.25, .25, .25]);
        drawCircle([ .5, 0, (-i+.875)], [90, 1, 0, 0], [.25, .25, .25]);
    }

    // push for cylinders
    currentIndex += 249;

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

function drawSurfaceRevolution(t = [0, 0, 0], r = [0, 0, 1, 0], s = [1, 1, 1]) {
    t = translate(t[0], t[1], t[2]);
    r = rotate(r[0], r[1], r[2], r[3]);
    s = scale4(s[0], s[1], s[2]);

    modelViewStack.push(modelViewMatrix);

    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);

    materialDiffuse = vec4(1, 165/255, 0, 1);
    SetupLightingMaterial();

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    
    gl.drawArrays(gl.TRIANGLES, currentIndex, rev_points);

    modelViewMatrix = modelViewStack.pop();
    currentIndex += rev_points;
}


// ============================== Daniel's functions ====================== //

// Added one other object
function RenderRoad() {
    // Apply transformations: translation and scaling
    let translation = translate(0, 0.25, 0);
    let scale = scale4(1, 1, 1); // Adjust the size of the light post
    let trashCanPostModelViewMatrix = mult(modelViewMatrix, mult(translation, scale));

    
    // Pass the transformation matrix to the shader
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trashCanPostModelViewMatrix));

    // change color
    materialDiffuse = colors[6];
    SetupLightingMaterial();

    // draw sidewalk
    gl.drawArrays(gl.TRIANGLES, currentIndex, 36);
    currentIndex += 36;

    // change color
    materialDiffuse = colors[10];
    SetupLightingMaterial();

    // draw road
    gl.drawArrays(gl.TRIANGLES, currentIndex, 36);
    currentIndex += 36;

    // change color
    materialDiffuse = colors[3];
    SetupLightingMaterial();

    // draw road
    gl.drawArrays(gl.TRIANGLES, currentIndex, 180);
    currentIndex += 180;

}

function RenderLightPost(lampColor) {
    // Save the original lighting properties
    const originalAmbient = materialAmbient;
    const originalDiffuse = materialDiffuse;
    const originalSpecular = materialSpecular;
    const originalShininess = materialShininess;

    // Apply transformations: translation and scaling
    let translation = translate(0, 0.25, 0);
    let scale = scale4(1, 1, 1); // Adjust the size of the light post
    let lightPostModelViewMatrix = mult(modelViewMatrix, mult(translation, scale));

    // Pass the transformation matrix to the shader
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(lightPostModelViewMatrix));

    // Draw the light post (this assumes you have already set the color for the light post)
    materialDiffuse = colors[8];
    SetupLightingMaterial();
    gl.drawArrays(gl.TRIANGLES, currentIndex, 36); // 36 vertices for a cube
    currentIndex += 36;

    // Draw the post (gray color)
    materialDiffuse = colors[7];
    SetupLightingMaterial();
    gl.drawArrays(gl.TRIANGLES, currentIndex, 1200);
    currentIndex += 1200; // Move past the light post

    if(lampColorToggled) {
        ColorLampPostBulb(lampColor);
    } else {
        RestoreOriginalLighting(originalAmbient, originalDiffuse, originalSpecular, originalShininess);
    }

    // Draw the lamp (yellow colored sphere)a
    materialDiffuse = colors[3];
    SetupLightingMaterial();
    gl.drawArrays(gl.TRIANGLES, currentIndex, 3750);
    currentIndex += 3750; // Move past the lamp

    // Restore the original lighting properties
    RestoreOriginalLighting(originalAmbient, originalDiffuse, originalSpecular, originalShininess);

    // Draw the banner arm (dark gray color)
    materialDiffuse = colors[8];
    SetupLightingMaterial();
    gl.drawArrays(gl.TRIANGLES, currentIndex, 36); // 36 vertices for a adjustable rectangle
    currentIndex += 36; // Move past the adjustable rectangle

    // Draw the banner arm underside
    materialDiffuse = colors[0];
    SetupLightingMaterial();
    gl.drawArrays(gl.TRIANGLES, currentIndex, 1200); // vertices for a curve
    currentIndex += 1200; // Move past the curve
    gl.drawArrays(gl.TRIANGLES, currentIndex, 1200); // vertices for a curve
    currentIndex += 1200; // Move past the curve

    function ColorLampPostBulb(lampColor) {
        // Set the current material color
        materialAmbient = lampColor;
        materialDiffuse = lampColor;

        // Pass the updated material properties to the shaders
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(mult(lightAmbient, materialAmbient)));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(mult(lightDiffuse, materialDiffuse)));
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(mult(lightSpecular, materialSpecular)));
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
        gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    }

    function RestoreOriginalLighting(ambient, diffuse, specular, shininess) {
        materialAmbient = ambient;
        materialDiffuse = diffuse;
        materialSpecular = specular;
        materialShininess = shininess;

        // Pass the restored properties to the shaders
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(mult(lightAmbient, materialAmbient)));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(mult(lightDiffuse, materialDiffuse)));
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(mult(lightSpecular, materialSpecular)));
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
        gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    }
}


// Function to render the whole wall with hedge
function RenderWall(rows, cols, brickWidth, brickHeight, xPosition, yPosition, zPosition, setScale) {
    let xOffset = xPosition; // Center horizontally
    let yOffset = yPosition; // Center vertically   

    // Rendering the gray bricks

    materialDiffuse = vec4(0.2, 0.2, 0.2, 1.0); // changing color to dark grey
    materialShiness=0; // making brick less reflective
    SetupLightingMaterial();  // apply changes

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            // Apply transformations: translation and scaling
            let translation = translate(xOffset, yOffset, zPosition);
            let scale = scale4(setScale * 2, setScale, 1); // Adjust the size of the bricks
            let brickModelViewMatrix = mult(modelViewMatrix, mult(translation, scale));

            // Pass the transformation matrix to the shader
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(brickModelViewMatrix));

            // Draw the brick (this assumes you have already set the color for the brick)
            gl.drawArrays(gl.TRIANGLES, currentIndex, 36); // 36 vertices for a cube

            // Increase the offset for the next brick
            xOffset += brickWidth;
        }
        xOffset = xPosition; // Reset the x offset
        yOffset += brickHeight;
    }
    currentIndex += 36;

    // Rendering the hedge bricks

    materialDiffuse = vec4(0.15, 0.4, 0.15, 1.0);
    SetupLightingMaterial();

    xOffset = xPosition + ((cols * brickWidth) / 2) - 0.32; // Start hedge bricks at the same position as the gray bricks
    yOffset = yPosition + 0.01; // Slight offset for hedge bricks
    for (var row = 0; row < rows + 2; row++) {
        // Apply transformations: translation and scaling
        let translation = translate(xOffset, yOffset, zPosition);
        let scale = scale4(setScale * cols * 2, setScale + 0.05, 0.85); // Adjust the size of the bricks
        let brickModelViewMatrix = mult(modelViewMatrix, mult(translation, scale));

        // Pass the transformation matrix to the shader
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(brickModelViewMatrix));

         // Draw the brick (this assumes you have already set the color for the brick)
         gl.drawArrays(gl.TRIANGLES, currentIndex, 36); // 36 vertices for a cube

         yOffset += brickHeight;
    }
    currentIndex += 36; // Move past the hedge bricks
}

function RenderTrashCan() {
    // Apply transformations: translation and scaling
    let translation = translate(0, 0.25, 0);
    let scale = scale4(1, 1, 1); // Adjust the size of the light post

    modelViewStack.push(modelViewMatrix); // save
    modelViewMatrix = mult(mult(modelViewMatrix, translation), scale);

    // Pass the transformation matrix to the shader
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    materialDiffuse = colors[7];
    SetupLightingMaterial();

    // draw body
    gl.drawArrays(gl.TRIANGLES, currentIndex, 180);
    currentIndex += 180;

    // draw top
    materialDiffuse = colors[0];
    SetupLightingMaterial();

    gl.drawArrays(gl.TRIANGLES, currentIndex, 5400);
    currentIndex += 5400;

    // draw receptical
    modelViewStack.push(modelViewMatrix); // save
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, translate(1.33, -1.2, -0.5))

    materialDiffuse = colors[0];
    SetupLightingMaterial();
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, currentIndex, 240);
    currentIndex += 240;
    
    modelViewMatrix = modelViewStack.pop(); // restore

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, currentIndex, 36);
    currentIndex += 36;

    modelViewMatrix = modelViewStack.pop(); // restore
}
