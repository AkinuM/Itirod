
const InsertDataToTable = () => {
    const response = fetch("https://api.coincap.io/v2/assets");

    response
        .then(json => json.json())
        .then(data => addDataToTable('coins', data.data))
}

const addDataToTable = (id, data) => {
    const tbodyContainer = document.getElementById(id);
    const updateTime = document.getElementById('update-time');

    data.forEach((coin, index) => {
        tbodyContainer.insertAdjacentHTML('beforeend', `
            <tr id='${coin.id}' class='hoveriable' onclick='renderChart("${coin.id}")'> 
                <td>${coin.rank}</td>
                <td class="text-left">
                    <div class="table__coin-name-container">
                        <img 
                            src="https://static.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png"
                            alt="">
                        <span class="pl-2">${coin.name}</span>
                    </div>
                </td>
                <td>${new Intl.NumberFormat('en-US', {
            style: 'currency',
            notation: "compact",
            compactDisplay: "short",
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(coin.priceUsd)}
                </td>
                <td>${new Intl.NumberFormat('en-US', {
            style: 'currency',
            notation: "compact",
            compactDisplay: "short",
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(coin.marketCapUsd)}
                </td>
                <td>${new Intl.NumberFormat('en-US', {
            style: 'currency',
            notation: "compact",
            compactDisplay: "short",
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(coin.vwap24Hr)}</td>
                <td>${new Intl.NumberFormat('en-US', {
            style: 'currency',
            notation: "compact",
            compactDisplay: "short",
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(coin.supply)}</td>
                <td>${new Intl.NumberFormat('en-US', {
            style: 'currency',
            notation: "compact",
            compactDisplay: "short",
            currency: 'USD',
            minimumFractionDigits: 3,
        }).format(coin.volumeUsd24Hr)}</td>
                <td>${new Intl.NumberFormat('en-US', {
            style: 'percent',
            currencySign: 'accounting',
            minimumFractionDigits: 2
        }).format(coin.changePercent24Hr / 100)}</td>
            </tr>
        `)    
    });

    updateTime.innerText = `Last Time Updated: ${new Date().toLocaleTimeString('it-IT')}`
}

window.renderChart = (coinId) => {
    const chartElement = document.getElementById('chartElement');
    
    chartElement?.remove();

    if(chartElement?.classList.contains(coinId)) return;

    const coinRow = document.getElementById(coinId);

    coinRow.insertAdjacentHTML('afterend', `
        <tr id='chartElement' class='${coinId}'> 
            <td colspan="8">
                <canvas id="coinId${coinId}" width="800" height="400"></canvas>
            </td>
        </tr>
    `);

    const chartsResponse = fetch(`https://api.coincap.io/v2/assets/${coinId}/history?interval=m1`);
        
    chartsResponse
        .then(json => json.json())
        .then(data => {
            const ctx = document.getElementById(`coinId${coinId}`).getContext('2d');

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.data.map((data) => new Date(data.time).getHours()),
                    datasets: [{
                        label: coinId,
                        data: data.data.map((data) => data.priceUsd),
                        backgroundColor: [
                            'rgba(0, 255, 0, 0.2)',
    
                        ],
                        borderColor: [
                            'rgba(0, 255, 0, 1)',
                        ],
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 3,
                    }]
                },
                options: {
                    elements: {
                        line: {
                            tension: 0.000001
                        }
                    },
                }
            });

            console.log(myChart);
        });
}

window.updateTable = () => {
    const tbodyContainer = document.getElementById('coins');

    tbodyContainer.innerHTML = '';
    InsertDataToTable();
}

window.onload = () => {
    InsertDataToTable();
}
