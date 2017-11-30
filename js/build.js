define(["require", "exports", "./graph", "./elements"], function (require, exports, graph, elements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.locations = {};
    let staircases = {};
    let corridors = [];
    let link_block = [["L02", "AC1", "AC2", "AS1", "AS2"],
        ["ICT4", "ICT Training", "ICT1", "AS4", "AS5"],
        ["EN201", "EN202", "EN203", "English Office", "EN204", "EN205", "EN206"],
        ["EN301", "EN302", "EN303", "EN304", "EN305", "EN306", "EN307", "EN308"],
        ["MA401", "MA402", "MA403", "MA404", "MA405", "MA406", "MA407"],
        ["MA501", "MA502", "MA503", "Maths Office", "MA504", "MA505", "MA506"]];
    for (let i = 0; i < 6; i++) {
        corridors.push(new elements.Corridor(link_block[i], exports.locations, 1 /* Right */));
    }
    exports.locations["ICT Intersection 1"] = new graph.Place("the intersection", [corridors[1]], "place", "ICT Intersection 1");
    corridors[1].places.splice(2, 0, exports.locations["ICT Intersection 1"]);
    exports.locations["ICT Intersection 2"] = new graph.Place("the intersection", [], "place", "ICT Intersection 2");
    graph.makeEdge(exports.locations["ICT Intersection 1"], exports.locations["ICT Intersection 2"], new graph.Edge([], "corridor", 4 /* Up */));
    exports.locations["ICT2"] = new graph.Place("ICT2", []);
    exports.locations["ICT3"] = new graph.Place("ICT3", []);
    let ict_parallel_corridor = new graph.Edge([exports.locations["ICT2"], exports.locations["ICT Intersection 2"], exports.locations["ICT3"]], "corridor", 3 /* Left */);
    exports.locations["ICT2"].add_edge(ict_parallel_corridor);
    exports.locations["ICT Intersection 2"].add_edge(ict_parallel_corridor);
    exports.locations["ICT3"].add_edge(ict_parallel_corridor);
    exports.locations["Link Block Intersection Upper"] = new graph.Place("the intersection", [corridors[1]], "place", "Link Block Intersection Upper");
    corridors[1].places.splice(5, 0, exports.locations["Link Block Intersection Upper"]);
    exports.locations["Link Block Intersection Lower"] = new graph.Place("the intersection", [corridors[0]], "place", "Link Block Intersection Lower");
    corridors[0].places.push(exports.locations["Link Block Intersection Lower"]);
    let s1 = new elements.Staircase("Link Block Staircase 1", 7, 4 /* Up */);
    let s2 = new elements.Staircase("Link Block Staircase 2", 7, 4 /* Up */); //TODO: Add AS3 + Terrace
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
        ["Science Block Garden"]]; // TODO: Add ME1/2 + Science Office routing
    for (let i = 1; i < 7; i++) {
        corridors.push(new elements.Corridor(science_block[i], exports.locations, 1 /* Right */));
        graph.makeEdge(new elements.InvisiblePlace("Science Block Intersection " + i, []), null, corridors[i - 1]);
    }
    let science_passthrough_intersection = new elements.InvisiblePlace("Science Block Passthrough Intersection", []);
    exports.locations["Sci-New Block Passthrough"] = new graph.Place("Sci-New Block Passthrough", []);
    graph.makeEdge(science_passthrough_intersection, corridors[1].places[0], new elements.Corridor([], exports.locations, 0 /* Forward */));
    graph.makeEdge(exports.locations["Sci-New Block Passthrough"], science_passthrough_intersection, new elements.Corridor([], exports.locations, 0 /* Forward */));
    s1 = new elements.Staircase("Science Block Staircase 1", 7, 3 /* Left */);
    s2 = new elements.Staircase("Science Block Staircase 2", 7, 1 /* Right */);
    exports.locations["GLT"] = new graph.Place("GLT", []);
    graph.makeEdge(exports.locations["GLT"], s2.places[0], new graph.Edge([], "open space", 1 /* Right */));
    staircases["Science Block 1"] = s1;
    staircases["Science Block 2"] = s2;
    for (let i = 1; i < 7; i++) {
        graph.makeEdge(s1.places[i], s2.places[i], corridors[i - 1]);
    }
    // graph.makeEdge(null, s2.places[0], locations["GLT"].edges[0]);  TODO: What even is this?
    // Make the Language Block! TODO: Add Language Block extension + second staircase
    corridors = [];
    let language_block = [["the ICT Helpdesk", "W1", "W2"],
        ["G1", "G2", "F1"],
        ["the Language Office", "LA201", "LA202", "LA203", "LA204"],
        ["LA301", "LA302", "LA303", "LA304", "LA305", "LA306"]];
    for (let i = 0; i < 4; i++) {
        corridors.push(new elements.Corridor(language_block[i], exports.locations, 4 /* Up */));
    }
    s1 = new elements.Staircase("Language Block Staircase 1", 4, 3 /* Left */);
    staircases["Language Block 1"] = s1;
    for (let i = 0; i < 4; i++) {
        graph.makeEdge(s1.places[i], null, corridors[i]);
    }
    // Link the Language Block with the Link Block and Science Block!
    for (let i = 0; i < 4; i++) {
        graph.makeEdge(null, new elements.InvisiblePlace("Language Block Link Node " + i, []), corridors[i]);
        graph.makeEdge(corridors[i].places[corridors[i].places.length - 1], (staircases["Link Block 1"]).places[i], new graph.Edge([], "bridge", 1 /* Right */));
    }
    graph.makeEdge(exports.locations["Sci-New Block Passthrough"], null, corridors[3]);
    // Make the Peel Block!
    let corridors_1 = [];
    let corridors_2 = [];
    let corridors_3 = [];
    let peel_block = [[["LPS", "Middle School Office", "PTSA Shop"], ["Staffroom", "Foyer", "Offices and SLT", "Board Room"], ["Careers Office", "SSC 5", "SSC 4", "SSC 3"]],
        [["Reading Center"], ["LRC Middle School Section", "LRC Canteen", "LRC Senior School Section"], ["Senior School Office", "SSC 2", "SSC 1"]]];
    corridors_1.push(new elements.Corridor(peel_block[0][0], exports.locations, 5 /* Down */));
    corridors_1.push(new elements.Corridor(peel_block[1][0], exports.locations, 5 /* Down */));
    corridors_2.push(new elements.Corridor(peel_block[0][1], exports.locations, 1 /* Right */));
    corridors_2.push(new elements.Corridor(peel_block[1][1], exports.locations, 1 /* Right */));
    corridors_3.push(new elements.Corridor(peel_block[0][2], exports.locations, 4 /* Up */));
    corridors_3.push(new elements.Corridor(peel_block[1][2], exports.locations, 4 /* Up */));
    let s1_0 = new elements.StairJunction(0, [corridors_2[0]], "Peel Block Staircase 1");
    let s1_1 = new elements.StairJunction(1, [corridors_1[1]], "Peel Block Staircase 1");
    let s2_0 = new elements.StairJunction(0, [corridors_2[0]], "Peel Block Staircase 2");
    let s2_1 = new elements.StairJunction(1, [corridors_3[1]], "Peel Block Staircase 2");
    s1 = new graph.Edge([s1_0, s1_1], "Peel Block Staircase 1", 4 /* Up */, "Staircase");
    s2 = new graph.Edge([exports.locations["Foyer"], exports.locations["LRC Canteen"]], "Foyer Staircase", 1 /* Right */, "Staircase");
    let s3 = new graph.Edge([s2_0, s2_1], "Peel Block Staircase 2", 1 /* Right */, "Staircase");
    s1_0.add_edge(s1);
    s1_1.add_edge(s1);
    exports.locations["S10"] = s1_0;
    exports.locations["S11"] = s1_1;
    exports.locations["Foyer"].add_edge(s2);
    exports.locations["LRC Canteen"].add_edge(s2);
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
    let peel_block_passage_1 = new elements.Corridor([], exports.locations, 1 /* Right */);
    let peel_end_node_lower = new elements.InvisiblePlace("Peel Block Link Node Lower", [peel_block_passage_1]);
    let d_1 = new elements.InvisiblePlace("Peel Block Corner Node D1", [peel_block_passage_1]);
    let d_2 = new elements.InvisiblePlace("Peel Block Corner Node D2", [peel_block_passage_1]);
    let d_3 = new elements.InvisiblePlace("Peel Block Corner Node D3", []);
    peel_block_passage_1.places = [d_1, peel_end_node_lower, d_2];
    graph.makeEdge(d_2, null, corridors_1[0]);
    graph.makeEdge(d_3, null, corridors_2[0]);
    let peel_block_ext_corridor_1 = new graph.Edge([d_1, d_3], "corridor", 5 /* Down */);
    graph.makeEdge(d_1, d_3, peel_block_ext_corridor_1);
    let c0 = new elements.InvisiblePlace("Peel Block Corner Node 0", [corridors_1[1]]);
    exports.locations["Peel Block Corner Node 0"] = c0;
    corridors_1[1].places.splice(0, 0, c0);
    let peel_wing_edge_1 = new graph.Edge([], "corridor", 1 /* Right */);
    exports.locations["Media Center"] = new graph.Place("Media Center", []);
    graph.makeEdge(peel_end_node_upper, c0, peel_wing_edge_1);
    graph.makeEdge(exports.locations["Media Center"], null, peel_wing_edge_1);
    graph.makeEdge(exports.locations["Link Block Intersection Upper"], peel_end_node_upper, new graph.Edge([], "bridge", 5 /* Down */));
    let peel_block_link = new graph.Edge([], "path", 5 /* Down */);
    let peel_link_center = new elements.InvisiblePlace("Peel Link Center", []);
    graph.makeEdge(exports.locations["Link Block Intersection Lower"], peel_link_center, peel_block_link);
    graph.makeEdge(null, peel_end_node_lower, peel_block_link);
    exports.locations["Hall"] = new graph.Place("Hall", []);
    graph.makeEdge(exports.locations["Foyer"], exports.locations["Hall"], new graph.Edge([], "passage", 4 /* Up */));
    // Add the Piazza!
    graph.makeEdge(d_3, exports.locations["GLT"], new graph.Edge([], "passage", 3 /* Left */));
    graph.makeEdge(c1_0, staircases["Science Block 2"].places[0], new graph.Edge([], "passage", 3 /* Left */));
    let piazza = new graph.Place("Piazza", []);
    exports.locations["Piazza"] = piazza;
    let piazza_tl = new elements.InvisiblePlace("Piazza TL", []);
    let piazza_tr = new elements.InvisiblePlace("Piazza TR", []);
    let piazza_br = new elements.InvisiblePlace("Piazza BR", []);
    let piazza_bl = new elements.InvisiblePlace("Piazza BL", []);
    graph.makeEdge(new elements.InvisiblePlace("Language Block End Node", []), null, exports.locations["the ICT Helpdesk"].edges[0]);
    graph.makeEdge(exports.locations["the ICT Helpdesk"].edges[0].places[0], piazza_bl, new graph.Edge([], "path", 1 /* Right */));
    graph.makeEdge(piazza_br, exports.locations["GLT"], new graph.Edge([], "space", 5 /* Down */));
    graph.makeEdge(piazza_br, d_3, new graph.Edge([], "space", 1 /* Right */));
    graph.makeEdge(piazza_br, staircases["Science Block 2"][0], new graph.Edge([], "path", 4 /* Up */));
    graph.makeEdge(piazza_tr, peel_link_center, new graph.Edge([], "path", 1 /* Right */));
    graph.makeEdge(piazza_tl, staircases["Link Block 1"][0], new graph.Edge([], "path", 4 /* Up */));
    graph.makeEdge(piazza_bl, piazza_br, new graph.Edge([], "piazza", 1 /* Right */));
    graph.makeEdge(piazza_bl, piazza_tl, new graph.Edge([], "piazza", 4 /* Up */));
    graph.makeEdge(piazza_bl, piazza_tr, new graph.Edge([], "piazza", 1 /* Right */));
    graph.makeEdge(piazza_br, piazza_tl, new graph.Edge([], "piazza", 3 /* Left */));
    graph.makeEdge(piazza_br, piazza_tr, new graph.Edge([], "piazza", 4 /* Up */));
    graph.makeEdge(piazza_tl, piazza_tr, new graph.Edge([], "piazza", 1 /* Right */));
    // Add the PE Rooms!
    let pe_intersection_bl = new elements.InvisiblePlace("PE Intersection BL", []);
    let pe_intersection_br = new elements.InvisiblePlace("PE Intersection BR", []);
    exports.locations["Swimming Pool"] = new graph.Place("Swimming Pool", []);
    exports.locations["Canteen"] = new graph.Place("Canteen", []);
    exports.locations["PE1"] = new graph.Place("PE1", []);
    exports.locations["PE2"] = new graph.Place("PE2", []);
    exports.locations["PE3"] = new graph.Place("PE3", []);
    let pe_path_1 = new graph.Edge([], "path", 4 /* Up */);
    graph.makeEdge(exports.locations["PE3"], exports.locations["PE2"], pe_path_1);
    graph.makeEdge(pe_intersection_bl, null, pe_path_1);
    let pe_path_2 = new graph.Edge([], "path", 5 /* Down */);
    graph.makeEdge(exports.locations["PE1"], pe_intersection_br, pe_path_2);
    // Add the poolside area!
    let pool_corridor = new graph.Edge([], "path", 1 /* Right */);
    graph.makeEdge(exports.locations["Canteen"], null, pool_corridor);
    graph.makeEdge(exports.locations["Swimming Pool"], null, pool_corridor);
    graph.makeEdge(pe_intersection_br, null, pool_corridor);
    graph.makeEdge(pe_intersection_bl, null, pool_corridor);
    graph.makeEdge(peel_link_center, null, pool_corridor);
    let peel_end_node = new elements.InvisiblePlace("Peel Block End Node", []);
    let peel_canteen_transfer = new elements.InvisiblePlace("Peel Canteen Transfer", []);
    let peel_back_corridor = new elements.Corridor(["Boys Toilets", "Girls Toilets"], exports.locations, 1 /* Right */);
    graph.makeEdge(d_2, peel_canteen_transfer, peel_back_corridor);
    graph.makeEdge(null, peel_end_node, peel_back_corridor);
    graph.makeEdge(null, peel_end_node, corridors_3[0]);
    graph.makeEdge(peel_canteen_transfer, exports.locations["Canteen"], new graph.Edge([], "space", 4 /* Up */));
});
//# sourceMappingURL=build.js.map