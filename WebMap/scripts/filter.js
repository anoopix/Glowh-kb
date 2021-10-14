import * as graph from "./graph.js";
import * as table from "./table.js";
import { addToArray, getCurrentScreen } from "./main.js";
import { add_all_markers } from "./map.js";
import { getIcon, refresh_resultsWindow, refresh_selectedWindow } from "./ui.js";

let filter = document.querySelector('.filter');
let logo = document.querySelector('.logo');
let buttons = document.querySelector('.buttons');

let panel;
let panel_maxWidth;
let panel_maxHeight;
let panel_shortenHeight;

let header;
let header_maxHeight;

let body;

let footer;
let footer_maxHeight;

let showBtn;

let shown;

let margin = 20;

let pubs = [];
let filteredPubs = [];

let subfilter_maxWidth;

let all_checkbox;
let all_input;
let all_span;
let all_checked;

let study_period_checkbox;
let study_period_label;
let slider_value_label;
let slider_container;
let slider;
let min_year_label;
let max_year_label;

let instructions;
let subfilter_names = ['Continents', 'Subjects',
    'Diseases', 'Air Pollutants', 'Weather Parameters',
    'Relations', 'Pollen'
];
let checkbox_names = [];
let checkboxes = [];
let min_year;
let max_year;

let headerIcon_imgs = [];
let headerIcon_inputs = [];

function load(_pubs) {
    all_checked = true;
    pubs = _pubs;
    shown = false;
    createPanel();
    createBtn();
    getNames(pubs);
    fill();
    setMaxSizes();
    pos();
    checkbox_and_slider_func();
    headerIcon_inputs_func();
    filter_pubs(pubs);
}

function createPanel() {
    if (panel != null) {
        return;
    }

    panel = document.createElement('div');
    panel.id = 'filter_panel';
    filter.appendChild(panel);

    header = document.createElement('div');
    header.id = 'panel_header';
    panel.appendChild(header);

    body = document.createElement('div');
    body.id = 'panel_body';
    panel.appendChild(body);

    footer = document.createElement('div');
    footer.id = 'panel_footer';
    panel.appendChild(footer);
}

function createBtn() {
    showBtn = document.createElement('button');
    showBtn.id = 'filter_btn';
    showBtn.innerHTML = 'Show filter';

    filter.appendChild(showBtn);

    showBtn.onclick = function() {
        if (shown == true) {
            shown = false;
            showBtn.innerHTML = "Show filter";
        } else {
            shown = true;
            showBtn.innerHTML = "Hide filter";
        }
        showHide("");
    }
    showHide("");
}

function setMaxSizes() {
    panel_maxWidth = (subfilter_maxWidth * 7) + margin;
    panel_maxHeight = panel.clientHeight;

    header_maxHeight = header.clientHeight;
    footer_maxHeight = footer.clientHeight;
}

function showHide(trans) {
    filter.style.transition = trans;
    if (shown == true) {
        filter.style.top = (window.innerHeight - filter.clientHeight - margin).toString() + "px";
    } else {
        filter.style.top = (window.innerHeight - showBtn.clientHeight - margin).toString() + "px";
    }
}

