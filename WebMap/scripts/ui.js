import { get_atmParams_checkboxes, get_atmParams_names, get_relations_checkboxes, get_relations_names } from "./filter.js";
import { get_allPubs } from "./main.js";
import { get_filteredPubs } from "./filter.js";
import { getChart } from "./graph.js";
import { getTable } from "./table.js";

let logo = document.querySelector(".logo");
let content = document.querySelector(".content");
let buttons = document.querySelector(".buttons");

let icons = "../style/icons/";
let markers = icons + "markers/";
let params = icons + "params/";
let relations = icons + "relations/";

let atmParams_checkboxes;
let atmParams_names;
let relations_checkboxes;
let relations_names;

let selected;
// Top, left, width, height
let selected_dimensions = [null, null, null, null];
let opened_uid_single;
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let margin = 5;

let results;
// Top, left, width, height
let results_dimensions = [null, null, null, null];
let opened_uid_multiple;

// Set checkboxes and names - to be used in popups
function get_checksNames() {
    atmParams_checkboxes = get_atmParams_checkboxes();
    atmParams_names = get_atmParams_names();
    relations_checkboxes = get_relations_checkboxes();
    relations_names = get_relations_names();
}

// Used to retrieve icon by name
// Used in filter, map markers, and side window
function getIcon(name) {
    let src = "";

    switch (name) {
        case "Air Pollutants":
            src = markers + "air_pollutants.png";
            break;
        case "Weather Parameters":
            src = markers + "atm_parameters.png";
            break;
        case "Pollen":
            src = markers + "pollen.png";
            break;
        case "Temperature":
            src = params + "temperature.png";
            break;
        case "Air Temperature":
            src = params + "air_temperature.png";
            break;
        case "Mean Temperature":
            src = params + "mean_temperature.png";
            break;
        case "Minimum Temperature":
            src = params + "min_temperature.png";
            break;
        case "Maximum Temperature":
            src = params + "max_temperature.png";
            break;
        case "Dew point Temperature":
            src = params + "dew_temperature.png";
            break;
        case "Humidity":
            src = params + "humidity.png";
            break;
        case "Relative Humidity":
            src = params + "relative_humidity.png";
            break;
        case "Absolute Humidity":
            src = params + "absolute_humidity.png";
            break;
        case "Wind Speed":
            src = params + "wind_speed.png";
            break;
        case "Seasons":
            src = params + "seasons.png";
            break;
        case "Diurnal Temperature range (DTR)":
            src = params + "diurnal_temperature.png";
            break;
        case "Mean Monthly Air Temperature":
            src = params + "mean_monthly_air_temperature.png";
            break;
        case "Thunderstorm":
            src = params + "thunderstorm.png";
            break;
        case "Rainfall":
            src = params + "rainfall.png";
            break;
        case "Seasonal Variation":
            src = params + "seasonal_variation.png";
            break;
        case "Wind":
            src = params + "wind.png";
            break;
        case "Positive":
            src = relations + "positive.png";
            break;
        case "Negative":
            src = relations + "negative.png";
            break;
        case "Changes":
            src = relations + "changes.png";
            break;
    }

    return src;
}

// Gets array of parameters and relations based on publication
// Used in "selected" window to print out icons
function get_paramRel_arrays(pub) {
    let params = pub.atm_parameters;

    let p_arr = [];
    for (let param of params) {
        let _arr = [];

        _arr.push(param.uid);
        _arr.push(param.primary);
        _arr.push(param.secondary);

        p_arr.push(_arr);
    }

    let rels = pub.weather_relations;
    let r_arr = [];
    for (let rel of rels) {
        let _arr = [];

        _arr.push(rel.uid);
        _arr.push(rel.relation);

        r_arr.push(_arr);
    }

    return [p_arr, r_arr];
}

// Converts a pub/marker's atm parameter and relation info into an array
// Used to generate a list of icons representing each parameter and its corresponding relation

