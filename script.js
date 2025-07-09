// Configuration
const backendUrl = 'https://qop-tawny.vercel.app/api/instagram'; // Replace with your Vercel API route
let swiper = null;

async function fetchInstagramPosts() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const errorMessageElement = document.getElementById('error-message');

    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        swiperWrapper.innerHTML = '';

        const response = await fetch(backendUrl);
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No Instagram posts found');
        }

        // Create Swiper slides
        swiperWrapper.innerHTML = data.data.map(post => `
            <div class="swiper-slide">
                <div class="relative group overflow-hidden rounded-xl shadow-lg mx-2 h-full">
                    <a href="${post.permalink}" target="_blank" rel="noopener noreferrer" class="block h-full">
                        ${post.media_type === 'VIDEO' ? `
                            <div class="absolute inset-0 flex items-center justify-center z-10">
                                <svg class="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                </svg>
                            </div>
                            <video class="w-full h-full object-cover aspect-square" muted playsinline>
                                <source src="${post.media_url}" type="video/mp4">
                            </video>` : 
                            `<img src="${post.media_url}" 
                                 alt="${post.caption || 'Instagram post'}"
                                 class="w-full h-full object-cover aspect-square"
                                 loading="lazy">`}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
                            <p class="text-white text-sm line-clamp-2">${post.caption || ''}</p>
                        </div>
                    </a>
                </div>
            </div>
        `).join('');

        // Initialize or update Swiper
        if (!swiper) {
            swiper = new Swiper('.swiper-container', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 24,
                centeredSlides: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    640: { slidesPerView: 1.5 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 2.5 },
                    1280: { slidesPerView: 3 }
                }
            });
        } else {
            swiper.update();
            swiper.slideTo(0);
        }

    } catch (error) {
        console.error('Instagram feed error:', error);
        errorMessageElement.textContent = error.message;
        errorElement.classList.remove('hidden');
        swiperWrapper.innerHTML = '';
    } finally {
        loadingElement.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchInstagramPosts);

// Optional: Refresh every hour
setInterval(fetchInstagramPosts, 3600000);
