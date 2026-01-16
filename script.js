document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn-start');
    const overlay = document.getElementById('intro-overlay');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme Toggle Logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    if (startBtn && overlay) {
        startBtn.addEventListener('click', () => {
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
            const response = await fetch('https://api.github.com/users/Guibis');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

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
            const response = await fetch('https://api.github.com/users/Guibis/repos?sort=updated');
            if (!response.ok) throw new Error('Failed to fetch repos');
            const repos = await response.json();

            const filteredRepos = repos.filter(repo => {
                const isNotFork = !repo.fork;
                const hasPortfolioTopic = repo.topics && repo.topics.includes('portfolio');
                return isNotFork && hasPortfolioTopic; 
            });

            filteredRepos.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'repo-card';

                const repoTitle = document.createElement('h3');
                const link = document.createElement('a');
                link.href = repo.html_url;
                link.target = '_blank';
                link.textContent = repo.name;
                repoTitle.appendChild(link);

                const desc = document.createElement('p');
                desc.textContent = repo.description || 'No description available.';

                const meta = document.createElement('div');
                meta.className = 'repo-meta';
                const lang = document.createElement('span');
                lang.textContent = repo.language || 'Code';
                meta.appendChild(lang);

                card.appendChild(repoTitle);
                card.appendChild(desc);
                card.appendChild(meta);
                repoGrid.appendChild(card);
            }); 

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
