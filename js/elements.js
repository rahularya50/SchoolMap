define(["require", "exports", "./graph", "./str_utils"], function (require, exports, graph, str_utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Staircase extends graph.Edge {
        constructor(name, floors, direction) {
            super([], name, direction, "Staircase");
            this.name = name;
            this.floors = floors;
            this.direction = direction;
            for (let i = 0; i < floors; i++) {
                this.places.push(new StairJunction(i, [this], name));
            }
        }
        message(start, end) {
            if (start.floor > end.floor) {
                return "go down the staircase to the <strong>" + end.name + "</strong>.";
            }
            else {
                return "go up the staircase to the <strong>" + end.name + "</strong>.";
            }
        }
        get_floor(floor) {
            return this.places[floor];
        }
        path_sign(a, b) {
            console.warn("Compare StairJunction .floor instead!");
            return this.places.indexOf(a) > this.places.indexOf(b) ? 1 : 0;
        }
        dist_between(a, b) {
            return (Math.abs(this.places.indexOf(a) - this.places.indexOf(b)) * 500) + 100;
        }
    }
    exports.Staircase = Staircase;
    class StairJunction extends graph.Place {
        constructor(floor, edges, staircase_name) {
            super(floor == 0 ? "Ground Floor" : str_utils.ordinal(floor) + " Floor", edges, "StairJunction", staircase_name);
            this.floor = floor;
            this.edges = edges;
            this.staircase_name = staircase_name;
        }
    }
    exports.StairJunction = StairJunction;
    class Corridor extends graph.Edge {
        constructor(rooms, locations, direction) {
            super([], "corridor", direction, "Corridor");
            for (let room of rooms) {
                let place = new graph.Place(room, [this]);
                locations[room] = place;
                this.places.push(place);
            }
        }
    }
    exports.Corridor = Corridor;
    class InvisiblePlace extends graph.Place {
        constructor(name, edges) {
            super(name, edges, "InvisiblePlace");
            this.name = name;
            this.edges = edges;
        }
    }
    exports.InvisiblePlace = InvisiblePlace;
});
//# sourceMappingURL=elements.js.map