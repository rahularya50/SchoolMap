define(["require", "exports", "motion"], function (require, exports, motion) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let svgs = [];
    let svgDocs = [];
    let currVisible = 0;
    const FLOORS = 2;
    window.onload = () => {
        for (let i = 0; i < FLOORS; i++) {
            svgs.push(document.getElementById(`id_map_${i + 1}`));
            svgDocs.push(null);
            $(svgs[i]).ready(function () {
                svgDocs[i] = svgs[i].contentDocument;
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
    function getSvgNode(place, hint) {
        return svgDocs[Math.max(getFloor(place), getFloor(hint))].getElementById(place);
    }
    function getFloor(place) {
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
    exports.getFloor = getFloor;
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
        // for (let name of Object.keys(graphNodes)) {
        //     console.log(name);
        //     (getSvgNode(name) as any).css('visibility', 'hidden');
        // }
    }
    exports.clearMap = clearMap;
    function getLocation(place, hint) {
        return getCoords(getSvgNode(place, hint));
    }
    exports.getLocation = getLocation;
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