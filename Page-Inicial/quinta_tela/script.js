let countdown = 5;
    const timerElement = document.getElementById("timer");
    const interval = setInterval(() => {
        countdown--;
        timerElement.textContent = countdown;
        if (countdown === 0) {
            clearInterval(interval);
            window.location.href = "index.html";
        }
    }, 1000);

    function redirectHome() {
        clearInterval(interval);
        window.location.href = "index.html";
    }