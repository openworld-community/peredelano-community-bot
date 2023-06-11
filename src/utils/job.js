"use strict";

/**
 * @param {(args: any[]) => void} callback 
 * @param {number} interval 
 * @param {string} name
 */
const startJob = async (callback, interval, name) => {
    let timerID = setTimeout(function tick() {
        try {
            callback();
        } catch (err) {
            console.error(`[ERROR] ${name} job execution: ${err}`);
        }
        timerID = setTimeout(tick, interval)
    }, 0);

}

module.exports = {
    startJob: startJob,
};