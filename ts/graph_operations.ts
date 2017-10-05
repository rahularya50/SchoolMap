import * as str_utils from "./str_utils";
import * as graph from "./graph";

class Move { constructor(public edge: graph.Edge, public place: graph.Place, public length: number) { } }
class Route { constructor(public moves: Array<Move>, public place: graph.Place, public distance: number, public origin: graph.Place) { } }

export function path_finder(start_place: graph.Place, end_place: graph.Place): Route {
    let explored: Array<Route> = [];
    let explored_places: Array<graph.Place> = [];
    let to_explore: Array<Route> = [new Route([], start_place, 0, start_place)];
    let to_explore_places: Array<graph.Place> = [];

    while (to_explore.length) {
        let current_route: Route = to_explore.reduce(function (prev: Route, curr: Route) {
            return prev.distance < curr.distance ? prev : curr
        });
        to_explore.splice(to_explore.indexOf(current_route), 1);
        to_explore_places.splice(to_explore_places.indexOf(current_route.place), 1);
        explored.push(current_route);
        explored_places.push(current_route.place);
        if (current_route.place === end_place) {
            break;
        }
        for (let edge of current_route.place.edges) {
            for (let place of edge.places) {
                if (explored_places.indexOf(place) === -1 &&
                    (to_explore_places.indexOf(place) === -1 ||
                        to_explore[to_explore_places.indexOf(place)].distance > current_route.distance + edge.dist_between(current_route.place, place))) {
                    to_explore_places.push(place);
                    to_explore.push(new Route(current_route.moves.concat(new Move(edge, place,
                        edge.dist_between(current_route.place, place))), place,
                        current_route.distance + edge.dist_between(current_route.place, place), start_place));
                }
            }
        }
    }
    return explored[explored.length - 1];
}

export function gen_desc(route: Route): string[] {
    let output: Array<string> = [];
    console.log(route);
    for (let i = 0; i < route.moves.length; i++) {
        console.log(route.moves[i]);
        let prefix: string = "";
        if (i != 0) {
            let edge = route.moves[i].edge;
            let prev_edge = route.moves[i - 1].edge;

            let prev_place = i == 1 ? route.origin : route.moves[i - 2].place;
            let place = route.moves[i - 1].place;
            // noinspection UnnecessaryLocalVariableJS
            let next_place = route.moves[i].place;

            let sign = edge.path_sign(place, next_place);
            let prev_sign = prev_edge.path_sign(prev_place, place);

            let direction = edge.direction + 2 * sign;
            let prev_direction = prev_edge.direction + 2 * prev_sign;

            if (prev_edge.type == "Staircase") {
                prev_direction += 2;
            }

            prefix = str_utils.dir_gen(prev_direction, direction);
        }
        let temp = prefix + str_utils.message(i == 0 ? route.origin : route.moves[i - 1].place, route.moves[i].place, route.moves[i].edge);

        output.push(temp[0].toUpperCase() + temp.slice(1));
    }
    output.push("You have arrived!");
    return output;
}

export function edgePair(route: Route): [string, string][] {
    let prev = route.origin;
    let output: [string, string][] = [];
    for (let move of route.moves) {
        output.push([prev.id, move.place.id]);
        prev = move.place;
    }
    return output;
}