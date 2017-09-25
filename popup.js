var lastUpdated = 0;

function activate() {
    var gatheredData = [];
    for (var index = 0; index < localStorage.length; index++) {
        var key = localStorage.key(index);
        var data = JSON.parse(localStorage.getItem(key));
        data.timestamp = Number(key);
        gatheredData.push(data);

        lastUpdated = lastUpdated < Number(key) ? Number(key) : lastUpdated;
    }

    calculateTimes(gatheredData);
    updateStats(lastUpdated);

    updateDiagTime();
    updateDiagSize();
}

function customSort(a, b) {
    if (a.timestamp < b.timestamp)
        return -1;
    if (a.timestamp > b.timestamp)
        return 1;
    return 0;
}

function updatedSpeedHtml(newTimes, length, id) {
    if(newTimes.length < length) { return; }
    
    var slicedTimes = newTimes.slice(0, length);
    sum = slicedTimes.reduce(function (a, b) {
        return a + b;
    });
    avg = sum / length;
    document.getElementById('speed10').innerHTML = Math.ceil(avg / 1000);
}

function calculateSpeed(times) {
    var newTimes = [];
    var sum, avg;
    for (var index = 0; index < times.length; index++) {
        var element = times[index];
        var nextElem = times[index + 1];

        if (nextElem == undefined) {
            break;
        }
        newTimes.push(element - nextElem);
    }

    updatedSpeedHtml(newTimes, 10, 'speed10');
    updatedSpeedHtml(newTimes, 50, 'speed50');
    updatedSpeedHtml(newTimes, 100, 'speed100');
    updatedSpeedHtml(newTimes, 500, 'speed500');
}

function calculateTimes(gatheredData) {
    gatheredData.sort(customSort);
    var current = gatheredData[gatheredData.length - 1];
    var lastLvl, counter = 0,
        sum, avg;
    var times = [];
    for (var index = gatheredData.length - 1; index > 0; index--) {
        var element = gatheredData[index];
        if (element.currentLvl == current.currentLvl) {
            continue;
        }

        if (lastLvl == undefined) {
            counter += 1;
            lastLvl = element.currentLvl;
            times.push(element.timestamp);
            continue;
        }

        if (lastLvl > element.currentLvl) {
            counter += 1;
            times.push(element.timestamp);
        }
    }
    times = times.slice(0, 501);
    calculateSpeed(times);
}

function updateStats(timestamp) {
    var data = localStorage.getItem(timestamp);
    data = JSON.parse(data);
    document.getElementById('statLvl').innerHTML = data.currentLvl;
    document.getElementById('statRunes').innerHTML = data.runes;
    document.getElementById('statKeys').innerHTML = data.keys;
    document.getElementById('statChests').innerHTML = data.chestsCharged;
}

function updateDiagTime() {
    var d = new Date(lastUpdated);
    var n = d.toLocaleString();
    document.getElementById('diagTime').innerHTML = "Last updated: " + n;
}

function updateDiagSize() {
    var _lsTotal = 0,
        _x;
    for (_x in localStorage) {
        _lsTotal += ((localStorage[_x].length + _x.length) * 2);
    };
    document.getElementById('diagSize').innerHTML = "DB size = " + (_lsTotal / 1024).toFixed(2) + " KB";
}

activate();