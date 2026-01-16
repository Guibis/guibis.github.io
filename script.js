const IS_DEV_MODE = true;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn-start');
    const overlay = document.getElementById('intro-overlay');
    const themeToggle = document.getElementById('theme-toggle');

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

    async function fetchProfile() {
        const headerSection = document.getElementById('main-header');
        if (!headerSection) return;

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
                const response = await fetch('https://api.github.com/users/Guibis');
                if (!response.ok) throw new Error('Network response was not ok');
                data = await response.json();
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

    async function fetchRepos() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

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
                const response = await fetch('https://api.github.com/users/Guibis/repos?sort=updated');
                if (!response.ok) throw new Error('Failed to fetch repos');
                repos = await response.json();
            }

            const filteredRepos = repos.filter(repo => {
                const isNotFork = !repo.fork;
                const hasPortfolioTopic = repo.topics && repo.topics.includes('portfolio');
                return isNotFork && hasPortfolioTopic; 
            });

            const repoCards = filteredRepos.map(repo => {
                const card = document.createElement('div');
                card.className = 'repo-card';

                const repoTitle = document.createElement('h3');
                const link = document.createElement('a');
                link.href = repo.html_url;
                link.target = '_blank';
                link.textContent = `🌐 ${repo.name}`;
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
                    demoLink.textContent = 'View Page 🔗';
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
