/* 
To hold API response
*/
var result = [];

/* 
To hold State Names for dropdown
*/
var stateName = [];

/* 
To hold District Names for dropdown
*/
var districtName = [];

/* 
To provide data to chart
*/
var districtData = [];

/* 
To fetch data from API
*/
var getData = () => {
    const url = 'https://api.covid19india.org/state_district_wise.json'
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (data) {
                result = data;
                getStates();
            });
        })
        .catch(function () {
            // This is where you run code if the server returns any errors
        });
}

/* 
call to getData meathod
*/
getData();


/* 
To separate state names for dropdown
*/
var getStates = () => {
    var dropDown = document.querySelector('select');
    changedState = document.getElementById('stateSelect');
    for (var key in result) {
        stateName.push(key);
    }
    stateName.forEach(element => {
        dropDown.innerHTML += `<option value="${element}">${element}</option>`
    });
    changedState.addEventListener("change", function () {
        getDistrict();
        var disp=document.querySelector('.dist');
        if(disp.classList.contains('d-none')){
            disp.classList.remove('d-none');
        }
    });
}

/* 
To separate district names for dropdown
*/
var getDistrict = () => {
    districtName = [];
    var dropDown = document.getElementById('districtSelect');
    var changedDistrict = document.getElementById('districtSelect');
    var select = document.getElementById('stateSelect');
    var currentOpt = select.options[select.selectedIndex];
    var s = currentOpt.label;
    var temp = result[s]
    districtData = temp.districtData;
    for (var key in temp.districtData) {
        districtName.push(key);
    }
    var len = dropDown.options.length;
    for (i = len - 1; i >= 0; i--) {
        dropDown.options[i] = null;
    }
    districtName.forEach(element => {
        dropDown.innerHTML += `<option value="${element}">${element}</option>`
    });
    changedDistrict.addEventListener("change", function () {
        google.charts.setOnLoadCallback(drawChart);
    });
}

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    var select = document.getElementById('districtSelect');
    var currentOpt = select.options[select.selectedIndex];
    var d = currentOpt.label;
    var result = districtData[d];
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Persons'],
        ['Active', result.active],
        ['Confirmed', result.confirmed],
        ['Deceased', result.deceased],
        ['Recovered', result.recovered]
    ]);

    var options = {
        pieHole: 0.4,
        colors: ['#FF0000', '#1F45FC', '#FCDFFF', '#7FFFD4']
    };

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}