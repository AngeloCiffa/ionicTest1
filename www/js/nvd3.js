angular.module('nvd3', ['d3'])
    .factory('nvd3Service', ['$document', '$q', '$rootScope', 'd3Service',
            function($document, $q, $rootScope, d3Service) {

                d3Service.d3().then(function(d3) {
                        var d = $q.defer();

                        function onScriptLoad() {
                            // Load client in the browser
                            $rootScope.$apply(function() {
                                d.resolve(window.nv);
                            });
                        }
                        // Create a script tag with nvd3 as the source
                        // and call our onScriptLoad callback when it
                        // has been loaded
                        var nvd3ScriptTag = $document[0].createElement('script');
                        nvd3ScriptTag.type = 'text/javascript';
                        nvd3ScriptTag.async = true;
                        nvd3ScriptTag.src = 'lib/nvd3/nv.d3.min.js';
                        nvd3ScriptTag.onreadystatechange = function() {
                            if (this.readyState == 'complete') onScriptLoad();
                        }
                        nvd3ScriptTag.onload = onScriptLoad;

                        var nvd3DirectivesScriptTag = $document[0].createElement('script');
                        nvd3DirectivesScriptTag.type = 'text/javascript';
                        nvd3DirectivesScriptTag.async = true;
                        nvd3DirectivesScriptTag.src = 'lib/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.min.js';

                        var s = $document[0].getElementsByTagName('body')[0];
                        s.appendChild(nvd3ScriptTag);
                        s.appendChild(nvd3DirectivesScriptTag);

                        return {
                            nvd3: function() {
                                return d.promise;
                            }
                        };
                    })
                }]);
