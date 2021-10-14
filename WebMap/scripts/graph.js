import * as ui from "./ui.js";
import { get_filteredPubs, get_disease_names, get_airPolls_names, get_atmParams_names } from "./filter.js";
import { get_allPubs, get_tableGraph_screen, set_tableGraph_screen } from "./main.js";

let selectDiv;

let btns_container;

// Select div buttons
let disease_btn;
let airPoll_btn;
let atmParam_btn;
let btns = [];

let graphDiv;

let content = document.querySelector(".content");

// Total data to be pushed into "data" variable
let data_arr;
// First row of "data_arr"
let header_arr;

// Variables to be changed according to screen
let title;

let diseases_colors = [
    "rgb(30, 150, 255)",
    "rgb(60, 120, 255)",
    "rgb(90, 90, 255)",
    "rgb(120, 60, 255)",
    "rgb(150, 30, 255)"
];

let airPolls_colors = [
    "rgb(255, 19, 247)",
    "rgb(255, 38, 228)",
    "rgb(255, 57, 209)",
    "rgb(255, 76, 190)",
    "rgb(255, 95, 171)",
    "rgb(255, 114, 152)",
    "rgb(255, 133, 133)",
    "rgb(255, 152, 114)",
    "rgb(255, 171, 95)",
    "rgb(255, 190, 76)",
    "rgb(255, 209, 57)",
    "rgb(255, 228, 38)",
    "rgb(255, 247, 19)"
];

let atmParams_colors = [
    "rgb(200, 255, 50)",
    "rgb(150, 255, 50)",
    "rgb(100, 255, 50)",
    "rgb(50, 255, 50)",
    "rgb(50, 255, 100)",
    "rgb(50, 255, 150)",
    "rgb(50, 255, 200)"
];

let chart;

let categoryAxis;
let valueAxis;

let series_list;

// Load the Visualization API and the corechart package
google.charts.load('current', { 'packages': ['corechart'] });

// Opens the graph screen
function open() {
    if (selectDiv != null) {
        return;
    }
    if (graphDiv != null) {
        return;
    }

    // Create the select div
    create_selectDiv();
    set_graphBtns();
    set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    get_screen();

    // Create the graph div
    create_graphDiv();

    // Adding data to graph
    add_data();

    // The select handler. Call the chart's getSelection() method

    posSize();
}

// Create the graph div
function create_graphDiv() {
    am4core.useTheme(am4themes_animated);

    graphDiv = document.createElement("div");
    graphDiv.id = "graph";
    content.appendChild(graphDiv);

    chart = am4core.create(graphDiv, am4charts.XYChart);

    add_axes();

    chart.legend = new am4charts.Legend();

    title = chart.titles.create();
    title.marginBottom = 10;
}

// Refresh data when filter settings are changed
function refresh_data() {
    add_data();
}

// Adding data to the graph
function add_data() {
    // Set title
    title.text = get_title();

    data_arr = [];

    // Go through every publication in order to put every single
    // represented continent on the graph's x-axis
    for (let pub of get_allPubs()) {
        let _continent = pub.geo_location.continent;

        // Check if continent is already part of the graph's x-axis
        let already_added = false;
        for (let i = 0; i < data_arr.length; i++) {
            if (data_arr[i].continent == _continent) {
                already_added = true;
                break;
            }
        }

        // If the continent is not yet added
        if (already_added == false) {
            let new_item = { "continent": _continent };
            data_arr.push(new_item);
        }

    }

    // Fill the rest of the graph
    for (let item of data_arr) {
        fill_graph(item);
    }

    chart.data = data_arr;

    add_series();
}

