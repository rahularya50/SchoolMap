import * as graph from "./graph";
import * as map from "./map";
import {Direction, Edge, Place} from "./graph";
import {genMapId} from "./map";
import {Staircase, StairJunction} from "./elements";

class Move {
    constructor(public edge: graph.Edge, public place: graph.Place, public length: number) {
    }
}

export class Route {
    constructor(public moves: Array<Move>, public place: graph.Place, public distance: number, public origin: graph.Place) {
    }
}

// Implementation of Dijkstra's algorithm to find the shortest Route from the origin (start_place) to the destination (end_place)
export function path_finder(start_place: graph.Place, end_place: graph.Place): Route {
    // Initializing variables
    let explored = new Map<graph.Place, Route>();  // To store explored Places
    let to_explore = new Map<graph.Place, Route>(); // To store Places to be explored in the next iteration, along with Routes describing how to reach them
    to_explore.set(start_place, new Route([], start_place, 0, start_place)); // Add the origin Place to to_explore, along with an empty Route

    while (to_explore.size > 0) {
        // Identify the Place in to_explore closest to start_place (the origin)
        let current_place = to_explore.keys().next().value;  // Get an arbitrary Place from to_explore
        for (let keyval of to_explore.entries()) { // Iterate through all the Places in to_explore
            let key = keyval[0];
            let val = keyval[1];
            if (val.distance < to_explore.get(current_place).distance) {
                current_place = key;  // Keep updating current_place to represent the Place closest to start_place so far
            }
        }
        // current_place is now the closest Place to start_place in to_explore. As we are about to explore it, we will move it from to_explore to explored
        // It can be mathematically shown that current_route is the shortest Route from start_place to current_place, so we will not need to update it again
        let current_route = to_explore.get(current_place);
        to_explore.delete(current_place);
        explored.set(current_route.place, current_route);

        if (current_route.place === end_place) { // If we have reached end_place (the destination), we are finished.
            break;
        }

        // Otherwise, iterate through each of the Places reachable from current_place
        for (let edge of current_route.place.edges) {
            for (let place of edge.places) {
                // Only process this Place if we are yet to explore it, or if we have found a shorter Route to it.
                if (!explored.has(place) &&
                    (!to_explore.has(place) ||
                        to_explore.get(place).distance > current_route.distance + edge.dist_between(current_route.place, place))) {
                    // If so, create this new shorter Route and store it in to_explore
                    to_explore.set(place,
                        new Route(
                            current_route.moves.concat(new Move(edge, place, edge.dist_between(current_route.place, place))),
                            place, current_route.distance + edge.dist_between(current_route.place, place), start_place)
                    );
                }
            }
        }
    }

    // As the graph is fully connected, this will never throw an error, as end_place must have been reached once the loop terminates.
    return explored.get(end_place);
}

function get_angle(origin: Place, dest: Place) {
    // SVG manipulation functions from map.ts obtain the coordinates of the origin and destination (dest) Places
    let originCoords = map.getLocation(genMapId(origin), genMapId(dest));
    let destCoords = map.getLocation(genMapId(dest), genMapId(origin));

    // Simple trigonometry yields the angle of the edge joining the two Places with respect to the x-axis
    return Math.atan2(destCoords[1] - originCoords[1], destCoords[0] - originCoords[0]);
}

export function gen_turns(route: Route): Direction[] {
    let angles: Array<number> = []; // This array will contain the direction of each Move / Edge in the Route
    for (let i = 0; i < route.moves.length; i++) {
        if (route.moves[i].edge.type === "Staircase") {
            console.warn("Please verify Staircase direction calculations!");
            angles.push(Math.PI * 2 - (route.moves[i].edge as Staircase).direction * Math.PI / 2); // Since Staircases do not have a direction, we assign a placeholder for their angle
        } else {
            // The angle obtained from get_angle is pushed to angles
            angles.push(get_angle(i != 0 ? route.moves[i - 1].place : route.origin, route.moves[i].place));
        }
    }

    // Since the user's initial orientation cannot be known, we arbitrarily assume that they are facing in the correct direction, and assign Direction.Forward to the first Move in the Route
    let output: Array<Direction> = [Direction.Forward];

    // We compare the angle of each Move with its antecedent to compute the angular change (angle_delta) in radians
    for (let i = 1; i < angles.length; i++) {
        let angle_delta = (angles[i] - angles[i-1] + Math.PI * 2) % (Math.PI * 2); // We use modular arithmetic to force angle_delta between 0 and 2*PI
        // We threshold values of angle_delta to yield the appropriate Direction
        if (route.moves[i].edge.type === "Staircase") {
            let curr = route.moves[i].place as StairJunction;
            let prev = (i != 0 ? route.moves[i - 1].place : route.origin) as StairJunction;

            output.push(curr.floor > prev.floor ? Direction.Up : Direction.Down);
        }
        else if (angle_delta < Math.PI / 4 || angle_delta > Math.PI * 7 / 4) {
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
