import * as graph from "./graph";

export function message(start: graph.Place, end: graph.Place, edge: graph.Edge): string {
    if (edge.type == "Staircase") {
        return edge.message(start, end);
    }
    else if (end.type == "InvisiblePlace" || (edge.type != "Staircase" && (edge.places.indexOf(end) == 0 || edge.places.indexOf(end) == edge.places.length - 1))) {
        return "walk all the way along the " + edge.name + ".";
    }
    else if (start.type == "StairJunction") {
        return "walk along the " + edge.name + " from the staircase to <strong>" + end.name + "</strong>.";
    }
    else if (end.type == "StairJunction") {
        return "walk along the " + edge.name + " to the staircase.";
    }
    else {
        return edge.message(start, end);
    }
}

export function dir_gen(old_dir: graph.Direction, new_dir: graph.Direction): string {
    let delta = (new_dir - old_dir + 12) % 4;
    switch (delta) {
        case graph.Direction.Up: return "";
        case graph.Direction.Left: return "Turn <strong>left</strong>, and ";
        case graph.Direction.Right: return "Turn <strong>right</strong>, and ";
        case graph.Direction.Down: return "Turn <strong>around</strong>, and ";
    }
    console.log(delta);
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