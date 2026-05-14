const player = document.querySelector('[data-player]');
const audio = player.querySelector('[data-audio]');
const cover = player.querySelector('.audio-cover');
const title = player.querySelector('.audio-title-text');
const album = player.querySelector('.audio-album');
const toggle = player.querySelector('[data-toggle]');
const previous = player.querySelector('[data-prev]');
const next = player.querySelector('[data-next]');
const seek = player.querySelector('[data-seek]');
const progress = player.querySelector('[data-progress]');
const tracks = [
	{
		title: 'Tabun (ft. Hatsune Miku)',
		album: 'Ayase / YOASOBI',
		cover: 'tabun.png',
		src: 'tabunmiku.mp3'
	},
	{
		title: 'Ghost Rule (ft. Hatsune Miku)',
		album: 'DECO*27',
		cover: 'ghostrulecover.png',
		src: 'ghostrule.mp3'
	},
	{
		title: 'Igaku (ft. Kasane Teto)',
		album: 'Haraguchi Sasuke',
		cover: 'igakucover.png',
		src: 'igaku.mp3'
	},
	{
		title: 'Roshin Yuukai',
		album: 'iroha (sasaki)',
		cover: 'meltdowncover.png',
		src: 'meltdown.mp3'
	},
	{
		title: 'KING',
		album: 'Kanaria',
		cover: 'kingcover.jpg',
		src: 'king.mp3'
	},
	{
		title: 'Rolling Girl',
		album: 'wowaka',
		cover: 'rollinggirlcover.png',
		src: 'rolling.mp3'
	}
];
let currentTrack = 0;

function loadTrack(index, shouldPlay) {
	const track = tracks[index];
	currentTrack = index;
	title.textContent = track.title;
	album.textContent = track.album;
	cover.src = track.cover;
	audio.src = track.src;
	progress.style.width = '0%';
	seek.setAttribute('aria-valuenow', '0');

	if (shouldPlay) {
		audio.play();
	}
}

toggle.addEventListener('click', () => {
	if (audio.paused) {
		audio.play();
	} else {
		audio.pause();
	}
});

previous.addEventListener('click', () => {
	const index = (currentTrack - 1 + tracks.length) % tracks.length;
	loadTrack(index, true);
});

next.addEventListener('click', () => {
	const index = (currentTrack + 1) % tracks.length;
	loadTrack(index, true);
});

seek.addEventListener('click', (event) => {
	if (!audio.duration) {
		return;
	}

	const rect = seek.getBoundingClientRect();
	const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
	audio.currentTime = audio.duration * percent;
});

audio.addEventListener('play', () => {
	toggle.textContent = 'Pause';
	toggle.setAttribute('aria-label', 'Pause track');
});

audio.addEventListener('pause', () => {
	toggle.textContent = 'Play';
	toggle.setAttribute('aria-label', 'Play track');
});

audio.addEventListener('timeupdate', () => {
	const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
	progress.style.width = percent + '%';
	seek.setAttribute('aria-valuenow', Math.round(percent));
});

audio.addEventListener('ended', () => {
	const index = (currentTrack + 1) % tracks.length;
	loadTrack(index, true);
});

const profileMenu = document.querySelector('[data-profile-menu]');
const profileToggle = document.querySelector('[data-profile-toggle]');
const profileDropdown = document.querySelector('[data-profile-dropdown]');
const loggedOutMenu = document.querySelector('[data-logged-out]');
const loggedInMenu = document.querySelector('[data-logged-in]');
const signupForm = document.querySelector('[data-signup-form]');
const loginForm = document.querySelector('[data-login-form]');
const showLoginButton = document.querySelector('[data-show-login]');
const showSignupButton = document.querySelector('[data-show-signup]');
const logoutButton = document.querySelector('[data-logout]');
const searchForm = document.querySelector('.search-bar');
const loginStorageKey = 'liveexpo-logged-in';

function showAuthForm(mode) {
	const isLogin = mode === 'login';
	signupForm.hidden = isLogin;
	loginForm.hidden = !isLogin;
}

const ROLE_LEVELS = { guest: 0, user: 1, admin: 2, superadmin: 3 };

