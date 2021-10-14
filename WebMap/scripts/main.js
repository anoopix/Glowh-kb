import * as filter from "./filter.js";
import * as map from "./map.js";
import * as graph from "./graph.js";
import * as table from "./table.js";
import * as ajax from "./ajax.js";
import * as ui from "./ui.js";

// A GLObal knowledgebase to catalog impact of environment, Weather,
// and climate change on Health

let description = "Welcome to GLOWH-kb:<br>" +
    "a GLObal knowledge base to catalog the impact of environment, Weather, and climate change on Health." +
    "<br><br>GLOWH-kb contains data taken from published literature " +
    "on the impact of weather and air pollutants on health.";

let description_cont = "In this initial deployment of GLOWH-kb we have focused on asthma.<br><br>" +
    "The data is displayed in map, graphical, and tabular formats.";

//The impact of climate change on human health involves complex and dynamic interactions. These include shifting patterns of weather and fluctuating environmental pollutants against a backdrop of socio-economic conditions, population demographics, access
//to medical advances, and other factors. It is vital to understand the interplay between environment and health determinants as it applies to different geographic locations over time. Mere knowledge of the impact on a specific demographic is
//not enough. It is imperative that we supplement that information with data demonstrating different health outcomes on various population demographics in different geographic locations.
//GLOWH-kb is comprised of a backend database and public web application which gathers, catalogs, and broadcasts data from published literature that documents the impact of environmental factors on the health of a population in a geographic
//location.

let screen;
// 0 = logoImg
// 1 = help
// 2 = map
// 3 = graph
// 4 = table

let header = document.querySelector(".header");
let buttons = document.querySelector(".buttons");

let helpBtn = document.querySelector("#helpBtn");
let mapBtn = document.querySelector("#mapBtn");
let graphBtn = document.querySelector("#graphBtn");
let tableBtn = document.querySelector("#tableBtn");
let btns = [helpBtn, mapBtn, graphBtn, tableBtn];

let helpBtn_container;
let help_uiBtn;
let help_mapBtn;
let help_graphBtn;
let help_tableBtn;
let help_btns;
let help_content;

let help_screen;

let headerContent = document.querySelector(".header_content");
let h_ContentMargin = 20;

let content = document.querySelector(".content");

let footer = document.querySelector(".footer");
let credits = document.querySelector(".credits");
let update = document.querySelector(".update");

let logo = document.querySelector(".logo");
let logoImg = document.querySelector("#logo_img");

let onMain;

let logoHeight;
let footerHeight;
let h_Height;

let buttonsLeft;

let pubs;

let current_helpScroll;

let instructions;
let instructions_content;

// 0 - Diseases
// 1 - Air Pollutants
// 2 - Atm Parameters
let tableGraph_screen;

// Array of secondary parameters
let secondParam_array = [
    "Temperature",
    "Air Temperature",
    "Mean Temperature",
    "Minimum Temperature",
    "Maximum Temperature",
    "Dew point Temperature",
    "Diurnal Temperature range (DTR)",
    "Mean Monthly Air Temperature",
    "Humidity",
    "Relative Humidity",
    "Absolute Humidity",
    "Wind Speed",
    "Seasons",
    "Thunderstorm",
    "Rainfall",
    "Seasonal Variation"
];

// Array of markers
let marker_array = [
    "Air Pollutants",
    "Weather Parameters",
    "Pollen"
];

// Returns full list of pubs
// Used in "selected" window
function get_allPubs() {
    if (pubs == null) {
        return;
    }

    return pubs;
}

function jsonToPubs() {
    const url = "../json/pub_markers.json";

    function loadPubs(jsonString) {
        pubs = JSON.parse(jsonString);
    }

    ajax.downloadFile(url, loadPubs);
}

// Sets the transition speed for each of the elements within the method
function elementTransitions(trans) {
    header.style.transition = trans;
    buttons.style.transition = trans;
    footer.style.transition = trans;
    logoImg.style.transition = trans;
    logo.style.transition = trans;
}