function pos() {
    if (filter == null) {
        return;
    }

    // Dynamically sized panel according to window resolution
    let minimumGap_x = 2 * margin;
    let minimumGap_y = logo.clientHeight + (3 * margin) + showBtn.clientHeight;

    if (window.innerWidth < 920) {
        panel_shortenHeight = buttons.clientHeight;
    } else {
        panel_shortenHeight = 0;
    }

    if (window.innerWidth > (panel_maxWidth + minimumGap_x)) {
        panel.style.width = (panel_maxWidth).toString() + "px";
    } else {
        panel.style.width = (window.innerWidth - minimumGap_x).toString() + "px";
    }
    if (window.innerHeight > (panel_maxHeight + minimumGap_y + panel_shortenHeight)) {
        panel.style.height = "";
    } else {
        panel.style.height = (window.innerHeight - minimumGap_y - panel_shortenHeight).toString() + "px";
    }

    // Panel position within filter div
    panel.style.top = (showBtn.clientHeight + margin).toString() + "px";

    //Filter div size
    filter.style.width = (panel.clientWidth).toString() + "px";
    filter.style.height = (panel.clientHeight + margin + showBtn.clientHeight).toString() + "px";

    // Filter div position
    filter.style.left = (window.innerWidth - filter.clientWidth - margin).toString() + "px";

    // Button position within filter div
    showBtn.style.top = (filter.clientTop).toString() + "px";
    showBtn.style.left = (filter.clientWidth - showBtn.clientWidth - 5).toString() + "px";

    showHide("top 0s");

    // Positioning panel contents
    // Header
    header.style.top = (panel.clientTop).toString() + "px";
    header.style.width = (panel.clientWidth).toString() + "px";

    // Body
    body.style.top = (panel.clientTop + header.clientHeight + 5).toString() + "px";
    body.style.width = (panel.clientWidth).toString() + "px";
    body.style.height = (panel.clientHeight - header.clientHeight - footer.clientHeight).toString() + "px";

    // Footer
    footer.style.top = (panel.clientTop + panel.clientHeight - footer.clientHeight + 5).toString() + "px";
    footer.style.width = (panel.clientWidth).toString() + "px";

    // Header contents - Select all checkbox AND Instructions
    all_checkbox.style.left = (0).toString() + "px";
    all_checkbox.style.top = (margin / 2).toString() + "px";

    if (window.innerWidth > 920) {
        all_checkbox.style.width = "";
        instructions.style.left = (header.clientWidth / 2 - instructions.clientWidth / 2).toString() + "px";
    } else {
        all_checkbox.style.width = "22.5%";
        instructions.style.left = ((2 * header.clientWidth / 3 - instructions.clientWidth / 2) - margin).toString() + "px";
    }

    if (panel.clientHeight < (header_maxHeight + footer_maxHeight)) {
        header.style.height = (panel.clientHeight / 2).toString() + "px";
        footer.style.height = (panel.clientHeight / 2).toString() + "px";
        instructions.style.display = "none";
        slider_container.style.display = "none";
        study_period_checkbox.style.display = "none";
        study_period_label.style.display = "none";
        slider_value_label.style.display = "none";
    } else {
        header.style.height = "";
        footer.style.height = "";
        instructions.style.display = "block";
        slider_container.style.display = "inline";
        study_period_checkbox.style.display = "inline";
        study_period_label.style.display = "inline";
        slider_value_label.style.display = "inline";
    }

    if (panel.clientHeight < (header_maxHeight / 2.5 + footer_maxHeight / 2.5)) {
        all_checkbox.style.display = "none";
    } else {
        all_checkbox.style.display = "block";
    }

    // Slider
    slider_container.style.left = (footer.clientWidth / 2 - slider_container.clientWidth / 2).toString() + "px";
    slider.style.width = (slider_container.clientWidth - min_year_label.clientWidth - max_year_label.clientWidth - 20).toString() + "px";
    slider.style.left = (slider_container.clientWidth / 2 - slider.clientWidth / 2).toString() + "px";

    min_year_label.style.left = (slider_container.clientTop).toString() + "px";
    max_year_label.style.left = (slider_container.clientWidth - max_year_label.clientWidth).toString() + "px";
}