// Add the y-axis data to each continent in graph
function fill_graph(current_item) {

    // Cycle through each filtered pubs' diseases
    for (let pub of get_filteredPubs()) {
        let _continent = pub.geo_location.continent;

        // If the currently selected continent matches the parameter
        if (_continent == current_item.continent) {
            // Fill data according to current screen
            switch (get_tableGraph_screen()) {
                case 0:
                    // Cycle through each disease in the pub
                    for (let disease of pub.diseases) {
                        switch (disease.name) {
                            case "Asthma":
                                if (current_item.asthma == undefined) {
                                    current_item.asthma = 1;
                                } else {
                                    current_item.asthma += 1;
                                }
                                break;
                            case "Diabetes Mellitus":
                                if (current_item.diabetes_mellitus == undefined) {
                                    current_item.diabetes_mellitus = 1;
                                } else {
                                    current_item.diabetes_mellitus += 1;
                                }
                                break;
                            case "COPD":
                                if (current_item.copd == null) {
                                    current_item.copd = 1;
                                } else {
                                    current_item.copd += 1;
                                }
                                break;
                            case "Respiratory Symptoms":
                                if (current_item.respiratory_symptoms == undefined) {
                                    current_item.respiratory_symptoms = 1;
                                } else {
                                    current_item.respiratory_symptoms += 1;
                                }
                                break;
                            case "Chronic Bronchitis":
                                if (current_item.chronic_bronchitis == undefined) {
                                    current_item.chronic_bronchitis = 1;
                                } else {
                                    current_item.chronic_bronchitis += 1;
                                }
                                break;
                        }
                    }
                    break;
                case 1:
                    for (let airPoll of pub.air_pollutants) {
                        switch (airPoll.pollutant) {
                            case "Sulfur dioxide":
                                if (current_item.sulfur_dioxide == undefined) {
                                    current_item.sulfur_dioxide = 1;
                                } else {
                                    current_item.sulfur_dioxide += 1;
                                }
                                break;
                            case "Carbon monoxide":
                                if (current_item.carbon_monoxide == undefined) {
                                    current_item.carbon_monoxide = 1;
                                } else {
                                    current_item.carbon_monoxide += 1;
                                }
                                break;
                            case "Ozone":
                                if (current_item.ozone == undefined) {
                                    current_item.ozone = 1;
                                } else {
                                    current_item.ozone += 1;
                                }
                                break;
                            case "Nitrogen dioxide":
                                if (current_item.nitrogen_dioxide == undefined) {
                                    current_item.nitrogen_dioxide = 1;
                                } else {
                                    current_item.nitrogen_dioxide += 1;
                                }
                                break;
                            case "Particulate Matter 10":
                                if (current_item.particulate_matter_10 == undefined) {
                                    current_item.particulate_matter_10 = 1;
                                } else {
                                    current_item.particulate_matter_10 += 1;
                                }
                                break;
                            case "Particulate Matter 2.5":
                                if (current_item.particulate_matter_25 == undefined) {
                                    current_item.particulate_matter_25 = 1;
                                } else {
                                    current_item.particulate_matter_25 += 1;
                                }
                                break;
                            case "Tobacco Smoke":
                                if (current_item.tobacco_smoke == undefined) {
                                    current_item.tobacco_smoke = 1;
                                } else {
                                    current_item.tobacco_smoke += 1;
                                }
                                break;
                            case "Car exhaust fumes":
                                if (current_item.car_exhaust_fumes == undefined) {
                                    current_item.car_exhaust_fumes = 1;
                                } else {
                                    current_item.car_exhaust_fumes += 1;
                                }
                                break;
                            case "Animal Dander":
                                if (current_item.animal_dander == undefined) {
                                    current_item.animal_dander = 1;
                                } else {
                                    current_item.animal_dander += 1;
                                }
                                break;
                            case "Elemental Carbon":
                                if (current_item.elemental_carbon == undefined) {
                                    current_item.elemental_carbon = 1;
                                } else {
                                    current_item.elemental_carbon += 1;
                                }
                                break;
                            case "Alternaria conidia":
                                if (current_item.alternaria_conidia == undefined) {
                                    current_item.alternaria_conidia = 1;
                                } else {
                                    current_item.alternaria_conidia += 1;
                                }
                                break;
                            case "Ultrafine particles":
                                if (current_item.ultrafine_particles == undefined) {
                                    current_item.ultrafine_particles = 1;
                                } else {
                                    current_item.ultrafine_particles += 1;
                                }
                                break;
                            case "Black Smoke":
                                if (current_item.black_smoke == undefined) {
                                    current_item.black_smoke = 1;
                                } else {
                                    current_item.black_smoke += 1;
                                }
                                break;
                        }
                    }
                    break;
                case 2:
                    for (let atmParam of pub.atm_parameters) {
                        switch (atmParam.primary) {
                            case "Temperature":
                                if (current_item.temperature == undefined) {
                                    current_item.temperature = 1;
                                } else {
                                    current_item.temperature += 1;
                                }
                                break;
                            case "Humidity":
                                if (current_item.humidity == undefined) {
                                    current_item.humidity = 1;
                                } else {
                                    current_item.humidity += 1;
                                }
                                break;
                            case "Wind":
                                if (current_item.wind == undefined) {
                                    current_item.wind = 1;
                                } else {
                                    current_item.wind += 1;
                                }
                                break;
                            case "Seasons":
                                if (current_item.seasons == undefined) {
                                    current_item.seasons = 1;
                                } else {
                                    current_item.seasons += 1;
                                }
                                break;
                            case "Thunderstorm":
                                if (current_item.thunderstorm == undefined) {
                                    current_item.thunderstorm = 1;
                                } else {
                                    current_item.thunderstorm += 1;
                                }
                                break;
                            case "Rainfall":
                                if (current_item.rainfall == undefined) {
                                    current_item.rainfall = 1;
                                } else {
                                    current_item.rainfall += 1;
                                }
                                break;
                            case "Seasonal Variation":
                                if (current_item.seasonal_variation == undefined) {
                                    current_item.seasonal_variation = 1;
                                } else {
                                    current_item.seasonal_variation += 1;
                                }
                                break;
                        }
                    }
                    break;
            }

        }
    }
}

