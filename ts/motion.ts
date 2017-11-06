///<reference path="jquery.d.ts"/>

class State {
    constructor(public xCenter: number, public yCenter: number, public width: number, public height) {
    }
}

let currState: State = null;
let goalState: State = null;
let stateBeforeDrag: State = null;

let activeSVG: SVGSVGElement = null;

let prevTimeStamp: number = 0;

export function animate(svg: SVGSVGElement, xCenter: number, yCenter: number, width: number, height: number): void {
    activeSVG = svg;
    goalState = new State(xCenter, yCenter, width, height);
}

function animationStep(timestamp) {
    prevTimeStamp = timestamp;
    if (goalState !== null) {
        if (currState === null) {
            currState = {...goalState};
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
            else if (currState.height - goalState.height < - speed) {
                currState.height += speed;
            }
        }
    }
    if (activeSVG !== null && currState !== null) {
        render(currState)
    }
    requestAnimationFrame(animationStep)
}

function render(state: State) {
    activeSVG.setAttribute("viewBox",
        `${state.xCenter - state.width / 2}, ${state.yCenter - state.height / 2}, ${state.width}, ${state.height}`);
}

export function handleTouchEvent(ev: HammerInput) {
    let isFirst = false;
    if (ev.type === "pan") {
        if (stateBeforeDrag === null) {
            console.log("Begin drag " + prevTimeStamp);
            isFirst = true;
            stateBeforeDrag = {...currState};
        }
        goalState = null;
        let scaleFactor = Math.max(
            currState.width / $("#id_map_1").width(),
            currState.height / $("#id_map_1").height()
        );
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

animationStep(0);