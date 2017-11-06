///<reference path="jquery.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class State {
        constructor(xCenter, yCenter, width, height) {
            this.xCenter = xCenter;
            this.yCenter = yCenter;
            this.width = width;
            this.height = height;
        }
    }
    let currState = null;
    let goalState = null;
    let stateBeforeDrag = null;
    let activeSVG = null;
    let prevTimeStamp = 0;
    function animate(svg, xCenter, yCenter, width, height) {
        activeSVG = svg;
        goalState = new State(xCenter, yCenter, width, height);
    }
    exports.animate = animate;
    function animationStep(timestamp) {
        prevTimeStamp = timestamp;
        if (goalState !== null) {
            if (currState === null) {
                currState = Object.assign({}, goalState);
            }
            else {
                const speed = 10;
                if (currState.xCenter - goalState.xCenter > speed) {
                    currState.xCenter -= speed;
                }
                else if (currState.xCenter - goalState.xCenter < -speed) {
                    currState.xCenter += speed;
                }
                if (currState.yCenter - goalState.yCenter > speed) {
                    currState.yCenter -= speed;
                }
                else if (currState.yCenter - goalState.yCenter < -speed) {
                    currState.yCenter += speed;
                }
                if (currState.width - goalState.width > speed) {
                    currState.width -= speed;
                }
                else if (currState.width - goalState.width < -speed) {
                    currState.width += speed;
                }
                if (currState.height - goalState.height > speed) {
                    currState.height -= speed;
                }
                else if (currState.height - goalState.height < -speed) {
                    currState.height += speed;
                }
            }
        }
        if (activeSVG !== null && currState !== null) {
            render(currState);
        }
        requestAnimationFrame(animationStep);
    }
    function render(state) {
        activeSVG.setAttribute("viewBox", `${state.xCenter - state.width / 2}, ${state.yCenter - state.height / 2}, ${state.width}, ${state.height}`);
    }
    function handleTouchEvent(ev) {
        let isFirst = false;
        if (ev.type === "pan") {
            if (stateBeforeDrag === null) {
                console.log("Begin drag " + prevTimeStamp);
                isFirst = true;
                stateBeforeDrag = Object.assign({}, currState);
            }
            goalState = null;
            let scaleFactor = Math.max(currState.width / $("#id_map_1").width(), currState.height / $("#id_map_1").height());
            currState.xCenter = stateBeforeDrag.xCenter - ev.deltaX * scaleFactor;
            currState.yCenter = stateBeforeDrag.yCenter - ev.deltaY * scaleFactor;
            if (ev.isFinal) {
                stateBeforeDrag = null;
                console.log("End drag " + prevTimeStamp);
                if (isFirst) {
                    console.log(ev);
                }
            }
        }
    }
    exports.handleTouchEvent = handleTouchEvent;
    animationStep(0);
});
//# sourceMappingURL=motion.js.map