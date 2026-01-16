document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn-start');
    const overlay = document.getElementById('intro-overlay');

    if (startBtn && overlay) {
        startBtn.addEventListener('click', () => {
            // First, user sees the button hover/active animation, maybe we just hide the button first
            // or trigger the page reveal immediately.
            
            // Let's add the fade-out class to the button itself to make it disappear
            startBtn.classList.add('fade-out'); // startBtn is now the <a> tag

            // Then, after a short delay or immediately, reveal the page.
            // Since the user said "click -> it disappears -> animation executed -> show content"
            // We can delay the overlay lift slightly to let the button disappear.
            
            setTimeout(() => {
                overlay.classList.add('reveal-overlay');
            }, 500);
        });
    }

    // Fetch GitHub Profile Data
    async function fetchProfile() {
        // Dynamic HTML Generation
        const headerSection = document.getElementById('main-header');
        if (!headerSection) return;

        // Create Container
        const headerContent = document.createElement('div');
        headerContent.className = 'header-content';

        // Create Avatar
        const avatar = document.createElement('img');
        avatar.id = 'profile-avatar';
        avatar.alt = 'Profile Avatar';
        // Set a placeholder or leave empty until fetch
        
        // Create Info Wrapper
        const profileInfo = document.createElement('div');
        profileInfo.className = 'profile-info';

        // Create Elements
        const name = document.createElement('h2');
        name.id = 'profile-name';
        name.textContent = 'Loading...';

        const bio = document.createElement('p');
        bio.id = 'profile-bio';

        const location = document.createElement('p');
        location.id = 'profile-location';

        // Append elements to DOM
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
            
            // Bio Constraint: If bio is null, use default
            bio.textContent = data.bio ? data.bio : "Coding enthusiast & learner";
            
            if (data.location) location.textContent = `📍 ${data.location}`;
            
        } catch (error) {
            console.error('Error fetching GitHub profile:', error);
            name.textContent = "Failed to load profile";
        }
    }

    fetchProfile();
});
