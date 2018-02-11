///<reference path="jquery.d.ts"/>
import * as graph_operations from "./graph_operations";
import * as build from "./build";
import * as elements from "./elements";
import * as map from "./map";
import {Direction} from "./graph";
import {gen_desc} from "./str_utils";
import {genMapId} from "./map";

// Testing!

//graph_operations.path_finder takes in two Places and outputs a Route
//gen_desc takes in a Route and output a String[] of directions.


// focusMap updates the display based on an input Route and index within Route.moves
function focusMap(route: graph_operations.Route, index: number) {
    // Generate the raw data to be formatted using pre-existing functions
    let turns = graph_operations.gen_turns(route);
    let moveDescs = gen_desc(route);
    let edgePairs = graph_operations.edgePair(route);

    // Identify the map elements corresponding to the start and end Places for the Edge of the specified index within the Route
    let startName = genMapId(edgePairs[index][0]);
    let endName = genMapId(edgePairs[index][1]);

    // Identify the floor to be displayed based on the Edge's start and end Places
    let floor = Math.max(map.getFloor(endName),
        map.getFloor(startName)); // map.getFloor returns -1 if the result is inconclusive (i.e. for StairJunctions on Staircases spanning multiple floors). By taking the maximum, the target floor can be identified even if one Place is on multiple floors.

    // Verify that the floor has been identified correctly and that the results from map.getFloor are consistent
    map.showFloor(floor); // Load and display the SVG corresponding to the identified floor
    console.log(`Floors are ${map.getFloor(startName)} and ${map.getFloor(endName)}`);
    console.log(`Focusing on ${startName} and ${endName}`);
    map.focusMap(edgePairs[index][0], edgePairs[index][1]); // Pan and zoom the SVG map to focus on the desired Edge

    // Identify the icon to display any changes in Direction
    let url : string;
    let delta = turns[index];
    console.log(delta);
    switch (delta) {
        case Direction.Forward:
            url = "img/forward.svg";
            break;
        case Direction.Left:
            url = "img/left.svg";
            break;
        case Direction.Right:
            url = "img/right.svg";
            break;
        case Direction.Backwards:
            url = "img/uturn.svg";
            break;
        case Direction.Up:
            url = "img/stairs_up.svg";
            break;
        case Direction.Down:
            url= "img/stairs_down.svg";
            break;
    }
    // Display the identified icon in a HTML <img> tag
    $("#arrow-img").attr("src", url);

    // Write the corresponding message text to a HTML <div> tag
    document.getElementById("result-text").innerHTML = moveDescs[index];
}

function init() {
    $("#destination-select").css("display", "none");
    $("#map").css("display", "");
    $("#result-text").css("display", "none");
    $("#top").css("display", "none");

    let locations = build.locations; //A list of location strings

    let index = 0;
    let route: graph_operations.Route = null;

    let locationData = [];

    for (let i = 0; i < Object.keys(locations).length; i++) {
        locationData.push({id: i, text: Object.keys(locations)[i]});
    }

    $(`.selector`).select2({data: locationData});

    $("#id_start_location").on("change", () => {
        $("#destination-select").css("display", "block");
    });

    $("#id_end_location").on("change", () => {
        $("#map").css("display", "");
        $("#result-text").css("display", "");
        $("#top").css("display", "");

        let origin = $("#id_start_location").find("option:selected").text();
        let destination = $("#id_end_location").find("option:selected").text();

        route = graph_operations.path_finder(locations[origin], locations[destination]);

        $("#inp_form").css("display", "none");

        map.clearMap();

        console.log("Start");

        for (let pair of graph_operations.edgePair(route)) {
            console.log(pair[0].id, pair[1].id, map.getFloor(map.genMapId(pair[0])), map.getFloor(map.genMapId(pair[1])));
            if (pair[0].id === pair[1].id) {
                let stair_pair = pair as any as [elements.StairJunction, elements.StairJunction];
                map.drawEdge(map.genMapId(pair[0]) + stair_pair[0].floor, map.genMapId(stair_pair[1]) + stair_pair[1].floor);
            }
            else {
                map.drawEdge(map.genMapId(pair[0]), map.genMapId(pair[1]));
            }
        }

        index = 0;
        focusMap(route, index);
    });

    $("#previous_btn").on("click", prev);

    function prev() {
        index = Math.max(index - 1, 0);
        focusMap(route, index);
    }

    $("#next_btn").on("click", next);

    function next() {
        index = Math.min(index + 1, route.moves.length - 1);
        focusMap(route, index);
    }

    $("#back_btn").on("click", () => {
        map.showFloor(-1);
        $("#inp_form").css("display", "");
        $("#destination-select").css("display", "none");
        $("#map").css("display", "");
        $("#result-text").css("display", "none");
        $("#origin-select").css("display", "");
        $("#top").css("display", "none");
    });

    let swipeHammer = new Hammer($("#top")[0]);
    swipeHammer.on("swipeleft", ev => next());
    swipeHammer.on("swiperight", ev => prev());
}

init();