// Axes
function add_axes() {
    // x-axis
    categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.title.text = "Continent";
    categoryAxis.dataFields.category = "continent";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.miniGridDistance = 30;

    // y-axis
    valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Number of publications";
}

// Adds a single series based on value, name, and color
function series(_valueY, _name, _color) {

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = _valueY;
    series.dataFields.categoryX = "continent";
    series.name = _name;
    series.clustered = true;
    series.columns.template.tooltipText = "Instances of " + _name + " in {categoryX}: [bold]{valueY}[/]";

    series.columns.template.fill = am4core.color(_color);
    series.columns.template.stroke = am4core.color("rgb(0,0,0)");
    series.columns.template.events.on("hit", function(ev) {
        selected(ev.target.dataItem.dataContext.continent, ev.target.dataItem.component.name);
    }, this);
    series.columns.template.width = am4core.percent(80);

    return series;
}

// Checks if series is already added first before adding to the list
function add_newSeries_to_list(_name) {
    let already_added = false;
    for (let series of series_list) {
        if (series == _name) {
            already_added = true;
            break;
        }
    }

    if (already_added == false) {
        series_list.push(_name);
    }
}

// Adds all of the series to the graph
// Dependent on current screen (pt1)
function add_series() {
    // Clears all of the series names from the list first
    series_list = [];

    // Disposes of series objects - removes from graph
    while (chart.series.length > 0) {
        chart.series.removeIndex(0).dispose();
    }

    for (let item of data_arr) {
        switch (get_tableGraph_screen()) {
            case 0:
                if (item.asthma != undefined) {
                    add_newSeries_to_list("asthma");
                }
                if (item.diabetes_mellitus != undefined) {
                    add_newSeries_to_list("diabetes_mellitus");
                }
                if (item.copd != undefined) {
                    add_newSeries_to_list("copd");
                }
                if (item.respiratory_symptoms != undefined) {
                    add_newSeries_to_list("respiratory_symptoms");
                }
                if (item.chronic_bronchitis != undefined) {
                    add_newSeries_to_list("chronic_bronchitis");
                }
                break;
            case 1:
                if (item.sulfur_dioxide != undefined) {
                    add_newSeries_to_list("sulfur_dioxide");
                }
                if (item.carbon_monoxide != undefined) {
                    add_newSeries_to_list("carbon_monoxide");
                }
                if (item.ozone != undefined) {
                    add_newSeries_to_list("ozone");
                }
                if (item.nitrogen_dioxide != undefined) {
                    add_newSeries_to_list("nitrogen_dioxide");
                }
                if (item.particulate_matter_10 != undefined) {
                    add_newSeries_to_list("particulate_matter_10");
                }
                if (item.particulate_matter_25 != undefined) {
                    add_newSeries_to_list("particulate_matter_25");
                }
                if (item.tobacco_smoke != undefined) {
                    add_newSeries_to_list("tobacco_smoke");
                }
                if (item.car_exhaust_fumes != undefined) {
                    add_newSeries_to_list("car_exhaust_fumes");
                }
                if (item.animal_dander != undefined) {
                    add_newSeries_to_list("animal_dander");
                }
                if (item.elemental_carbon != undefined) {
                    add_newSeries_to_list("elemental_carbon");
                }
                if (item.alternaria_conidia != undefined) {
                    add_newSeries_to_list("alternaria_conidia");
                }
                if (item.ultrafine_particles != undefined) {
                    add_newSeries_to_list("ultrafine_particles");
                }
                if (item.black_smoke != undefined) {
                    add_newSeries_to_list("black_smoke");
                }
                break;
            case 2:
                if (item.temperature != undefined) {
                    add_newSeries_to_list("temperature");
                }
                if (item.humidity != undefined) {
                    add_newSeries_to_list("humidity");
                }
                if (item.wind != undefined) {
                    add_newSeries_to_list("wind");
                }
                if (item.seasons != undefined) {
                    add_newSeries_to_list("seasons");
                }
                if (item.thunderstorm != undefined) {
                    add_newSeries_to_list("thunderstorm");
                }
                if (item.rainfall != undefined) {
                    add_newSeries_to_list("rainfall");
                }
                if (item.seasonal_variation != undefined) {
                    add_newSeries_to_list("seasonal_variation");
                }
                break;
        }
    }

    create_series_from_list();
}