function setProfileState(role = 'guest') {
	const level = ROLE_LEVELS[role] || 0;
	const isLoggedIn = level > 0;

	localStorage.setItem(loginStorageKey, role);
	loggedOutMenu.hidden = isLoggedIn;
	loggedInMenu.hidden = !isLoggedIn;
	
	const roleDisplay = document.getElementById('display-role');
	roleDisplay && (roleDisplay.textContent = role.charAt(0).toUpperCase() + role.slice(1));

	// Update UI visibility based on role level
	document.querySelectorAll('[data-role-required]').forEach(el => {
		const requiredLevel = ROLE_LEVELS[el.dataset.roleRequired] || 0;
		el.hidden = level < requiredLevel;
	});

	// Update playback/library buttons (General View check)
	document.querySelectorAll('[data-auth-required]').forEach(el => {
		el.disabled = !isLoggedIn;
	});

	// Update auth gates in overlays (About Us is exempted as it lacks [data-auth-gate])
	document.querySelectorAll('.miku-overlay').forEach(overlay => {
		const gate = overlay.querySelector('[data-auth-gate]');
		const content = overlay.querySelector('[data-auth-content]');
		gate && (gate.hidden = isLoggedIn);
		content && (content.hidden = !isLoggedIn);
	});

	(!isLoggedIn) && showAuthForm('signup');
}

function closeProfileMenu() {
	profileDropdown.hidden = true;
	profileToggle.setAttribute('aria-expanded', 'false');
}

profileToggle.addEventListener('click', () => {
	const isOpen = !profileDropdown.hidden;
	profileDropdown.hidden = isOpen;
	profileToggle.setAttribute('aria-expanded', String(!isOpen));
});

signupForm.addEventListener('submit', (event) => {
	event.preventDefault();
	setProfileState(true);
	closeProfileMenu();
	signupForm.reset();
});

loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const u = loginForm.querySelector('[name="login-username"]').value;
	const p = loginForm.querySelector('[name="login-password"]').value;

	// Credential Mapping logic
	const role = (u === 'root' && p === 'root') ? 'superadmin' : 
	             (u === 'admin' && p === 'admin') ? 'admin' : 
	             (u === 'user' && p === 'user') ? 'user' : 'guest';

	const success = role !== 'guest';
	success && setProfileState(role);
	success && closeProfileMenu();
	success && loginForm.reset();
	(!success) && alert("Invalid credentials (user/admin/root)");
});

showLoginButton.addEventListener('click', () => {
	showAuthForm('login');
});

showSignupButton.addEventListener('click', () => {
	showAuthForm('signup');
});

document.querySelectorAll('[data-user-mode]').forEach(btn => btn.onclick = () => {
	setProfileState('user');
	closeProfileMenu();
});

document.querySelectorAll('[data-admin-mode]').forEach(btn => btn.onclick = () => {
	setProfileState('admin');
	closeProfileMenu();
});

document.querySelectorAll('[data-root-mode]').forEach(btn => btn.onclick = () => {
	setProfileState('superadmin');
	closeProfileMenu();
});

logoutButton.addEventListener('click', () => {
	setProfileState('guest');
	closeProfileMenu();
});

document.addEventListener('click', (event) => {
	if (!profileMenu.contains(event.target)) {
		closeProfileMenu();
	}
});

searchForm.addEventListener('submit', (event) => {
	event.preventDefault();
});

setProfileState(localStorage.getItem(loginStorageKey) || 'guest');

const mikuOverlay = document.querySelector('[data-miku-overlay]');
const mikuCloseButton = document.querySelector('[data-close-miku]');

function openMikuOverlay() {
	mikuOverlay.hidden = false;
	mikuOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeMikuOverlay() {
	mikuOverlay.classList.remove('active');
	mikuOverlay.hidden = true;
	document.body.style.overflow = '';
}

mikuCloseButton.addEventListener('click', closeMikuOverlay);

mikuOverlay.addEventListener('click', (event) => {
	if (event.target === mikuOverlay) {
		closeMikuOverlay();
	}
});

function addMikuTrackListeners() {
	document.querySelectorAll('.miku-card[data-track-index]').forEach((card) => {
		card.addEventListener('click', () => {
			const index = Number(card.dataset.trackIndex);
			if (!Number.isNaN(index) && tracks[index]) {
				loadTrack(index, true);
				closeMikuOverlay();
			}
		});
	});
}

addMikuTrackListeners();

function setupCarouselControls() {
	document.querySelectorAll('.miku-arrow[data-carousel][data-direction]').forEach((button) => {
		button.addEventListener('click', () => {
			const carouselName = button.dataset.carousel;
			const direction = button.dataset.direction === 'next' ? 1 : -1;
			let carousel = document.querySelector(`.miku-card-list.carousel[data-carousel="${carouselName}"]`);

			if (!carousel) {
				const row = button.closest('.miku-music-row');
				carousel = row ? row.querySelector('.miku-card-list.carousel') : null;
			}

			if (!carousel) return;
			const amount = Math.max(carousel.clientWidth * 0.75, 200);
			carousel.scrollBy({ left: amount * direction, behavior: 'smooth' });
		});
	});
}

setupCarouselControls();

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && mikuOverlay.classList.contains('active')) {
		closeMikuOverlay();
	}
});

