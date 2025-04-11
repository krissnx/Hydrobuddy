$(document).ready(function() {

    let program = 'easy';
    let waterAmount = 1500;
    let totalHours = 12;
    let startHour = 8;

    $.get('title.html', function(response) {
        $(".content-box").html(response);
    });

    $('#start-hour').change(function() {
        startHour = parseInt($(this).val());
    });

    $("body").on('click', '.start-button', function() {
        var button = $(this);
        playAudio("audio/game-start.mp3");

        // Add the animation class
        button.css('animation', 'disappearPop 0.5s ease-in-out forwards');

        // Disable the button after the animation completes
        setTimeout(function() {
            button.hide().css('animation', 'unset');
        }, 500);

        setTimeout(function() {
            $('.programs-field').css('display', 'flex');
            $('.programs-field').css('opacity', 1);
        }, 500);
    });

    $('body').on('click', '.program-choice-field .button', function() {
        var button = $(this);
        playAudio("audio/selection.mp3");

        if(button.hasClass('selected') == false) {
            $('.program-choice-field .button').removeClass('selected');
            button.addClass('selected');

            switch(button.val()) {
                case "Easy":
                    $("#droppy").attr("src", "img/droppy-happy.png");
                    $('.program-title span').html('A Sip to Start <i class="fa-solid fa-droplet"></i>');
                    $('.program-details span').html('Stay lightly refreshed—just a few sips to keep you going !');
                    $('.program-goal span').html('1/2L per day');
                    break;

                case "Normal":
                    $("#droppy").attr("src", "img/droppy-interested.png");
                    $('.program-title span').html('Hydration Hero <i class="fa-solid fa-droplet"></i><i class="fa-solid fa-droplet"></i>');
                    $('.program-details span').html('Level up your water game—fuel your body with a liter a day !');
                    $('.program-goal span').html('1L per day');
                    break;

                case "Hard":
                    $("#droppy").attr("src", "img/droppy-ready.png");
                    $('.program-title span').html('Aqua Champion <i class="fa-solid fa-droplet"></i><i class="fa-solid fa-droplet"></i><i class="fa-solid fa-droplet"></i>');
                    $('.program-details span').html('Go all in! Conquer the ultimate hydration challenge and feel amazing !');
                    $('.program-goal span').html('2L per day');
                    break;
            }
        }
    });

    $("body").on('click', '#start-game', function(event) {
        event.preventDefault();
        playAudio("audio/game-start.mp3");

        program = $('.program-choice-field .button.selected').val();
        switch(program) {
            case "Easy":
                    waterAmount = 500;
                    break;

                case "Normal":
                    waterAmount = 1000;
                    break;

                case "Hard":
                    waterAmount = 2000;
                    break;
        }

        $('.options-icon-field, .options-field').hide();

        $.get('interface.html', function(response) {
            $("#droppy").fadeOut(200);
            $(".content-box").css('animation', 'disappearPop 0.5s ease-in-out');
            setTimeout(function() {
                $(".content-box").html(response);
                generateHours();
                $(".content-box").css('animation', 'popIn 0.5s ease-in-out forwards', 1);
                setTimeout(() => {
                    $("#droppy").css("top", "25px").css("left", "310px").fadeIn(200);
                    $('.expected-level').css('top', $($('.circle')[0]).offset().top + 'px')
                                        .css('display', 'block')
                                        .css('animation', 'popIn 0.5s ease-in-out', 1);
                }, 500);
                setTimeout(() => {
                    updateExpectedLevelArrow();
                }, 1000);
                scheduleReminder();
            }, 500);
        });
    });

    function generateHours() {
        let container = $('#program-hours');
        let waterAmountPerHour = waterAmount / totalHours; // Water amount per hour
    
        // Loop through the hours from startHour for totalHours
        for (let i = startHour; i < startHour + totalHours; i++) {
            let hourLabel = '';
            let hour = i % 24;  // Ensure the hour stays within 24-hour format
            let waterAmount = Math.round(waterAmountPerHour * (i - startHour + 1)); // Calculate water amount for the current hour
    
            // Determine AM/PM format
            if (hour < 12) {
                hourLabel = `${hour === 0 ? 12 : hour}AM`; // Handle 12AM for midnight
            } else if (hour === 12) {
                hourLabel = `12PM`; // Handle 12PM for noon
            } else {
                hourLabel = `${hour - 12}PM`; // Convert PM hours to 12-hour format
            }
    
            // Create the HTML for the current hour
            let hourDiv = `
                <div class="box">
                    <div class="hour">
                        <span>${hourLabel}</span>
                    </div>
                    <div class="circle" id="${i}"></div>
                    <div class="water-amount">
                        <span>${waterAmount}ml</span>
                    </div>
                </div>
            `;
            container.append(hourDiv); // Append the generated HTML to the container
        }
    }
    

    
    $('body').on('click', '.circle', async function() {
        let circles = $('.circle');
        let lastCheckedCircleIndex = $.inArray($('.circle.checked').last()[0], $('.circle'))
        let clickedCircleIndex = $.inArray(this, circles);


        if(lastCheckedCircleIndex == -1 || lastCheckedCircleIndex < clickedCircleIndex) {
            $("#droppy").attr("src", "img/droppy-surprised.png");
            for (let i = lastCheckedCircleIndex === -1 ? 0 : lastCheckedCircleIndex + 1; i <= clickedCircleIndex; i++) {
                await adjustGauge($('.circle')[i], 'down');
                if (i == clickedCircleIndex) {
                    displayPhrases(i);
                    $("#droppy").attr("src", "img/droppy-excited.png");
                    setTimeout(() => {
                        $("#droppy").attr("src", "img/droppy-happy.png");
                    }, 2000);
                }
            }
        }
        else {
            $("#droppy").attr("src", "img/droppy-sad.png");
            for (let i = lastCheckedCircleIndex; i > clickedCircleIndex; i--) {
                await adjustGauge($('.circle')[i], 'up'); // Wait for each step before moving to the next
            }
            $("#droppy").attr("src", "img/droppy-happy.png");
        }
    });

    $('#water-reminder-modal').on('hidden.bs.modal', function () {
        updateExpectedLevelArrow();
    });

    $('.options-icon-field').click(function () {
        $('.options-field').toggleClass('hide');
    });

    $('.options-field .color').click(function () {
        $('.options-field .color').removeClass('selected');
        $(this).addClass('selected');
        changeBackgroundColor($(this).attr('id'));
    });

    function changeBackgroundColor(color) {
        // Define the gradients in an object
        const gradients = {
            cyanpink: 'linear-gradient(270deg, #FFAED7, #E9D1DE, #DBE5E5, #C5FFFE)',
            salmonblue: 'linear-gradient(270deg, #FF9B9A, #E3C1C2, #BFD4E5, #A3C6DD)',
            mintlavender: 'linear-gradient(270deg, #B2F7EF, #D6C7FF, #E8DFFF, #A0E4CB)',
            peachseafoam: 'linear-gradient(270deg, #FFCBA4, #F7E7CE, #C3FBD8, #A2E1DB)',
            twilightblue: 'linear-gradient(270deg, #A7C7E7, #8FA7C4, #6D90C2, #4E7496)',
            sunlitcoral: 'linear-gradient(270deg, #FFB69F, #FFD1BA, #FFEAD4, #F4C2C2)',
        };
    
        // Check if the color exists in the gradients object
        if (gradients[color]) {
            // Apply the gradient background
            $('body').css({
                'background': gradients[color],
                'background-size': '400% 400%',
                'animation': 'gradientAnimation 10s ease infinite'
            });
        } else {
            console.log('Color not recognized');
        }
    }

    $('body').on('click', '.end-game', function() {
        $('#end-game-modal').modal('show');
    });

    $('body').on('click', '#end-game-modal .cancel', function() {
        $('#end-game-modal').modal('hide');
    });

    $('body').on('click', '#end-game-modal .confirm', function() {
        $('#end-game-modal').modal('hide');
        $('#droppy').fadeOut(500);
        $('.sub-container, .end-game, .content-container').fadeOut(500);
        clearInterval(reminderInterval);
        clearTimeout(reminderTimeout);
        setTimeout(() => {
            $.get('title.html', function(response) {
                $('.content-box').html(response);
                $('.content-container').fadeIn(500);
            });
        }, 600);
    });
});