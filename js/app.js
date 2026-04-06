// Dữ liệu phim - Bài 2.1
const movies = [
    { id: 1, title: "Batman", year: 2022, genres: ["Hành động"], poster: "images/batman.jpg", desc: "Bruce Wayne đối đầu với kẻ giết người hàng loạt Riddler tại thành phố Gotham." },
    { id: 2, title: "Avenger", year: 2019, genres: ["Hành động", "Viễn tưởng"], poster: "images/avenger.jpg", desc: "Trận chiến cuối cùng của các siêu anh hùng chống lại Thanos để cứu vũ trụ." },
    { id: 3, title: "Your Name", year: 2016, genres: ["Anime", "Lãng mạn"], poster: "images/yourname.jpg", desc: "Hai thiếu niên xa lạ phát hiện họ bị hoán đổi cơ thể cho nhau một cách kỳ bí." },
];

const movieGrid = document.getElementById('movie-grid');
const genreContainer = document.getElementById('genre-filters');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// 1. Hiển thị phim
function displayMovies(data) {
    if (data.length === 0) {
        movieGrid.innerHTML = "<h3>Không tìm thấy phim nào phù hợp.</h3>";
        return;
    }
    movieGrid.innerHTML = data.map(movie => `
        <div class="movie-card" onclick="showDetail(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-card-info">
                <h4>${movie.title}</h4>
                <p>${movie.year}</p>
            </div>
        </div>
    `).join('');
}

// 2. Tạo checkbox thể loại tự động - Bài 2.2
function renderGenres() {
    const allGenres = [...new Set(movies.flatMap(m => m.genres))];
    genreContainer.innerHTML = allGenres.map(genre => `
        <div style="margin: 5px 0;">
            <input type="checkbox" class="genre-cb" value="${genre}"> ${genre}
        </div>
    `).join('');
}

// 3. Lọc tích hợp (Tìm kiếm + Checkbox) - Bài 2.4
function filterData() {
    const term = searchInput.value.toLowerCase();
    const selectedGenres = Array.from(document.querySelectorAll('.genre-cb:checked')).map(cb => cb.value);

    const filtered = movies.filter(m => {
        const matchName = m.title.toLowerCase().includes(term);
        const matchGenre = selectedGenres.length === 0 || selectedGenres.some(g => m.genres.includes(g));
        return matchName && matchGenre;
    });
    displayMovies(filtered);
}

// 4. Debounce cho tìm kiếm - Bài 2.5
function debounce(func, delay = 400) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// 5. Modal chi tiết - Bài 3.1
function showDetail(id) {
    const movie = movies.find(m => m.id === id);
    const modal = document.getElementById('movie-modal');
    document.getElementById('modal-body').innerHTML = `
        <div style="display:flex; gap:20px; flex-wrap: wrap;">
            <img src="${movie.poster}" style="width:250px; border-radius: 10px;">
            <div style="flex: 1; min-width: 250px;">
                <h2 style="color: var(--accent-color)">${movie.title}</h2>
                <p><b>Năm:</b> ${movie.year}</p>
                <p><b>Thể loại:</b> ${movie.genres.join(', ')}</p>
                <p style="margin-top: 15px;">${movie.desc}</p>
            </div>
        </div>
    `;
    modal.style.display = "block";
}

// Đóng modal
document.querySelector('.close-btn').onclick = () => document.getElementById('movie-modal').style.display = "none";
window.onclick = (e) => { if(e.target.className === 'modal') document.getElementById('movie-modal').style.display = "none"; };

// 6. Dark mode - Bài 3.2
themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('movie-theme', isDark ? 'dark' : 'light');
    themeToggle.innerText = isDark ? "Chế độ Sáng" : "Chế độ Tối";
};

// Khởi chạy
window.onload = () => {
    displayMovies(movies);
    renderGenres();
    if(localStorage.getItem('movie-theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = "Chế độ Sáng";
    }
    searchInput.addEventListener('input', debounce(filterData));
    genreContainer.addEventListener('change', filterData);
};