define(["require", "exports", "./graph_operations", "./build", "./map", "./str_utils", "./map"], function (require, exports, graph_operations, build, map, str_utils_1, map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Testing!
    //graph_operations.path_finder takes in two Places and outputs a Route
    //gen_desc takes in a Route and output a String[] of directions.
    // focusMap updates the display based on an input Route and index within Route.moves
    function focusMap(route, index) {
        // Generate the raw data to be formatted using pre-existing functions
        let turns = graph_operations.gen_turns(route);
        let moveDescs = str_utils_1.gen_desc(route);
        let edgePairs = graph_operations.edgePair(route);
        // Identify the map elements corresponding to the start and end Places for the Edge of the specified index within the Route
        let startName = map_1.genMapId(edgePairs[index][0]);
        let endName = map_1.genMapId(edgePairs[index][1]);
        // Identify the floor to be displayed based on the Edge's start and end Places
        let floor = Math.max(map.getFloor(endName), map.getFloor(startName)); // map.getFloor returns -1 if the result is inconclusive (i.e. for StairJunctions on Staircases spanning multiple floors). By taking the maximum, the target floor can be identified even if one Place is on multiple floors.
        // Verify that the floor has been identified correctly and that the results from map.getFloor are consistent
        if (floor != -1 && (map.getFloor(startName) == -1 ||
            map.getFloor(endName) == -1 ||
            map.getFloor(startName) == map.getFloor(endName))) {
            map.showFloor(floor); // Load and display the SVG corresponding to the identified floor
            console.log(`Floors are ${map.getFloor(startName)} and ${map.getFloor(endName)}`);
            console.log(`Focusing on ${startName} and ${endName}`);
            map.focusMap(startName, endName); // Pan and zoom the SVG map to focus on the desired Edge
            // Identify the icon to display any changes in Direction
            let url;
            let delta = turns[index];
            console.log(delta);
            switch (delta) {
                case 0 /* Forward */:
                    url = "img/forward.svg";
                    break;
                case 3 /* Left */:
                    url = "img/left.svg";
                    break;
                case 1 /* Right */:
                    url = "img/right.svg";
                    break;
                case 2 /* Backwards */:
                    url = "img/uturn.svg";
                    break;
                case 4 /* Up */:
                    url = "img/stair_up.svg";
                    break;
                case 5 /* Down */:
                    url = "img/stair_down.svg";
                    break;
            }
            // Display the identified icon in a HTML <img> tag
            $("#arrow-img").attr("src", url);
        }
        else {
        }
        console.log(floor);
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