function getNames(pubs) {
    // Continents
    let continent_arr = [];
    // Subjects
    let subject_arr = [];
    // Diseases
    let disease_arr = [];
    // Air Pollutants
    let airPoll_arr = [];
    // Atm Parameters
    let atmParam_arr = [];
    // Relations
    let relations_arr = [];
    // Pollen
    let pollen_arr = [];

    // From each publication, extract each piece of data,
    // and fill the above arrays with the corresponding pieces
    for (let pub of pubs) {
        let continent = pub.geo_location.continent;
        addToArray(continent, continent_arr);

        let subject = pub.subject.type;
        if (pub.subject.type != null) {
            addToArray(subject, subject_arr);
        }

        let diseases = pub.diseases;
        for (let disease of diseases) {
            addToArray(disease.name, disease_arr);
        }

        let airPolls = pub.air_pollutants;
        for (let airPoll of airPolls) {
            addToArray(airPoll.pollutant, airPoll_arr);
        }

        let atmParams = pub.atm_parameters;
        for (let atmParam of atmParams) {
            addToArray(atmParam.primary, atmParam_arr);
        }

        let relations = pub.weather_relations;
        for (let relation of relations) {
            addToArray(relation.relation, relations_arr);
        }

        let pollen = pub.pollen;
        if (pollen.type != null) {
            addToArray(pollen.type, pollen_arr);
        }

        // For finding the min and max years
        // in order to create the study period slider
        let studyPeriod = pub.study_period;
        if ((min_year == null || (studyPeriod.start_year < min_year)) && studyPeriod.start_year != 0) {
            min_year = studyPeriod.start_year;
        }
        if ((max_year == null || (studyPeriod.end_year > max_year)) && studyPeriod.start_year != 0) {
            max_year = studyPeriod.end_year;
        }
    }

    // Push all of the newly filled arrays into 'names'
    checkbox_names.push(continent_arr);
    checkbox_names.push(subject_arr);
    checkbox_names.push(disease_arr);
    checkbox_names.push(airPoll_arr);
    checkbox_names.push(atmParam_arr);
    checkbox_names.push(relations_arr);
    checkbox_names.push(pollen_arr);
}

// Fills the filter with the checkboxes, labels, and icons
function fill() {
    if (body == null) {
        return;
    }

    // "Select/Deselect all" checkbox in top-left corner of header
    all_checkbox = document.createElement("div");
    header.appendChild(all_checkbox);
    all_checkbox.className = "check-button";
    all_checkbox.id = "check-all";

    let all_label = document.createElement("label");
    all_checkbox.appendChild(all_label);

    all_input = document.createElement("input");
    all_input.setAttribute("type", "checkbox");
    all_label.appendChild(all_input);
    all_input.checked = all_checked;

    all_span = document.createElement("span");
    all_label.appendChild(all_span);

    // Instructions string in header
    instructions = document.createElement("p");
    instructions.id = "instructions";
    instructions.innerHTML = "Select what you want to show or hide:";
    header.appendChild(instructions);

    headerIcon_inputs = [];
    headerIcon_imgs = [];

    for (let i = 0; i < checkbox_names.length; i++) {
        // For each category in the filter, create a div
        // Contains label and list of checkboxes corresponding to each
        // category
        let subfilter = document.createElement('div');
        subfilter.className = 'subfilter';
        body.appendChild(subfilter);

        if (subfilter_maxWidth == null) {
            subfilter_maxWidth = subfilter.clientWidth;
        }

        let sub_header = document.createElement('div');
        sub_header.className = 'subfilter_header';
        subfilter.appendChild(sub_header);

        // if ((i == 3 || i == 4 || i == 6)) {
        //     let img = document.createElement("img");
        //     img.src = getIcon(subfilter_names[i]);
        //     sub_header.appendChild(img);
        // }

        if (i == 3) {
            create_icon_checkbox(sub_header, i);
        } else if (i == 4) {
            create_icon_checkbox(sub_header, i);
        } else if (i == 6) {
            create_icon_checkbox(sub_header, i);
        }

        let sub_label = document.createElement("p");
        sub_label.innerHTML = subfilter_names[i] + ":";
        sub_header.appendChild(sub_label);

        if (i == 4) {
            sub_label.style.marginLeft = "35px";
            sub_label.style.fontSize = "13px";
        }

        let checkbox_list = document.createElement('div');
        checkbox_list.className = 'checkbox_list';
        subfilter.appendChild(checkbox_list);

        let checkbox_array = [];

        // Create checkboxes for each category
        for (let j = 0; j < checkbox_names[i].length; j++) {
            let checkbox = document.createElement("div");
            checkbox_list.appendChild(checkbox);
            checkbox.className = "check-button";
            checkbox.id = "list";

            let label = document.createElement("label");
            checkbox.appendChild(label);

            let input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            label.appendChild(input);

            let span = document.createElement("span");
            span.innerHTML = checkbox_names[i][j];
            label.appendChild(span);

            if (i == 4 && j == 5) {
                span.style.fontSize = "12px";
            }

            if ((i == 4 || i == 5)) {
                let img = document.createElement("img");

                if (i == 4) {
                    img.id = "atm";
                } else if (i == 5) {
                    img.id = "rel";
                }

                img.src = getIcon(checkbox_names[i][j]);
                checkbox.appendChild(img);
            }

            checkbox_array.push(input);
        }
        checkboxes.push(checkbox_array);
    }

    create_slider();

    all_input_check(all_input.checked);
    every_input_check(all_input.checked);
}

