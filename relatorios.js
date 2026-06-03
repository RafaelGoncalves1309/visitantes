
// ================= SUPABASE =================

const supabaseClient = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
);




// =========================================
// CORES
// =========================================

const coresOrigem = {       
  'QR-Code': '#5bb1fc',
  'Pescaria': '#086304',
  'Website Paz Church': '#b21c0f',
  'Sem Origem': '#999999'
};

const coresStatus = {
  'Em Conversa': '#feff00',
  'Concluído': '#5bb1fc',
  'Já tem Life': '#646196',
  'Sem Resposta': '#b21c0f',
  'Transição': '#086304',
  'Novo': '#a49f99',
  'Sem Interesse no Momento': '#55211e'
};

// =========================================
// CHARTS
// =========================================

let chartData;
let chartCidade;
let chartOrigem;
let chartStatus;

// =========================================
// CARREGAR RELATÓRIOS
// =========================================

async function carregarRelatorios() {

  // =========================================
  // FILTROS
  // =========================================

  const filtroOrigem =
    document.getElementById('filtroOrigem').value;

  const filtroStatus =
    document.getElementById('filtroStatus').value;

  const filtroCidade = 
    document.getElementById('filtroCidade').value;

  const dataInicio =
    document.getElementById('dataInicio').value;

  const dataFim =
    document.getElementById('dataFim').value;

  // =========================================
  // BUSCA DADOS
  // =========================================

  const { data, error } = await supabaseClient
    .from('convidados_admin')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  
  // =========================================
  // FILTRAR DADOS
  // =========================================

  let dadosFiltrados = [...data];

  if (filtroOrigem) {

    dadosFiltrados =
      dadosFiltrados.filter(item =>
        item.origem === filtroOrigem
      );
  }

  // filtro cidade 
  if (filtroCidade) 
    { dadosFiltrados = 
        dadosFiltrados.filter(item => 
          item.cidade === filtroCidade 
        );
    }

  if (filtroStatus) {

    dadosFiltrados =
      dadosFiltrados.filter(item =>
        item.status_convidado === filtroStatus
      );
  }

  if (dataInicio) {

    dadosFiltrados =
      dadosFiltrados.filter(item => {

        return new Date(item.created_at) >=
          new Date(`${dataInicio}T00:00:00`);
      });
  }

  if (dataFim) {

    dadosFiltrados =
      dadosFiltrados.filter(item => {

        return new Date(item.created_at) <=
          new Date(`${dataFim}T23:59:59`);
      });
  }

  // =========================================
  // CARDS
  // =========================================

      // =========================================
      // CARD TOTAL 
      // =========================================

const totalConvidados =
  dadosFiltrados.length;

      // =========================================
      // CARD NOVOS
      // =========================================

const novos =
  dadosFiltrados.filter(item =>

    item.status_convidado &&
    item.status_convidado.trim() === 'Novo'

  ).length;

const percentualNovos =
  totalConvidados > 0
    ? ((novos / totalConvidados) * 100).toFixed(1)
    : 0;

        // =========================================
        // CONTATADOS
        // =========================================


const contatados = dadosFiltrados.filter(item =>
  item.responsavel !== null &&
  item.responsavel !== undefined &&
  String(item.responsavel).trim() !== ''
).length;

const percentualContatados =
  totalConvidados > 0
    ? ((contatados / totalConvidados) * 100).toFixed(1)
    : 0;

        // =========================================
        // CONTATADOS EM 24H
        // =========================================


const contatados24h =
  dadosFiltrados.filter(item =>
    item.origem?.trim() !== 'Website Paz Church'
  ).length;

const percentual24h =
  totalConvidados > 0
    ? ((contatados24h / totalConvidados) * 100).toFixed(1)
    : 0;

        // =========================================
        // INTEGRADOS
        // =========================================

const integrados =
  dadosFiltrados.filter(item =>

    item.status_convidado === 'Concluído' ||
    item.status_convidado === 'Já tem Life'

  ).length;

const percentualIntegracao =
  totalConvidados > 0
    ? ((integrados / totalConvidados) * 100).toFixed(1)
    : 0;
  // =========================================
  // PREENCHE CARDS
  // =========================================

  document.getElementById('totalConvidados').textContent = totalConvidados;

  document.getElementById('totalNovos').textContent = novos;

  document.getElementById('totalContatados').textContent = contatados;
  document.getElementById('percentualContatados').textContent = percentualContatados + '%';

  document.getElementById('total24h').textContent = contatados24h;
  document.getElementById('percentualContatados24h').textContent = percentual24h + '%';

  document.getElementById('totalIntegrados').textContent = integrados;
  document.getElementById('percentualIntegrados').textContent = percentualIntegracao + '%';
  

  //document.getElementById('total24h').textContent =    percentual24h + '%';

  //document.getElementById('totalIntegrados').textContent =    integrados;

  //document.getElementById('percentualIntegracao').textContent =     percentualIntegracao + '%';

  // =========================================
  // DESTRUIR GRÁFICOS ANTIGOS
  // =========================================

  if (chartData) chartData.destroy();
  if (chartCidade) chartCidade.destroy();
  if (chartOrigem) chartOrigem.destroy();
  if (chartStatus) chartStatus.destroy();

  // =========================================
  // GRÁFICO DATA
  // =========================================
  // =========================================
// GRÁFICO DATA
// =========================================

const mapaDatas = {};

// pega origens únicas
const origens = [
  ...new Set(
    dadosFiltrados.map(item =>
      item.origem || 'Sem Origem'
    )
  )
];

// monta mapa
dadosFiltrados.forEach(item => {

  const dataFormatada =
    new Date(item.created_at)
      .toLocaleDateString('pt-BR');

  const origem =
    item.origem || 'Sem Origem';

  if (!mapaDatas[dataFormatada]) {
    mapaDatas[dataFormatada] = {};
  }

  if (!mapaDatas[dataFormatada][origem]) {
    mapaDatas[dataFormatada][origem] = 0;
  }

  mapaDatas[dataFormatada][origem]++;
});

// ordena datas
const labelsDatas =
  Object.keys(mapaDatas).sort((a, b) => {

    const [dA, mA, aA] = a.split('/');
    const [dB, mB, aB] = b.split('/');

    return new Date(`${aA}-${mA}-${dA}`) -
      new Date(`${aB}-${mB}-${dB}`);
  });

// datasets
const datasets = origens.map(origem => {

  const cor =
    coresOrigem[origem] || '#666666';

  return {

    label: origem,

    data: labelsDatas.map(data =>
      mapaDatas[data][origem] || 0
    ),

    borderColor: cor,

    backgroundColor: cor,

    pointBackgroundColor: cor,

    pointBorderColor: '#ffffff',

    pointRadius: 5,

    pointHoverRadius: 7,

    borderWidth: 3,

    tension: 0.3,

    fill: false
  };
});

// cria gráfico
chartData = new Chart(
  document.getElementById('graficoData'),
  {
    type: 'line',

    data: {
      labels: labelsDatas,
      datasets
    },

    plugins: [ChartDataLabels],

    options: {

      responsive: true,

      maintainAspectRatio: false,

      // espaço interno do gráfico
      layout: {

        padding: {

          top: 10,

          right: 15,

          left: 10,

          bottom: 0
        }
      },

      plugins: {

        legend: {

          position: 'top',

          labels: {

            padding: 20,

            font: {

              weight: 'bold',

              size: 13
            }
          }
        },

        datalabels: {

          color: '#444444',

          anchor: 'end',

          align: 'top',

          offset: 6,

          clamp: true,

          clip: false,

          font: {

            weight: 'bold',

            size: 13
          },

          formatter: value =>
            value > 0 ? value : ''
        }
      },

      scales: {

        x: {

          grid: {
            display: false
          },

          ticks: {

            display: true,

            color: '#333333',

            font: {

              weight: 'bold',

              size: 13
            }
          }
        },

        y: {

          beginAtZero: true,

          // cria espaço acima da linha
          grace: '35%',

          grid: {
            display: false
          },

          ticks: {
            display: false
          }
        }
      }
    }
  }
);

  // =========================================
  // GRÁFICO CIDADE
  // =========================================

  const cidadeMap = {};

  dadosFiltrados.forEach(item => {

    const cidade =
      item.cidade || 'Sem Cidade';

    cidadeMap[cidade] =
      (cidadeMap[cidade] || 0) + 1;
  });

  const cidadesOrdenadas =
    Object.entries(cidadeMap)
      .sort((a, b) => b[1] - a[1]);

  chartCidade = new Chart(
    document.getElementById('graficoCidade'),
    {
      type: 'bar',

      data: {

        labels:
          cidadesOrdenadas.map(i => i[0]),

        datasets: [{

          data:
            cidadesOrdenadas.map(i => i[1]),

          borderRadius: 8
        }]
      },

      plugins: [ChartDataLabels],

      options: {

        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
           

          },

          datalabels: {

            color: '#11005e',

            anchor: 'end',

            align: 'left',

            font: {
              weight: 'bold',
              size: '13'
            }
          }
        },

        scales: {

          x: {

            grid: {
              display: false
            },

            ticks: {
              display: false,
              font: {
              weight: 'bold',
              size:'10'
            }

            }
          },

          y: {

            grid: {
              display: false
            },

            ticks: {
            color: '#333',
            font: {
              weight: 'bold',
              size:'13'
            }
          }

          }
        }
      }
    }
  );

  // =========================================
  // GRÁFICO ORIGEM
  // =========================================

  const origemMap = {};

  dadosFiltrados.forEach(item => {

    const origem =
      item.origem || 'Sem Origem';

    origemMap[origem] =
      (origemMap[origem] || 0) + 1;
  });

  chartOrigem = new Chart(
    document.getElementById('graficoOrigem'),
    {
      type: 'pie',

      data: {

        labels:
          Object.keys(origemMap),

        datasets: [{

          data:
            Object.values(origemMap),

          backgroundColor:

            Object.keys(origemMap).map(origem => {

              return coresOrigem[origem]
                || '#999999';
            }),

          borderColor: '#fff',

          borderWidth: 2
        }]
      },

      plugins: [ChartDataLabels],

      options: {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

          legend: {
            position: 'top',
            
            labels:{ 
              font:{
                weight: 'bold',
                size: '13'
              },
            },
          },

          datalabels: {

            color: '#fff',

            font: {
              weight: 'bold',
              size: 13
            },

            formatter: (value, context) => {

              const total =
                context.chart.data.datasets[0].data
                  .reduce((a, b) => a + b, 0);

              const percentual =
                ((value / total) * 100).toFixed(1);

              return `${value} - (${percentual}%)`;
            }
          }
        }
      }
    }
  );

  
