let reminderInterval;
let reminderTimeout;

function showWaterReminder() {
    $('#water-reminder-modal').modal('show');
    playAudio("audio/water-splash.mp3");

    setTimeout(function() {
        $('#water-reminder-modal').modal('hide'); // Hide modal after 5 minutes (300000 ms)
    }, 300000);
}

function scheduleReminder(startHour = 8, totalHours = 12) {
    let now = new Date();
    let endHour = startHour + totalHours - 1; // Calculate the last active hour

    function shouldRunReminder(hour) {
        return hour >= startHour && hour <= endHour;
    }

    // Calculate time until the next full hour
    let minutesUntilNextHour = 60 - now.getMinutes();
    let millisecondsUntilNextHour = minutesUntilNextHour * 60 * 1000;

    reminderTimeout = setTimeout(() => {
        let now = new Date();
        let hour = now.getHours();

        if (shouldRunReminder(hour)) {
            showWaterReminder();
        }

        reminderInterval = setInterval(() => {
            let now = new Date();
            let hour = now.getHours();

            console.log(`Current hour: ${hour}`);

            if (shouldRunReminder(hour)) {
                showWaterReminder();
            } else {
                clearInterval(interval); // Stop running reminders outside the range
            }
        }, 3600000); // Repeat every hour

        reminderTimeout = null;
    }, millisecondsUntilNextHour); // Wait until the next full hour
}