// Used to create the checkboxes in the header (airPoll, atmParams, pollen)
function create_icon_checkbox(parent_div, i) {
    let div = document.createElement("div");
    parent_div.appendChild(div);
    div.className = "check-button";
    div.id = "header-button";

    let label = document.createElement("label");
    div.appendChild(label);

    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    label.appendChild(input);
    input.checked = true;
    headerIcon_inputs.push(input);

    let span = document.createElement("span");
    span.id = "header-span";
    label.appendChild(span);

    let img = document.createElement("img");
    img.src = getIcon(subfilter_names[i]);
    label.appendChild(img);
    headerIcon_imgs.push(img);

    img.style.left = (div.clientWidth / 2 - img.clientWidth / 2).toString() + "px";
    img.style.top = (div.clientHeight / 2 - img.clientHeight / 2).toString() + "px";
}

function create_slider() {
    // Creating the "Study period" checkbox
    study_period_checkbox = document.createElement("input");
    study_period_checkbox.id = "study_period_checkbox";
    study_period_checkbox.setAttribute("type", "checkbox");
    footer.appendChild(study_period_checkbox);

    // Creating the "Study period" label
    study_period_label = document.createElement("label");
    study_period_label.id = "study_period_label";
    study_period_label.innerHTML = "Study Period:";
    footer.appendChild(study_period_label);

    // Slider container
    // Contains the slider, and labels for the min and max values
    slider_container = document.createElement("div");
    slider_container.className = "slider_container";
    footer.appendChild(slider_container);

    min_year_label = document.createElement("label");
    min_year_label.id = "year_label";
    min_year_label.innerHTML = (min_year).toString();
    slider_container.appendChild(min_year_label);

    max_year_label = document.createElement("label");
    max_year_label.id = "year_label";
    max_year_label.innerHTML = (max_year).toString();
    slider_container.appendChild(max_year_label);

    slider = document.createElement("input");
    slider.id = "slider";
    slider.setAttribute("type", "range");
    slider_container.appendChild(slider);
    slider.min = min_year;
    slider.max = max_year;
    slider.value = min_year + Math.round((max_year - min_year) / 2);

    // Slider value label
    slider_value_label = document.createElement("label");
    slider_value_label.id = "slider_value_label";
    slider_value_label.innerHTML = (slider.value).toString();
    footer.appendChild(slider_value_label);

    if_study_period_checked();
}

// The following code will handle the functionality of the checkboxes

// When the word "all" is used, it will refer to the "Select all" checkbox
// on the top-left corner of the header.

// When the word "every" is used, it will refer to every one of the 
// individual checkboxes in the body.

// Changes the "all" checkbox, and affects the other checkboxes
// Dependant on the current value of the "all" checkbox
// Activated whenever "all" checkbox is clicked
function all_input_check(value) {
    if (value == true) {
        all_span.innerHTML = "Deselect all";
    } else {
        all_span.innerHTML = "Select all";
    }
}

// Changes every checkbox in the body
// Dependant on what value the "all" checkbox is
function every_input_check(value) {
    for (let i = 0; i < checkboxes.length; i++) {
        for (let j = 0; j < checkboxes[i].length; j++) {
            checkboxes[i][j].checked = value;
        }
    }
}

// Goes through every checkbox in the body,
// and checks if everything is selected
function is_every_input_true() {
    let every_true = true;
    for (let i = 0; i < checkboxes.length; i++) {
        for (let j = 0; j < checkboxes[i].length; j++) {
            if (checkboxes[i][j].checked == false) {
                every_true = false;
                i = checkboxes.length - 1;
                break;
            }
        }
    }

    if (every_true == true) {
        all_input.checked = true;
    } else {
        all_input.checked = false;
    }
    all_input_check(all_input.checked);
}

// Study period checkbox
function if_study_period_checked() {
    if (study_period_checkbox.checked == true) {
        slider.disabled = false;
        slider.style.background = "";
        slider_value_label.style.color = "";
    } else {
        slider.disabled = true;
        slider.style.background = "#8d8d8d";
        slider_value_label.style.color = "#414141";
    }
}