// Positions each of the elements on the main page
function mainPage(trans) {
    elementTransitions(trans);

    footerHeight = footer.clientHeight;
    resizeFooterText();

    headerAndButtonPos(0.85 * window.innerHeight);

    if (onMain == true) {
        if (window.innerWidth >= 920) {
            logoImg.style.width = "50%";
            logo.style.height = logoImg.clientHeight.toString() + "px";
        } else {
            logoImg.style.width = "";
            logo.style.height = "";
        }
        logoHeight = logo.clientHeight;
        header.style.top = "0";
        credits.style.display = "block";
        update.style.display = "block";
        footer.style.height = "";
        footer.style.top = "";
    } else {
        if (window.innerWidth >= 920) {
            logoImg.style.width = "";
            logo.style.height = "";
        }
        logoHeight = logo.clientHeight;
        header.style.top = (-h_Height + logoHeight).toString() + "px";
        if (window.innerWidth >= 920) {
            buttonTop(logoHeight, 10);
        } else if (window.innerWidth < 920) {
            buttonTop(320, 200);
        }
        credits.style.display = "none";
        update.style.display = "none";
        footer.style.height = "0px";
        footer.style.top = (window.innerHeight).toString() + "px";


        create_instructPanel();
    }

    headerContentPos();
    contentPos();
}

// Changes the size of the text in footer, depending on the size of the screen
function resizeFooterText() {
    // Setting numbers to be dynamically changed by resolution
    // Width
    let width = 0;
    if (window.innerWidth >= 1100) {
        width = 1;
    } else if (window.innerWidth < 1100 && window.innerWidth > 720) {
        width = 2;
    } else if (window.innerWidth < 720 && window.innerWidth > 500) {
        width = 3;
    } else if (window.innerWidth <= 500) {
        width = 4;
    }
    // Height
    let height = 0;
    if (window.innerHeight >= 700) {
        height = 1;
    } else if (window.innerHeight < 700 && window.innerHeight > 600) {
        height = 2;
    } else if (window.innerHeight < 600 && window.innerHeight > 500) {
        height = 3;
    } else if (window.innerHeight <= 500) {
        height = 4;
    }

    if (width == 1 || height == 1) {
        changeFooterSize("");
    }
    if (width == 2 || height == 2) {
        changeFooterSize("1em");
    }
    if (width == 3 || height == 3) {
        changeFooterSize(".83em");
    }
    if (width == 4 || height == 4) {
        changeFooterSize(".67em");
    }

    function changeFooterSize(size) {
        credits.style.fontSize = size;
        update.style.fontSize = size;
    }
}

// Sets position (top and left) of both header and buttons
function headerAndButtonPos(headerHeight) {
    h_Height = headerHeight;

    // Header height/length
    header.style.height = (headerHeight).toString() + "px";

    // Buttons
    if (window.innerWidth >= 920) {
        buttonsLeft = (window.innerWidth / 2);
    } else if (window.innerWidth < 920) {
        buttonsLeft = (window.innerWidth / 2 - buttons.clientWidth / 2);
    }
    buttons.style.left = buttonsLeft.toString() + "px";

    buttonTop(headerHeight, 10);
}

// Quick method to set button top position
function buttonTop(headerHeight, btnMargin) {
    buttons.style.top = (headerHeight - buttons.clientHeight - btnMargin).toString() + "px";
}

// Sets position and size of content within the header
function headerContentPos() {

    if (window.innerWidth >= 920) {
        headerContent.style.width = ((header.clientWidth / 2) - h_ContentMargin).toString() + "px";
        headerContent.style.left = (h_ContentMargin).toString() + "px";
    } else {
        headerContent.style.width = (header.clientWidth - (2 * h_ContentMargin)).toString() + "px";
        headerContent.style.left = ((window.innerWidth / 2) - (headerContent.clientWidth / 2)).toString() + "px";
    }
    headerContent.style.height = (header.clientHeight - logoHeight - buttons.clientHeight - 2 * h_ContentMargin).toString() + "px";

    headerContent.style.top = (logoHeight + h_ContentMargin).toString() + "px";

}

