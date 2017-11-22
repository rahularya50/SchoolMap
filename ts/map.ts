import * as motion from "motion";

let svgs: HTMLIFrameElement[] = [];
let svgDocs: Document[] = [];

let currVisible = 0;

const FLOORS = 3;

window.onload = () => {
    for (let i = 0; i < FLOORS; i++) {
        svgs.push(<HTMLIFrameElement>document.getElementById(`id_map_${i + 1}`));
        svgDocs.push(null);
        $(svgs[i]).ready(function () {
            svgDocs[i] = svgs[i].contentDocument;
            let hammer = new Hammer(<HTMLElement><any>svgDocs[i].getElementsByTagName("svg")[0]);
            hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
            hammer.on("pan panstart panend", motion.handleTouchEvent);
        });
    }
};

export function focusMap(start: string, end: string) {
    let floor = Math.max(getFloor(start), getFloor(end));
    (<any> focusMapOnPoints)(...getLocation(start, end), ...getLocation(end, start), floor, 50);
}

function focusMapOnPoints(startX: number, startY: number, endX: number, endY: number, floor: number, padding: number) {
    let maxX = Math.max(startX, endX);
    let maxY = Math.max(startY, endY);
    let minX = Math.min(startX, endX);
    let minY = Math.min(startY, endY);

    motion.animate(
        svgDocs[floor].getElementsByTagName("svg")[0],
        (minX + maxX) / 2, (minY + maxY) / 2, maxX - minX + 2 * padding, maxY - minY + 2 * padding
    );

    svgDocs[floor].getElementsByTagName("svg")[0]
        .setAttribute("preserveAspectRatio", "xMidYMid meet");
}

function getSvgNode(place: string, hint: string): SVGUseElement {
    return svgDocs[Math.max(getFloor(place), getFloor(hint))].getElementById(place) as any as SVGUseElement;
}

export function getFloor(place: string): number {
    let out = -1;
    for (let i = 0; i < FLOORS; i++) {
        if (svgDocs[i].getElementById(place) !== null) {
            if (out != -1) {
                return -1;
            }
            // console.log(`${place} found on floor ${i}`)
            out = i;
        }
    }
    return out;
}

export function drawEdge(start: string, end: string) {
    let floor = Math.max(getFloor(start), getFloor(end));
    if (floor != -1 && (getFloor(start) == -1 || getFloor(end) == -1 || getFloor(start) == getFloor(end))) {
        console.log(`Drawing edge between ${start} and ${end}!`);
        drawSVGEdge(getSvgNode(start, end), getSvgNode(end, start), svgDocs[floor].getElementById("Edges"));
        // showFloor(getFloor(start));
    }
}

export function clearMap() {
    for (let i = 0; i < FLOORS; i++) {
        $(svgDocs[i].getElementById("Edges")).empty();
    }
}

export function getLocation(place: string, hint: string): [number, number] {
    return getCoords(getSvgNode(place, hint));
}

function getCoords(place: SVGUseElement): [number, number] {
    return [place.transform.baseVal[0].matrix.e, place.transform.baseVal[0].matrix.f];
}

function drawSVGEdge(start: SVGUseElement, end: SVGUseElement, svg: Node): void {
    let [start_x, start_y] = getCoords(start);
    let [end_x, end_y] = getCoords(end);

    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
    newElement.setAttribute("d", "M" + start_x.toString() + " " + start_y.toString() + "L" + end_x.toString() + " " + end_y.toString()); //Set path's data
    newElement.style.stroke = "#000"; //Set stroke colour
    newElement.style.strokeWidth = "5px"; //Set stroke width
    svg.appendChild(newElement);

    $(start).css('visibility', 'visible');
    $(end).css('visibility', 'visible');
}

export function showFloor(floor: number): void {
    if (currVisible != -1) {
        $(svgs[currVisible]).css("visibility", "hidden");
    }
    if (floor != -1) {
        $(svgs[floor]).css("visibility", "visible");
    }
    currVisible = floor;
}
