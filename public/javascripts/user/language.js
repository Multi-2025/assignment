const chartData = [
    {
        containerId: 'chart-container-1',
        languages: [
            { name: 'HTML', percentage: 59.4, color: '#e34c26' },
            { name: 'CSS', percentage: 27.5, color: '#264de4' },
            { name: 'Python', percentage: 10.4, color: '#4b8bbe' },
            { name: 'JavaScript', percentage: 2.7, color: '#f0db4f' },
        ]
    },
    {
        containerId: 'chart-container-2',
        languages: [
            { name: 'Vue', percentage: 74.5, color: '#42b883' },
            { name: 'CSS', percentage: 15.1, color: '#264de4' },
            { name: 'JavaScript', percentage: 8.3, color: '#f0db4f' },
            { name: 'HTML', percentage: 2.1, color: '#e34c26' }
        ]
    },
    {
        containerId: 'chart-container-3',
        languages: [
            { name: 'C++', percentage: 68.7, color: '#ff6384' },
            { name: 'C', percentage: 18.2, color: '#4d4d4d' },
            { name: 'JavaScript', percentage: 6.7, color: '#ffcd56' },
            { name: 'CSS', percentage: 3.1, color: '#c45850' },
            { name: 'Python', percentage: 2.0, color: '#36a2eb' },
            { name: 'Objective-C++', percentage: 0.4, color: '#9966ff' },
            { name: 'Other', percentage: 0.9, color: '#cccccc' }
        ]
    }
];

chartData.forEach(chart => {
    const chartContainer = document.getElementById(chart.containerId);
    const chartElement = chartContainer.querySelector('.chart');
    const legendElement = chartContainer.querySelector('.legend');

    chart.languages.forEach(language => {
        // Create bar
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = language.percentage + '%';
        bar.style.backgroundColor = language.color;
        chartElement.appendChild(bar);

        // Create legend item
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `<span class="color" style="background-color: ${language.color};"></span>${language.name} ${language.percentage}%`;
        legendElement.appendChild(legendItem);
    });
});