// params is list of arrays [param.uid, param.primary, param.secondary]
// relations is list of arrays [relation.uid, relation.relation]
function get_paramList(params, relations) {
    let list = [];

    // For each parameter
    // Push into list an array like this: [param.secondary, relations.relation]
    for (let param of params) {
        let paramRel_arr = [];

        let _relations = [];

        // Cycle through the relations until you find
        // the one that corresponds to the current parameter
        for (let relation of relations) {
            if (relation[0] == param[0]) {
                _relations.push(relation[1]);
            }
        }

        paramRel_arr.push(param[1]);
        paramRel_arr.push(param[2]);
        paramRel_arr.push(_relations);

        list.push(paramRel_arr);
    }

    // Returns list of [primary, secondary, [relations]]
    return list;
}

// Sorts out each item in the parameter-relation list
// First by checked, then by unchecked
function get_paramList_sorted(paramRel_list) {
    let list = [];

    let checked_list = [];
    let unchecked_list = [];

    for (let item of paramRel_list) {
        let primary = item[0];
        let relations = item[2];

        let is_checked = paramRel_checked(primary, relations);

        if (is_checked == true) {
            checked_list.push(item);
        } else {
            unchecked_list.push(item);
        }
    }

    list.push(checked_list);
    list.push(unchecked_list);

    // Returns list of [primary, secondary, [relations]]
    return list;
}

// Function that checks whether both checkboxes that correspond 
// to the selected parameter and relation are checked or not
// REMEMBER: param HAS to be primary
function paramRel_checked(primary, relations) {
    if (atmParams_checkboxes == null ||
        atmParams_names == null ||
        relations_checkboxes == null ||
        relations_names == null) {
        get_checksNames();
    }

    let checked = false;

    // Check if the corresponding parameter checkbox is checked
    let atm_checked = false;
    for (let i = 0; i < atmParams_names.length; i++) {
        if (primary == atmParams_names[i]) {
            if (atmParams_checkboxes[i].checked == true) {
                atm_checked = true;
            } else {
                atm_checked = false;
            }
            break;
        }
    }

    // Check if corresponding relation checkbox is checked
    let rel_checked = false;
    if (relations.length > 0) {
        for (let relation of relations) {
            for (let i = 0; i < relations_names.length; i++) {
                if (relation == relations_names[i]) {
                    if (relations_checkboxes[i].checked == true) {
                        rel_checked = true;
                    }
                }
            }
        }
    } else {
        rel_checked = true;
    }

    // If both atm and rel are checked, return true
    if (atm_checked == true && rel_checked == true) {
        checked = true;
    }

    return checked;
}

// Function that takes in list of [primary, secondary, relations]
// Returns innerHTML containing a list of icons
function get_paramRel_icons(params, relations) {
    let param_html = "";

    let unsorted_list = get_paramList(params, relations);
    let sorted_list = get_paramList_sorted(unsorted_list);

    let checked_list = sorted_list[0];
    let unchecked_list = sorted_list[1];

    param_html += icons_html(checked_list, 1);
    param_html += icons_html(unchecked_list, 0.3);

    return param_html;
}

// Shortcut function used to add icons to innerHTML string
// Takes in list [primary, secondary, relations] as parameter
function icons_html(list, opacity) {
    let html = "";

    for (let item of list) {
        let secondary = item[1];
        let relations = item[2];

        html += "<div class=\"param-list\" " +
            "style=\"opacity:" + opacity + ";\">" +
            "<img src = \"" + getIcon(secondary) + "\" id=\"atm-html\">" +
            "<div class=\"rel-list\">";

        for (let relation of relations) {
            html += "<img src=\"" + getIcon(relation) + "\" id=\"rel-html\">";
        }

        html += "</div></div>";
    }

    return html;
}

/*
 *
 *
 * Window class
 *
 *
 */
class MyWindow {
    constructor(name, maxWidth, maxHeight, start_top, start_left, window_content, dimensions) {
        this.name = name;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.window_content = window_content;

        // Full window
        this.full = null;
        // Header
        this.header = null;
        // Body
        this.body = null;
        // Content
        this.content = null;
        // Footer
        this.footer = null;

        // Close btn
        this.close_btn = null;

        // Top
        this.top = dimensions[0];
        // Left
        this.left = dimensions[1];
        // Width
        this.width = dimensions[2];
        // Height
        this.height = dimensions[3];

        // Start top
        this.start_top = start_top;
        // Start left
        this.start_left = start_left;

        // Drag variables
        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;

        this.open();
        this.drag();
        this.posSize();
        this.bring_to_front();

        this.full.onmousedown = () => {
            this.bring_to_front();
        }
    }

