import * as graph from "./graph";
import * as str_utils from "./str_utils";

export class Staircase extends graph.Edge {
    constructor(public name: string, public floors: number, public direction: graph.Direction) {
        super([], name, direction, "Staircase");
        for (let i = 0; i < floors; i++) {
            this.places.push(new StairJunction(i, [this], name));
        }
    }

    message(start: StairJunction, end: StairJunction): string {
        if (start.floor > end.floor) {
            return "go down the staircase to the <strong>" + end.name + "</strong>.";
        }
        else {
            return "go up the staircase to the <strong>" + end.name + "</strong>.";
        }
    }

    get_floor(floor: number): StairJunction {
        return <StairJunction>this.places[floor];
    }

    path_sign(a: StairJunction, b: StairJunction): number {
        console.warn("Compare StairJunction .floor instead!");
        return this.places.indexOf(a) > this.places.indexOf(b) ? 1 : 0;
    }

    dist_between(a: graph.Place, b: graph.Place): number {
        return (Math.abs(this.places.indexOf(a) - this.places.indexOf(b)) * 500) + 100;
    }
}

export class StairJunction extends graph.Place {
    constructor(public floor: number, public edges: Array<graph.Edge>, public staircase_name: string) {
        super(floor == 0 ? "Ground Floor" : str_utils.ordinal(floor) + " Floor", edges, "StairJunction", staircase_name);
    }
}

export class Corridor extends graph.Edge {
    constructor(rooms: Array<string>, locations: Object, direction: graph.Direction) {
        super([], "corridor", direction, "Corridor");
        for (let room of rooms) {
            let place: graph.Place = new graph.Place(room, [this]);
            locations[room] = place;
            this.places.push(place);
        }
    }
}

export class InvisiblePlace extends graph.Place {
    constructor(public name: string, public edges: Array<graph.Edge>) {
        super(name, edges, "InvisiblePlace");
    }
}