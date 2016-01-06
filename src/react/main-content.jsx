'use strict';
var React = require('react');
var moment = require('moment');

function drawBasic() {
    //https://google-developers.appspot.com/chart/interactive/docs/gallery/linechart
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Temperature');
    data.addColumn('number', 'Humidity');

    data.addRows([
    [1, 10, 70],  [2, 23, 70],  [3, 17, 70],  [4, 18, 70],  [5, 9, 70],
    [6, 11, 70],  [7, 27, 70],  [8, 33, 50],  [9, 40, 60],  [10, 32, 50], [11, 35, 70],
    [12, 30, 70], [13, 40, 40], [14, 42, 70], [15, 47, 80], [16, 44, 90], [17, 48, 70],
    [18, 52, 70], [19, 54, 70], [20, 42, 70], [21, 55, 70], [22, 56, 70], [23, 57, 70], [24, 57, 70]
    ]);

    var options = {
    curveType: 'function',
    hAxis: {
        title: 'Time, hours'
    }
    };

    var chart = new google.visualization.LineChart(document.querySelector('.chartDiv'));

    chart.draw(data, options);
}

module.exports = React.createClass({
    locationSelection: function(e) {
        console.log('main');
    },
    componentDidMount: function() {
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawBasic);
    },
    render: function() {

        return (
            <div className="mainContent">
                <div className="chartDiv"></div>
            </div>
        );
    }
});
