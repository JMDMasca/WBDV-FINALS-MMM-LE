  (function() {
    let isLoggedIn = false;
    const views = {
      home: document.getElementById('homeView'),
      music: document.getElementById('musicView'),
      liveexpo: document.getElementById('liveexpoView'),
      library: document.getElementById('libraryView'),
      about: document.getElementById('aboutView')
    };
    const libraryLoggedOut = document.getElementById('libraryLoggedOut');
    const libraryLoggedIn = document.getElementById('libraryLoggedIn');
    const authButtonsDiv = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileCircle = document.getElementById('profileCircle');
    const profileDropdown = document.getElementById('profileDropdown');
    const loggedInDot = document.getElementById('loggedInDot');

    function updateAuthUI() {
      if (isLoggedIn) {
        authButtonsDiv.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        libraryLoggedOut.classList.add('hidden');
        libraryLoggedIn.classList.remove('hidden');
        profileCircle.classList.add('logged-in');
      } else {
        authButtonsDiv.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        libraryLoggedOut.classList.remove('hidden');
        libraryLoggedIn.classList.add('hidden');
        profileCircle.classList.remove('logged-in');
      }
    }

    profileCircle.addEventListener('click', function(e) {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
      if (!profileCircle.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });

    profileDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    document.getElementById('loginBtn').addEventListener('click', function(e) {
      e.stopPropagation();
      isLoggedIn = true;
      updateAuthUI();
    });
    document.getElementById('signupBtn').addEventListener('click', function(e) {
      e.stopPropagation();
      isLoggedIn = true;
      updateAuthUI();
    });
    logoutBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      isLoggedIn = false;
      updateAuthUI();
    });

    const btnSongs = document.getElementById('btnSongs');
    const btnVideos = document.getElementById('btnVideos');
    const songsPanel = document.getElementById('songsLibraryPanel');
    const videosPanel = document.getElementById('videosLibraryPanel');
    btnSongs.addEventListener('click', () => {
      songsPanel.classList.remove('hidden');
      videosPanel.classList.add('hidden');
      btnSongs.classList.add('active');
      btnVideos.classList.remove('active');
    });
    btnVideos.addEventListener('click', () => {
      videosPanel.classList.remove('hidden');
      songsPanel.classList.add('hidden');
      btnVideos.classList.add('active');
      btnSongs.classList.remove('active');
    });

    function hideAllViews() {
      Object.values(views).forEach(v => v.classList.add('hidden'));
    }
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
        const view = this.getAttribute('data-view');
        hideAllViews();
        if (views[view]) views[view].classList.remove('hidden');
      });
    });

    const advToggle = document.getElementById('advSearchToggle');
    const advPanel = document.getElementById('advancedPanel');
    advToggle.addEventListener('click', () => {
      advPanel.style.display = advPanel.style.display === 'none' ? 'flex' : 'none';
    });
    advPanel.style.display = 'flex';

    const genAll = document.getElementById('genAll');
    const genCbs = document.querySelectorAll('.gen-cb');
    function updateGenAll() {
      const anyChecked = Array.from(genCbs).some(cb => cb.checked);
      genAll.checked = !anyChecked;
    }
    genAll.addEventListener('change', function() {
      if (this.checked) { genCbs.forEach(cb => cb.checked = false); }
    });
    genCbs.forEach(cb => cb.addEventListener('change', updateGenAll));

    const singAll = document.getElementById('singAll');
    const singCbs = document.querySelectorAll('.sing-cb');
    function updateSingAll() {
      const anyChecked = Array.from(singCbs).some(cb => cb.checked);
      singAll.checked = !anyChecked;
    }
    singAll.addEventListener('change', function() {
      if (this.checked) { singCbs.forEach(cb => cb.checked = false); }
    });
    singCbs.forEach(cb => cb.addEventListener('change', updateSingAll));

    document.querySelectorAll('.arrow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); alert('Carousel scroll'); });
    });

    hideAllViews();
    document.getElementById('homeView').classList.remove('hidden');
    updateAuthUI();
  })();