    open() {
        if (this.full != null) {
            this.close();
        }

        // Full window
        this.full = document.createElement("div");
        this.full.id = "window";
        this.full.className = this.name;
        document.body.appendChild(this.full);

        // Header
        this.header = document.createElement("div");
        this.header.id = "window_header";
        this.header.className = this.name;
        this.full.appendChild(this.header);

        // Close button
        this.close_btn = document.createElement("button");
        this.close_btn.id = "close_btn";
        this.close_btn.onclick = this.close;
        this.header.appendChild(this.close_btn);

        // Body
        this.body = document.createElement("div");
        this.body.id = "window_body";
        this.body.className = this.name;
        this.full.appendChild(this.body);

        // Content
        this.content = document.createElement("div");
        this.content.id = "window_content";
        this.content.className = this.name;
        this.body.appendChild(this.content);
        this.fill(this.window_content);

        // Footer
        this.footer = document.createElement("div");
        this.footer.id = "window_footer";
        this.footer.className = this.name;
        this.full.appendChild(this.footer);
    }

    pos() {
        if (this.full == null) {
            return;
        }

        let margin = 5;

        // Width is here, because the position of the window
        // is dependant on the width
        if (window.innerWidth > this.maxWidth) {
            this.full.style.width = (this.maxWidth).toString() + "px";
        } else {
            this.full.style.width = (window.innerWidth - 3 * margin).toString() + "px";
        }

        // Starting top positions for windows over and under 920px
        if (this.top == null) {
            if (window.innerWidth > 920) {
                this.top = this.start_top;
            } else {
                this.top = this.start_top + buttons.clientHeight + 10;
            }
        }

        // Starting left position for window
        if (this.left == null) {
            this.left = this.start_left;
        } else if (this.left > window.innerWidth) {
            this.left = (content.clientWidth - this.full.clientWidth - 2 * margin);
        }

        if (window.innerWidth <= 920) {
            // Keeps the window underneath the menu buttons
            // whenever the screen size changes to <=920
            if (this.top < logo.clientHeight + content.clientTop + buttons.clientHeight + 10) {
                this.top = logo.clientHeight + content.clientTop + buttons.clientHeight + 10;
            }
        } else {
            if (this.top < logo.clientHeight + content.clientTop) {
                this.top = logo.clientHeight + content.clientTop;
            }
        }

        // Keeping window within the window boundaries
        // whenever the screen size changes
        if (window.innerWidth > this.maxWidth) {
            if (this.full.offsetLeft > (content.clientWidth - this.full.clientWidth - 2 * margin)) {
                this.left = (content.clientWidth - this.full.clientWidth - 2 * margin);
            }
        }


        if (this.full.offsetTop > (content.clientHeight - this.header.clientHeight - 5)) {
            this.top = (content.clientHeight - this.header.clientHeight - 5);
        }

        this.full.style.top = this.top.toString() + "px";
        this.full.style.left = this.left.toString() + "px";

        // If the screen is too small, hide "selected" window
        let min_height;
        if (window.innerWidth > 920) {
            min_height = this.header.clientHeight + this.footer.clientHeight;
        } else {
            min_height = this.header.clientHeight + this.footer.clientHeight + buttons.clientHeight + 10;
        }

        // If content height is too short for the window to be displayed
        if (content.clientHeight < min_height) {
            this.full.style.display = "none";
            if (this.name == "selected") {
                selected = null;
            } else if (this.name == "results") {
                results = null;
            }
        }

        if (this.name == "selected") {
            selected_dimensions[0] = this.full.offsetTop;
            selected_dimensions[1] = this.full.offsetLeft;
        } else if (this.name == "results") {
            results_dimensions[0] = this.full.offsetTop;
            results_dimensions[1] = this.full.offsetLeft;
        }
    }

