define(["require", "exports", "motion"], function (require, exports, motion) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let svgs = []; // Stores the SVG wrapper elements for each floor
    let svgDocs = []; // Stores the SVG elements for each floor
    let currVisible = 0;
    const FLOORS = 8;
    const STAIRCASES = [
        "Link Block Staircase",
        "Language Block Staircase",
        "Science Block Staircase",
        "Peel Block Staircase",
        "Foyer Staircase",
        "Senior School Staircase"
    ];
    function initialize_svgs() {
        for (let i = 0; i < STAIRCASES.length; ++i) {
            svgs.push(document.getElementById(STAIRCASES[i]));
            svgDocs.push(svgs[i].contentDocument);
            $(svgs[i]).ready(function () {
                svgDocs[i] = svgs[i].contentDocument;
                // Initializing a Hammer.js touch receiver to aid user interaction
                let hammer = new Hammer(svgDocs[i].getElementsByTagName("svg")[0]);
                hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                hammer.on("pan panstart panend", motion.handleTouchEvent);
            });
        }
        for (let i = STAIRCASES.length; i < STAIRCASES.length + FLOORS; i++) {
            svgs.push(document.getElementById(`id_map_${i + 1 - STAIRCASES.length}`));
            svgDocs.push(svgs[i].contentDocument);
            $(svgs[i]).ready(function () {
                svgDocs[i] = svgs[i].contentDocument;
                // Initializing a Hammer.js touch receiver to aid user interaction
                let hammer = new Hammer(svgDocs[i].getElementsByTagName("svg")[0]);
                hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                hammer.on("pan panstart panend", motion.handleTouchEvent);
            });
        }
    }
    exports.initialize_svgs = initialize_svgs;
    // Focuses the appropriate SVG on an edge joining designated Nodes.
    function focusMap(start, end, force_real = false) {
        // Determining the floor of the input Place ids, as described previously
        let startName = genMapId(start);
        let endName = genMapId(end);
        let floor = Math.max(getFloor(startName, force_real), getFloor(endName, force_real));
        if (floor < STAIRCASES.length) {
            let stair_start = start;
            let stair_end = end;
            focusMapOnPoints(...getLocation("Target_" + stair_start.floor, endName), ...getLocation("Target_" + stair_end.floor, startName), floor, 130, 50);
        }
        else {
            console.log("Focusing on real map");
            focusMapOnPoints(...getLocation(startName, endName, force_real), ...getLocation(endName, startName, force_real), floor, 50);
        }
    }
    exports.focusMap = focusMap;
    // Calls animation handlers from motion.ts to animate a specified SVG to focus on given coordinates
    function focusMapOnPoints(startX, startY, endX, endY, floor, padding, vpadding = -1) {
        // Calculating the bounding box of the given coordinates
        let maxX = Math.max(startX, endX);
        let maxY = Math.max(startY, endY);
        let minX = Math.min(startX, endX);
        let minY = Math.min(startY, endY);
        if (vpadding == -1)
            vpadding = padding;
        // Calling motion.ts animation handlers and extracting the SVG element from the DOM
        motion.animate(svgDocs[floor].getElementsByTagName("svg")[0], (minX + maxX) / 2, (minY + maxY) / 2, maxX - minX + 2 * padding, maxY - minY + 2 * vpadding);
        svgDocs[floor].getElementsByTagName("svg")[0]
            .setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
    // Obtaining the SVG object with the input name. Since some elements are on multiple floors (such as StairJunctions), a second element on the same floor (hint) is included. Typically, "place" and "hint" are the start and end Places on an Edge. It is rare for two nodes on an Edge to both be StairJunctions for different Staircases, so this method should always output the correct Node when such a Node exists.
    function getSvgNode(place, hint, force_real = false) {
        // Since getFloor returns -1 when the floor of a Place is indeterminate, Math.max is used to obtain a target floor whenever possible. The appropriate SVG is then identified from svgDocs, and the correct Node is extracted based on its id
        const targetFloor = Math.max(getFloor(place, force_real), getFloor(hint, force_real));
        // console.log(`Floor is ${targetFloor}`);
        return svgDocs[targetFloor].getElementById(place);
    }
    // getFloor identifies the floor a particular Place is on, returning -1 when said Place may lie on multiple floors
    function getFloor(place, force_real = false) {
        for (let i = 0; i < STAIRCASES.length; ++i) {
            if (!force_real && STAIRCASES[i].split(" ").join("_") == place.substr(0, STAIRCASES[i].length)) {
                return i;
            }
        }
        for (let i = 0; i < FLOORS; i++) {
            // Determine whether the place is contained on the ith floor by inspecting the corresponding SVG
            if (svgDocs[STAIRCASES.length + i].getElementById(place) !== null) {
                return STAIRCASES.length + i;
            }
        }
        return -1;
    }
    exports.getFloor = getFloor;
    // Due to the nature of SVGs generated using Adobe Illustrator CS6, ids cannot contain spaces. Since the ids of some Places contain spaces, this function replaces them with underscores.
    function genMapId(place) {
        return place.id.split(" ").join("_");
    }
    exports.genMapId = genMapId;
    // Extracting the Nodes corresponding to given Place ids and calling appropriate SVG manipulation functions
    function drawEdge(start, end, force_real = false) {
        // Determining the floor of the input Place ids, as described previously
        let floor = Math.max(getFloor(start, force_real), getFloor(end, force_real));
        console.log("Floor xcv is: " + floor);
        // Verifying that the Places are on the same floor
        if (floor >= STAIRCASES.length || force_real) {
            console.log(`Drawing edge between ${start} and ${end}!`);
            // Calling raw SVG manipulation function
            drawSVGEdge(getSvgNode(start, end, force_real), getSvgNode(end, start, force_real), svgDocs[floor].getElementById("Edges"));
            // showFloor(getFloor(start));
        }
        else {
            console.log(`Drawing edge on floor ${floor}`);
            drawSVGEdge(getSvgNode("Floor_" + start.slice(-1), end), getSvgNode("Floor_" + end.slice(-1), start), svgDocs[floor].getElementById("Edges"));
        }
    }
    exports.drawEdge = drawEdge;
    // Deleting all elements in SVG "Edges" layer to reset the map display
    function clearMap() {
        for (let i = 0; i < FLOORS + STAIRCASES.length; i++) {
            $(svgDocs[i].getElementById("Edges")).empty();
        }
    }
    exports.clearMap = clearMap;
    // Determines the coordinates of a particular Place, using a hint analogously to getSvgNode
    function getLocation(place, hint, force_real = false) {
        return getCoords(getSvgNode(place, hint, force_real));
    }
    exports.getLocation = getLocation;
    // Extracts the coordinates of an SVGElement (typically a "Node") using SVG transform matricse
    function getCoords(place) {
        return [place.transform.baseVal[0].matrix.e, place.transform.baseVal[0].matrix.f];
    }
    // Constructs an SVG element from two specified Nodes
    function drawSVGEdge(start, end, svg) {
        console.log(start, end, svg);
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