// (pt2)
function create_series_from_list() {
    switch (get_tableGraph_screen()) {
        case 0:
            if (series_list.includes("asthma")) {
                let new_series = series("asthma", "Asthma", diseases_colors[0]);
            }
            if (series_list.includes("diabetes_mellitus")) {
                let new_series = series("diabetes_mellitus", "Diabetes Mellitus", diseases_colors[1]);
            }
            if (series_list.includes("copd")) {
                let new_series = series("copd", "COPD", diseases_colors[2]);
            }
            if (series_list.includes("respiratory_symptoms")) {
                let new_series = series("respiratory_symptoms", "Respiratory Symptoms", diseases_colors[3]);
            }
            if (series_list.includes("chronic_bronchitis")) {
                let new_series = series("chronic_bronchitis", "Chronic Bronchitis", diseases_colors[4]);
            }
            break;
        case 1:
            if (series_list.includes("sulfur_dioxide")) {
                let new_series = series("sulfur_dioxide", "Sulfur dioxide", airPolls_colors[0]);
            }
            if (series_list.includes("carbon_monoxide")) {
                let new_series = series("carbon_monoxide", "Carbon monoxide dioxide", airPolls_colors[1]);
            }
            if (series_list.includes("ozone")) {
                let new_series = series("ozone", "Ozone", airPolls_colors[2]);
            }
            if (series_list.includes("nitrogen_dioxide")) {
                let new_series = series("nitrogen_dioxide", "Nitrogen dioxide", airPolls_colors[3]);
            }
            if (series_list.includes("particulate_matter_10")) {
                let new_series = series("particulate_matter_10", "Particulate Matter 10", airPolls_colors[4]);
            }
            if (series_list.includes("particulate_matter_25")) {
                let new_series = series("particulate_matter_25", "Particulate Matter 2.5", airPolls_colors[5]);
            }
            if (series_list.includes("tobacco_smoke")) {
                let new_series = series("tobacco_smoke", "Tobacco Smoke", airPolls_colors[6]);
            }
            if (series_list.includes("car_exhaust_fumes")) {
                let new_series = series("car_exhaust_fumes", "Car exhaust fumes", airPolls_colors[7]);
            }
            if (series_list.includes("animal_dander")) {
                let new_series = series("animal_dander", "Animal Dander", airPolls_colors[8]);
            }
            if (series_list.includes("elemental_carbon")) {
                let new_series = series("elemental_carbon", "Elemental Carbon", airPolls_colors[9]);
            }
            if (series_list.includes("alternaria_conidia")) {
                let new_series = series("alternaria_conidia", "Alternaria conidia", airPolls_colors[10]);
            }
            if (series_list.includes("ultrafine_particles")) {
                let new_series = series("ultrafine_particles", "Ultrafine particles", airPolls_colors[11]);
            }
            if (series_list.includes("black_smoke")) {
                let new_series = series("black_smoke", "Black Smoke", airPolls_colors[12]);
            }
            break;
        case 2:
            if (series_list.includes("temperature")) {
                let new_series = series("temperature", "Temperature", atmParams_colors[0]);
            }
            if (series_list.includes("humidity")) {
                let new_series = series("humidity", "Humidity", atmParams_colors[1]);
            }
            if (series_list.includes("wind")) {
                let new_series = series("wind", "Wind", atmParams_colors[2]);
            }
            if (series_list.includes("seasons")) {
                let new_series = series("seasons", "Seasons", atmParams_colors[3]);
            }
            if (series_list.includes("thunderstorm")) {
                let new_series = series("thunderstorm", "Thunderstorm", atmParams_colors[4]);
            }
            if (series_list.includes("rainfall")) {
                let new_series = series("rainfall", "Rainfall", atmParams_colors[5]);
            }
            if (series_list.includes("seasonal_variation")) {
                let new_series = series("seasonal_variation", "Seasonal Variation", atmParams_colors[6]);
            }
            break;
    }
}