// Sets position and size of the displayed content (map, graph, table)
function contentPos() {
    let inst_height = 0;
    if (instructions == null) {
        inst_height = 0;
    } else {
        inst_height = instructions.clientHeight;
    }

    content.style.top = (logoHeight + inst_height).toString() + "px";
    content.style.height = (window.innerHeight - logoHeight - inst_height).toString() + "px";
}

// Sets functionality of menu buttons
function buttonFunc() {
    logoImg.onclick = function() {
        onMain = true;
        mainPage("");
        screenTransition(screen, 0);

        for (let btn of btns) {
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }
    }
    helpBtn.onclick = function() {
        onMain = true;
        mainPage("");
        screenTransition(screen, 1);
        set_btnColor(helpBtn, "rgb(76, 168, 199)", "rgb(46, 46, 46)");
    }
    mapBtn.onclick = function() {
        onMain = false;
        mainPage("");
        screenTransition(screen, 2);
        set_btnColor(mapBtn, "rgb(69, 182, 69)", "rgb(153, 153, 153)");
    }
    graphBtn.onclick = function() {
        onMain = false;
        mainPage("");
        screenTransition(screen, 3);
        set_btnColor(graphBtn, "rgb(212, 53, 53)", "rgb(153, 153, 153)");
    }
    tableBtn.onclick = function() {
        onMain = false;
        mainPage("");
        screenTransition(screen, 4);
        set_btnColor(tableBtn, "rgb(233, 233, 74)", "rgb(46, 46, 46)");
    }
}

// Set button color
function set_btnColor(button, _bg, _color) {
    for (let btn of btns) {
        btn.style.backgroundColor = "";
        btn.style.color = "";
    }

    button.style.backgroundColor = _bg;
    button.style.color = _color;
}

function load_aboutInfo() {
    headerContent.innerHTML = "";

    let desc_elmnt = document.createElement("p");
    desc_elmnt.className = "description";
    desc_elmnt.id = "desc";
    desc_elmnt.innerHTML = description;

    let cont_elmnt = document.createElement("p");
    cont_elmnt.className = "description";
    cont_elmnt.id = "cont";
    cont_elmnt.innerHTML = description_cont;
    cont_elmnt.innerHTML += "<br><br>There are currently " + get_allPubs().length + " publications on display.";

    headerContent.appendChild(desc_elmnt);
    headerContent.appendChild(cont_elmnt);
}

function load_help() {
    headerContent.innerHTML = "";
    create_helpBtns();
    set_helpScreen();
    helpBtn_func();
    help_pos();
    help_content.scrollTop = current_helpScroll;
}

function create_helpBtns() {
    // Button container
    helpBtn_container = document.createElement("div");
    helpBtn_container.className = "helpBtn-container";
    headerContent.appendChild(helpBtn_container);

    // Create buttons
    help_btns = [];

    help_uiBtn = document.createElement("button");
    help_uiBtn.innerHTML = "Interface";
    helpBtn_container.appendChild(help_uiBtn);
    help_btns.push(help_uiBtn);

    help_mapBtn = document.createElement("button");
    help_mapBtn.innerHTML = "Map";
    helpBtn_container.appendChild(help_mapBtn);
    help_btns.push(help_mapBtn);

    help_graphBtn = document.createElement("button");
    help_graphBtn.innerHTML = "Graph";
    helpBtn_container.appendChild(help_graphBtn);
    help_btns.push(help_graphBtn);

    help_tableBtn = document.createElement("button");
    help_tableBtn.innerHTML = "Table";
    helpBtn_container.appendChild(help_tableBtn);
    help_btns.push(help_tableBtn);

    // Create help content div
    help_content = document.createElement("div");
    help_content.className = "help-content";
    headerContent.appendChild(help_content);
}

