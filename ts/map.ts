let svg: HTMLIFrameElement;
let svgDoc: Document;
let graphNodes: { [index: string]: HTMLElement };

window.onload = function () {
    svg = <HTMLIFrameElement>document.getElementById("id_map");

    $(svg).ready(function () {
        svgDoc = svg.contentDocument;
        genNodes(svgDoc, svg, []);
    });
};

export function focusMap(start: string, end: string) {
    (<any> focusMapOnPoints)(...getLocation(start), ...getLocation(end), 100);
}

function focusMapOnPoints(startX: number, startY: number, endX: number, endY: number, padding: number) {
    let maxX = Math.max(startX, endX);
    let maxY = Math.max(startY, endY);
    let minX = Math.min(startX, endX);
    let minY = Math.min(startY, endY);

    console.log(`${minX - padding} ${minY - padding} ${maxX - minX + padding} ${maxY - minY + padding}`);

    svgDoc.getElementsByTagName("svg")[0]
          .setAttribute("viewBox", `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`);
}

function getSvgNode(place: string): SVGUseElement {
    return svgDoc.getElementById(place) as any as SVGUseElement;
}

export function drawEdge(start: string, end: string) {
    console.log(start, end);
    drawSVGEdge(getSvgNode(start), getSvgNode(end), svgDoc.getElementById("Edges"));
}

export function clearMap() {
    $(svgDoc.getElementById("Edges")).empty();
    for (let name of Object.keys(graphNodes)) {
        console.log(name);
        $(svgDoc.getElementById(name)).css('visibility', 'hidden');
    }
}

export function getLocation(place: string): [number, number] {
    return getCoords(getSvgNode(place));
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

function genNodes(svgDoc: Document, svg: HTMLIFrameElement, names: Array<string>) {
    graphNodes = {};
    // for (let name of names) {
    //     graphNodes[name] = svgDoc.getElementById(name);
    //     $(graphNodes[name]).css('visibility', 'hidden');
    // }
}