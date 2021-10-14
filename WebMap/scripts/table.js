import { get_filteredPubs } from "./filter.js";
import * as ui from "./ui.js";
import { get_tableGraph_screen, set_tableGraph_screen } from "./main.js";

let selectDiv;

let btns_container;

let disease_btn;
let airPoll_btn;
let atmParam_btn;
let btns = [];

// Select div checkboxes
let instructions
let check_container;

let all_checkbox;
let all_label;
let all_checked;

let checkboxes = [];
let checkbox_names = ['ID', 'Publication', 'Location', 'City', 'Country', 'Continent'];

let column_values;

let tableDiv;

let data;
let options;
let chart;

// Used to open "selected" window
let row_uids;

let content = document.querySelector(".content");

// Load the Visualization API and the corechart package
google.charts.load('current', { 'packages': ['table'] });

function open() {
    if (selectDiv != null) {
        return;
    }
    if (tableDiv != null) {
        return;
    }

    if (all_checked == null) {
        all_checked = true;
    }

    // Set initial column values
    if (column_values == null) {
        column_values = [true, true, true, true, true, true];
    }

    // Create the select div
    create_selectDiv();
    create_checkboxes();
    set_checkbox_values();
    checkbox_func();

    set_tableBtns();
    set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");

    // Create the table div
    create_tableDiv();

    // Adding data to table
    add_data();

    // Selection
    // Opens "selected" window
    function selectHandler() {
        let selection = chart.getSelection();
        for (var i = 0; i < selection.length; i++) {
            ui.open_selected(row_uids[selection[i].row]);
        }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);

    posSize();
}

// Create the table div
function create_tableDiv() {
    tableDiv = document.createElement("div");
    tableDiv.id = "table";
    content.appendChild(tableDiv);

    // Sets up chart
    chart = new google.visualization.Table(tableDiv);
    options = {}
}

// Refresh data when filter settings are changed
function refresh_data() {
    chart.clearChart();
    add_data();
    posSize();
}

// Add data to the table
function add_data() {
    columns();
    rows();
}

// Add columns (top row)
// Number of columns depend on checkbox values
function columns() {
    data = new google.visualization.DataTable();

    if (checkboxes[0].checked == true) {
        data.addColumn('number', 'ID');
    }

    if (checkboxes[1].checked == true) {
        data.addColumn('string', 'Publication');
    }

    if (checkboxes[2].checked == true) {
        data.addColumn('string', 'Location');
    }

    if (checkboxes[3].checked == true) {
        data.addColumn('string', 'City');
    }

    if (checkboxes[4].checked == true) {
        data.addColumn('string', 'Country');
    }

    if (checkboxes[5].checked == true) {
        data.addColumn('string', 'Continent');
    }

    screen_columns();
}

// Add rows
function rows() {
    row_uids = [];

    for (let pub of get_filteredPubs()) {
        let row = [];

        // ID
        if (checkboxes[0].checked == true) {
            row.push(pub.pub_uid);
        }

        // Title
        if (checkboxes[1].checked == true) {
            row.push(pub.publication.title);
        }

        // Location
        if (checkboxes[2].checked == true) {
            row.push(pub.geo_location.location_in_pub);
        }

        // City
        if (checkboxes[3].checked == true) {
            row.push(pub.geo_location.city);
        }

        // Country
        if (checkboxes[4].checked == true) {
            row.push(pub.geo_location.country);
        }

        // Continent
        if (checkboxes[5].checked == true) {
            row.push(pub.geo_location.continent);
        }

        if (screen_rows(row, pub) == true) {
            // Push id in "row_uids"
            row_uids.push(pub.pub_uid);
            data.addRow(row);
        }
    }
}

// Table screen functions
// Table will change depending on the current screen
// (Diseases, air pollutants, atmParams)
function screen_columns() {
    switch (get_tableGraph_screen()) {
        case 0:
            data.addColumn('string', 'Diseases');
            break;
        case 1:
            data.addColumn('string', 'Air Pollutants');
            break;
        case 2:
            data.addColumn('string', 'Weather Parameters');
            break;
    }
}

