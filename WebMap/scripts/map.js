import * as ui from "./ui.js";
import { get_filteredPubs } from "./filter.js";

let mapDiv;

let content = document.querySelector(".content");

let map;
let markers_info = [];
let markers = [];

let startCenter = [0, 50];
let startZoom = 3;

let currentCenter;
let currentZoom;

let filteredPubs;

// Opens the map screen
function open() {
    if (mapDiv != null) {
        return;
    }

    mapDiv = document.createElement('div');
    mapDiv.id = 'map';

    content.appendChild(mapDiv);

    if (currentCenter == null) {
        currentCenter = startCenter;
    }

    if (currentZoom == null) {
        currentZoom = startZoom;
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5vb3BpeCIsImEiOiJja3J4bTR0d2IwMjViMndxZ3NjcWIyZmNlIn0.Q02k5gj7N7bnTlY8l_IwTA';
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: currentCenter, // starting position [lng, lat]
        zoom: currentZoom // starting zoom
    });

    filteredPubs = get_filteredPubs();
    add_all_markers(filteredPubs);
}

// Closes the map screen
function close() {
    if (map == null) {
        return;
    }

    if (mapDiv == null) {
        return;
    }

    currentCenter = map.getCenter();
    currentZoom = map.getZoom();

    content.removeChild(mapDiv);
    mapDiv = null;
}

// Adds all of the markers to the map
function add_all_markers(pubs) {
    clear_all_markers();

    fill_markers_info(pubs);

    for (let m_info of markers_info) {
        add_marker(m_info);
    }
}

// Stores info from each publication into JS objects
// Each object is added to an aray
// This array will be used to create the markers
function fill_markers_info(pubs) {
    markers_info = [];

    for (let pub of pubs) {
        let _ids = [];
        let _location = pub.geo_location.location_in_pub;
        let _country = pub.geo_location.country;
        let _coordinates = [pub.geo_location.longitude, pub.geo_location.latitude];
        let _contains_airPolls = false;
        let _atm_params = [];
        let _relations = [];
        let _contains_pollen = false;

        // Pushes id into array
        _ids.push(pub.pub_uid);

        // Will push arrays like this: [param.uid, param.secondary]
        for (let param of pub.atm_parameters) {
            let _param_arr = [];

            _param_arr.push(param.uid);
            _param_arr.push(param.primary);
            _param_arr.push(param.secondary);

            _atm_params.push(_param_arr);
        }

        // Will push arrays like this: [weather_relations.uid, weather_relations.relation]
        for (let relation of pub.weather_relations) {
            let _rel_arr = [];

            _rel_arr.push(relation.uid);
            _rel_arr.push(relation.relation);

            _relations.push(_rel_arr);
        }

        let already_in_array = false;
        let selected_index = 0;
        for (let i = 0; i < markers_info.length; i++) {
            // If the "markers_info" array already has an item with the same location,
            // then it will add atm parameters from the currently selected publication
            // to the item (Pt. 1)
            if (markers_info[i].location == _location) {
                already_in_array = true;
                selected_index = i;
                break;
            }
        }

        // If the publication has air pollutants, 
        // then set "_contains_airPolls" to true
        if (pub.air_pollutants.length > 0) {
            _contains_airPolls = true;
        }

        // Do the same thing for pollen
        if (pub.pollen.type != null) {
            _contains_pollen = true;
        }

        if (already_in_array == false) {
            // If an item from this specific location 
            // isn't already in the "markers_info" array,
            // create a new "info" item
            let info = {
                ids: _ids,
                location: _location,
                country: _country,
                coordinates: _coordinates,
                atm_params: _atm_params,
                relations: _relations,
                number_of_pubs: 1,
                contains_airPolls: _contains_airPolls,
                contains_pollen: _contains_pollen
            };
            markers_info.push(info);
        } else {
            // Adding id from current pub to item with same location
            (markers_info[selected_index].ids).push(pub.pub_uid);

            // Adding atm parameters from current pub to item with the same location
            // (Pt. 2)
            for (let param of _atm_params) {
                (markers_info[selected_index].atm_params).push(param);
            }

            // Doing the same for weather relations
            for (let relation of _relations) {
                (markers_info[selected_index].relations).push(relation);
            }
            markers_info[selected_index].number_of_pubs++;
        }
    }
}

