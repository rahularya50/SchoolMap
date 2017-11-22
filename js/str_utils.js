define(["require", "exports", "./graph", "./graph_operations"], function (require, exports, graph, graph_operations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function message(start, end, edge) {
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
    exports.message = message;
    function gen_desc(route) {
        let output = [];
        let turns = graph_operations_1.gen_turns(route);
        for (let i = 0; i < turns.length; i++) {
            let prefix = dir_gen(turns[i]);
            let temp = prefix + message(i == 0 ? route.origin : route.moves[i - 1].place, route.moves[i].place, route.moves[i].edge);
            output.push(temp[0].toUpperCase() + temp.slice(1));
        }
        output.push("You have arrived!");
        return output;
    }
    exports.gen_desc = gen_desc;
    function dir_gen(delta) {
        switch (delta) {
            case 0 /* Up */: return "";
            case 3 /* Left */: return "Turn <strong>left</strong>, and ";
            case 1 /* Right */: return "Turn <strong>right</strong>, and ";
            case 2 /* Down */: return "Turn <strong>around</strong>, and ";
        }
        console.log(delta);
    }
    exports.dir_gen = dir_gen;
    function ordinal(n) {
        if (n > 3) {
            return n.toString() + "th";
        }
        switch (n) {
            case 1: return n.toString() + "st";
            case 2: return n.toString() + "nd";
            case 3: return n.toString() + "rd";
        }
    }
    exports.ordinal = ordinal;
});
//# sourceMappingURL=str_utils.js.map