// =========================================
// GRÁFICO STATUS
// =========================================




const statusMap = {};

dadosFiltrados.forEach(item => {

  const status =
    item.status_convidado || 'Sem Status';

  statusMap[status] =
    (statusMap[status] || 0) + 1;
});

// ordena do maior para menor
const statusOrdenados =
  Object.entries(statusMap)
    .sort((a, b) => b[1] - a[1]);

chartStatus = new Chart(
  document.getElementById('graficoStatus'),
  {
    type: 'bar',

    data: {

      labels:
        statusOrdenados.map(i => i[0]),

      datasets: [{

        data:
          statusOrdenados.map(i => i[1]),

        borderRadius: 8,

        backgroundColor:

          statusOrdenados.map(item => {

            const status = item[0];

            return coresStatus[status]
              || '#999999';
          })
      }]
    },

    plugins: [ChartDataLabels],

    options: {

      responsive: true,

      indexAxis: 'y',

      maintainAspectRatio: false,

      plugins: {

        legend: {
          display: false
        },

        datalabels: {

          color: '#11005e',

          anchor: 'end',

          align: 'left',

          font: {
            weight: 'bold',
            size: 13
          }
        }
      },

      scales: {

        x: {

          grid: {
            display: false
          },

          ticks: {
            display: false
          },

          border: {
            display: false
          }
        },

        y: {

          grid: {
            display: false
          },

          border: {
            display: false
          },

          ticks: {
            color: '#333',
            font: {
              weight: 'bold',
              size:'13'
            }
          }
        }
      }
    }
  }
);





  // =========================================
  // TABELA
  // =========================================

  const tbody =
    document.getElementById('tabelaRelatorio');

  tbody.innerHTML = '';

  dadosFiltrados
    .sort((a, b) =>
      new Date(b.created_at) -
      new Date(a.created_at)
    )
    .slice(0, 10)
    .forEach(item => {

      const tr =
        document.createElement('tr');

      tr.innerHTML = `
        <td>${item.nome || ''}</td>
        <td>${item.cidade || ''}</td>
        <td>${item.origem || ''}</td>
        <td>${item.status_convidado || ''}</td>
      `;

      tbody.appendChild(tr);
    });
}

// =========================================
// EVENTO FILTRAR
// =========================================


// =========================================
// FILTROS AUTOMÁTICOS
// =========================================

document
  .getElementById('filtroOrigem')
  .addEventListener('change', carregarRelatorios);

document
  .getElementById('filtroStatus')
  .addEventListener('change', carregarRelatorios);

document
  .getElementById('filtroCidade')
  .addEventListener('change', carregarRelatorios);

document
  .getElementById('dataInicio')
  .addEventListener('change', carregarRelatorios);

document
  .getElementById('dataFim')
  .addEventListener('change', carregarRelatorios);

document .getElementById('btnLimpar') .addEventListener('click', limparFiltros);



// =========================================
// LIMPAR FILTROS
// =========================================

function limparFiltros() {

  document.getElementById('filtroOrigem').value = '';

  document.getElementById('filtroStatus').value = '';

  document.getElementById('filtroCidade').value = '';

  document.getElementById('dataInicio').value = '';

  document.getElementById('dataFim').value = '';

  carregarRelatorios();
}



// =========================================
// INIT
// =========================================

carregarRelatorios();
