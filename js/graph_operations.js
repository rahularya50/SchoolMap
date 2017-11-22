define(["require", "exports"], function (require, exports) {
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
    function gen_turns(route) {
        let output = [];
        for (let i = 0; i < route.moves.length; i++) {
            if (i != 0) {
                let edge = route.moves[i].edge;
                let prev_edge = route.moves[i - 1].edge;
                let prev_place = i == 1 ? route.origin : route.moves[i - 2].place;
                let place = route.moves[i - 1].place;
                let sign = edge.path_sign(place, route.moves[i].place);
                let prev_sign = prev_edge.path_sign(prev_place, place);
                let direction = edge.direction + 2 * sign;
                let prev_direction = prev_edge.direction + 2 * prev_sign;
                if (prev_edge.type == "Staircase") {
                    prev_direction += 2;
                }
                output.push((direction - prev_direction + 12) % 4);
                // prefix = str_utils.dir_gen(prev_direction, direction);
            }
            // let temp = prefix + str_utils.message(i == 0 ? route.origin : route.moves[i - 1].place, route.moves[i].place, route.moves[i].edge);
            // output.push(temp[0].toUpperCase() + temp.slice(1));
        }
        // output.push("You have arrived!");
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