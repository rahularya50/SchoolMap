﻿///<reference path="graph.ts"/>
import * as graph from "./graph";
import * as elements from "./elements";
import {Direction, makeEdge} from "./graph";

export let locations: { [name: string]: graph.Place } = {};
let staircases: { [name: string]: graph.Edge } = {};

let corridors: Array<elements.Corridor> = [];

let link_block = [["L02", "AC1", "AC2", "AS1", "AS2"],
    ["ICT4", "ICT Training", "ICT1", "AS4", "AS5"],
    ["EN201", "EN202", "EN203", "English Office", "EN204", "EN205", "EN206"],
    ["EN301", "EN302", "EN303", "EN304", "EN305", "EN306", "EN307", "EN308"],
    ["MA401", "MA402", "MA403", "MA404", "MA405", "MA406", "MA407"],
    ["MA501", "MA502", "MA503", "Maths Office", "MA504", "MA505", "MA506"]];

for (let i = 0; i < 6; i++) {
    corridors.push(new elements.Corridor(link_block[i], locations, graph.Direction.Right));
}

locations["ICT Intersection 1"] = new graph.Place("the intersection", [corridors[1]], "place", "ICT Intersection 1");

corridors[1].places.splice(2, 0, locations["ICT Intersection 1"]);

locations["ICT Intersection 2"] = new graph.Place("the intersection", [], "place", "ICT Intersection 2");

graph.makeEdge(locations["ICT Intersection 1"], locations["ICT Intersection 2"], new graph.Edge([], "corridor", graph.Direction.Left));

locations["ICT2"] = new graph.Place("ICT2", []);
locations["ICT3"] = new graph.Place("ICT3", []);

let ict_parallel_corridor = new graph.Edge([locations["ICT2"], locations["ICT Intersection 2"], locations["ICT3"]], "corridor", graph.Direction.Left);

locations["ICT2"].add_edge(ict_parallel_corridor);
locations["ICT Intersection 2"].add_edge(ict_parallel_corridor);
locations["ICT3"].add_edge(ict_parallel_corridor);

locations["Link Block Intersection Upper"] = new graph.Place("the intersection", [corridors[1]], "place", "Link Block Intersection Upper");
corridors[1].places.splice(5, 0, locations["Link Block Intersection Upper"]);

locations["Link Block Intersection Lower"] = new graph.Place("the intersection", [corridors[0]], "place", "Link Block Intersection Lower");
corridors[0].places.push(locations["Link Block Intersection Lower"]);

let s1: graph.Edge = new elements.Staircase("Link Block Staircase 1", 7, graph.Direction.Left);
let s2: graph.Edge = new elements.Staircase("Link Block Staircase 2", 7, graph.Direction.Left); //TODO: Add AS3 + Terrace

staircases["Link Block 1"] = s1;
staircases["Link Block 2"] = s2;

for (let i = 0; i < 6; i++) {
    graph.makeEdge(s1.places[i], s2.places[i], corridors[i]);
}

// Make the Science Block!

corridors = [];

let science_block = [["GLT"],
    ["SC101", "1st Floor Prep Room", "SC102", "SC103"],
    ["SC201", "SC202", "SC203"],
    ["ME2", "SC301", "3rd Floor Prep Room", "SC302", "SC303"],
    ["Science Office", "SC401", "SC402", "SC403", "SC404"],
    ["ME1", "SC501", "5th Floor Prep Room", "SC502", "SC503"],
    ["Roof Garden"]]; // TODO: Add ME1/2 + Science Office routing

for (let i = 1; i < 7; i++) {
    corridors.push(new elements.Corridor(science_block[i], locations, graph.Direction.Right));
    graph.makeEdge(new elements.InvisiblePlace("Science Block Intersection " + i, []), null, corridors[i - 1]);
}

corridors[5].name = "path";

let science_passthrough_intersection = new elements.InvisiblePlace("Science Block Passthrough Intersection", []);
locations["Sci-New Block Passthrough"] = new graph.Place("Sci-New Block Passthrough", []);

graph.makeEdge(science_passthrough_intersection, corridors[1].places[0],
    new elements.Corridor([], locations, graph.Direction.Forward));
graph.makeEdge(locations["Sci-New Block Passthrough"], science_passthrough_intersection,
    new elements.Corridor([], locations, graph.Direction.Forward));


