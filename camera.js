// functions to control the camera

function zoom(e) {
    if (e.wheelDelta > 0) {
        AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
    } else {
        AllInfo.zoomFactor += 0.1;
    }
    render();
}

function mouseDown(e) {
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
}

function mouseUp(e) {
    AllInfo.mouseDownLeft = false;
    AllInfo.mouseDownRight = false;
    render();
}

function mouseMove(e) {
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
}