// Reposition help screen
function help_pos() {
    if (help_content == null) {
        return;
    }

    help_content.style.height = (headerContent.clientHeight - helpBtn_container.clientHeight - 20).toString() + "px";
}

// Set help button color
function set_helpBtn_color(screen) {
    for (let btn of help_btns) {
        btn.style.backgroundColor = "";
        btn.style.color = "";
    }

    help_btns[screen].style.backgroundColor = "rgb(17, 143, 44)";
    help_btns[screen].style.color = "rgb(255, 200, 82)";
}

// Help button functionality
function helpBtn_func() {
    help_uiBtn.onclick = function() {
        if (help_screen == 0) {
            return;
        }
        help_screen = 0;
        set_helpScreen();
        // Scroll
        help_content.scrollTop = current_helpScroll;
    }

    help_mapBtn.onclick = function() {
        if (help_screen == 1) {
            return;
        }
        help_screen = 1;
        set_helpScreen();
        // Scroll
        help_content.scrollTop = current_helpScroll;
    }

    help_graphBtn.onclick = function() {
        if (help_screen == 2) {
            return;
        }
        help_screen = 2;
        set_helpScreen();
        // Scroll
        help_content.scrollTop = current_helpScroll;
    }

    help_tableBtn.onclick = function() {
        if (help_screen == 3) {
            return;
        }
        help_screen = 3;
        set_helpScreen();
        // Scroll
        help_content.scrollTop = current_helpScroll;
    }
}