s1 = new elements.Staircase("Science Block Staircase 1", 7, graph.Direction.Left);
s2 = new elements.Staircase("Science Block Staircase 2", 7, graph.Direction.Right);

locations["GLT"] = new graph.Place("GLT", []);
graph.makeEdge(locations["GLT"], s2.places[0], new graph.Edge([], "open space", graph.Direction.Right));

staircases["Science Block 1"] = s1;
staircases["Science Block 2"] = s2;

for (let i = 1; i < 7; i++) {
    graph.makeEdge(s1.places[i], s2.places[i], corridors[i-1]);
}

// graph.makeEdge(null, s2.places[0], locations["GLT"].edges[0]);  TODO: What even is this?

// Make the Language Block! TODO: Add Language Block extension + second staircase

corridors = [];

let language_block = [["the ICT Helpdesk", "W1", "W2"],
    ["G1", "G2", "F1"],
    ["the Language Office", "LA201", "LA202", "LA203", "LA204"],
    ["LA301", "LA302", "LA303", "LA304", "LA305", "LA306"]];

for (let i = 0; i < 4; i++) {
    corridors.push(new elements.Corridor(language_block[i], locations, graph.Direction.Left));
}

s1 = new elements.Staircase("Language Block Staircase 1", 4, graph.Direction.Left);
staircases["Language Block 1"] = s1;

for (let i = 0; i < 4; i++) {
    graph.makeEdge(s1.places[i], null, corridors[i]);
}

// Link the Language Block with the Link Block and Science Block!

for (let i = 0; i < 4; i++) {
    graph.makeEdge(null, new elements.InvisiblePlace("Language Block Link Node " + i, []), corridors[i]);
    graph.makeEdge(corridors[i].places[corridors[i].places.length - 1], (staircases["Link Block 1"]).places[i], new graph.Edge([], "bridge", graph.Direction.Right));
}

graph.makeEdge(locations["Sci-New Block Passthrough"], null, corridors[3]);

// Make the Peel Block!

let corridors_1: Array<elements.Corridor> = [];
let corridors_2: Array<elements.Corridor> = [];
let corridors_3: Array<elements.Corridor> = [];

let peel_block = [[["LPS", "Middle School Office", "PTSA Shop"], ["Staffroom", "Foyer", "Offices and SLT", "Board Room"], ["Careers Office", "SSC 5", "SSC 4", "SSC 3"]],
    [["Reading Center"], ["LRC Middle School Section", "LRC Canteen", "LRC Senior School Section"], ["Senior School Office", "SSC 2", "SSC 1"]]];

corridors_1.push(new elements.Corridor(peel_block[0][0], locations, graph.Direction.Down));
corridors_1.push(new elements.Corridor(peel_block[1][0], locations, graph.Direction.Down));

corridors_2.push(new elements.Corridor(peel_block[0][1], locations, graph.Direction.Right));
corridors_2.push(new elements.Corridor(peel_block[1][1], locations, graph.Direction.Right));

corridors_3.push(new elements.Corridor(peel_block[0][2], locations, graph.Direction.Left));
corridors_3.push(new elements.Corridor(peel_block[1][2], locations, graph.Direction.Left));

let s1_0 = new elements.StairJunction(0, [corridors_2[0]], "Peel Block Staircase 1");
let s1_1 = new elements.StairJunction(1, [corridors_1[1]], "Peel Block Staircase 1");

let s2_0 = new elements.StairJunction(0, [corridors_2[0]], "Peel Block Staircase 2");
let s2_1 = new elements.StairJunction(1, [corridors_3[1]], "Peel Block Staircase 2");

let foyer_staircase_0 = new elements.StairJunction(0, [corridors_2[0]], "Foyer Staircase");
let foyer_staircase_1 = new elements.StairJunction(1, [corridors_2[1]], "Foyer Staircase");

s1 = new elements.Staircase("Peel Block Staircase 1", 0, graph.Direction.Left);
s1.places = [s1_0, s1_1];
s2 = new elements.Staircase("Foyer Staircase", 0, graph.Direction.Right);
let s3 = new elements.Staircase("Peel Block Staircase 2", 0, graph.Direction.Left);
s3.places = [s2_0, s2_1];

graph.makeEdge(foyer_staircase_0, null, corridors_2[0]);
graph.makeEdge(foyer_staircase_1, null, corridors_2[1]);

s1_0.add_edge(s1);
s1_1.add_edge(s1);