function screen_rows(row, pub) {
    let cell_str = "";
    switch (get_tableGraph_screen()) {
        case 0:
            if (pub.diseases.length == 0) {
                return false;
            }

            for (let i = 0; i < pub.diseases.length; i++) {
                if (i != 0) {
                    cell_str += ", ";
                }
                cell_str += pub.diseases[i].name;
            }
            break;
        case 1:
            if (pub.air_pollutants.length == 0) {
                return false;
            }

            for (let i = 0; i < pub.air_pollutants.length; i++) {
                if (i != 0) {
                    cell_str += ", ";
                }
                cell_str += pub.air_pollutants[i].pollutant;
                cell_str += " -- ";
                cell_str += pub.air_pollutants[i].abbrev;
            }
            break;
        case 2:
            if (pub.atm_parameters.length == 0) {
                return false;
            }

            for (let i = 0; i < pub.atm_parameters.length; i++) {
                if (i != 0) {
                    cell_str += ", ";
                }
                cell_str += pub.atm_parameters[i].secondary;
            }
            break;
    }
    row.push(cell_str);
    return true;
}

// Creates the select div
function create_selectDiv() {
    btns = [];

    selectDiv = document.createElement("div");
    selectDiv.className = "table-select";
    content.appendChild(selectDiv);

    // Button container
    btns_container = document.createElement("div");
    btns_container.className = "tableBtn-container";
    selectDiv.appendChild(btns_container);

    // Disease button creation
    disease_btn = document.createElement("button");
    disease_btn.className = "table-btn";
    disease_btn.innerHTML = "Diseases";
    btns_container.appendChild(disease_btn);
    btns.push(disease_btn);

    // Air pollutants button creation
    airPoll_btn = document.createElement("button");
    airPoll_btn.className = "table-btn";
    airPoll_btn.innerHTML = "Air Pollutants";
    btns_container.appendChild(airPoll_btn);
    btns.push(airPoll_btn);

    // Disease button creation
    atmParam_btn = document.createElement("button");
    atmParam_btn.className = "table-btn";
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

// Create selectDiv checkboxes
function create_checkboxes() {
    if (selectDiv == null) {
        return;
    }

    // Instructions
    instructions = document.createElement('p');
    instructions.innerHTML = "Select which columns to show or hide:";
    selectDiv.appendChild(instructions);

    // Checkbox container
    check_container = document.createElement("div");
    check_container.className = "checkbox-container";
    selectDiv.appendChild(check_container);

    // All
    all_checkbox = document.createElement("input");
    all_checkbox.setAttribute("type", "checkbox");
    check_container.appendChild(all_checkbox);
    all_checkbox.checked = all_checked;

    all_label = document.createElement("label");
    all_label.setAttribute("for", all_checkbox);
    check_container.appendChild(all_label);

    // Add the rest of the checkboxes
    for (let i = 0; i < checkbox_names.length; i++) {
        check_container.appendChild(check_and_label(checkboxes[i], checkbox_names[i], i));
    }

    all_input_check(all_checkbox.checked);
    every_input_check(all_checkbox.checked);
}

// Container for individual checkbox and label
function check_and_label(checkbox, name, index) {
    let singleCheck_container = document.createElement("div");
    singleCheck_container.className = "singleCheck-container";

    checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    singleCheck_container.appendChild(checkbox);

    let label = document.createElement("label");
    label.innerHTML = name;
    label.setAttribute("for", checkbox);
    singleCheck_container.appendChild(label);

    // Add checkbox to array
    checkboxes.push(checkbox);

    return singleCheck_container;
}

// The following functions are similar to the checkbox functions
// in filter.js
// Here, there is only one group of checkboxes to sift through,
// instead of multiple groups
function all_input_check(value) {
    if (value == true) {
        all_label.innerHTML = "Deselect all";
    } else {
        all_label.innerHTML = "Select all";
    }
}

function every_input_check(value) {
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = value;
    }
}

function is_every_input_true() {
    let every_true = true;
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == false) {
            every_true = false;
            break;
        }
    }

    if (every_true == true) {
        all_checkbox.checked = true;
    } else {
        all_checkbox.checked = false;
    }
    all_input_check(all_checkbox.checked);
}

