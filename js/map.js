define(["require", "exports", "motion"], function (require, exports, motion) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let svgs = []; // Stores the SVG wrapper elements for each floor
    let svgDocs = []; // Stores the SVG elements for each floor
    let currVisible = 0;
    const FLOORS = 5;
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
    // Focuses the appropriate SVG on an edge joining designated Nodes.
    function focusMap(start, end) {
        // Determining the floor of the input Place ids, as described previously
        let floor = Math.max(getFloor(start), getFloor(end));
        focusMapOnPoints(...getLocation(start, end), ...getLocation(end, start), floor, 50);
    }
    exports.focusMap = focusMap;
    // Calls animation handlers from motion.ts to animate a specified SVG to focus on given coordinates
    function focusMapOnPoints(startX, startY, endX, endY, floor, padding) {
        // Calculating the bounding box of the given coordinates
        let maxX = Math.max(startX, endX);
        let maxY = Math.max(startY, endY);
        let minX = Math.min(startX, endX);
        let minY = Math.min(startY, endY);
        // Calling motion.ts animation handlers and extracting the SVG element from the DOM
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
    // Extracting the Nodes corresponding to given Place ids and calling appropriate SVG manipulation functions
    function drawEdge(start, end) {
        // Determining the floor of the input Place ids, as described previously
        let floor = Math.max(getFloor(start), getFloor(end));
        // Verifying that the Places are on the same floor
        if (floor != -1 && (getFloor(start) == -1 || getFloor(end) == -1 || getFloor(start) == getFloor(end))) {
            console.log(`Drawing edge between ${start} and ${end}!`);
            // Calling raw SVG manipulation function
            drawSVGEdge(getSvgNode(start, end), getSvgNode(end, start), svgDocs[floor].getElementById("Edges"));
            // showFloor(getFloor(start));
        }
    }
    exports.drawEdge = drawEdge;
    // Deleting all elements in SVG "Edges" layer to reset the map display
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
    // Constructs an SVG element from two specified Nodes
    function drawSVGEdge(start, end, svg) {
        // Extracting the coordinates of the specified SVG Nodes
        let [start_x, start_y] = getCoords(start);
        let [end_x, end_y] = getCoords(end);
        // Creating an SVG stroke element to visually represent an Edge
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
        newElement.setAttribute("d", "M" + start_x.toString() + " " + start_y.toString() + "L" + end_x.toString() + " " + end_y.toString()); //Set path's data
        newElement.style.stroke = "#000"; //Set stroke colour
        newElement.style.strokeWidth = "5px"; //Set stroke width
        // Adding the SVG element to the SVG container
        svg.appendChild(newElement);
        // Ensuring the source and destination Nodes are visible
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