locations["Foyer Staircase Base"] = foyer_staircase_0;
locations["Foyer Staircase Top"] = foyer_staircase_1;
graph.makeEdge(foyer_staircase_0, foyer_staircase_1, s2);
console.log(s2.places);

locations["S10"] = s1_0;
locations["S11"] = s1_1;

s2_0.add_edge(s3);
s2_1.add_edge(s3);

let c1_0 = new elements.InvisiblePlace("Peel Block Corner Node 10", [corridors_1[0], corridors_2[0]]);
let c1_1 = new elements.InvisiblePlace("Peel Block Corner Node 11", [corridors_1[1], corridors_2[1]]);
let c2_0 = new elements.InvisiblePlace("Peel Block Corner Node 20", [corridors_2[0], corridors_3[0]]);
let c2_1 = new elements.InvisiblePlace("Peel Block Corner Node 21", [corridors_2[1], corridors_3[1]]);

corridors_1[0].add_nodes([c1_0]);
corridors_1[1].add_nodes([s1_1, c1_1]);

graph.makeEdge(s1_0, s2_0, corridors_2[0]);
graph.makeEdge(c1_0, c2_0, corridors_2[0]);
graph.makeEdge(c1_1, c2_1, corridors_2[1]);

graph.makeEdge(c2_0, null, corridors_3[0]);
graph.makeEdge(s2_1, null, corridors_3[1]);
graph.makeEdge(c2_1, null, corridors_3[1]);

let peel_end_node_upper = new elements.InvisiblePlace("Peel Block Link Node Upper", []);

let peel_block_passage_1 = new elements.Corridor([], locations, graph.Direction.Right);

let peel_end_node_lower = new elements.InvisiblePlace("Peel Block Link Node Lower", [peel_block_passage_1]);

let d_1 = new elements.InvisiblePlace("Peel Block Corner Node D1", [peel_block_passage_1]);
let d_2 = new elements.InvisiblePlace("Peel Block Corner Node D2", [peel_block_passage_1]);
let d_3 = new elements.InvisiblePlace("Peel Block Corner Node D3", []);

peel_block_passage_1.places = [d_1, peel_end_node_lower, d_2];

graph.makeEdge(d_2, null, corridors_1[0]);
graph.makeEdge(d_3, null, corridors_2[0]);

let peel_block_ext_corridor_1 = new graph.Edge([d_1, d_3], "corridor", graph.Direction.Down);

graph.makeEdge(d_1, d_3, peel_block_ext_corridor_1);

let c0 = new elements.InvisiblePlace("Peel Block Corner Node 0", [corridors_1[1]]);

locations["Peel Block Corner Node 0"] = c0;

corridors_1[1].places.splice(0, 0, c0);

let peel_wing_edge_1 = new graph.Edge([], "corridor", graph.Direction.Right);
locations["Media Center"] = new graph.Place("Media Center", []);

graph.makeEdge(peel_end_node_upper, c0, peel_wing_edge_1);

graph.makeEdge(locations["Media Center"], null, peel_wing_edge_1);

graph.makeEdge(locations["Link Block Intersection Upper"], peel_end_node_upper, new graph.Edge([], "bridge", graph.Direction.Down));

let peel_block_link = new graph.Edge([], "path", graph.Direction.Down);
let peel_link_center = new elements.InvisiblePlace("Peel Link Center", []);
graph.makeEdge(locations["Link Block Intersection Lower"],
    peel_link_center,
    peel_block_link);
graph.makeEdge(null, peel_end_node_lower, peel_block_link);

locations["Hall"] = new graph.Place("Hall", []);

graph.makeEdge(locations["Foyer"], locations["Hall"], new graph.Edge([], "passage", graph.Direction.Left));

// Add the Piazza!
graph.makeEdge(d_3, locations["GLT"], new graph.Edge([], "passage", graph.Direction.Left));

graph.makeEdge(c1_0, staircases["Science Block 2"].places[0], new graph.Edge([], "passage", graph.Direction.Left));

let piazza = new graph.Place("Piazza", []);
locations["Piazza"] = piazza;

let piazza_tl = new elements.InvisiblePlace("Piazza TL", []);
let piazza_tr = new elements.InvisiblePlace("Piazza TR", []);
let piazza_br = new elements.InvisiblePlace("Piazza BR", []);
let piazza_bl = new elements.InvisiblePlace("Piazza BL", []);

