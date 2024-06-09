document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector(".container main");
  
    document.querySelectorAll(".sidebar a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const url = this.getAttribute("href");
        if (url === "/explore") {
          loadPage(url);
        } else {
          fetch(url)
            .then((response) => response.text())
            .then((html) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              mainContent.innerHTML =
                doc.querySelector(".container main").innerHTML;
            });
        }
      });
    });
  
    // window.addEventListener('popstate', function () {
    //     const url = location.pathname;
    //     fetch(url)
    //         .then(response => response.text())
    //         .then(html => {
    //             const parser = new DOMParser();
    //             const doc = parser.parseFromString(html, 'text/html');
    //             mainContent.innerHTML = doc.querySelector('.main-content').innerHTML;
    //         });
    // });
  });
  
  function loadPage(page) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", page, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.querySelector("main").innerHTML = xhr.responseText;
        // document.querySelector("main .playlist").innerHTML = "";
      }
    };
    xhr.send();
  }
  
  // Get the menu open and close buttons
  const menuOpenButton = document.getElementById("toggleSidebar");
  
  // Get the sidebar
  const sidebar = document.querySelector(".container .sidebar");
  
  // Add event listeners to the buttons
  menuOpenButton.addEventListener("click", function () {
    if (
      sidebar.style.transform === "translateX(-100%)" ||
      sidebar.style.transform === ""
    ) {
      sidebar.style.transform = "translateX(0)"; // Show the sidebar
    } else {
      sidebar.style.transform = "translateX(-100%)"; // Hide the sidebar
    }
  });
  
  // menuOpenButton.addEventListener('click', function() {
  //     sidebar.classList.toggle('collapsed');
  //    console.log("hello")
  //    const queue = document.createElement('div')
  //    queue.style.width = "200px"
  //    document.querySelector('.container').appendChild(
  //         queue
  //    );
  // });



  // Lấy tham chiếu đến thẻ main và header
var main = document.querySelector('main');
var header = document.querySelector('main header');

// Thêm sự kiện scroll cho thẻ main
main.addEventListener('scroll', function() {
    // Kiểm tra nếu thẻ main được scroll xuống
    if (main.scrollTop > 0) {
        // Thêm class 'scrolled' vào header
        main.header.style.position = "10vh";
    } else {
        // Xóa class 'scrolled' khỏi header
        main.header.style.top = "10vh"; // Độ dài của header, ẩn hoàn toàn
    }
});










document.addEventListener('DOMContentLoaded', function() {
  // Check if access token is available
  const accessToken = getCookie('access_token');
  if (!accessToken) {
      console.log('No access token found');
      return;
  }

  // Function to get cookie by name
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Fetch user's playlists
  fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  })
  .then(response => response.json())
  .then(data => {
      const playlistContainer = document.getElementById('playlist-container');
      data.items.forEach(playlist => {
          const div = document.createElement('div');
          div.textContent = playlist.name;
          playlistContainer.appendChild(div);
      });
  })
  .catch(error => console.log(error));
});





let searchResults = []; // Lưu trữ kết quả tìm kiếm ban đầu

async function searchSpotify() {
  const query = document.getElementById('searchQuery').value;

  if (!query) {
      alert('Vui lòng nhập từ khóa để tìm kiếm.');
      return;
  }

  const spotifySearchUrl = `https://v1.nocodeapi.com/tvkhang/spotify/dzYJkRIsojRMPuIT/search?q=${encodeURIComponent(query)}`; // Đây là hàm JavaScript dùng để mã hóa một chuỗi URL
  
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow"
  };

  try {
      const response = await fetch(spotifySearchUrl, requestOptions);
      const searchResult = await response.json();

      handleSearchResult(searchResult);
  } catch (error) {
      handleSearchError(error);
  }
}

function handleSearchResult(result) {
  displayAllResults(result);
}

function displayAllResults(result) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  const categories = ['albums', 'tracks', 'artists', 'playlists'];

  categories.forEach(category => {
      if (result[category] && result[category].items.length > 0) {
          const categoryTitle = document.createElement('h2');
          categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
          resultsDiv.appendChild(categoryTitle);

          result[category].items.forEach(item => {
              const itemElement = createItemElement(category, item);
              resultsDiv.appendChild(itemElement);
          });
      }
  });
}

function createItemElement(category, item) {
  const itemElement = document.createElement('div');
  itemElement.className = 'searchre';

  const itemTitle = document.createElement('h3');
  itemTitle.textContent = item.name;
  itemElement.appendChild(itemTitle);

  if (category === 'albums' || category === 'tracks') {
      const artistsParagraph = document.createElement('p');
      const artists = item.artists.map(artist => artist.name).join(', ');
      artistsParagraph.textContent = 'by ' + artists;
      itemElement.appendChild(artistsParagraph);
  }

  if (item.images && item.images.length > 0) {
      const itemImage = document.createElement('img');
      itemImage.src = item.images[0].url; // Use the first image in the array
      itemImage.alt = item.name;
      itemElement.appendChild(itemImage);
  }

  return itemElement;
}

function displayNoResultsMessage() {
  document.getElementById('results').innerHTML = 'Không có kết quả nào được tìm thấy.';
}

function handleSearchError(error) {
  console.log('Error fetching data from Spotify API:', error);
  // Có thể hiển thị thông báo lỗi trên giao diện người dùng thay vì chỉ log lỗi vào console.
}


let currentResults = {};

function handleSearchResult(result) {
  currentResults = result; // Lưu kết quả hiện tại để lọc
  displayAllResults(result);
}

function filterResults(category) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (category === 'all') {
      displayAllResults(currentResults);
  } else {
      const filteredCategory = category === 'songs' ? 'tracks' : category;
      if (currentResults[filteredCategory] && currentResults[filteredCategory].items.length > 0) {
          currentResults[filteredCategory].items.forEach(item => {
              const itemElement = createItemElement(filteredCategory, item);
              resultsDiv.appendChild(itemElement);
          });
      } else {
          displayNoResultsMessage();
      }
  }
}










  