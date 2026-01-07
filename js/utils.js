// Internationalization (i18n) Manager
class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.updatePage();
        this.setupLanguageSwitcher();
    }

    async loadTranslations() {
        // Try to load from localStorage first
        const cached = localStorage.getItem(`translations_${this.currentLang}`);
        if (cached) {
            this.translations = JSON.parse(cached);
            return;
        }

        // Load from external file or API
        try {
            const response = await fetch(`/translations/${this.currentLang}.json`);
            if (response.ok) {
                this.translations = await response.json();
                localStorage.setItem(`translations_${this.currentLang}`, JSON.stringify(this.translations));
            } else {
                // Fallback to embedded translations
                this.translations = this.getEmbeddedTranslations();
            }
        } catch (error) {
            console.error('Failed to load translations:', error);
            this.translations = this.getEmbeddedTranslations();
        }
    }

    getEmbeddedTranslations() {
        // Embedded translations for English and Arabic
        return {
            en: {
                "site_name": "Atlantis",
                "site_subtitle": "Spiritual Guidance",
                "nav_home": "Home",
                "nav_meditations": "Meditations",
                "nav_wisdom": "Wisdom Library",
                "nav_community": "Community",
                "nav_login": "Login",
                "nav_logout": "Logout",
                "hero_title": "Find Your Inner Peace",
                "hero_subtitle": "Journey through ancient wisdom and modern spiritual practices",
                "hero_cta": "Begin Your Journey",
                "features_title": "Our Spiritual Offerings",
                "feature1_title": "Guided Meditations",
                "feature1_desc": "Daily mindfulness sessions for inner peace",
                "feature2_title": "Sacred Texts",
                "feature2_desc": "Access to wisdom from spiritual traditions",
                "feature3_title": "Community Circles",
                "feature3_desc": "Connect with like-minded seekers",
                "feature4_title": "Spiritual Growth Tracking",
                "feature4_desc": "Monitor your spiritual journey",
                "wisdom_title": "Wisdom of the Day",
                "daily_wisdom": "\"The soul always knows what to do to heal itself. The challenge is to silence the mind.\"",
                "wisdom_author": "— Caroline Myss",
                "guest_message": "You are browsing as a guest. <a href=\"pages/login.html\">Login</a> for personalized guidance.",
                "login_link": "Login",
                "footer_tagline": "A sanctuary for spiritual growth",
                "footer_quick_links": "Quick Links",
                "footer_contact": "Contact",
                "footer_email": "contact@atlantis-spiritual.com",
                "footer_rights": "All rights reserved.",
                "back_home": "Back Home",
                "login_tab": "Login",
                "signup_tab": "Sign Up",
                "login_title": "Welcome Back, Seeker",
                "email_label": "Email",
                "password_label": "Password",
                "login_button": "Login",
                "forgot_password": "Forgot password?",
                "reset_here": "Reset here",
                "signup_title": "Begin Your Spiritual Journey",
                "name_label": "Full Name",
                "confirm_password_label": "Confirm Password",
                "accept_terms": "I accept the Terms and Conditions",
                "signup_button": "Create Account",
                "reset_title": "Reset Password",
                "reset_button": "Send Reset Link",
                "back_to_login": "Back to Login",
                "dashboard_home": "Dashboard",
                "journal_title": "Spiritual Journal",
                "progress_title": "Progress",
                "settings_title": "Settings",
                "dashboard_welcome": "Welcome,",
                "dashboard_date": "Today is",
                "daily_meditation_title": "Daily Meditation",
                "recommended": "Recommended",
                "morning_mindfulness": "Morning Mindfulness",
                "meditation_duration": "10 minutes",
                "view_all_meditations": "View All Meditations",
                "today_journal_title": "Today's Journal",
                "journal_placeholder": "Write your spiritual reflections here...",
                "save_journal": "Save Entry",
                "mood_label": "Today's Mood:",
                "spiritual_progress": "Your Spiritual Progress",
                "day_streak": "Day Streak",
                "total_meditations": "Total Meditations",
                "journal_entries": "Journal Entries",
                "recent_wisdom_title": "Recent Wisdom"
            },
            ar: {
                "site_name": "أتلانتس",
                "site_subtitle": "الإرشاد الروحي",
                "nav_home": "الرئيسية",
                "nav_meditations": "التأملات",
                "nav_wisdom": "مكتبة الحكمة",
                "nav_community": "المجتمع",
                "nav_login": "تسجيل الدخول",
                "nav_logout": "تسجيل الخروج",
                "hero_title": "ابحث عن سلامك الداخلي",
                "hero_subtitle": "ارتحل عبر الحكمة القديمة والممارسات الروحية الحديثة",
                "hero_cta": "ابدأ رحلتك",
                "features_title": "عروضنا الروحية",
                "feature1_title": "جلسات تأمل موجهة",
                "feature1_desc": "جلسات يومية للوعي الكامل من أجل السلام الداخلي",
                "feature2_title": "النصوص المقدسة",
                "feature2_desc": "الوصول إلى الحكمة من التقاليد الروحية",
                "feature3_title": "دوائر المجتمع",
                "feature3_desc": "تواصل مع الباحثين عن المعنى",
                "feature4_title": "تتبع النمو الروحي",
                "feature4_desc": "راقب رحلتك الروحية",
                "wisdom_title": "حكمة اليوم",
                "daily_wisdom": "\"الروح تعرف دائمًا ما يجب فعله لشفاء نفسها. التحدي هو إسكات العقل.\"",
                "wisdom_author": "— كارولين ميس",
                "guest_message": "أنت تتصفح كضيف. <a href=\"pages/login.html\">سجل الدخول</a> للحصول على إرشادات مخصصة.",
                "login_link": "تسجيل الدخول",
                "footer_tagline": "ملاذ للنمو الروحي",
                "footer_quick_links": "روابط سريعة",
                "footer_contact": "اتصل بنا",
                "footer_email": "contact@atlantis-spiritual.com",
                "footer_rights": "جميع الحقوق محفوظة.",
                "back_home": "العودة للرئيسية",
                "login_tab": "تسجيل الدخول",
                "signup_tab": "إنشاء حساب",
                "login_title": "مرحبًا بعودتك، أيها الباحث",
                "email_label": "البريد الإلكتروني",
                "password_label": "كلمة المرور",
                "login_button": "تسجيل الدخول",
                "forgot_password": "نسيت كلمة المرور؟",
                "reset_here": "إعادة تعيين هنا",
                "signup_title": "ابدأ رحلتك الروحية",
                "name_label": "الاسم الكامل",
                "confirm_password_label": "تأكيد كلمة المرور",
                "accept_terms": "أوافق على الشروط والأحكام",
                "signup_button": "إنشاء حساب",
                "reset_title": "إعادة تعيين كلمة المرور",
                "reset_button": "إرسال رابط إعادة التعيين",
                "back_to_login": "العودة لتسجيل الدخول",
                "dashboard_home": "لوحة التحكم",
                "journal_title": "المذكرات الروحية",
                "progress_title": "التقدم",
                "settings_title": "الإعدادات",
                "dashboard_welcome": "مرحبًا،",
                "dashboard_date": "اليوم هو",
                "daily_meditation_title": "التأمل اليومي",
                "recommended": "موصى به",
                "morning_mindfulness": "اليقظة الصباحية",
                "meditation_duration": "10 دقائق",
                "view_all_meditations": "عرض كل التأملات",
                "today_journal_title": "مذكرات اليوم",
                "journal_placeholder": "اكتب تأملاتك الروحية هنا...",
                "save_journal": "حفظ المدخل",
                "mood_label": "مزاج اليوم:",
                "spiritual_progress": "تقدمك الروحي",
                "day_streak": "تتابع الأيام",
                "total_meditations": "إجمالي التأملات",
                "journal_entries": "مدخلات المذكرات",
                "recent_wisdom_title": "الحكمة الحديثة"
            }
        }[this.currentLang] || {};
    }

    // Update entire page with translations
    updatePage() {
        // Set HTML direction for RTL languages
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        
        // Translate all elements with data-i18n-key
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translations[key] || key;
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                // Handle HTML content (like links in messages)
                if (translation.includes('<a')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.id.includes(this.currentLang)) {
                btn.classList.add('active');
            }
        });

        // Save language preference
        localStorage.setItem('language', this.currentLang);
    }

    // Change language
    changeLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Clear cached translations to force reload
        localStorage.removeItem(`translations_${lang}`);
        
        // Reload translations and update page
        this.loadTranslations().then(() => {
            this.updatePage();
        });
    }

    // Setup language switcher
    setupLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.id.includes('en') ? 'en' : 'ar';
                this.changeLanguage(lang);
            });
        });
    }

    // Add new translation (for admin)
    addTranslation(lang, key, value) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang][key] = value;
        
        // Save to localStorage
        localStorage.setItem(`translations_${lang}`, JSON.stringify(this.translations[lang]));
    }
}

// Initialize i18n
const i18n = new I18nManager();

// Utility functions
class Utils {
    static formatDate(date) {
        return new Date(date).toLocaleDateString(i18n.currentLang, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatTime(date) {
        return new Date(date).toLocaleTimeString(i18n.currentLang, {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static showLoading(element) {
        const originalHTML = element.innerHTML;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.disabled = true;
        return () => {
            element.innerHTML = originalHTML;
            element.disabled = false;
        };
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    static getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static setQueryParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    }

    static generateAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }

    static getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
}

// Export to window
window.i18n = i18n;
window.utils = Utils;