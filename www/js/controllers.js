angular.module('starter.controllers', ['d3', 'nvd3'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [{
        title: 'Reggae',
        id: 1
    }, {
        title: 'Chill',
        id: 2
    }, {
        title: 'Dubstep',
        id: 3
    }, {
        title: 'Indie',
        id: 4
    }, {
        title: 'Rap',
        id: 5
    }, {
        title: 'Cowbell',
        id: 6
    }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.directive('myFirstNvd3Chart', ['nvd3Service',

    function(nvd3Service) {
        //Generate some nice data.
        function sinAndCos() {
            var sin = [],
                sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({
                    x: i,
                    y: Math.sin(i / 10)
                });
                sin2.push({
                    x: i,
                    y: Math.sin(i / 10) * 0.25 + 0.5
                });
                cos.push({
                    x: i,
                    y: .5 * Math.cos(i / 10)
                });
            }

            //Line chart data should be sent as an array of series objects.
            return [{
                values: sin, //values - represents the array of {x,y} data points
                key: 'Sine Wave', //key  - the name of the series.
                color: '#ff7f0e' //color - optional: choose your own line color.
            }, {
                values: cos,
                key: 'Cosine Wave',
                color: '#2ca02c'
            }, {
                values: sin2,
                key: 'Another sine wave',
                color: '#7777ff',
                area: true //area - set to true if you want this line to turn into a filled area chart.
            }];
        };

        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                nvd3Service.nvd3().then(function(nv) {
                    nv.addGraph(function() {
                        var chart = nv.models.lineChart()
                            .margin({
                                left: 100
                            }) //Adjust chart margins to give the x-axis some breathing room.
                            .useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
                            .transitionDuration(350) //how fast do you want the lines to transition?
                            .showLegend(true) //Show the legend, allowing users to turn on/off line series.
                            .showYAxis(true) //Show the y-axis
                            .showXAxis(true) //Show the x-axis
                        ;

                        chart.xAxis //Chart x-axis settings
                        .axisLabel('Time (ms)')
                            .tickFormat(d3.format(',r'));

                        chart.yAxis //Chart y-axis settings
                        .axisLabel('Voltage (v)')
                            .tickFormat(d3.format('.02f'));

                        /* Done setting the chart up? Time to render it!*/
                        var myData = sinAndCos(); //You need data...

                        d3.select('#chart svg') //Select the <svg> element you want to render the chart in.   
                        .datum(myData) //Populate the <svg> element with chart data...
                        .call(chart); //Finally, render the chart!

                       
                          chart.update();
                        return chart;
                    });
                })
            }
        }
    }

])

.directive('barChart', ['d3Service',
    function(d3Service) {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    var svg = d3.select(element[0])
                        .append("svg").style('width', '100%');

                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // hard-code data
                    scope.data = [{
                        name: "test",
                        score: 98
                    }, {
                        name: "testtt",
                        score: 96
                    }, {
                        name: 'teteste',
                        score: 75
                    }, {
                        name: "tetetet",
                        score: 48
                    }];


                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.data);
                    });


                    // define render function
                    scope.render = function(data) {
                        // remove all previous items before render
                        svg.selectAll("*").remove();

                        // setup variables
                        var width, height, max;
                        width = d3.select(element[0].firstElementChild.offsetWidth - 20);
                        // 20 is for margins and can be changed
                        height = scope.data.length * 35;
                        // 35 = 30(bar height) + 5(margin between bars)
                        max = 98;
                        // this can also be found dynamically when the data is not static
                        // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

                        // set the height based on the calculations above
                        svg.attr('height', height);

                        //create the rectangles for the bar chart
                        svg.selectAll("rect")
                            .data(data)
                            .enter()
                            .append("rect")
                            .on("click", function(d, i) {
                                return scope.onClick({
                                    item: d
                                });
                            })
                            .attr("fill", "#E8712F")
                            .attr("height", 30) // height of each bar
                        .attr("width", 0) // initial width of 0 for transition
                        .attr("x", 10) // half of the 20 side margin specified above
                        .attr("y", function(d, i) {
                            return i * 35;
                        }) // height + margin between bars
                        .transition()
                            .duration(1000) // time of duration
                        .attr("width", function(d) {
                            return d.score / (max / width);
                        }); // width based on scale

                        svg.selectAll("text")
                            .data(data)
                            .enter()
                            .append("text")
                            .attr("fill", "#fff")
                            .attr("y", function(d, i) {
                                return i * 35 + 22;
                            })
                            .attr("x", 15)
                            .text(function(d) {
                                return d[scope.label];
                            });

                    };

                    scope.render(scope.data);

                });
            } //end link
        }
    }
]);
