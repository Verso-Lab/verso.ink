// Global variables
let currentLanguage = 'en';
let translations = {};
const supportedLanguages = ['en', 'de'];

// Detect user's preferred language
function detectLanguage() {
    const browserLang = navigator.language.split('-')[0];
    return supportedLanguages.includes(browserLang) ? browserLang : 'en';
}

// Load translations for a given language
async function loadTranslations(lang) {
    if (!translations[lang]) {
        try {
            const response = await fetch(`${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            translations[lang] = await response.json();
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            return false;
        }
    }
    return true;
}

// Update all translatable elements on the page
function updateContent() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = key.split('.').reduce((obj, k) => obj && obj[k], translations[currentLanguage]);
        if (translation) {
            element.innerHTML = translation;
        } else {
            console.warn(`Translation missing for key: ${key}`);
        }
    });
}

// Update the toggle button text
function updateToggleButton() {
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.textContent = currentLanguage === 'en' ? 'DE' : 'EN';
    }
}

// Set the language and update content
async function setLanguage(lang) {
    if (await loadTranslations(lang)) {
        currentLanguage = lang;
        document.documentElement.lang = lang;
        updateContent();
        updateToggleButton();
    }
}

// Toggle between English and German
async function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'de' : 'en';
    await setLanguage(newLang);
}

// Initialize the page with the user's preferred language
document.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = detectLanguage();
    await setLanguage(userPreferredLanguage);
    
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
});