function checkbox_func() {
    // "Select all" checkbox
    all_checkbox.onchange = function() {
        all_input_check(all_checkbox.checked);
        every_input_check(all_checkbox.checked);
        refresh_data();
    }

    // Every checkbox in body
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onchange = function() {
            is_every_input_true();
            refresh_data();
        }
    }
}

// Used when table is opened
function set_checkbox_values() {
    // Go through each checkbox (minus "All")
    // If the corresponding item in "column_values" is true/false
    // then check/uncheck the checkbox
    for (let i = 0; i < checkboxes.length; i++) {
        if (column_values[i] == true) {
            checkboxes[i].checked = true;
        } else {
            checkboxes[i].checked = false;
        }
    }
}

function save_checkbox_values() {
    // Go through each checkbox (minus "All")
    // Save column values according to the value of the corresponding checkbox
    for (let i = 0; i < checkboxes.length; i++) {
        column_values[i] = checkboxes[i].checked;
    }
}

// Set button functionality
function set_tableBtns() {
    disease_btn.onclick = function() {
        set_tableGraph_screen(0);
        refresh_data();
        set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    }

    airPoll_btn.onclick = function() {
        set_tableGraph_screen(1);
        refresh_data();
        set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    }

    atmParam_btn.onclick = function() {
        set_tableGraph_screen(2);
        refresh_data();
        set_btnColor(get_tableGraph_screen(), "rgb(0, 78, 167)", "rgb(255, 200, 82)");
    }
}

// Sets position of table and buttons to the center of the screen
function pos() {
    // Buttons left
    btns_container.style.left = (selectDiv.clientWidth / 2 - btns_container.clientWidth / 2).toString() + "px";
    // Instructions left
    instructions.style.left = (selectDiv.clientWidth / 2 - instructions.clientWidth / 2).toString() + "px";
    // Checkboxes left
    check_container.style.left = (selectDiv.clientWidth / 2 - check_container.clientWidth / 2).toString() + "px";

    let _gap = 0;
    if (window.innerWidth > 920) {
        _gap = 40;
    } else {
        _gap = 80;
    }

    // Buttons top
    btns_container.style.top = (selectDiv.clientHeight - btns_container.clientHeight - _gap - check_container.clientHeight).toString() + "px";
    // Instructions top
    instructions.style.top = (selectDiv.clientHeight - 50 - check_container.clientHeight).toString() + "px";
    // Checkboxes top
    check_container.style.top = (selectDiv.clientHeight - check_container.clientHeight).toString() + "px";
}

// Changes the size of the table, button text, and margins
// Dependant on screen width
function size() {
    let selectDiv_height;
    let margin;
    let fontSize;

    if (window.innerWidth > 920) {
        selectDiv_height = 110;
        fontSize = 18;
    } else {
        selectDiv_height = 130;
        fontSize = 12;
    }

    if (window.innerWidth > 920) {
        margin = 15;
    } else if (window.innerWidth <= 920 && window.innerWidth >= 575) {
        margin = 10;
    } else {
        margin = 5;
    }

    selectDiv_height += check_container.clientHeight;

    for (let btn of btns) {
        btn.style.marginLeft = margin + "px";
        btn.style.marginRight = margin + "px";
        btn.style.fontSize = fontSize + "px";
    }
    selectDiv.style.height = selectDiv_height + "px";

    tableDiv.style.height = (content.clientHeight * (6 / 10)).toString() + "px";
    tableDiv.style.width = "80%";
    tableDiv.style.left = (content.clientWidth / 2 - tableDiv.clientWidth / 2).toString() + "px";

    // Table width
    options.width = tableDiv.clientWidth;
}

function posSize() {
    size();
    pos();
    chart.draw(data, options);
}

function close() {
    if (selectDiv == null) {
        return;
    }

    if (tableDiv == null) {
        return;
    }

    save_checkbox_values();
    checkboxes = [];
    all_checked = all_checkbox.checked;

    content.removeChild(selectDiv);
    selectDiv = null;
    content.removeChild(tableDiv);
    tableDiv = null;
}

// Used in closing the results window
function getTable() {
    if (chart == null) {
        return;
    }

    return chart;
}

export { open, close, refresh_data, posSize, getTable };