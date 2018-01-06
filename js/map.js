define(["require", "exports", "motion"], function (require, exports, motion) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let svgs = []; // Stores the SVG wrapper elements for each floor
    let svgDocs = []; // Stores the SVG elements for each floor
    let currVisible = 0;
    const FLOORS = 4;
    // Initializing SVGs after page load
    window.onload = () => {
        for (let i = 0; i < FLOORS; i++) {
            svgs.push(document.getElementById(`id_map_${i + 1}`));
            svgDocs.push(null);
            $(svgs[i]).ready(function () {
                svgDocs[i] = svgs[i].contentDocument;
                // Initializing a Hammer.js touch receiver to aid user interaction
                let hammer = new Hammer(svgDocs[i].getElementsByTagName("svg")[0]);
                hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                hammer.on("pan panstart panend", motion.handleTouchEvent);
            });
        }
    };
    function focusMap(start, end) {
        let floor = Math.max(getFloor(start), getFloor(end));
        focusMapOnPoints(...getLocation(start, end), ...getLocation(end, start), floor, 50);
    }
    exports.focusMap = focusMap;
    function focusMapOnPoints(startX, startY, endX, endY, floor, padding) {
        let maxX = Math.max(startX, endX);
        let maxY = Math.max(startY, endY);
        let minX = Math.min(startX, endX);
        let minY = Math.min(startY, endY);
        motion.animate(svgDocs[floor].getElementsByTagName("svg")[0], (minX + maxX) / 2, (minY + maxY) / 2, maxX - minX + 2 * padding, maxY - minY + 2 * padding);
        svgDocs[floor].getElementsByTagName("svg")[0]
            .setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
    // Obtaining the SVG object with the input name. Since some elements are on multiple floors (such as StairJunctions), a second element on the same floor (hint) is included. Typically, "place" and "hint" are the start and end Places on an Edge. It is rare for two nodes on an Edge to both be StairJunctions for different Staircases, so this method should always output the correct Node when such a Node exists.
    function getSvgNode(place, hint) {
        // Since getFloor returns -1 when the floor of a Place is indeterminate, Math.max is used to obtain a target floor whenever possible. The appropriate SVG is then identified from svgDocs, and the correct Node is extracted based on its id
        return svgDocs[Math.max(getFloor(place), getFloor(hint))].getElementById(place);
    }
    // getFloor identifies the floor a particular Place is on, returning -1 when said Place may lie on multiple floors
    function getFloor(place) {
        let out = -1;
        for (let i = 0; i < FLOORS; i++) {
            // Determine whether the place is contained on the ith floor by inspecting the corresponding SVG
            if (svgDocs[i].getElementById(place) !== null) {
                if (out != -1) {
                    // If the place has been previously found on a different floor, the answer must be indeterminate
                    return -1;
                }
                // Otherwise, record the floor where the place has been found
                out = i;
            }
        }
        return out;
    }
    exports.getFloor = getFloor;
    // Due to the nature of SVGs generated using Adobe Illustrator CS6, ids cannot contain spaces. Since the ids of some Places contain spaces, this function replaces them with underscores.
    function genMapId(place) {
        return place.id.split(" ").join("_");
    }
    exports.genMapId = genMapId;
    function drawEdge(start, end) {
        let floor = Math.max(getFloor(start), getFloor(end));
        if (floor != -1 && (getFloor(start) == -1 || getFloor(end) == -1 || getFloor(start) == getFloor(end))) {
            console.log(`Drawing edge between ${start} and ${end}!`);
            drawSVGEdge(getSvgNode(start, end), getSvgNode(end, start), svgDocs[floor].getElementById("Edges"));
            // showFloor(getFloor(start));
        }
    }
    exports.drawEdge = drawEdge;
    function clearMap() {
        for (let i = 0; i < FLOORS; i++) {
            $(svgDocs[i].getElementById("Edges")).empty();
        }
    }
    exports.clearMap = clearMap;
    // Determines the coordinates of a particular Place, using a hint analogously to getSvgNode
    function getLocation(place, hint) {
        return getCoords(getSvgNode(place, hint));
    }
    exports.getLocation = getLocation;
    // Extracts the coordinates of an SVGElement (typically a "Node") using SVG transform matricse
    function getCoords(place) {
        return [place.transform.baseVal[0].matrix.e, place.transform.baseVal[0].matrix.f];
    }
    function drawSVGEdge(start, end, svg) {
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
    function showFloor(floor) {
        if (currVisible != -1) {
            $(svgs[currVisible]).css("visibility", "hidden");
        }
        if (floor != -1) {
            $(svgs[floor]).css("visibility", "visible");
        }
        currVisible = floor;
    }
    exports.showFloor = showFloor;
});
//# sourceMappingURL=map.js.map