    // Size of window
    // Dynamically changes with the resolution
    size() {
        if (this.full == null) {
            return;
        }

        let _height;
        if (window.innerWidth > 920) {
            _height = 2 * margin;
        } else {
            _height = buttons.clientHeight + 4 * margin;
        }

        if (content.clientHeight > this.maxHeight) {
            this.full.style.height = (this.maxHeight - _height).toString() + "px";
        } else {
            this.full.style.height = (content.clientHeight - _height).toString() + "px";
        }

        this.body.style.height = (this.full.clientHeight - this.header.clientHeight - this.footer.clientHeight).toString() + "px";

        this.close_btn.style.left = (this.full.clientWidth - 30).toString() + "px";

        if (this.name == "selected") {
            selected_dimensions[2] = this.full.clientWidth;
            selected_dimensions[3] = this.full.clientHeight;
        } else if (this.name == "results") {
            results_dimensions[2] = this.full.clientWidth;
            results_dimensions[3] = this.full.clientHeight;
        }
    }

    drag() {
        this.header.onmousedown = () => {
            this.drag_mouse_down();
        }
    }

    drag_mouse_down(e) {
        e = e || window.event;
        e.preventDefault();

        // Get the mouse cursor position at startup
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = () => {
                this.close_drag();
            }
            // Call a function whenever the cursor moves
        document.onmousemove = () => {
            this.element_drag();
        }
    }

    element_drag(e) {
        e = e || window.event;

        // Calculate the new cursor position
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        // Set the element's new position
        this.full.style.top = (this.full.offsetTop - this.pos2) + "px";
        this.full.style.left = (this.full.offsetLeft - this.pos1) + "px";

        this.keep_in_view();
    }

    keep_in_view() {
        let div_width = this.full.clientWidth;
        let div_left = this.full.offsetLeft;
        let div_top = this.full.offsetTop;

        // If the top of the div is past the top of content
        let _top = 0;
        if (window.innerWidth > 920) {
            _top = logo.clientHeight;
        } else {
            _top = logo.clientHeight + buttons.clientHeight + 2 * margin;
        }
        if (div_top < _top) {
            this.full.style.top = (_top).toString() + "px";
        }

        // If the left side of the div is past the left edge of content
        if (div_left < margin) {
            this.full.style.left = 0 + "px";
        }

        // If the bottom of the header is past the bottom of content
        if (div_top > (logo.clientHeight + content.clientHeight - this.header.clientHeight - margin)) {
            this.full.style.top = (logo.clientHeight + content.clientHeight - this.header.clientHeight - margin).toString() + "px";
        }

        // If the right side of the div is past the right edge of content
        if (div_left > (content.clientWidth - div_width - 2 * margin)) {
            this.full.style.left = (content.clientWidth - div_width - 2 * margin).toString() + "px";
        }
    }

    close_drag(e) {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;

        if (this.name == "selected") {
            selected_dimensions[0] = this.full.offsetTop;
            selected_dimensions[1] = this.full.offsetLeft;
        } else if (this.name == "results") {
            results_dimensions[0] = this.full.offsetTop;
            results_dimensions[1] = this.full.offsetLeft;
        }

        this.top = this.full.offsetTop;
        this.left = this.full.offsetLeft;
    }

    fill(window_content) {
        this.content.innerHTML = "";

        this.content.innerHTML += window_content;
    }

    posSize() {
        this.pos();
        this.size();
    }

    close() {
        if (this.parentNode.parentNode.className == "selected") {
            selected = null;
        } else if (this.parentNode.parentNode.className == "results") {
            results = null;
            opened_uid_multiple = null;
        }

        if (getTable() != null) {
            getTable().setSelection(null);
        }

        document.body.removeChild(this.parentNode.parentNode);
    }

    bring_to_front() {
        this.full.style.zIndex = 3;
        if (this.name == "selected") {
            if (results != null) {
                results.full.style.zIndex = 2;
            }
        } else if (this.name == "results") {
            if (selected != null) {
                selected.full.style.zIndex = 2;
            }
        }
    }
}

/*
 *
 * Functions for handling the selected window
 * - Used to view info regarding a specific publication
 *
 */
