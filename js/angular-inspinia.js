/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function() {
    angular.module('inspinia', [
        'oc.lazyLoad', // ocLazyLoad
        'ui.bootstrap', // Ui Bootstrap,
    ]);


    /**
     * INSPINIA - Responsive Admin Theme
     *
     * Inspinia theme use AngularUI Router to manage routing and views
     * Each view are defined as state.
     * Initial there are written state for all view in theme.
     *
     */
    function config($ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });

    }
    angular
        .module('inspinia')
        .config(config);


    /**
     * pageTitle - Directive for set Page title - mata title
     */
    function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'INSPINIA | Responsive Admin Theme';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = 'INSPINIA | ' + toState.data.pageTitle;
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        }
    };

    /**
     * sideNavigation - Directive for run metsiMenu on sidebar navigation
     */
    function sideNavigation($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                // Call the metsiMenu plugin and plug it to sidebar navigation
                $timeout(function() {
                    $(element).metisMenu();
                });
            }
        };
    };

    /**
     * responsibleVideo - Directive for responsive video
     */
    function responsiveVideo() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var figure = element;
                var video = element.children();
                video
                    .attr('data-aspectRatio', video.height() / video.width())
                    .removeAttr('height')
                    .removeAttr('width')

                //We can use $watch on $window.innerWidth also.
                $(window).resize(function() {
                    var newWidth = figure.width();
                    video
                        .width(newWidth)
                        .height(newWidth * video.attr('data-aspectRatio'));
                }).resize();
            }
        }
    }


    /**
     * minimalizaSidebar - Directive for minimalize sidebar
     */
    function minimalizaSidebar($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-pogo-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function($scope, $element) {
                $scope.minimalize = function() {
                    $(window).trigger('hashchange');
                    var minimalize = $("body").toggleClass("mini-navbar").hasClass("mini-navbar");
                    localStorage.setItem('side-menu-minimalize', JSON.stringify(minimalize));
                    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        $('#side-menu').hide();
                        // For smoothly turn on menu
                        setTimeout(
                            function() {
                                $('#side-menu').fadeIn(500);
                            }, 100);
                    } else if ($('body').hasClass('fixed-sidebar')) {
                        $('#side-menu').hide();
                        setTimeout(
                            function() {
                                $('#side-menu').fadeIn(500);
                            }, 300);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        $('#side-menu').removeAttr('style');
                    }
                }

                var cachedMinimalize = JSON.parse(localStorage.getItem('side-menu-minimalize'));
                if (cachedMinimalize) {
                    $scope.minimalize();
                }
            }
        };
    };


    function closeOffCanvas() {
        return {
            restrict: 'A',
            template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
            controller: function($scope, $element) {
                $scope.closeOffCanvas = function() {
                    $("body").toggleClass("mini-navbar");
                }
            }
        };
    }

    /**
     * vectorMap - Directive for Vector map plugin
     */
    function vectorMap() {
        return {
            restrict: 'A',
            scope: {
                myMapData: '=',
            },
            link: function(scope, element, attrs) {
                element.vectorMap({
                    map: 'world_mill_en',
                    backgroundColor: "transparent",
                    regionStyle: {
                        initial: {
                            fill: '#e4e4e4',
                            "fill-opacity": 0.9,
                            stroke: 'none',
                            "stroke-width": 0,
                            "stroke-opacity": 0
                        }
                    },
                    series: {
                        regions: [{
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }]
                    },
                });
            }
        }
    }


    /**
     * sparkline - Directive for Sparkline chart
     */
    function sparkline() {
        return {
            restrict: 'A',
            scope: {
                sparkData: '=',
                sparkOptions: '=',
            },
            link: function(scope, element, attrs) {
                scope.$watch(scope.sparkData, function() {
                    render();
                });
                scope.$watch(scope.sparkOptions, function() {
                    render();
                });
                var render = function() {
                    $(element).sparkline(scope.sparkData, scope.sparkOptions);
                };
            }
        }
    };

    /**
     * icheck - Directive for custom checkbox icheck
     */
    function icheck($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue) {
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'

                    }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    }

    /**
     * ionRangeSlider - Directive for Ion Range Slider
     */
    function ionRangeSlider() {
        return {
            restrict: 'A',
            scope: {
                rangeOptions: '='
            },
            link: function(scope, elem, attrs) {
                elem.ionRangeSlider(scope.rangeOptions);
            }
        }
    }

    /**
     * dropZone - Directive for Drag and drop zone file upload plugin
     */
    function dropZone() {
        return function(scope, element, attrs) {
            element.dropzone({
                url: "/upload",
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 5,
                init: function() {
                    scope.files.push({
                        file: 'added'
                    });
                    this.on('success', function(file, json) {});
                    this.on('addedfile', function(file) {
                        scope.$apply(function() {
                            alert(file);
                            scope.files.push({
                                file: 'added'
                            });
                        });
                    });
                    this.on('drop', function(file) {
                        alert('file');
                    });
                }
            });
        }
    }

    /**
     * chatSlimScroll - Directive for slim scroll for small chat
     */
    function chatSlimScroll($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $timeout(function() {
                    element.slimscroll({
                        height: '234px',
                        railOpacity: 0.4
                    });

                });
            }
        };
    }

    /**
     * customValid - Directive for custom validation example
     */
    function customValid() {
        return {
            require: 'ngModel',
            link: function(scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function() {

                    // You can call a $http method here
                    // Or create custom validation

                    var validText = "Inspinia";

                    if (scope.extras == validText) {
                        c.$setValidity('cvalid', true);
                    } else {
                        c.$setValidity('cvalid', false);
                    }

                });
            }
        }
    }


    /**
     * fullScroll - Directive for slimScroll with 100%
     */
    function fullScroll($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $timeout(function() {
                    element.slimscroll({
                        height: '100%',
                        railOpacity: 0.9
                    });

                });
            }
        };
    }

    /**
     * slimScroll - Directive for slimScroll with custom height
     */
    function slimScroll($timeout) {
        return {
            restrict: 'A',
            scope: {
                boxHeight: '@',
                scrollEvent: '=',
                scrollingEvent: '=',
                hasScrollBar: '='
            },
            link: function(scope, element) {
                $timeout(function() {
                    var $slimScrollElement = element.slimscroll({
                        height: scope.boxHeight,
                        railOpacity: 0.9
                    });

                    scope.hasScrollBar = $slimScrollElement[0].scrollHeight > $slimScrollElement[0].offsetHeight;

                    if (angular.isFunction(scope.scrollEvent)) {
                        $slimScrollElement.bind('slimscroll', scope.scrollEvent);
                    }
                    if (angular.isFunction(scope.scrollingEvent)) {
                        $slimScrollElement.bind('slimscrolling', scope.scrollingEvent);
                    }
                });
            }
        };
    }

    /**
     * clockPicker - Directive for clock picker plugin
     */
    function clockPicker() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.clockpicker();
            }
        };
    };


    /**
     * landingScrollspy - Directive for scrollspy in landing page
     */
    function landingScrollspy() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.scrollspy({
                    target: '.navbar-fixed-top',
                    offset: 80
                });
            }
        }
    }

    /**
     * fitHeight - Directive for set height fit to window height
     */
    function fitHeight() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.css("height", $(window).height() + "px");
                element.css("min-height", $(window).height() + "px");
            }
        };
    }

    /**
     *
     * Pass all functions into module
     */
    angular
        .module('inspinia')
        .directive('pageTitle', pageTitle)
        .directive('sideNavigation', sideNavigation)
        .directive('minimalizaSidebar', minimalizaSidebar)
        .directive('vectorMap', vectorMap)
        .directive('sparkline', sparkline)
        .directive('icheck', icheck)
        .directive('ionRangeSlider', ionRangeSlider)
        .directive('dropZone', dropZone)
        .directive('responsiveVideo', responsiveVideo)
        .directive('chatSlimScroll', chatSlimScroll)
        .directive('customValid', customValid)
        .directive('fullScroll', fullScroll)
        .directive('closeOffCanvas', closeOffCanvas)
        .directive('clockPicker', clockPicker)
        .directive('landingScrollspy', landingScrollspy)
        .directive('fitHeight', fitHeight)
        .directive('slimScroll', slimScroll);

})();