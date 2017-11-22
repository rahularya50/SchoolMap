///<reference path="jquery.d.ts"/>

class State {
    constructor(public xCenter: number, public yCenter: number, public width: number, public height) {
    }
}

let currState: State = null;
let stateBeforeDrag: State = null;

let activeSVG: SVGSVGElement = null;

let inDrag = false;

let prevTimeStamp: number = 0;

export function animate(svg: SVGSVGElement, xCenter: number, yCenter: number, width: number, height: number): void {
    activeSVG = svg;
    TweenMax.to(svg, 1.5, {
        attr: {viewBox: `${xCenter - width / 2}, ${yCenter - height / 2}, ${width}, ${height}`},
    ease: Circ.easeOut});
}


function render(state: State) {
    activeSVG.setAttribute("viewBox",
        `${state.xCenter - state.width / 2}, ${state.yCenter - state.height / 2}, ${state.width}, ${state.height}`);
}

export function handleTouchEvent(ev: HammerInput) {
    inDrag = true;
    TweenMax.killTweensOf(activeSVG);
    let isFirst = false;
    if (ev.type === "pan") {
        if (stateBeforeDrag === null) {
            console.log("Begin drag " + prevTimeStamp);
            isFirst = true;
            let rawViewBox = activeSVG.getAttribute("viewBox");
            console.log(rawViewBox);
            let [cornerX, cornerY, width, height]: number[] = rawViewBox.split(", ").map(parseFloat);
            stateBeforeDrag = new State(cornerX + width / 2, cornerY + height/2, width, height);
            currState = {...stateBeforeDrag};
        }
        let scaleFactor = Math.max(
            currState.width / $("#id_map_1").width(),
            currState.height / $("#id_map_1").height()
        );
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

// animationStep(0);