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
    let stateBeforeDrag = null;
    let activeSVG = null;
    let inDrag = false;
    let prevTimeStamp = 0;
    function animate(svg, xCenter, yCenter, width, height) {
        activeSVG = svg;
        TweenMax.to(svg, 1.5, {
            attr: { viewBox: `${xCenter - width / 2}, ${yCenter - height / 2}, ${width}, ${height}` },
            ease: Circ.easeOut
        });
    }
    exports.animate = animate;
    function render(state) {
        activeSVG.setAttribute("viewBox", `${state.xCenter - state.width / 2}, ${state.yCenter - state.height / 2}, ${state.width}, ${state.height}`);
    }
    function handleTouchEvent(ev) {
        inDrag = true;
        TweenMax.killTweensOf(activeSVG);
        let isFirst = false;
        if (ev.type === "pan") {
            if (stateBeforeDrag === null) {
                console.log("Begin drag " + prevTimeStamp);
                isFirst = true;
                let rawViewBox = activeSVG.getAttribute("viewBox");
                console.log(rawViewBox);
                let [cornerX, cornerY, width, height] = rawViewBox.split(", ").map(parseFloat);
                stateBeforeDrag = new State(cornerX + width / 2, cornerY + height / 2, width, height);
                currState = Object.assign({}, stateBeforeDrag);
            }
            let scaleFactor = Math.max(currState.width / $("#id_map_1").width(), currState.height / $("#id_map_1").height());
            currState.xCenter = stateBeforeDrag.xCenter - ev.deltaX * scaleFactor;
            currState.yCenter = stateBeforeDrag.yCenter - ev.deltaY * scaleFactor;
            if (ev.isFinal) {
                stateBeforeDrag = null;
                inDrag = false;
                console.log("End drag " + prevTimeStamp);
                if (isFirst) {
                }
            }
            console.log(ev);
            console.log(currState);
            render(currState);
        }
    }
    exports.handleTouchEvent = handleTouchEvent;
});
// animationStep(0); 
//# sourceMappingURL=motion.js.map