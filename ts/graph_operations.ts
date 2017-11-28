import * as graph from "./graph";
import * as map from "./map";
import {Direction, Edge, Place} from "./graph";
import {genMapId} from "./map";

class Move {
    constructor(public edge: graph.Edge, public place: graph.Place, public length: number) {
    }
}

export class Route {
    constructor(public moves: Array<Move>, public place: graph.Place, public distance: number, public origin: graph.Place) {
    }
}

export function path_finder(start_place: graph.Place, end_place: graph.Place): Route {
    let explored = new Map<graph.Place, Route>();
    let to_explore = new Map<graph.Place, Route>();
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
                    to_explore.set(place,
                        new Route(
                            current_route.moves.concat(new Move(edge, place, edge.dist_between(current_route.place, place))),
                            place, current_route.distance + edge.dist_between(current_route.place, place), start_place)
                    );
                }
            }
        }
    }
    return explored.get(end_place);
}

function get_angle(origin: Place, dest: Place) {
    let originCoords = map.getLocation(genMapId(origin), genMapId(dest));
    let destCoords = map.getLocation(genMapId(dest), genMapId(origin));

    return Math.atan2(destCoords[1] - originCoords[1], destCoords[0] - originCoords[0]);
}

export function gen_turns(route: Route): Direction[] {
    let angles: Array<number> = [];
    let staircase_dir: Array<Direction> = [];
    for (let i = 0; i < route.moves.length; i++) {
        if (route.moves[i].edge.type === "Staircase") {
            angles.push(-1);
            staircase_dir.push();
        } else {
            angles.push(get_angle(i != 0 ? route.moves[i - 1].place : route.origin, route.moves[i].place));
            staircase_dir.push(undefined);
        }
    }

    let output: Array<Direction> = [Direction.Forward];

    for (let i = 1; i < angles.length; i++) {
        let angle_delta = (angles[i] - angles[i-1] + Math.PI * 2) % (Math.PI * 2);
        if (angle_delta < Math.PI / 4 || angle_delta > Math.PI * 7 / 4) {
            output.push(Direction.Forward);
        }
        else if (angle_delta < Math.PI * 3 / 4) {
            output.push(Direction.Right);
        }
        else if (angle_delta < Math.PI * 5 / 4) {
            output.push(Direction.Backwards)
        }
        else if (angle_delta <= Math.PI * 7 / 4) {
            output.push(Direction.Left)
        }
        else {
            output.push(Direction.Forward);
        }
    }

            // prefix = str_utils.dir_gen(prev_direction, direction)
        // let temp = prefix + str_utils.message(i == 0 ? route.origin : route.moves[i - 1].place, route.moves[i].place, route.moves[i].edge);

        // output.push(temp[0].toUpperCase() + temp.slice(1));
    // output.push("You have arrived!");
    console.log(output);
    return output;
}

export function edgePair(route: Route): [graph.Place, graph.Place][] {
    let prev = route.origin;
    let output: [graph.Place, graph.Place][] = [];
    for (let move of route.moves) {
        console.log(prev.id, move.place.id, move.edge.dist_between(prev, move.place));
        output.push([prev, move.place]);
        prev = move.place;
    }
    return output;
}
