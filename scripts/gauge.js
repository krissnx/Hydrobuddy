const phrases = [
    "Great start ! Your body is already thanking you !💧",
    "Keep going ! Hydration is your superpower! ⚡",
    "Refreshing, right? Stay on track! 🍃",
    "Hydration boost incoming ! 🚀",
    "Your skin, brain, and body love this ! ✨",
    "Halfway there! Keep going! 💙",
    "Power up with water! ⚡",
    "Stay strong, stay hydrated! 💪",
    "Almost there! Just a few more sips! 💦",
    "You're a hydration hero! 🦸‍♂️",
    "Last step, finish strong! 🔥",
    "Mission complete! Hydration success! 🎉"
];

function updateExpectedLevelArrow() {
    let currentHour = new Date().getHours();
    let circles = $('.circle');

    // Get the first and last circle elements
    let firstCircle = $(circles[0]);
    let lastCircle = $(circles[circles.length - 1]);

    let topValue;

    if (currentHour < parseInt($(firstCircle).attr('id'))) {
        topValue = $(firstCircle).offset().top;
    }
    else if (currentHour > parseInt($(lastCircle).attr('id'))) {
        topValue = $(lastCircle).offset().top;
    }
    else {
        let currentCircle = $('.circle#' + currentHour);
        topValue = currentCircle.offset().top;
    }

    $('.expected-level').css('top', topValue + 'px');
}

function adjustGauge(circle, direction) {
    return new Promise(resolve => {
        let circleTop = $(circle).offset().top;
        let gaugeContainerBottom = $('.gauge-container').offset().top + $('.gauge-container').outerHeight();
        let newHeight;

        if ($(circle).is($('.circle').first())) {
            newHeight = $('.gauge-full').height();
        }
        else if(direction == 'down') {
            newHeight = gaugeContainerBottom - circleTop;
        }
        else {
            let previousCircle = $(circle).closest('.box').prev().find('.circle');
            let previousCircleBottom = previousCircle.offset().top + previousCircle.outerHeight();
            newHeight = gaugeContainerBottom - previousCircleBottom;
        }

        adjustWaterLevel($.inArray(circle, $('.circle')), $('.circle').length);

        // Ensure the animation starts from the current height, not resetting to full
        if(direction == 'down') {
            $('.gauge-empty').stop().animate({ height: newHeight + 'px' }, 100, function() {
                $(circle).addClass('checked');
                let index = $.inArray(circle, $('.circle')) + 1;
                playAudio("audio/circle" + index + ".mp3");
                resolve();
            });
        }
        else {
            $(circle).removeClass('checked');
            $('.gauge-empty').stop().animate({ height: newHeight + 'px' }, 100, function() {
                resolve();
            });
        }
    });
}

function adjustWaterLevel(clickedCircleIndex, totalCircles) {
    let imgFile;
    let percentageToRemove = (clickedCircleIndex  * 100) / totalCircles;
    let newWaterLevel = 100 - percentageToRemove;
    newWaterLevel = Math.round(newWaterLevel / 5) * 5;

    if (clickedCircleIndex === totalCircles - 1) {
        newWaterLevel = 0;
    }

    if (clickedCircleIndex === 0) {
        newWaterLevel = 95;
    }

    imgFile = "bottle" + newWaterLevel + ".png";
    $("#water-bottle").attr("src", "img/" + imgFile);
}

function displayPhrases(index) {

    let phraseBox = $("#encouraging-phrase");
    phraseBox.text(phrases[index]);

    // Apply animation & show
    phraseBox.css({
        visibility: "visible",
        opacity: "1",
        animation: "wobble 0.5s ease-in-out infinite"
    });

    // Stay for 1.5s, then fade out
    setTimeout(() => {
        phraseBox.css({ opacity: "0" });

        setTimeout(() => {
            phraseBox.css("visibility", "hidden");
        }, 500);
    }, 1500);
}
