define(["require", "exports", "./graph_operations", "./build", "./map", "./str_utils"], function (require, exports, graph_operations, build, map, str_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Testing!
    //graph_operations.path_finder takes in two Places and outputs a Route
    //gen_desc takes in a Route and output a String[] of directions.
    function focusMap(route, index) {
        let turns = graph_operations.gen_turns(route);
        let moveDescs = str_utils_1.gen_desc(route);
        moveDescs.push("You have arrived!");
        let edgePairs = graph_operations.edgePair(route);
        let floor;
        let startName = edgePairs[index][0].id.split(" ").join("_");
        let endName = edgePairs[index][1].id.split(" ").join("_");
        floor = Math.max(map.getFloor(endName), map.getFloor(startName));
        if (floor != -1 && (map.getFloor(startName) == -1 ||
            map.getFloor(endName) == -1 ||
            map.getFloor(startName) == map.getFloor(endName))) {
            map.showFloor(floor);
            console.log(`Floors are ${map.getFloor(startName)} and ${map.getFloor(endName)}`);
            console.log(`Focusing on ${startName} and ${endName}`);
            map.focusMap(startName, endName);
            let url;
            if (index == 0) {
            }
            else {
                let delta = turns[index];
                console.log(delta);
                switch (delta) {
                    case 0 /* Up */:
                        url = "";
                        break;
                    case 3 /* Left */:
                        url = "img/left.svg";
                        break;
                    case 1 /* Right */:
                        url = "img/right.svg";
                        break;
                    case 2 /* Down */:
                        url = "img/uturn.svg";
                        break;
                }
            }
            $("#arrow-img").attr("src", url);
        }
        else {
        }
        console.log(floor);
        document.getElementById("result-text").innerHTML = moveDescs[index];
    }
    function init() {
        $("#destination-select").css("display", "none");
        $("#map").css("display", "");
        $("#result-text").css("display", "none");
        $("#top").css("display", "none");
        let locations = build.locations; //A list of location strings
        let index = 0;
        let route = null;
        let locationData = [];
        for (let i = 0; i < Object.keys(locations).length; i++) {
            locationData.push({ id: i, text: Object.keys(locations)[i] });
        }
        $(`.selector`).select2({ data: locationData });
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
                map.drawEdge(pair[0].id.split(" ").join("_"), pair[1].id.split(" ").join("_"));
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
});
//# sourceMappingURL=app.js.map