// Adding an individual marker
// In parameter is a "markers_info" object
// The info from that object will be used to set
// the information on the popup window, as well as the marker's coordinates
function add_marker(m_info) {
    let el = document.createElement("div");
    el.className = "marker";

    // Marker point
    // Will be used to set icons
    let point;

    let popup = new mapboxgl.Popup({
        closeButton: false,
        offset: 25
    });

    let ids = m_info.ids;
    let atmParams = m_info.atm_params;
    let relations = m_info.relations;

    let param_html = ui.get_paramRel_icons(atmParams, relations);

    let description = '<h3 style=\"margin-bottom: 0;\">' + m_info.location + '</h3>';
    if (m_info.location != m_info.country) {
        description += '<p style=\"margin-top: 0;\">' + m_info.country + '</p>';
    }
    description += '<p><b>Number of publications: </b>' + m_info.number_of_pubs + '</p>';
    if (atmParams.length > 0) {
        description += '<p><b>Weather parameters: </b><p>' + param_html;
    }

    let marker = new mapboxgl.Marker(el)
        .setLngLat(m_info.coordinates)
        .setPopup(popup)
        .addTo(map);

    markers.push(marker);

    el.onmouseover = function() {
        popup // adding popups
            .setHTML(description)
            .addTo(map);
    }

    el.onmouseleave = function() {
        popup.remove();
    }

    el.onclick = function() {
        map.flyTo({
            center: m_info.coordinates
        });

        if (ids.length == 1) {
            ui.open_selected(ids[0]);
        } else {
            ui.open_results(ids);
        }
    }

    set_icon(el, point, m_info);
}

function set_icon(el, point, m_info) {
    // Center of marker div
    let el_centerX = el.clientWidth / 2;
    let el_centerY = el.clientHeight / 2;

    // Adding point and point image to marker
    point = document.createElement("div");
    point.id = "point";
    el.appendChild(point);
    let point_img = document.createElement("img");
    point_img.src = "../style/icons/point.png";
    point.appendChild(point_img);

    // Center of point div
    let point_centerX = point.clientWidth / 2;
    let point_centerY = point.clientHeight / 2;

    // Setting point to the middle of the marker
    point.style.left = (el_centerX - point_centerX).toString() + "px";
    point.style.top = (el_centerY - point_centerY).toString() + "px";

    // Number of icons to be shown around each point
    // Will increase depending on whether pub contains air polls, atm params, or pollen
    let icons = [];
    if (m_info.contains_airPolls == true) {
        icons.push("Air Pollutants");
    }
    if ((m_info.atm_params).length > 0) {
        icons.push("Weather Parameters");
    }
    if (m_info.contains_pollen == true) {
        icons.push("Pollen");
    }

    if (icons.length == 0) {
        return;
    }

    // Adding icons
    // Will be displayed in a circle
    let radius = 20;
    let angle = 2 * Math.PI / icons.length;

    for (let i = 0; i < icons.length; i++) {
        let icon = document.createElement("div");
        icon.id = "icon";
        el.appendChild(icon);

        let icon_centerX = icon.clientWidth / 2;
        let icon_centerY = icon.clientHeight / 2;

        let originX = el_centerX - icon_centerX;
        let originY = el_centerY - icon_centerY;

        let new_angle = (angle * (i + 1));

        new_angle -= (Math.PI / 2);

        let x = Math.cos(new_angle) * radius;
        let y = Math.sin(new_angle) * radius;

        icon.style.left = (originX + x).toString() + "px";
        icon.style.top = (originY + y).toString() + "px";

        let icon_img = document.createElement("img");
        icon_img.src = ui.getIcon(icons[i]);
        icon.appendChild(icon_img);
    }
}

function clear_all_markers() {
    for (let marker of markers) {
        marker.remove();
    }
}

export { open, close, add_all_markers };