// The select handler. Call the chart's getSelection() method
function selected(_continent, _category) {
    let selected_continent = _continent;
    let selected_category = _category;

    let uids = get_uids_continentColumn(selected_continent, selected_category);

    if (uids.length > 1) {
        ui.open_results(uids);
    } else {
        ui.open_selected(uids[0]);
    }
}

// Used to open results window
function get_uids_continentColumn(_continent, _category) {
    let uids = [];

    for (let pub of get_filteredPubs()) {
        let continent = pub.geo_location.continent;
        let continent_match = false;

        if (continent == _continent) {
            continent_match = true;
        }

        let category_match = does_category_match(pub, _category);

        if (continent_match == true && category_match == true) {
            uids.push(pub.pub_uid);
        }
    }

    return uids;
}

function does_category_match(pub, _category) {
    switch (get_tableGraph_screen()) {
        case 0:
            for (let disease of pub.diseases) {
                if (disease.name == _category) {
                    return true;
                }
            }
            break;
        case 1:
            for (let airPoll of pub.air_pollutants) {
                if (airPoll.pollutant == _category) {
                    return true;
                }
            }
            break;
        case 2:
            for (let atmParam of pub.atm_parameters) {
                if (atmParam.primary == _category) {
                    return true;
                }
            }
            break;
    }
    return false;
}

// Graph screen functions
// Graph will change depending on the current screen
// (Diseases, air pollutants, atmParams)
function get_screen() {

}

// Function get title
function get_title() {
    let title = "";

    switch (get_tableGraph_screen()) {
        case 0:
            title = "[bold]Publications sorted by Diseases[/]";
            break;
        case 1:
            title = "[bold]Publications sorted by Air Pollutants[/]";
            break;
        case 2:
            title = "[bold]Publications sorted by Weather Parameters[/]";
            break;
    }

    return title;
}

// Creates the select div
function create_selectDiv() {
    btns = [];

    selectDiv = document.createElement("div");
    selectDiv.className = "graph-select";
    content.appendChild(selectDiv);

    // Button container
    btns_container = document.createElement("div");
    btns_container.className = "graphBtn-container";
    selectDiv.appendChild(btns_container);

    // Disease button creation
    disease_btn = document.createElement("button");
    disease_btn.className = "graph-btn";
    disease_btn.innerHTML = "Diseases";
    btns_container.appendChild(disease_btn);
    btns.push(disease_btn);

    // Air pollutants button creation
    airPoll_btn = document.createElement("button");
    airPoll_btn.className = "graph-btn";
    airPoll_btn.innerHTML = "Air Pollutants";
    btns_container.appendChild(airPoll_btn);
    btns.push(airPoll_btn);

    // Disease button creation
    atmParam_btn = document.createElement("button");
    atmParam_btn.className = "graph-btn";
    atmParam_btn.innerHTML = "Weather Parameters";
    btns_container.appendChild(atmParam_btn);
    btns.push(atmParam_btn);
}

