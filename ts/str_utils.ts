import * as graph from "./graph";
import {gen_turns, Route} from "./graph_operations";

// Generate the message body of a movement from "start" to "end" along "edge"
export function message(start: graph.Place, end: graph.Place, edge: graph.Edge): string {
    // By delegating message generation to Edges in special cases, internal properties do not have to be publicly exposed, making it easier to modify or extend the data model in the future.
    if (edge.type == "Staircase") {
        return edge.message(start, end);
    }
    // Check if the endpoint is at the end of an edge, or if it lacks a name
    else if (end.type == "InvisiblePlace" || (edge.type != "Staircase" && (edge.places.indexOf(end) == 0 || edge.places.indexOf(end) == edge.places.length - 1))) {
        return "walk all the way along the " + edge.name + ".";
    }
    // Check if the origin is at a staircase
    else if (start.type == "StairJunction") {
        return "walk along the " + edge.name + " from the staircase to <strong>" + end.name + "</strong>.";
    }
    // Check if the endpoint is at a staircase
    else if (end.type == "StairJunction") {
        return "walk along the " + edge.name + " to the staircase.";
    }
    // Delegate message generation to the edge to allow for future extension
    else {
        return edge.message(start, end);
    }
}

// Generate an Array of message descriptors
export function gen_desc(route: Route) {
    let output : Array<string> = [];
    let turns = gen_turns(route);

    for (let i = 0; i < turns.length; i++) {
        let prefix = dir_gen(turns[i]);
        // Combine prefix with body to create full message
        let temp = prefix + message(i == 0 ? route.origin : route.moves[i - 1].place, route.moves[i].place, route.moves[i].edge);
        // Fix capitalization
        output.push(temp[0].toUpperCase() + temp.slice(1));
    }
    // Add concluding message
    output.push("You have arrived!");
    return output;
}

export function dir_gen(delta: graph.Direction): string {
    switch (delta) {
        case graph.Direction.Forward: return "";
        case graph.Direction.Left: return "Turn <strong>left</strong>, and ";
        case graph.Direction.Right: return "Turn <strong>right</strong>, and ";
        case graph.Direction.Backwards: return "Turn <strong>around</strong>, and ";
    }
    return "";
}

export function ordinal(n: number): string {
    if (n > 3) {
        return n.toString() + "th"
    }
    switch (n) {
        case 1: return n.toString() + "st";
        case 2: return n.toString() + "nd";
        case 3: return n.toString() + "rd"
    }
}