graph.makeEdge(new elements.InvisiblePlace("Language Block End Node", []), null, locations["the ICT Helpdesk"].edges[0]);

graph.makeEdge(locations["the ICT Helpdesk"].edges[0].places[0], piazza_bl, new graph.Edge([], "path", graph.Direction.Right));

graph.makeEdge(piazza_br, locations["GLT"], new graph.Edge([], "space", graph.Direction.Down));
graph.makeEdge(piazza_br, d_3, new graph.Edge([], "space", graph.Direction.Right));
graph.makeEdge(piazza_br, staircases["Science Block 2"][0], new graph.Edge([], "path", graph.Direction.Left));

graph.makeEdge(piazza_tr, peel_link_center, new graph.Edge([], "path", graph.Direction.Right));

graph.makeEdge(piazza_tl, staircases["Link Block 1"][0], new graph.Edge([], "path", graph.Direction.Left));

graph.makeEdge(piazza_bl, piazza_br, new graph.Edge([], "piazza", graph.Direction.Right));
graph.makeEdge(piazza_bl, piazza_tl, new graph.Edge([], "piazza", graph.Direction.Left));
graph.makeEdge(piazza_bl, piazza_tr, new graph.Edge([], "piazza", graph.Direction.Right));
graph.makeEdge(piazza_br, piazza_tl, new graph.Edge([], "piazza", graph.Direction.Left));
graph.makeEdge(piazza_br, piazza_tr, new graph.Edge([], "piazza", graph.Direction.Left));
graph.makeEdge(piazza_tl, piazza_tr, new graph.Edge([], "piazza", graph.Direction.Right));

// Add the PE Rooms!
let pe_intersection_bl = new elements.InvisiblePlace("PE Intersection BL", []);
let pe_intersection_br = new elements.InvisiblePlace("PE Intersection BR", []);

locations["Swimming Pool"] = new graph.Place("Swimming Pool", []);
locations["Canteen"] = new graph.Place("Canteen", []);

locations["PE1"] = new graph.Place("PE1", []);
locations["PE2"] = new graph.Place("PE2", []);
locations["PE3"] = new graph.Place("PE3", []);

let pe_path_1 = new graph.Edge([], "path", graph.Direction.Left);
graph.makeEdge(locations["PE3"], locations["PE2"], pe_path_1);
graph.makeEdge(pe_intersection_bl, null, pe_path_1);

let pe_path_2 = new graph.Edge([], "path", graph.Direction.Down);
graph.makeEdge(locations["PE1"], pe_intersection_br, pe_path_2);


// Add the poolside area!
let pool_corridor = new graph.Edge([], "path", graph.Direction.Right);

graph.makeEdge(locations["Canteen"], null, pool_corridor);
graph.makeEdge(locations["Swimming Pool"], null, pool_corridor);
graph.makeEdge(pe_intersection_br, null, pool_corridor);
graph.makeEdge(pe_intersection_bl, null, pool_corridor);
graph.makeEdge(peel_link_center, null, pool_corridor);

let peel_end_node = new elements.InvisiblePlace("Peel Block End Node", []);
let peel_canteen_transfer = new elements.InvisiblePlace("Peel Canteen Transfer", []);

let peel_back_corridor = new elements.Corridor(["Boys Toilets", "Girls Toilets"], locations, graph.Direction.Right);
graph.makeEdge(d_2, peel_canteen_transfer, peel_back_corridor);
graph.makeEdge(null, peel_end_node, peel_back_corridor);
graph.makeEdge(null, peel_end_node, corridors_3[0]);

graph.makeEdge(peel_canteen_transfer, locations["Canteen"], new graph.Edge([], "space", graph.Direction.Left));

let ssc_entry_node = new elements.InvisiblePlace("SSC Entry Node", []);
graph.makeEdge(c2_1, ssc_entry_node, new graph.Edge([], "space", Direction.Forward));

let ssc_staircase = new elements.Staircase("Senior School Staircase 1", 4, Direction.Right);
graph.makeEdge(ssc_entry_node, ssc_staircase.get_floor(1), new graph.Edge([], "bridge", Direction.Forward));

locations["IS201"] = new graph.Place("IS201", []);
graph.makeEdge(locations["IS201"], ssc_staircase.get_floor(2), new graph.Edge([], "corridor", Direction.Forward));