// Help screen text display
// Dependant on help screen
function set_helpScreen() {
    set_helpBtn_color(help_screen);

    help_content.innerHTML = "";
    let help_str = "";

    switch (help_screen) {
        case 0:
            help_str += "<h1>Interface</h1>";
            help_str += "<p>Click on the Glowh-kb logo at the top of the screen " +
                "to return to the main page and read more about Glowh-kb.</p>";
            help_str += "<p>Click on each of the three buttons next to the “Help” button " +
                "to view the publications through different interfaces (Map, Graph, and Table).</p>";
            help_str += "<h2>Filter:</h2>";
            help_str += "<img src=\"../style/screenshots/filter_btn.png\">";
            help_str += "<p>When viewing the data, a button labelled as “Show filter” will appear" +
                " in the bottom-right corner of the screen. Click on it to reveal the data filter." +
                "This will allow you to show or hide data based on the attributes that are currently selected.</p>";
            help_str += "<img id=\"filter_img\" src=\"../style/screenshots/filter.png\">";
            help_str += "<p>In the top left corner of the filter is the “Select/Deselect all” button. ";
            help_str += "Clicking on this will allow you to either select or deselect every item in the filter.</p>";
            help_str += "<img id=\"select_img\" src=\"../style/screenshots/select_all.png\">";
            help_str += "<img id=\"deselect_img\" src=\"../style/screenshots/deselect_all.png\">";
            help_str += "<p>On top of the Air Pollutants, Weather Parameters, and Pollen columns, there are icons " +
                "representing each column. These icons are also checkboxes. Click on them to select or deselect every item " +
                "in their respective column.</p>";
            help_str += "<p>At the bottom of the filter is the “Study period” slider. Click on the checkbox on the left " +
                "side to active at. Once the slider is active, you can move the thumb left and right to view publications " +
                "that were actively being worked on during a specific year.</p>";
            help_str += "<img id=\"slider_img\" src=\"../style/screenshots/slider.png\">";
            help_str += "<h2>Information window:</h2>";
            help_str += "<img id=\"window_img\" src=\"../style/screenshots/window.png\">";
            help_str += "<p>Windows can be dragged around the screen using the top bar.</p>";
            help_str += "<p>When viewing a publication’s information, you can click on the title of the publication to " +
                "access the full study in another tab.</p>";
            help_str += "<h2>Secondary Weather Parameter icons:</h2>";
            help_str += "<table>";
            for (let param of secondParam_array) {
                help_str += "<tr>";
                help_str += "<td><img id=\"help_iconImg\" src=\"" + ui.getIcon(param) + "\"></td>";
                help_str += "<td>" + param + "</td>";
                help_str += "</tr>";
            }
            help_str += "</table>";
            break;
        case 1:
            help_str += "<h1>Map</h1>";
            help_str += "<p>On the Map screen, you can view the different publications " +
                "based on their locations around the world. Each publication is represented " +
                "by a marker, like this: ";
            help_str += "<img id=\"help_pointImg\" src=\"../style/icons/point.png\"></p>";
            help_str += "<p>The different icons surrounding each marker represent the " +
                "type of impact that each publication discusses. The meaning behind each icon is displayed here:</p>";
            help_str += "<table>";
            for (let marker of marker_array) {
                help_str += "<tr>";
                help_str += "<td><img id=\"help_markerImg\" src=\"" + ui.getIcon(marker) + "\"></td>";
                help_str += "<td>" + marker + "</td>";
                help_str += "</tr>";
            }
            help_str += "</table>";
            help_str += "<p>Click on a marker in order to view the information from each publication. " +
                "If multiple publications are from an identical location, clicking on that marker will " +
                "open up a menu in which each publication can be selected to view.</p>";
            break;
        case 2:
            help_str += "<h1>Graph</h1>";
            help_str += "<p>On the Graph screen, the publications will be displayed on a bar graph. Each of the columns represents a different continent.</p>";
            help_str += "<p>Above the graph are three buttons- Diseases, Air Pollutants, and Weather Parameters. Click on each of these buttons to sort the publications out based on the corresponding category.</p>";
            help_str += "<img id=\"help_buttonsImg\" src=\"../style/screenshots/graphTable_buttons.png\">";
            help_str += "<p>Clicking on a colored bar will open up a menu where each of the publications that bar represents can be selected, in order to view its information.</p>";
            break;
        case 3:
            help_str += "<h1>Table</h1>";
            help_str += "<p>On the Table screen, the publications will be displayed in a table. </p>";
            help_str += "<p>At the very top are three buttons- Diseases, Air Pollutants, and Weather Parameters. Click on each of these buttons to sort the publications out based on the corresponding category.</p>";
            help_str += "<img id=\"help_buttonsImg\" src=\"../style/screenshots/graphTable_buttons.png\">";
            help_str += "<p>Below the buttons is a row of checkboxes. These checkboxes allow the user to show or hide any of the columns pertaining to the Publications’ IDs, Titles, and Locations.</p>";
            help_str += "<p>Clicking on a publication in the table will let you view the publication’s information.</p>";
            break;
    }

    help_content.innerHTML = help_str;
}

// Creates instructions panel just below the logo
function create_instructPanel() {
    if (instructions != null) {
        return;
    }

    if (instructions_content != null) {
        return;
    }

    instructions = document.createElement("div");
    instructions.className = "instructions";
    document.body.appendChild(instructions);

    instructions_content = document.createElement("div");
    instructions_content.className = "instructions_content";
    instructions.appendChild(instructions_content);

    instructPanel_posSize();
}

// Instructions panel position
function instructPanel_pos() {
    if (instructions == null) {
        return;
    }

    if (instructions_content == null) {
        return;
    }

    instructions.style.top = (logo.clientHeight).toString() + "px";

    // Instructions content
    instructions_content.style.left = (instructions.clientWidth / 2 - instructions_content.clientWidth / 2).toString() + "px";
    instructions_content.style.top = (instructions.clientHeight - instructions_content.offsetHeight).toString() + "px";
}

// Instructions panel size
function instructPanel_size() {
    if (instructions == null) {
        return;
    }

    if (instructions_content == null) {
        return;
    }

    if (window.innerWidth > 920) {
        instructions.style.height = "70px";
    } else {
        instructions.style.height = "130px";
    }
}