// Handles functionality of all of the checkboxes 
// and the "Study period" slider in the filter
// Includes "all" and "every" checkbox
function checkbox_and_slider_func() {
    // "Select all" checkbox
    all_input.onchange = function() {
        all_input_check(all_input.checked);
        for (let check of headerIcon_inputs) {
            check.checked = all_input.checked;
        }
        every_input_check(all_input.checked);
        filter_pubs(pubs);
    }

    // Every checkbox in body
    for (let i = 0; i < checkboxes.length; i++) {
        for (let j = 0; j < checkboxes[i].length; j++) {
            checkboxes[i][j].onchange = function() {
                is_every_input_true();

                if (i == 3) {
                    if (is_every_input_in_sub_checked(3) == true) {
                        headerIcon_inputs[0].checked = true;
                    } else {
                        headerIcon_inputs[0].checked = false;
                    }
                }

                if (i == 4) {
                    if (is_every_input_in_sub_checked(4) == true) {
                        headerIcon_inputs[1].checked = true;
                    } else {
                        headerIcon_inputs[1].checked = false;
                    }
                }

                if (i == 6) {
                    if (is_every_input_in_sub_checked(6) == true) {
                        headerIcon_inputs[2].checked = true;
                    } else {
                        headerIcon_inputs[2].checked = false;
                    }
                }

                filter_pubs(pubs);
            }
        }
    }

    // "Study period" checkbox
    study_period_checkbox.onchange = function() {
        if_study_period_checked();
        filter_pubs(pubs);
    }

    // Slider functionality
    slider.oninput = function() {
        slider_value_label.innerHTML = (slider.value).toString();
        filter_pubs(pubs);
    }
}

// Header icon checkboxes
function headerIcon_inputs_func() {
    if (headerIcon_inputs.length == 0) {
        return;
    }

    // Air pollutants
    headerIcon_inputs[0].onchange = function() {
        change_icon(headerIcon_imgs[0], "air_pollutants", headerIcon_inputs[0].checked);
        every_input_in_subfilter(headerIcon_inputs[0].checked, 3);
        is_every_input_true();
        filter_pubs(pubs);
    }

    // Weather parameters
    headerIcon_inputs[1].onchange = function() {
        change_icon(headerIcon_imgs[1], "atm_parameters", headerIcon_inputs[1].checked);
        every_input_in_subfilter(headerIcon_inputs[1].checked, 4);
        is_every_input_true();
        filter_pubs(pubs);
    }

    // Pollen
    headerIcon_inputs[2].onchange = function() {
        change_icon(headerIcon_imgs[2], "pollen", headerIcon_inputs[2].checked);
        every_input_in_subfilter(headerIcon_inputs[2].checked, 6);
        is_every_input_true();
        filter_pubs(pubs);
    }
}

function change_icon(img, name_string, value) {
    if (value == true) {
        img.src = "../style/icons/markers/" + name_string + ".png";
    } else {
        img.src = "../style/icons/markers/" + name_string + "_gray.png";
    }
}

function every_input_in_subfilter(value, index) {
    for (let i = 0; i < checkboxes[index].length; i++) {
        checkboxes[index][i].checked = value;
    }

    if (value == false) {
        all_checked = false;
        all_input.checked = all_checked;
    }
}

function is_every_input_in_sub_checked(index) {
    let every_true = true;

    for (let i = 0; i < checkboxes[index].length; i++) {
        if (checkboxes[index][i].checked == false) {
            every_true = false;
            break;
        }
    }

    return every_true;
}

