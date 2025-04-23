// Handle card clicks
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function() {
      const link = this.querySelector('a');
      if (link) {
          link.click();
      }
  });
});

// Event listeners for visualization links
document.getElementById('merokok-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Membuka visualisasi Hubungan Merokok dan Kanker');
});

document.getElementById('gejala-kronis-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Membuka visualisasi Perbandingan Gejala pada Penyakit Kronis');
});

document.getElementById('usia-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Membuka visualisasi Distribusi Usia Pasien Kanker Paru');
});

document.getElementById('gender-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Membuka visualisasi Perbandingan Gejala Berdasarkan Gender');
});

document.getElementById('alkohol-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Membuka visualisasi Pengaruh Alkohol terhadap Kesehatan Paru');
});