function open_selected(uid) {
    opened_uid_single = uid;

    if (selected == null) {
        selected = new MyWindow("selected",
            450, 700,
            logo.clientHeight + margin,
            margin,
            selected_data(uid),
            selected_dimensions);
    } else {
        selected.fill(selected_data(uid));
    }
}

// Function for returning innerHTML displaying pub info
function selected_data(uid) {
    let pub = get_pub_from_uid(uid);
    let paramRels = get_paramRel_arrays(pub);
    let params = paramRels[0];
    let rels = paramRels[1];

    let title = pub.publication.title
    let url = pub.publication.url;
    let journal = pub.publication.journal;
    let year = pub.publication.year;

    let authors = [];
    for (let i = 0; i < (pub.publication.author).length; i++) {
        authors.push(pub.publication.author[i]);
    }

    let location_in_pub = pub.geo_location.location_in_pub;
    let city = pub.geo_location.city;
    let state = pub.geo_location.state;
    let country = pub.geo_location.country;
    let locationArr_old = [location_in_pub, city, state, country];

    let subject = pub.subject.type;

    let start_month = pub.study_period.start_month;
    let start_year = pub.study_period.start_year;
    let end_month = pub.study_period.end_month;
    let end_year = pub.study_period.end_year;

    let stat_method = pub.stat_method.name;

    let study_outcome = pub.study_outcome.outcome;
    let study_comment = pub.study_outcome.comment;

    let diseases = [];
    for (let i = 0; i < (pub.diseases).length; i++) {
        diseases.push(pub.diseases[i].name);
    }

    let pollen = pub.pollen.type;

    let airPoll_full = [];
    let airPoll_abb = [];
    for (let i = 0; i < (pub.air_pollutants).length; i++) {
        airPoll_full.push(pub.air_pollutants[i].pollutant);
        airPoll_abb.push(pub.air_pollutants[i].abbrev);
    }

    let body_str = "<a href=" + url +
        " target=\"_blank\"><h2>" + title + "</h2></a>";
    body_str += "<h3>" + journal + ", " + year + "</h3>";
    body_str += "<p><b>Author(s): </b>";
    for (let i = 0; i < authors.length; i++) {
        if (i != 0) {
            body_str += ", ";
        }
        body_str += authors[i];
    }
    body_str += "</p>";

    // Location
    body_str += "<p><b>Location: </b>";

    let locationArr_new = [];
    for (let loc of locationArr_old) {
        if (!locationArr_new.includes(loc) && loc != null) {
            locationArr_new.push(loc);
        }
    }

    for (let i = 0; i < locationArr_new.length; i++) {
        body_str += locationArr_new[i];

        if (i != locationArr_new.length - 1) {
            body_str += ", ";
        }
    }

    // Subject
    body_str += "<p><b>Sample info: </b>" + subject + "</p>";

    // Study period
    if (start_year != 0 && end_year != 0) {
        body_str += "<p><b>Study period: </b>";
        if (start_month != 0) {
            body_str += months[start_month - 1] + " ";
        }
        body_str += start_year;
        body_str += " - "
        if (end_month != 0) {
            body_str += months[end_month - 1] + " ";
        }
        body_str += end_year;
        body_str += "</p>";
    }

    // Stat method
    if (stat_method != null) {
        body_str += "<p><b>Statistical method: </b>" + stat_method + "</p>";
    }

    // Study outcome
    if (study_outcome != null) {
        body_str += "<p><b>Study outcome: </b>" + study_outcome + "<br>";
    }
    if (study_comment != null) {
        body_str += "<b>Comment: </b>" + study_comment + "</p>";
    } else {
        body_str += "</p>";
    }

    // Diseases
    if (diseases.length > 0) {
        if (diseases.length == 1) {
            body_str += "<p><b>Disease: </b>";
        } else {
            body_str += "<p><b>Diseases: </b>";
        }
        for (let i = 0; i < diseases.length; i++) {
            if (i != 0) {
                body_str += ", ";
            }

            body_str += diseases[i];
        }
        body_str += "</p>";
    }

    // Pollen
    if (pollen != null) {
        body_str += "<p><b>Pollen: </b>" + pollen + "</p>";
    }

    // Air pollutants
    if (airPoll_full.length > 0) {
        body_str += "<p><b>Air pollutants: </b>";
        for (let i = 0; i < airPoll_full.length; i++) {
            body_str += "<li>" + airPoll_full[i] + " - " + airPoll_abb[i] + "</li>";
        }
        body_str += "</p>";
    }

    // Atm parameters
    if (pub.atm_parameters.length > 0) {
        body_str += "<p><b>Weather parameters: </b>";
        body_str += "</p>";
        body_str += get_paramRel_icons(params, rels);
    }

    return body_str;
}

