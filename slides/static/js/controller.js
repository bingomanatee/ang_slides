angular.module('slides', []).filter('currency',function () {

    return function (input, color) {
        return '$' + parseFloat(input).toFixed(2);
    }

}).filter('date',function () {
        return function (dt) {
            //  console.log('date time: ', dt);
            var d = new Date();
            d.setTime(dt);
            return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
        }
    }).filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });

function SlideCtrl($scope, $filter) {
    $scope.slides = [
        {label:'Home', file:'home.html', nav_class:'active'},
        {label:'Overview', file:'overview.html', 'nav_class':'', appear_speed:500, appear_delay:500}
    ]

    _.each($scope.slides, function (slide, i) {
        (function (slide) {
            slide.nav_class = '';
            slide.index = i;
            $.get('content/' + slide.file).success(function (content) {
                console.log('content for ', slide, ': ', content);
                slide.content = content;
                $scope.slide_index = 0;
                $scope.$digest();
            })
        })(slide);
    })


    $scope.load_slide = function (slide) {
        var i = _.isNumber(slide) ? slide : slide.index;
        $scope.slide_index = i;
        console.log('loading slide ', $scope.slide_index);
    }

    $scope.go = function (goto) {
        if (goto == 'home') {
            $scope.slide_index = 0;
        } else {
            $scope.slide_index += goto;
        }
        console.log('slide set to ', $scope.slide_index)
    }

    var appear_timeout = null;
    var appear_interval = null;

    function _update_index(index, old) {
        console.log('active slide set to ', $scope.slide);
        $scope.slides.forEach(function (slide) {
            slide.nav_class = (slide.index == $scope.slide_index) ? 'active' : '';
        })

        var current_slide = $scope.slides[$scope.slide_index];
        if (!current_slide) return;
        var delay = current_slide.appear_delay ? current_slide.appear_delay : 1500;
        delay = Math.max(1500, delay);
        
        console.log('current slide: ', current_slide);

        if (appear_timeout) {
            clearTimeout(appear_timeout);
            appear_timeout = false;
        }

        if (appear_interval) {
            clearInterval(appear_interval);
            appear_interval = false;
        }

        setTimeout(function () {
            appear_timeout = false;
            
            var appears = $('article .appear');
            console.log('appears length: ', appears.length);
            
            var appear_speed = current_slide.appear_speed;
            if (!appear_speed) {
                console.log('no show speed for ', sl);
                appear_speed = 2000;
            }

            if (appears) {
                appear_interval = setInterval(function () {

                    var first_hidden_appear = null;
                    appears.each(function(index, appear){
                        if (first_hidden_appear){
                            return;
                        }
                        if (!$(appear).data('shown')){
                            first_hidden_appear = appear;
                        }
                    });

                    if (first_hidden_appear) {
                        first_hidden_appear = $(first_hidden_appear);
                        first_hidden_appear.data('shown', 1);
                        first_hidden_appear.css('visibility', 'visible');
                        console.log('showing appear ', first_hidden_appear);
                    } else {
                        console.log('DONE SHOWING SLIDES');
                        clearInterval(appear_interval);
                        appear_interval = false;
                    }


                }, appear_speed);
            } else {
                console.log('NO APPEARS FOR ', current_slide);
            }

        }, delay);
    }

    $scope.$watch('slide_index', _update_index);

    $scope.nav_class = function (slide) {
        console.log('getting nav class for ', slide);
        var active = $scope.slide();
        if (!active) {
            console.log('no slide is active - no class for ', slide.label);
            return ''
        }
        if (active.index == slide.index) {
            console.log('active is ', slide.label, ': returning active');
            return 'active';
        }
        console.log('not a match - returning "" ', slide.label);
        return '';
    }

    $scope.slide = function () {
        return $scope.slides[$scope.slide_index];
    }

}

SlideCtrl.$inject = ['$scope', '$filter'];