// Sets the color of the currently selected button
function set_btnColor(screen, _bg, _color) {
    for (let btn of btns) {
        btn.style.backgroundColor = "";
        btn.style.color = "";
    }

    btns[screen].style.backgroundColor = _bg;
    btns[screen].style.color = _color;
}

// Set button functionality
function set_graphBtns() {
    disease_btn.onclick = function() {
        set_tableGraph_screen(0);
        get_screen();
        refresh_data();
        set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    }

    airPoll_btn.onclick = function() {
        set_tableGraph_screen(1);
        get_screen();
        refresh_data();
        set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    }

    atmParam_btn.onclick = function() {
        set_tableGraph_screen(2);
        get_screen();
        refresh_data();
        set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    }
}

// Sets position of graph and buttons to the center of the screen
function pos() {
    // Buttons left
    btns_container.style.left = (selectDiv.clientWidth / 2 - btns_container.clientWidth / 2).toString() + "px";
    // Buttons top
    btns_container.style.top = (selectDiv.clientHeight - btns_container.clientHeight - 10).toString() + "px";
}

// Changes the size of the graph, button text, and margins
// Dependant on screen width
function size() {
    let selectDiv_height;
    let margin;
    let fontSize;

    if (window.innerWidth > 920) {
        selectDiv_height = 80;
        fontSize = 18;
    } else {
        selectDiv_height = 60;
        fontSize = 12;
    }

    if (window.innerWidth > 920) {
        margin = 15;
    } else if (window.innerWidth <= 920 && window.innerWidth >= 575) {
        margin = 10;
    } else {
        margin = 5;
    }

    for (let btn of btns) {
        btn.style.marginLeft = margin + "px";
        btn.style.marginRight = margin + "px";
        btn.style.fontSize = fontSize + "px";
    }
    selectDiv.style.height = selectDiv_height + "px";

    graphDiv.style.height = (content.clientHeight - selectDiv.clientHeight - 100).toString() + "px";

    // Title and axes
    if (window.innerWidth > 920) {
        title.fontSize = 24;
        categoryAxis.title.fontSize = 18
        categoryAxis.renderer.labels.template.fontSize = 18;
        valueAxis.title.fontSize = 18
        valueAxis.renderer.labels.template.fontSize = 18;
    } else if (window.innerWidth <= 920 && window.innerWidth >= 575) {
        title.fontSize = 20;
        categoryAxis.title.fontSize = 16
        categoryAxis.renderer.labels.template.fontSize = 16;
        valueAxis.title.fontSize = 16
        valueAxis.renderer.labels.template.fontSize = 16;
    } else {
        title.fontSize = 14;
        categoryAxis.title.fontSize = 14
        categoryAxis.renderer.labels.template.fontSize = 14;
        valueAxis.title.fontSize = 14
        valueAxis.renderer.labels.template.fontSize = 14;
    }

    // Legend
    chart.legend.maxHeight = 100;
    chart.legend.scrollable = true;

    // Tooltip
    for (let series of chart.series) {
        series.tooltip.label.maxWidth = 170;
        series.tooltip.label.wrap = true;
    }

}

function posSize() {
    size();
    pos();
}

function close() {
    if (selectDiv == null) {
        return;
    }

    if (graphDiv == null) {
        return;
    }

    content.removeChild(selectDiv);
    selectDiv = null;
    content.removeChild(graphDiv);
    graphDiv = null;
}

// Used in closing the results window
function getChart() {
    if (chart == null) {
        return;
    }

    return chart;
}

export { open, close, refresh_data, posSize, getChart };