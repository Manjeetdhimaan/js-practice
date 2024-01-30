self.onmessage = function (event) {
    if (event.data === 'startLoop') {
        handleLoop();
    }
};

function handleLoop() {
    for (let i = 0; i <= 9999; i++) {
        // Send each iteration result back to the main thread
        self.postMessage(i);
    }
}