///<reference path="jquery.d.ts"/>

// This class was used to represent the state of the currently visible SVG
class State {
    constructor(public xCenter: number, public yCenter: number, public width: number, public height) {
    }
}

let currState: State = null; // Representing the SVG currently visible
let stateBeforeDrag: State = null; // Representing the state of the SVG currently visible before dragging began

let activeSVG: SVGSVGElement = null; // Representing the SVG element being manipulated

let inDrag = false; // A boolean determining whether a drag event was taking place

let prevTimeStamp: number = 0;

// An exported function to execute an animation using the GreenSock library, called from map.ts
export function animate(svg: SVGSVGElement, xCenter: number, yCenter: number, width: number, height: number): void {
    activeSVG = svg; // Setting activeSVG
    // Calling Hammer.js to handle SVG animation to a set of specified coordinates
    TweenMax.to(svg, 1.5, {
        attr: {viewBox: `${xCenter - width / 2}, ${yCenter - height / 2}, ${width}, ${height}`},
    ease: Circ.easeOut});
}

// Sets the active SVG to a given State object
function render(state: State) {
    activeSVG.setAttribute("viewBox",
        `${state.xCenter - state.width / 2}, ${state.yCenter - state.height / 2}, ${state.width}, ${state.height}`);
}

// A touch event handler called by Hammer.js when the SVG is interacted with by the user
export function handleTouchEvent(ev: HammerInput) {
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
            let [cornerX, cornerY, width, height]: number[] = rawViewBox.split(", ").map(parseFloat);

            // Set stateBeforeDrag and currState
            stateBeforeDrag = new State(cornerX + width / 2, cornerY + height/2, width, height);
            currState = {...stateBeforeDrag};
        }

        // Determine the current zoom level
        let scaleFactor = Math.max(
            currState.width / $("#id_map_1").width(),
            currState.height / $("#id_map_1").height()
        );

        // Add the drag vector to the original SVG position to compute the new SVG state, taking into consideration the zoom level
        currState.xCenter = stateBeforeDrag.xCenter - ev.deltaX * scaleFactor;
        currState.yCenter = stateBeforeDrag.yCenter - ev.deltaY * scaleFactor;
        if (ev.isFinal) { // If the user has stopped dragging, reset flag variables
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

// animationStep(0);