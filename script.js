const IS_DEV_MODE = false;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn-start');
    const overlay = document.getElementById('intro-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const currentTheme = localStorage.getItem('theme') || 'light';
    
    function updateThemeButton(theme) {
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
    }

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeButton(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
        });
    }

    if (startBtn && overlay) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startBtn.classList.add('fade-out');
            setTimeout(() => {
                overlay.classList.add('reveal-overlay');
            }, 500);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    function handleSearch() {
        const username = searchInput.value.trim();
        if (username) {
            fetchProfile(username);
            fetchRepos(username);
        }
    }


    async function fetchProfile(username = 'Guibis') {
        const headerSection = document.getElementById('main-header');
        if (!headerSection) return;
        
        // Clear previous content
        headerSection.innerHTML = '';

        const headerContent = document.createElement('div');
        headerContent.className = 'header-content';

        const avatar = document.createElement('img');
        avatar.id = 'profile-avatar';
        avatar.alt = 'Profile Avatar';
        
        const profileInfo = document.createElement('div');
        profileInfo.className = 'profile-info';

        const name = document.createElement('h2');
        name.id = 'profile-name';
        name.textContent = 'Loading...';

        const bio = document.createElement('p');
        bio.id = 'profile-bio';

        const location = document.createElement('p');
        location.id = 'profile-location';

        profileInfo.appendChild(name);
        profileInfo.appendChild(bio);
        profileInfo.appendChild(location);
        
        headerContent.appendChild(avatar);
        headerContent.appendChild(profileInfo);
        
        headerSection.appendChild(headerContent);

        try {
            let data;
            if (IS_DEV_MODE && typeof MOCK_PROFILE !== 'undefined') {
                console.log('Using mock profile data');
                data = MOCK_PROFILE;
            } else {
                const response = await fetch(`https://api.github.com/users/${username}`);
                
                if (response.status === 403) {
                    console.warn("Github is taking a nap... Using fallback profile data.");
                    data = MOCK_PROFILE;
                } else if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    data = await response.json();
                }
            }

            if (data.avatar_url) avatar.src = data.avatar_url;
            if (data.name) name.textContent = data.name;
            
            bio.textContent = data.bio ? data.bio : "Coding enthusiast & learner";
            
            if (data.location) location.textContent = `📍 ${data.location}`;
            
        } catch (error) {
            console.error('Error fetching GitHub profile:', error);
            name.textContent = "Failed to load profile";
        }
    }

    async function fetchRepos(username = 'Guibis') {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Clear previous repo section if exists
        const existingRepoSection = document.getElementById('repo-section');
        if (existingRepoSection) {
            existingRepoSection.remove();
        }

        const repoSection = document.createElement('section');
        repoSection.id = 'repo-section';
        const title = document.createElement('h2');
        title.textContent = 'My Projects';
        repoSection.appendChild(title);

        const repoGrid = document.createElement('div');
        repoGrid.className = 'repo-grid';
        repoSection.appendChild(repoGrid);
        mainContent.appendChild(repoSection);

        try {
            let repos;
            if (IS_DEV_MODE && typeof MOCK_REPOS !== 'undefined') {
                console.log('Using mock repos data');
                repos = MOCK_REPOS;
            } else {
                const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
                
                if (response.status === 403) {
                    console.warn("Github is taking a nap... Using fallback repos data.");
                    repos = MOCK_REPOS;
                } else if (!response.ok) {
                    throw new Error('Failed to fetch repos');
                } else {
                    repos = await response.json();
                }
            }

            const filteredRepos = repos.filter(repo => {
                return !repo.fork;
            });

            const repoCards = filteredRepos.map(repo => {
                const card = document.createElement('div');
                card.className = 'repo-card';

                const repoTitle = document.createElement('h3');
                const link = document.createElement('a');
                link.href = repo.html_url;
                link.target = '_blank';
                link.innerHTML = `<img src="assets/github.svg" alt="GitHub" class="repo-icon"> ${repo.name}`;
                repoTitle.appendChild(link);

                const desc = document.createElement('p');
                desc.textContent = repo.description || 'No description available.';

                const meta = document.createElement('div');
                meta.className = 'repo-meta';
                const lang = document.createElement('span');
                lang.textContent = repo.language || 'Code';
                meta.appendChild(lang);

                if (repo.homepage) {
                    const demoLink = document.createElement('a');
                    demoLink.href = repo.homepage;
                    demoLink.target = '_blank';
                    demoLink.className = 'live-demo-btn';
                    demoLink.innerHTML = `<img src="assets/website.svg" alt="Live Demo" class="btn-icon"> View Page`;
                    meta.appendChild(demoLink);
                }

                if(!repo.homepage) {
                    meta.style.justifyContent = 'flex-end';
                }

                card.appendChild(repoTitle);
                card.appendChild(desc);
                card.appendChild(meta);
                
                return card;
            });

            repoCards.forEach(card => repoGrid.appendChild(card)); 

        } catch (error) {
            console.error('Error fetching repos:', error);
            const err = document.createElement('p');
            err.textContent = 'Failed to load projects.';
            repoSection.appendChild(err);
        }
    }

    fetchProfile();
    fetchRepos();
});
