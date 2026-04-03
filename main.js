const calcBoxPerPoot = (percent, seedAmount) => 2.6 * percent / (seedAmount / 100.0);

const tbody = document.getElementById('tbody');
const outputTotalEl = document.getElementById('outputTotal');
const dialog = document.getElementById('add-dialog');
const form = document.getElementById('add-form');

function printLine(plant, isOpened) {
    const trEl = document.createElement('tr');

    // Plant name
    trEl.innerHTML += `<td>${plant.name}</td>`;

    // Plant params
    trEl.innerHTML += `<td>${plant.percent}%<br/>${plant.seedsPerBox} bulbs<br/>${plant.boxCount} boxes</td>`;

    // Box needed
    let state = isOpened ? 'opened' : 'closed';
    let boxesNeeded = (plant.boxesNeeded == null) ? '—' : `${plant.boxesNeeded} (${state})`;
    trEl.innerHTML += `<td>${boxesNeeded}</td>`;

    tbody.appendChild(trEl);
}

function printTotalBoxes(total, pootRemain) {
    let pootState = (pootRemain <= 0) ? '' : '(maybe not full)';
    outputTotalEl.innerText = `${total} ${pootState}`;
}

let plants = [];

document.getElementById('new-plant').addEventListener('click', _ => {
    dialog.showModal();
});

document.getElementById('clean-plants').addEventListener('click', _ => {
    plants = [];
    tbody.innerHTML = '<tr><td>—</td><td>—</td><td>—</td></tr>'; // Empty line
    printTotalBoxes(0, 0.0);
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    plants.push(data);

    tbody.innerHTML = '';

    let pootAmount = 18.0;
    let totalBoxes = 0;
    let maxBoxes = 0.0;
    let maxBoxesPlantIndex = -1;
    plants.forEach((plant, index) => {
        if (pootAmount <= 0.0) {
            plant.boxesNeeded = null;
        } else {
            let boxPerPoot = calcBoxPerPoot(plant.percent / 100.0, plant.seedsPerBox);

            let boxNeeded = Math.min(pootAmount * boxPerPoot, plant.boxCount);
            plant.boxesNeeded = Math.round((boxNeeded + Number.EPSILON) * 100) / 100;
            totalBoxes += plant.boxesNeeded;

            let pootUsed = boxNeeded / boxPerPoot;
            pootAmount -= pootUsed;

            if (plant.boxesNeeded > maxBoxes) {
                maxBoxesPlantIndex = index;
                maxBoxes = plant.boxesNeeded;
            }
        }
    });

    // Print output lines
    plants.forEach((plant, index) => {
        printLine(plant, index === maxBoxesPlantIndex);
    });

    // Print total boxes
    printTotalBoxes(totalBoxes, pootAmount);

    form.reset();
});

form.addEventListener('reset', _ => {
    dialog.close();
});