function instructPanel_posSize() {
    instructPanel_size();
    instructPanel_pos();
}

function change_instructions() {
    if (instructions_content == null) {
        return;
    }

    let inst_str = "";

    switch (screen) {
        case 2:
            inst_str += "<p>"
            for (let marker of marker_array) {
                inst_str += marker + " = <img id=\"help_markerImg\" style=\"width: 30px\" src=\"" + ui.getIcon(marker) + "\">" + "&nbsp&nbsp&nbsp&nbsp&nbsp";
            }
            inst_str += "</p>";
            break;
        case 3:
            inst_str += "<p>Mouse over on the graph for more details. Click on a colored bar for publication info." +
                " You can also click on the boxes in the Legend, to show or hide the corresponding columns.</p>";
            break;
        case 4:
            inst_str += "<p>Click on a table row to view info on a publication.</p>";
            break;
    }

    instructions_content.innerHTML = inst_str;
}

// Sets fading animation for changing between two screens
function screenTransition(startScreen, endScreen) {
    if (screen == endScreen) {
        return;
    }

    let fadeOut_element, fadeIn_element;
    if (startScreen == 0 || startScreen == 1) {
        fadeOut_element = headerContent;
    } else {
        fadeOut_element = content;
    }

    if (endScreen == 0 || endScreen == 1) {
        fadeIn_element = headerContent;
    } else {
        fadeIn_element = content;
    }



    fadeOut_element.style.opacity = 0;
    setTimeout(
        function() {
            closeScreen(startScreen);
            screen = endScreen;
            openScreen(screen);
            fadeIn_element.style.opacity = 1;
        }, 250
    );
}

// Sets which screen is displayed, depending on the screen number (See very top of code!)
function openScreen(scr) {
    switch (scr) {
        case 0:
            load_aboutInfo();
            break;
        case 1:
            load_help();
            break;
        case 2:
            map.open();
            change_instructions();
            break;
        case 3:
            graph.open();
            change_instructions();
            break;
        case 4:
            table.open();
            change_instructions();
            break;
    }
}

// Calls reposition method based on the current screen
function reposScreen(scr) {
    switch (scr) {
        case 0:
            break;
        case 1:
            help_pos();
            break;
        case 2:
            break;
        case 3:
            graph.posSize();
            break;
        case 4:
            table.posSize();
            break;
    }
}

// Closes the current screen (map, table, graph)
function closeScreen(scr) {
    switch (scr) {
        case 1:
            current_helpScroll = help_content.scrollTop;
            break;
        case 2:
            map.close();
            break;
        case 3:
            graph.close();
            break;
        case 4:
            table.close();
            break;
    }
}

// Initialize screen
function init() {
    jsonToPubs();
    screen = 0;
    tableGraph_screen = 0;
    onMain = true;
    help_screen = 0;
    buttonFunc();
    mainPage("top 0s");
    reposition();
    setTimeout(function() {
        filter.load(pubs);
        openScreen(screen);
    }, 100);
}

// Called whenever the size of the window is changed
function reposition() {
    document.body.onresize = function() {
        instructPanel_posSize();
        mainPage("top 0s");
        reposScreen(screen);
        filter.pos();
        ui.windows_posSize();
    };
}

// Helper functions for other .js files
// Add an item to an array - checks if item already exists in array first
function addToArray(item, array) {
    if (array.length == 0) {
        array.push(item);
    }

    if (!(array.includes(item))) {
        array.push(item);
    }
}

// Returns current screen
// To be used by filter after fitlering publications
function getCurrentScreen() {
    return screen;
}

function get_tableGraph_screen() {
    return tableGraph_screen;
}

function set_tableGraph_screen(_screen) {
    tableGraph_screen = _screen;
}

export { init, addToArray, getCurrentScreen, get_allPubs, get_tableGraph_screen, set_tableGraph_screen };