// Handles the filtering of the publications
function filter_pubs(pubs) {
    // Resets the "filteredPubs" array
    // Will be added to throughout this function
    filteredPubs = [];

    for (let pub of pubs) {
        let info = [];

        // Continents
        let continent = [];
        continent.push(pub.geo_location.continent);
        info.push(continent);

        // Subjects
        let subject = [];
        subject.push(pub.subject.type);
        info.push(subject);

        // Diseases - multiple
        let diseases = [];
        for (let disease of pub.diseases) {
            diseases.push(disease.name);
        }
        info.push(diseases);

        // Air Pollutants - multiple
        let airPolls = [];
        for (let air_pollutant of pub.air_pollutants) {
            airPolls.push(air_pollutant.pollutant);
        }
        info.push(airPolls);

        // Weather Parameters - multiple
        let atmParams = [];
        for (let atm_parameter of pub.atm_parameters) {
            atmParams.push(atm_parameter.primary);
        }
        info.push(atmParams);

        // Relations
        let relations = [];
        for (let weather_relation of pub.weather_relations) {
            relations.push(weather_relation.relation);
        }
        info.push(relations);

        // Pollen
        let pollen = [];
        pollen.push(pub.pollen.type);
        info.push(pollen);

        // Cycle through each item in "info"
        // Check if the corresponding checkbox is checked
        let passed = false;
        // For each section in "info"
        for (let i = 0; i < info.length; i++) {
            // Go through the checkboxes, and if any of the corresponding checkboxes are checked,
            // increment "num_of_true"
            let num_of_true = 0;

            // If the current array of "info" doesn't contain anything, or contains "null"
            if (info[i].length == 0 || info[i].includes(null)) {
                num_of_true = 1;
            }

            // For each item in current "info" section
            for (let j = 0; j < info[i].length; j++) {
                // Cycle through the corresponding subset of checkbox names
                for (let k = 0; k < checkbox_names[i].length; k++) {
                    // If the correspondign checkbox is checked,
                    // Increment "num_of_true" by 1
                    if (info[i][j] == checkbox_names[i][k]) {
                        if (checkboxes[i][k].checked == true) {
                            num_of_true++;
                        }
                    }
                }
            }

            // Final check for each group of checkboxes
            // If all of the checkboxes were checked false,
            // Set passed to false and end this filter test
            if (num_of_true > 0) {
                passed = true;
            } else {
                passed = false;
                i = info.length - 1;
                break;
            }
        }

        // If the "Study period" slider is activated,
        // then check if the selected year is within the start year-end year range
        if (study_period_checkbox.checked == true) {
            if (pub.study_period.start_year > slider.value) {
                passed = false;
            }

            if (pub.study_period.end_year < slider.value) {
                passed = false;
            }
        }

        // If the publication successfully passed though the filter test,
        // then add it to the "filteredPubs" array
        if (passed == true) {
            filteredPubs.push(pub);
        }
    }

    refresh_selectedWindow();
    refresh_resultsWindow();

    // The site will respond differently to the new filtered publications
    // depending on what screen is currently on display
    switch (getCurrentScreen()) {
        case 2:
            add_all_markers(filteredPubs);
            break;
        case 3:
            graph.refresh_data();
            break;
        case 4:
            table.refresh_data();
            break;
    }
}

// Functions to be called in other .js files (Map, Graph, Table, and UI)
function get_disease_names() {
    return checkbox_names[2];
}

function get_airPolls_names() {
    return checkbox_names[3];
}

// Weather Parameters checkboxes
function get_atmParams_checkboxes() {
    return checkboxes[4];
}

// Weather Parameter names
function get_atmParams_names() {
    return checkbox_names[4];
}

// Weather Relations checkboxes
function get_relations_checkboxes() {
    return checkboxes[5];
}

// Weather Relation names
function get_relations_names() {
    return checkbox_names[5];
}

// Return filtered pubs
function get_filteredPubs() {
    return filteredPubs;
}

// Get subfilter header checks (Air pollutants, atm parameters, pollen)
function get_airPoll_headerCheck() {
    if (headerIcon_inputs.length == 0) {
        return;
    }

    return headerIcon_inputs[0];
}

function get_atmParam_headerCheck() {
    if (headerIcon_inputs.length == 0) {
        return;
    }

    return headerIcon_inputs[1];
}

function get_pollen_headerCheck() {
    if (headerIcon_inputs.length == 0) {
        return;
    }

    return headerIcon_inputs[2];
}

export { load, pos, get_airPoll_headerCheck, get_atmParam_headerCheck, get_pollen_headerCheck, get_disease_names, get_airPolls_names, get_atmParams_checkboxes, get_atmParams_names, get_relations_checkboxes, get_relations_names, get_filteredPubs };