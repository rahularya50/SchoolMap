define(["require", "exports", "./map", "./map"], function (require, exports, map, map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Move {
        constructor(edge, place, length) {
            this.edge = edge;
            this.place = place;
            this.length = length;
        }
    }
    class Route {
        constructor(moves, place, distance, origin) {
            this.moves = moves;
            this.place = place;
            this.distance = distance;
            this.origin = origin;
        }
    }
    exports.Route = Route;
    function path_finder(start_place, end_place) {
        let explored = new Map();
        let to_explore = new Map();
        to_explore.set(start_place, new Route([], start_place, 0, start_place));
        while (to_explore.size > 0) {
            let current_place = to_explore.keys().next().value;
            for (let keyval of to_explore.entries()) {
                let key = keyval[0];
                let val = keyval[1];
                if (val.distance < to_explore.get(current_place).distance) {
                    current_place = key;
                }
            }
            let current_route = to_explore.get(current_place);
            to_explore.delete(current_place);
            explored.set(current_route.place, current_route);
            if (current_route.place === end_place) {
                break;
            }
            for (let edge of current_route.place.edges) {
                for (let place of edge.places) {
                    if (!explored.has(place) &&
                        (!to_explore.has(place) ||
                            to_explore.get(place).distance > current_route.distance + edge.dist_between(current_route.place, place))) {
                        to_explore.set(place, new Route(current_route.moves.concat(new Move(edge, place, edge.dist_between(current_route.place, place))), place, current_route.distance + edge.dist_between(current_route.place, place), start_place));
                    }
                }
            }
        }
        return explored.get(end_place);
    }
    exports.path_finder = path_finder;
    function get_angle(origin, dest) {
        let originCoords = map.getLocation(map_1.genMapId(origin), map_1.genMapId(dest));
        let destCoords = map.getLocation(map_1.genMapId(dest), map_1.genMapId(origin));
        return Math.atan2(destCoords[1] - originCoords[1], destCoords[0] - originCoords[0]);
    }
    function gen_turns(route) {
        let angles = [];
        let staircase_dir = [];
        for (let i = 0; i < route.moves.length; i++) {
            if (route.moves[i].edge.type === "Staircase") {
                angles.push(-1);
                staircase_dir.push();
            }
            else {
                angles.push(get_angle(i != 0 ? route.moves[i - 1].place : route.origin, route.moves[i].place));
                staircase_dir.push(undefined);
            }
        }
        let output = [0 /* Forward */];
        for (let i = 1; i < angles.length; i++) {
            let angle_delta = (angles[i] - angles[i - 1] + Math.PI * 2) % (Math.PI * 2);
            if (angle_delta < Math.PI / 4 || angle_delta > Math.PI * 7 / 4) {
                output.push(0 /* Forward */);
            }
            else if (angle_delta < Math.PI * 3 / 4) {
                output.push(1 /* Right */);
            }
            else if (angle_delta < Math.PI * 5 / 4) {
                output.push(2 /* Backwards */);
            }
            else if (angle_delta <= Math.PI * 7 / 4) {
                output.push(3 /* Left */);
            }
            else {
                output.push(0 /* Forward */);
            }
        }
        // prefix = str_utils.dir_gen(prev_direction, direction)
        // let temp = prefix + str_utils.message(i == 0 ? route.origin : route.moves[i - 1].place, route.moves[i].place, route.moves[i].edge);
        // output.push(temp[0].toUpperCase() + temp.slice(1));
        // output.push("You have arrived!");
        console.log(output);
        return output;
    }
    exports.gen_turns = gen_turns;
    function edgePair(route) {
        let prev = route.origin;
        let output = [];
        for (let move of route.moves) {
            console.log(prev.id, move.place.id, move.edge.dist_between(prev, move.place));
            output.push([prev, move.place]);
            prev = move.place;
        }
        return output;
    }
    exports.edgePair = edgePair;
});
//# sourceMappingURL=graph_operations.js.map