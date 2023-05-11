const gpuContainerId = 'gpus-container';
const storageKey = 'coinProfitability';
const responce = fetch("https://api.allorigins.win/get?url=https://api.cointomine.today/api/v1/profitability?apikey=0c9d0dd3-9e9c-4c02-9b78-a9b5550119d4");
const gpusInputs = [];
const gpusProfitability = {};
const minProfitability = 0.3;
const forbiddenCoins = ['LUXCoin', 'Litecoinz', 'Swap', 'BitcoinZ', 'Strength', 'Ethereum', 'Vertcoin'];
const profitabilityTableId = 'profitability-table';

const DataRecieved = (json) => {
    const data = JSON.parse(json);
    if (data.length) throw new Error('Whoops!');

    localStorage.setItem(storageKey, data);
    return data;
};

const DataNotRecieved = () => {
    const json = localStorage.getItem(storageKey);
    return JSON.parse(json);
};

const RenderGpusInputs = (data) => {
    const gpuContainer = document.getElementById(gpuContainerId);

    Object.entries(data).forEach(([gpu, value]) => {
        const col = document.createElement('div');
        col.classList.add('col-3');

        const wrapper = document.createElement('div');
        wrapper.classList.add('form__group');

        const input = document.createElement('input');
        input.classList.add('form__field');
        input.type = 'number';
        //input.placeholder = gpu;
        input.id = gpu;

        const label = document.createElement('label');
        label.classList.add('form__label');
        label.htmlFor = gpu;
        label.innerText = gpu;

        col.appendChild(wrapper);

        wrapper.appendChild(input);
        wrapper.appendChild(label);

        gpusInputs.push(input);
        gpuContainer.appendChild(col);
    });
};

const InitGpusProfitability = (data) => {
    Object.entries(data).forEach(([gpu,]) => {
        gpusProfitability[gpu] = [];
    });
};

const InitProfitabilityList = (data) => {
    Object.entries(data).forEach(([, coinData]) => {
        Object.entries(coinData.gpu_benchmark_mhs).forEach(([gpu, value]) => {
            const profit = value * coinData.usd;

            profit > minProfitability && !forbiddenCoins.includes(coinData.name) && gpusProfitability[gpu].push({
                profit: profit,
                coin: coinData.name,
            })
        });
    });
};

const SortProfitabilityList = () => {
    Object.entries(gpusProfitability).forEach(([gpu, list]) => {
        list.sort((a, b) => a.profit < b.profit ? 1 : -1);
    });
};

const ProceedData = (data) => {
    RenderGpusInputs(data.cryptonightv8.gpu_benchmark_mhs);
    InitGpusProfitability(data.cryptonightv8.gpu_benchmark_mhs);
    InitProfitabilityList(data);
    SortProfitabilityList();
};

const getFilledInputs = () => {
    const filledInputs = [];

    gpusInputs.forEach((input) => {
        if (input.value > 0) {
            filledInputs.push({
                gpuName: input.id,
                quantity: input.value,
            })
        }
    }, []);

    return filledInputs;
}

const RenderProfitTable = (filledInputs) => {
    const tbodyContainer = document.getElementById(profitabilityTableId);
    tbodyContainer.innerHTML = '';
    let totalProfit = 0;

    filledInputs.forEach((data) => {
    	const mostProfitable = gpusProfitability[data.gpuName][0];
        totalProfit += mostProfitable?.profit || 0 * data.quantity;

        tbodyContainer.insertAdjacentHTML('beforeend', `
            <tr> 
                <td>${data.gpuName}</td>
                <td>${mostProfitable?.coin || 'No coin'}</td>
                <td>${data.quantity}</td>
                <td class="text-right">${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    notation: "compact",
                    compactDisplay: "short",
                    currency: 'USD',
                    minimumFractionDigits: 3,
                }).format(mostProfitable?.profit || 0 * data.quantity)}</td>
            </tr>
        `);
    });

    tbodyContainer.insertAdjacentHTML('beforeend', `
        <tr> 
            <td colspan='4' class='text-right'>
            Total Profit: 
            ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                notation: "compact",
                compactDisplay: "short",
                currency: 'USD',
                minimumFractionDigits: 3,
            }).format(totalProfit)}</td>
        </tr>
    `);
}

window.calculateProfitability = () => {
    const filledInputs = getFilledInputs();

    if (filledInputs.length === 0) alert('Please input your Gpus');
    else RenderProfitTable(filledInputs);
};

window.onload = () => {
    responce
        .then(json => json.json())
        .then(data => data.contents)
        .then(data => DataRecieved(data))
        .catch(() => DataNotRecieved())
        .then(data => ProceedData(data));
};
