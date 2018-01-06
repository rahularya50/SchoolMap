///<reference path="jquery.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // This class was used to represent the state of the currently visible SVG
    class State {
        constructor(xCenter, yCenter, width, height) {
            this.xCenter = xCenter;
            this.yCenter = yCenter;
            this.width = width;
            this.height = height;
        }
    }
    let currState = null; // Representing the SVG currently visible
    let stateBeforeDrag = null; // Representing the state of the SVG currently visible before dragging began
    let activeSVG = null; // Representing the SVG element being manipulated
    let inDrag = false; // A boolean determining whether a drag event was taking place
    let prevTimeStamp = 0;
    // An exported function to execute an animation using the GreenSock library, called from map.ts
    function animate(svg, xCenter, yCenter, width, height) {
        activeSVG = svg; // Setting activeSVG
        // Calling Hammer.js to handle SVG animation to a set of specified coordinates
        TweenMax.to(svg, 1.5, {
            attr: { viewBox: `${xCenter - width / 2}, ${yCenter - height / 2}, ${width}, ${height}` },
            ease: Circ.easeOut
        });
    }
    exports.animate = animate;
    // Sets the active SVG to a given State object
    function render(state) {
        activeSVG.setAttribute("viewBox", `${state.xCenter - state.width / 2}, ${state.yCenter - state.height / 2}, ${state.width}, ${state.height}`);
    }
    // A touch event handler called by Hammer.js when the SVG is interacted with by the user
    function handleTouchEvent(ev) {
        inDrag = true; // Set flag boolean
        TweenMax.killTweensOf(activeSVG); // Stop all animations
        let isFirst = false; // This variable indicates whether the drag has just begun
        if (ev.type === "pan") {
            // Check if the drag has just begun
            if (stateBeforeDrag === null) {
                console.log("Begin drag " + prevTimeStamp);
                isFirst = true; // Set flag variable
                // Obtain SVG state from DOM as a string
                let rawViewBox = activeSVG.getAttribute("viewBox");
                console.log(rawViewBox);
                // Parse SVG state into numerical values
                let [cornerX, cornerY, width, height] = rawViewBox.split(", ").map(parseFloat);
                // Set stateBeforeDrag and currState
                stateBeforeDrag = new State(cornerX + width / 2, cornerY + height / 2, width, height);
                currState = Object.assign({}, stateBeforeDrag);
            }
            // Determine the current zoom level
            let scaleFactor = Math.max(currState.width / $("#id_map_1").width(), currState.height / $("#id_map_1").height());
            // Add the drag vector to the original SVG position to compute the new SVG state, taking into consideration the zoom level
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
            render(currState); // Render the calculated state
        }
    }
    exports.handleTouchEvent = handleTouchEvent;
});
// animationStep(0); 
//# sourceMappingURL=motion.js.map