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
        let force_real = !(startName == endName);
        let floor = Math.max(map.getFloor(endName, force_real), map.getFloor(startName, force_real)); // map.getFloor returns -1 if the result is inconclusive (i.e. for StairJunctions on Staircases spanning multiple floors). By taking the maximum, the target floor can be identified even if one Place is on multiple floors.
        // Verify that the floor has been identified correctly and that the results from map.getFloor are consistent
        map.showFloor(floor); // Load and display the SVG corresponding to the identified floor
        console.log(`Floors are ${map.getFloor(startName)} and ${map.getFloor(endName)}`);
        console.log(`Focusing on ${startName} and ${endName}`);
        map.focusMap(edgePairs[index][0], edgePairs[index][1], force_real); // Pan and zoom the SVG map to focus on the desired Edge
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
                url = "img/stairs_up.svg";
                break;
            case 5 /* Down */:
                url = "img/stairs_down.svg";
                break;
        }
        // Display the identified icon in a HTML <img> tag
        $("#arrow-img").attr("src", url);
        // Write the corresponding message text to a HTML <div> tag
        document.getElementById("result-text").innerHTML = moveDescs[index];
    }
    function init() {
        $("#destination-select").css("display", "none");
        $("#result-text").css("display", "none");
        $("#top").css("display", "none");
        $("#bottom").css("display", "none");
        let locations = build.locations; //A list of location strings
        let index = 0;
        let route = null;
        let locationData = [];
        let keys = Object.keys(locations);
        for (let i = 0; i < keys.length; i++) {
            if (map.getFloor(map.genMapId(locations[keys[i]])) !== -1) {
                locationData.push({ id: i, text: keys[i] });
            }
        }
        $(`.selector`).select2({ data: locationData });
        let params = new URLSearchParams(location.search.slice(1));
        if (params.get('origin')) {
            $(`#id_start_location`).val(keys.indexOf(params.get('origin'))).trigger("change");
            $("#destination-select").css("display", "block");
        }
        $("#id_start_location").on("select2:close", () => {
            $("#destination-select").css("display", "block");
        });
        function start(origin = null, destination = null) {
            $("#result-text").css("display", "");
            $("#top").css("display", "");
            $("#bottom").css("display", "");
            console.log(`Routing from ${origin} to ${destination}`);
            if (!origin) {
                origin = $("#id_start_location").find("option:selected").text();
                destination = $("#id_end_location").find("option:selected").text();
            }
            route = graph_operations.path_finder(locations[origin], locations[destination]);
            let prev = route.origin;
            for (let move of route.moves) {
                console.log("Move ", prev.id, move.place.id, move.edge.dist_between(prev, move.place));
                prev = move.place;
            }
            console.log("Move Total distance: " + route.distance);
            console.log("Move ");
            $("#inp_form").css("display", "none");
            $("#suggestions").css("display", "none");
            $("#main").css("pointer-events", "all");
            map.clearMap();
            console.log("Start");
            for (let pair of graph_operations.edgePair(route)) {
                console.log(pair[0].id, pair[1].id, map.getFloor(map.genMapId(pair[0])), map.getFloor(map.genMapId(pair[1])));
                if (pair[0].id === pair[1].id) {
                    let stair_pair = pair;
                    map.drawEdge(map.genMapId(pair[0]) + stair_pair[0].floor, map.genMapId(stair_pair[1]) + stair_pair[1].floor, false);
                }
                else {
                    map.drawEdge(map.genMapId(pair[0]), map.genMapId(pair[1]), true);
                }
            }
            index = 0;
            focusMap(route, index);
        }
        $("#id_end_location").on("select2:close", () => {
            start();
        });
        $(".suggestion").on("click", (event) => {
            console.log("suggestion selected", event.target);
            start($(event.currentTarget).data("origin"), $(event.currentTarget).data("destination"));
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
            $("#suggestions").css("display", "");
            $("#destination-select").css("display", "none");
            $("#result-text").css("display", "none");
            $("#origin-select").css("display", "");
            $("#top").css("display", "none");
            $("#bottom").css("display", "none");
            $("#main").css("pointer-events", "none");
        });
        let swipeHammer = new Hammer($("#top")[0]);
        swipeHammer.on("swipeleft", ev => next());
        swipeHammer.on("swiperight", ev => prev());
    }
    // Initializing SVGs after page load
    window.onload = () => {
        map.initialize_svgs();
        init();
    };
});
//# sourceMappingURL=app.js.map