// Takes in pubs and uid
// Returns pub
function get_pub_from_uid(uid) {
    let pub;

    for (let p of get_allPubs()) {
        if (p.pub_uid == uid) {
            pub = p;
            break;
        }
    }

    return pub;
}

// Function to refresh the "selected" window
// Called in filter.js after the new list of pubs is filtered
// Only works if the selected window is visible
function refresh_selectedWindow() {
    if (selected == null) {
        return;
    }

    open_selected(opened_uid_single);
}

/*
 *
 * Functions for handling the results window
 * - Used to view multiple pubs
 *
 */
function open_results(uids) {
    if (opened_uid_multiple == null) {
        opened_uid_multiple = uids;
    }

    if (results == null) {
        results = new MyWindow("results",
            400, 500,
            logo.clientHeight + margin,
            content.clientWidth - 400 - 3 * margin,
            results_data(uids),
            results_dimensions);
    } else {
        results.fill(results_data(uids));
    }

    if (uids.length > 0) {
        set_results_links(uids);
    }

}

// Results window will be filled with list of results (multiple pubs)
function results_data(uids) {
    let body_str = "";

    for (let uid of uids) {
        // Publication
        let pub = get_pub_from_uid(uid);

        // Title
        let title = pub.publication.title;
        // Journal and Year
        let journal_year = pub.publication.journal + ", " + pub.publication.year;
        // Location
        let locArr_old = [pub.geo_location.location_in_pub, pub.geo_location.city, pub.geo_location.country];
        let locArr_new = [];

        for (let loc of locArr_old) {
            if (!locArr_new.includes(loc) && loc != null) {
                locArr_new.push(loc);
            }
        }

        // List item
        let list_str = "<li id=\"resId_" + uid + "\">";

        // Box representing item
        list_str += "<div class=\"results_item\">";
        // Text within box
        list_str += "<pubTitle>" + title + "</pubTitle><br>";
        list_str += "<pubJournalYear>" + journal_year + "</pubJournalYear><br>";
        list_str += "<pubLocation>";
        for (let i = 0; i < locArr_new.length; i++) {
            if (i != 0) {
                list_str += ", ";
            }

            list_str += locArr_new[i];
        }
        list_str += "</pubLocation>";
        list_str += "</div>";

        // Finally add list item + box to body
        list_str += "</li>";
        body_str += list_str;
    }

    return body_str;
}

// Sets links for each item in results list
function set_results_links(uids) {
    for (let uid of uids) {
        let list_box = document.querySelector("#resId_" + uid);

        list_box.addEventListener('click', function() {
            open_selected(uid);
        })
    }
}

// Refresh results list when the filter settings are changed
function refresh_resultsWindow() {
    if (results == null) {
        return;
    }

    let filtered_uids = [];

    for (let old_uid of opened_uid_multiple) {
        let still_in = false;

        for (let new_pub of get_filteredPubs()) {
            if (old_uid == new_pub.pub_uid) {
                still_in = true;
                break;
            }
        }

        if (still_in == true) {
            filtered_uids.push(old_uid);
        }
    }

    open_results(filtered_uids);
}

// Size and position of both windows (selected and results)
function windows_posSize() {
    if (selected != null) {
        selected.posSize();
    }

    if (results != null) {
        results.posSize();
    }
}

export { refresh_resultsWindow, refresh_selectedWindow, getIcon, get_paramRel_icons, open_selected, open_results, windows_posSize };