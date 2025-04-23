// Data sampel untuk visualisasi
const smokingData = [
    { name: 'Perokok Berat', kanker: 65, nonKanker: 35 },
    { name: 'Perokok Sedang', kanker: 45, nonKanker: 55 },
    { name: 'Perokok Ringan', kanker: 30, nonKanker: 70 },
    { name: 'Bukan Perokok', kanker: 12, nonKanker: 88 },
  ];
  
  const symptomsData = [
    { name: 'Asma', batukKronis: 65, sesakNapas: 80 },
    { name: 'PPOK', batukKronis: 85, sesakNapas: 90 },
    { name: 'Kanker Paru', batukKronis: 75, sesakNapas: 65 },
    { name: 'Bronkitis', batukKronis: 90, sesakNapas: 60 },
    { name: 'Pneumonia', batukKronis: 50, sesakNapas: 85 },
  ];
  
  const ageDistributionData = [
    { name: '20-30', value: 10 },
    { name: '31-40', value: 15 },
    { name: '41-50', value: 25 },
    { name: '51-60', value: 30 },
    { name: '61-70', value: 15 },
    { name: '71+', value: 5 },
  ];
  
  const genderSymptomsData = [
    { name: 'Batuk Kronis', pria: 60, wanita: 50 },
    { name: 'Sesak Napas', pria: 55, wanita: 60 },
    { name: 'Nyeri Dada', pria: 45, wanita: 40 },
    { name: 'Kelelahan', pria: 65, wanita: 70 },
    { name: 'Suara Serak', pria: 40, wanita: 35 },
  ];
  
  const alcoholData = [
    { name: 'Tidak Minum', fungsiParu: 90, risikoPenyakit: 15 },
    { name: 'Ringan', fungsiParu: 85, risikoPenyakit: 25 },
    { name: 'Sedang', fungsiParu: 75, risikoPenyakit: 45 },
    { name: 'Berat', fungsiParu: 60, risikoPenyakit: 75 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Dapatkan elemen main content
  const mainContent = document.getElementById('main-content');
  
  // Status halaman aktif
  let activePage = 'home';
  
  // Fungsi untuk menampilkan halaman berdasarkan status
  function renderPage() {
    // Hapus konten sebelumnya
    mainContent.innerHTML = '';
    
    switch (activePage) {
      case 'smoking':
        renderSmokingPage();
        break;
      case 'symptoms':
        renderSymptomsPage();
        break;
      case 'age':
        renderAgePage();
        break;
      case 'gender':
        renderGenderPage();
        break;
      case 'alcohol':
        renderAlcoholPage();
        break;
      default:
        renderHomePage();
        break;
    }
  }
  
  // Fungsi untuk menampilkan halaman beranda
  function renderHomePage() {
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    
    // Kartu-kartu menu
    const cards = [
      {
        title: 'Hubungan Merokok dan Kanker',
        icon: 'cigarette',
        page: 'smoking'
      },
      {
        title: 'Perbandingan Gejala pada Penyakit Kronis',
        icon: 'wind',
        page: 'symptoms'
      },
      {
        title: 'Distribusi Usia Pasien Kanker Paru',
        icon: 'activity',
        page: 'age'
      },
      {
        title: 'Perbandingan Gejala Berdasarkan Gender',
        icon: 'users',
        page: 'gender'
      },
      {
        title: 'Pengaruh Alkohol terhadap Kesehatan Paru',
        icon: 'beer',
        page: 'alcohol'
      }
    ];
    
    // Buat kartu untuk setiap menu
    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300';
      cardElement.addEventListener('click', () => {
        activePage = card.page;
        renderPage();
      });
      
      const iconContainer = document.createElement('div');
      iconContainer.className = 'flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 text-blue-500';
      
      // Tambahkan ikon dari Lucide
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', card.icon);
      icon.className = 'w-8 h-8';
      iconContainer.appendChild(icon);
      
      const titleElement = document.createElement('h3');
      titleElement.className = 'text-lg font-semibold mb-2';
      titleElement.textContent = card.title;
      
      const descElement = document.createElement('p');
      descElement.className = 'text-gray-600';
      descElement.textContent = 'Klik untuk melihat visualisasi detail';
      
      cardElement.appendChild(iconContainer);
      cardElement.appendChild(titleElement);
      cardElement.appendChild(descElement);
      
      container.appendChild(cardElement);
    });
    
    mainContent.appendChild(container);
    
    // Inisialisasi ikon Lucide
    lucide.createIcons();
  }
  
  // Fungsi template untuk semua halaman visualisasi
  function createVisualizationPage(title, content, description) {
    const container = document.createElement('div');
    container.className = 'bg-white p-6 rounded-lg shadow-lg';
    
    const titleElement = document.createElement('h2');
    titleElement.className = 'text-xl font-bold mb-4';
    titleElement.textContent = title;
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'h-96';
    chartContainer.id = 'chart-container';
    
    const descContainer = document.createElement('div');
    descContainer.className = 'mt-6';
    
    const descText = document.createElement('p');
    descText.className = 'text-gray-700';
    descText.textContent = description;
    descContainer.appendChild(descText);
    
    const backButton = document.createElement('button');
    backButton.className = 'mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
    backButton.textContent = 'Kembali ke Beranda';
    backButton.addEventListener('click', () => {
      activePage = 'home';
      renderPage();
    });
    
    container.appendChild(titleElement);
    container.appendChild(chartContainer);
    container.appendChild(descContainer);
    container.appendChild(backButton);
    
    mainContent.appendChild(container);
    
    // Tambahkan visualisasi
    if (content) {
      content();
    }
  }
  
  // Fungsi untuk menampilkan halaman Hubungan Merokok dan Kanker
  function renderSmokingPage() {
    createVisualizationPage(
      'Hubungan antara Kebiasaan Merokok dan Status Kanker',
      () => {
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;
        
        const chart = React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            BarChart,
            { data: smokingData, barSize: 60 },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(XAxis, { dataKey: 'name' }),
            React.createElement(YAxis, { label: { value: 'Persentase (%)', angle: -90, position: 'insideLeft' } }),
            React.createElement(Tooltip),
            React.createElement(Legend, { verticalAlign: 'top', height: 36 }),
            React.createElement(Bar, { dataKey: 'kanker', name: 'Positif Kanker', fill: '#FF8042' }),
            React.createElement(Bar, { dataKey: 'nonKanker', name: 'Negatif Kanker', fill: '#0088FE' })
          )
        );
        
        ReactDOM.render(chart, document.getElementById('chart-container'));
      },
      'Grafik ini menunjukkan hubungan yang kuat antara kebiasaan merokok dan risiko kanker paru-paru. Dari data tersebut, terlihat bahwa perokok berat memiliki persentase tertinggi terkena kanker (65%), sedangkan bukan perokok memiliki persentase terendah (12%).'
    );
  }
  
  // Fungsi untuk menampilkan halaman Perbandingan Gejala pada Penyakit Kronis
  function renderSymptomsPage() {
    createVisualizationPage(
      'Perbandingan Gejala Batuk Kronis dan Sesak Napas pada Pasien dengan Penyakit Kronis',
      () => {
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;
        
        const chart = React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            LineChart,
            { data: symptomsData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(XAxis, { dataKey: 'name' }),
            React.createElement(YAxis, { label: { value: 'Tingkat Keparahan (%)', angle: -90, position: 'insideLeft' } }),
            React.createElement(Tooltip),
            React.createElement(Legend, { verticalAlign: 'top', height: 36 }),
            React.createElement(Line, { type: 'monotone', dataKey: 'batukKronis', name: 'Batuk Kronis', stroke: '#8884d8', strokeWidth: 2 }),
            React.createElement(Line, { type: 'monotone', dataKey: 'sesakNapas', name: 'Sesak Napas', stroke: '#82ca9d', strokeWidth: 2 })
          )
        );
        
        ReactDOM.render(chart, document.getElementById('chart-container'));
      },
      'Grafik ini menunjukkan perbandingan gejala batuk kronis dan sesak napas pada berbagai penyakit paru-paru kronis. PPOK menunjukkan tingkat batuk kronis tertinggi (85%), sedangkan tingkat sesak napas tertinggi terjadi pada pasien PPOK (90%).'
    );
  }
  
  // Fungsi untuk menampilkan halaman Distribusi Usia Pasien Kanker Paru
  function renderAgePage() {
    createVisualizationPage(
      'Distribusi Usia Pasien yang Terdiagnosis Kanker Paru-paru',
      () => {
        const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = Recharts;
        
        const renderLabel = (entry) => {
          return `${entry.name}: ${entry.percent * 100}%`;
        };
        
        const chart = React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            PieChart,
            null,
            React.createElement(
              Pie,
              { 
                data: ageDistributionData,
                cx: '50%',
                cy: '50%',
                labelLine: true,
                outerRadius: 120,
                fill: '#8884d8',
                dataKey: 'value',
                nameKey: 'name',
                label: renderLabel
              },
              ageDistributionData.map((entry, index) => 
                React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] })
              )
            ),
            React.createElement(Tooltip, { formatter: (value) => `${value}%` }),
            React.createElement(Legend)
          )
        );
        
        ReactDOM.render(chart, document.getElementById('chart-container'));
      },
      'Distribusi usia pasien kanker paru-paru menunjukkan bahwa kelompok usia 51-60 tahun memiliki persentase tertinggi (30%), diikuti oleh kelompok usia 41-50 tahun (25%). Hal ini mengindikasikan bahwa risiko kanker paru-paru meningkat pada usia paruh baya hingga lansia.'
    );
  }
  
  // Fungsi untuk menampilkan halaman Perbandingan Gejala Berdasarkan Gender
  function renderGenderPage() {
    createVisualizationPage(
      'Perbandingan Gejala antara Pria dan Wanita',
      () => {
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;
        
        const chart = React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            BarChart,
            { data: genderSymptomsData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(XAxis, { dataKey: 'name' }),
            React.createElement(YAxis, { label: { value: 'Tingkat Keparahan (%)', angle: -90, position: 'insideLeft' } }),
            React.createElement(Tooltip),
            React.createElement(Legend, { verticalAlign: 'top', height: 36 }),
            React.createElement(Bar, { dataKey: 'pria', name: 'Pria', fill: '#0088FE' }),
            React.createElement(Bar, { dataKey: 'wanita', name: 'Wanita', fill: '#FF8042' })
          )
        );
        
        ReactDOM.render(chart, document.getElementById('chart-container'));
      },
      'Grafik ini membandingkan gejala penyakit paru-paru antara pria dan wanita. Terlihat bahwa wanita lebih cenderung mengalami kelelahan (70%) dan sesak napas (60%), sedangkan pria lebih cenderung mengalami batuk kronis (60%) dan nyeri dada (45%).'
    );
  }
  
  // Fungsi untuk menampilkan halaman Pengaruh Alkohol terhadap Kesehatan Paru
  function renderAlcoholPage() {
    createVisualizationPage(
      'Pengaruh Konsumsi Alkohol terhadap Kesehatan Paru-paru',
      () => {
        const { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;
        
        const chart = React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            ComposedChart,
            { data: alcoholData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(XAxis, { dataKey: 'name' }),
            React.createElement(YAxis, { label: { value: 'Persentase (%)', angle: -90, position: 'insideLeft' } }),
            React.createElement(Tooltip),
            React.createElement(Legend, { verticalAlign: 'top', height: 36 }),
            React.createElement(Area, { type: 'monotone', dataKey: 'fungsiParu', name: 'Fungsi Paru-paru', fill: '#8884d8', stroke: '#8884d8' }),
            React.createElement(Bar, { dataKey: 'risikoPenyakit', name: 'Risiko Penyakit Paru-paru', barSize: 40, fill: '#82ca9d' })
          )
        );
        
        ReactDOM.render(chart, document.getElementById('chart-container'));
      },
      'Grafik ini menunjukkan hubungan antara konsumsi alkohol dengan kesehatan paru-paru. Terlihat bahwa semakin tinggi konsumsi alkohol, fungsi paru-paru semakin menurun (dari 90% menjadi 60%) dan risiko penyakit paru-paru meningkat signifikan (dari 15% menjadi 75%).'
    );
  }
  
  // Inisialisasi halaman
  document.addEventListener('DOMContentLoaded', () => {
    renderPage();
  });