// About Us Overlay Logic
const aboutOverlay = document.querySelector('[data-about-overlay]');
const aboutCloseButton = document.querySelector('[data-close-about]');

function openAboutOverlay() {
	aboutOverlay.hidden = false;
	aboutOverlay.classList.add('active');
	document.body.style.overflow = 'hidden'; // Prevent scrolling on the main page
}

function closeAboutOverlay() {
	aboutOverlay.classList.remove('active');
	aboutOverlay.hidden = true;
	document.body.style.overflow = ''; // Restore scrolling
}

aboutCloseButton.addEventListener('click', closeAboutOverlay);

aboutOverlay.addEventListener('click', (event) => {
	if (event.target === aboutOverlay) {
		closeAboutOverlay();
	}
});

// Concerts Overlay Logic
const concertsOverlay = document.querySelector('[data-concerts-overlay]');
const concertsCloseButton = document.querySelector('[data-close-concerts]');

function openConcertsOverlay() {
	concertsOverlay.hidden = false;
	concertsOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeConcertsOverlay() {
	concertsOverlay.classList.remove('active');
	concertsOverlay.hidden = true;
	document.body.style.overflow = '';
}

if (concertsCloseButton) {
	concertsCloseButton.addEventListener('click', closeConcertsOverlay);
}

concertsOverlay.addEventListener('click', (event) => {
	if (event.target === concertsOverlay) {
		closeConcertsOverlay();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && concertsOverlay.classList.contains('active')) {
		closeConcertsOverlay();
	}
});

// Admin Overlay Logic
const adminOverlay = document.querySelector('[data-admin-overlay]');
const adminCloseButton = document.querySelector('[data-close-admin]');

function openAdminOverlay() {
	adminOverlay.hidden = false;
	adminOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeAdminOverlay() {
	adminOverlay.classList.remove('active');
	adminOverlay.hidden = true;
	document.body.style.overflow = '';
}

adminCloseButton && adminCloseButton.addEventListener('click', closeAdminOverlay);

adminOverlay.addEventListener('click', (event) => {
	if (event.target === adminOverlay) closeAdminOverlay();
});

// Super Admin Overlay Logic
const superAdminOverlay = document.querySelector('[data-superadmin-overlay]');
const superAdminCloseButton = document.querySelector('[data-close-superadmin]');

function openSuperAdminOverlay() {
	superAdminOverlay.hidden = false;
	superAdminOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeSuperAdminOverlay() {
	superAdminOverlay.classList.remove('active');
	superAdminOverlay.hidden = true;
	document.body.style.overflow = '';
}

superAdminCloseButton && superAdminCloseButton.addEventListener('click', closeSuperAdminOverlay);

superAdminOverlay.addEventListener('click', (event) => {
	if (event.target === superAdminOverlay) closeSuperAdminOverlay();
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		if (adminOverlay.classList.contains('active')) closeAdminOverlay();
		if (superAdminOverlay.classList.contains('active')) closeSuperAdminOverlay();
	}
});

const libraryOverlay = document.querySelector('[data-library-overlay]');
const libraryCloseButton = document.querySelector('[data-close-library]');

function openLibraryOverlay() {
	libraryOverlay.hidden = false;
	libraryOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeLibraryOverlay() {
	libraryOverlay.classList.remove('active');
	libraryOverlay.hidden = true;
	document.body.style.overflow = '';
}

libraryCloseButton.addEventListener('click', closeLibraryOverlay);

libraryOverlay.addEventListener('click', (event) => {
	if (event.target === libraryOverlay) {
		closeLibraryOverlay();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && libraryOverlay.classList.contains('active')) {
		closeLibraryOverlay();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && aboutOverlay.classList.contains('active')) {
		closeAboutOverlay();
	}
});



const videoOverlay = document.querySelector('[data-video-overlay]');
const videoElement = document.getElementById('concert-video');

function playVideo(src) {
	if (!videoElement || !videoOverlay) return;
	videoElement.src = src;
	videoOverlay.hidden = false;
	videoOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
	videoElement.play();
}

const videoCloseBtn = document.querySelector('[data-close-video]');
videoCloseBtn && videoCloseBtn.addEventListener('click', () => {
	videoOverlay.hidden = true;
	videoOverlay.classList.remove('active');
	videoElement.pause();
	document.body.style.overflow = '';
});
