import * as map from "./map";

export class Edge {
    constructor(public places: Array<Place>, public name: string, public direction: Direction, public type: string = "edge") { }

    message(start: Place, end: Place): string {
        return "walk along the " + this.name + " to <strong>" + end.name + "</strong>.";
    }

    add_nodes(nodes: Array<Place>): void {
        this.places = this.places.concat(nodes)
    }

    dist_between(a: Place, b: Place): number {
        try {
            let startNodeCoords = map.getLocation(a.id.split(" ").join("_"));
            let endNodeCoords = map.getLocation(b.id.split(" ").join("_"));

            return Math.sqrt(
                (startNodeCoords[0] - endNodeCoords[0]) ** 2 +
                (startNodeCoords[1] - endNodeCoords[1]) ** 2) + 1;
        } catch (e) {
            return 10000000000;
        }
    }

    path_sign(a: Place, b: Place): number {
        return this.places.indexOf(a) > this.places.indexOf(b) ? 1 : 0;
    }
}

export class Place {
    constructor(public name: string, public edges: Array<Edge>, public type: string = "place", public id: string = "") {
        if (id == "") {
            this.id = name
        }
    }

    add_edge(edge: Edge): void {
        this.edges.push(edge);
    }

    toString(): string {
        return this.name
    }
}

export const enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

export function makeEdge(start: Place, end: Place, edge: Edge): void {
    if (start) {
        start.add_edge(edge);
        edge.places.splice(0, 0, start);
    }
    if (end) {
        end.add_edge(edge);
        edge.places.push(end);
    }
}