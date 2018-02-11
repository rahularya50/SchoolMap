define(["require", "exports", "./map", "./map"], function (require, exports, map, map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Edge {
        constructor(places, name, direction, type = "edge") {
            this.places = places;
            this.name = name;
            this.direction = direction;
            this.type = type;
        }
        message(start, end) {
            return "walk along the " + this.name + " to <strong>" + end.name + "</strong>.";
        }
        add_nodes(nodes) {
            this.places = this.places.concat(nodes);
        }
        dist_between(a, b) {
            try {
                let startNodeName = map_1.genMapId(a);
                let endNodeName = map_1.genMapId(b);
                let startNodeCoords = map.getLocation(startNodeName, endNodeName, true);
                let endNodeCoords = map.getLocation(endNodeName, startNodeName, true);
                return Math.sqrt((startNodeCoords[0] - endNodeCoords[0]) ** 2 +
                    (startNodeCoords[1] - endNodeCoords[1]) ** 2) + 1;
            }
            catch (e) {
                return (Math.abs(this.places.indexOf(a) - this.places.indexOf(b)) * 500) + 100;
            }
        }
        path_sign(a, b) {
            return this.places.indexOf(a) > this.places.indexOf(b) ? 1 : 0;
        }
    }
    exports.Edge = Edge;
    class Place {
        constructor(name, edges, type = "place", id = "") {
            this.name = name;
            this.edges = edges;
            this.type = type;
            this.id = id;
            if (id == "") {
                this.id = name;
            }
        }
        add_edge(edge) {
            this.edges.push(edge);
        }
        toString() {
            return this.name;
        }
    }
    exports.Place = Place;
    function makeEdge(start, end, edge) {
        if (start) {
            start.add_edge(edge);
            edge.places.splice(0, 0, start);
        }
        if (end) {
            end.add_edge(edge);
            edge.places.push(end);
        }
    }
    exports.makeEdge = makeEdge;
});
//# sourceMappingURL=graph.js.map