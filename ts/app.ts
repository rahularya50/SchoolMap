///<reference path="jquery.d.ts"/>
import * as graph_operations from "./graph_operations";
import * as build from "./build";
import * as map from "./map";

// Testing!

//graph_operations.path_finder takes in two Places and outputs a Route
//gen_desc takes in a Route and output a String[] of directions.


function focusMap(edgePairs: [string, string][], moveDescs, index: number) {
    map.focusMap(
        edgePairs[index][0].split(" ").join("_"),
        edgePairs[index][1].split(" ").join("_"),
        $("#main").height() / $("#main").width()
    );
    document.getElementById("result").innerHTML = moveDescs[index];
}

function init() {
    $("#destination-select").css("display", "none");
    $("#map").css("display", "");
    $("#result").css("display", "none");

    let locations = build.locations; //A list of location strings

    let index = 0;
    let edgePairs: [string, string][] = null;

    let locationData = [];
    let moveDescs : string[] = null;

    for (let i = 0; i < Object.keys(locations).length; i++) {
        locationData.push({ id: i, text: Object.keys(locations)[i] });
    }

    $(`.selector`).select2({ data: locationData });

    $("#id_start_location").on("change", () => {
        $("#destination-select").css("display", "block");
    });

    $("#id_end_location").on("change", () => {
        $("#map").css("display", "");
        $("#result").css("display", "");

        let origin = $("#id_start_location").find("option:selected").text();
        let destination = $("#id_end_location").find("option:selected").text();

        let route = graph_operations.path_finder(locations[origin], locations[destination]);
        moveDescs = graph_operations.gen_desc(route);

        $("#inp_form").css("display", "none");

        map.clearMap();

        console.log("Start");

        edgePairs = graph_operations.edgePair(route);

        for (let pair of edgePairs) {
            console.log(pair);
            map.drawEdge(pair[0].split(" ").join("_"), pair[1].split(" ").join("_"));
        }

        index = 0;
        focusMap(edgePairs, moveDescs, index);
    });

    $("#previous_btn").on("click", () => {
        index = Math.max(index - 1, 0);
        focusMap(edgePairs, moveDescs, index);
    });

    $("#next_btn").on("click", () => {
        index = Math.min(index + 1, edgePairs.length - 1);
        focusMap(edgePairs, moveDescs, index);
    });

}

init();