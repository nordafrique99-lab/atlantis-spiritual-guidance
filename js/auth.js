// Authentication functions
// Get supabase from global scope
const supabase = window.supabaseClient;

// Check if supabase is available
if (!supabase || !supabase.auth) {
    console.error('Supabase is not properly initialized. Make sure supabase.js is loaded first.');
    
    // Create a minimal dummy supabase object to prevent errors
    window.supabaseClient = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signUp: () => Promise.reject(new Error('Supabase not initialized')),
            signInWithPassword: () => Promise.reject(new Error('Supabase not initialized')),
            signOut: () => Promise.reject(new Error('Supabase not initialized')),
            resetPasswordForEmail: () => Promise.reject(new Error('Supabase not initialized')),
            updateUser: () => Promise.reject(new Error('Supabase not initialized')),
            onAuthStateChange: (callback) => {
                console.warn('Auth state change listener registered but Supabase not initialized');
                return { data: { subscription: { unsubscribe: () => {} } } };
            }
        },
        from: () => ({
            insert: () => ({ 
                select: () => ({ 
                    single: () => Promise.reject(new Error('Supabase not initialized')) 
                }) 
            }),
            select: () => ({ 
                eq: () => ({ 
                    single: () => Promise.reject(new Error('Supabase not initialized')) 
                }) 
            }),
            update: () => ({ 
                eq: () => Promise.reject(new Error('Supabase not initialized')) 
            })
        })
    };
}
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check existing session
        const { data: { session } } = await supabase.auth.getSession();
        this.currentUser = session?.user || null;
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            this.updateAuthUI();
            
            if (event === 'SIGNED_IN') {
                this.showSuccessMessage('Welcome back!');
                window.location.href = 'pages/dashboard.html';
            } else if (event === 'SIGNED_OUT') {
                this.showInfoMessage('Successfully logged out');
            }
        });
    }

    // Sign up new user
    async signUp(email, password, name) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                        created_at: new Date().toISOString()
                    }
                }
            });

            if (error) throw error;

            // Create user profile in database
            if (data.user) {
                await this.createUserProfile(data.user, name);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Create user profile
    async createUserProfile(user, name) {
        const { error } = await supabase
            .from('users')
            .insert([
                {
                    id: user.id,
                    email: user.email,
                    name: name,
                    created_at: new Date().toISOString(),
                    meditation_streak: 0,
                    total_meditations: 0,
                    journal_entries: 0
                }
            ]);

        if (error) {
            console.error('Profile creation error:', error);
        }
    }

    // Sign in user
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out user
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/pages/reset-password.html`,
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update password
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Update password error:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if user is admin
    async isAdmin() {
        if (!this.currentUser) return false;
        
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', this.currentUser.id)
            .single();

        if (error || !data) return false;
        
        return data.role === 'admin';
    }

    // Get user data
    async getUserData() {
        if (!this.currentUser) return null;
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.currentUser.id)
            .single();

        if (error) {
            console.error('Get user data error:', error);
            return null;
        }

        return data;
    }

    // Update auth UI based on state
    updateAuthUI() {
        const loginBtn = document.querySelector('.nav-auth a[href*="login"]');
        const logoutBtn = document.getElementById('logout-btn');
        const userStatus = document.getElementById('user-status');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userStatus) {
                userStatus.innerHTML = `<p>Welcome back, ${this.currentUser.email}!</p>`;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userStatus) {
                userStatus.innerHTML = `<p data-i18n="guest_message">You are browsing as a guest. <a href="pages/login.html" data-i18n="login_link">Login</a> for personalized guidance.</p>`;
                i18n.updatePage();
            }
        }
    }

    // Show success message
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    // Show error message
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    // Show info message
    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    // Show message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.querySelector('.auth-message');
        if (existing) existing.remove();

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}-message fade-in`;
        messageDiv.textContent = message;

        // Add to DOM
        const authContainer = document.querySelector('.auth-container') || document.body;
        authContainer.prepend(messageDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize auth manager
const auth = new AuthManager();

// Expose to window for debugging
window.auth = auth;

// Helper function to check auth state
async function checkAuthState() {
    const { data } = await supabase.auth.getSession();
    auth.currentUser = data.session?.user || null;
    auth.updateAuthUI();
    return auth.currentUser;
}

// Load user data for dashboard
async function loadUserData() {
    if (!auth.currentUser) {
        window.location.href = '../index.html';
        return;
    }

    const userData = await auth.getUserData();
    if (userData) {
        // Update dashboard with user data
        const userNameElements = document.querySelectorAll('#user-name, #welcome-name');
        userNameElements.forEach(el => {
            el.textContent = userData.name || userData.email.split('@')[0];
        });

        document.getElementById('user-email').textContent = userData.email;
        
        // Update avatar with initials
        const avatar = document.getElementById('user-avatar');
        if (avatar && userData.name) {
            const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.textContent = initials;
        }

        // Update stats
        document.getElementById('meditation-streak').textContent = userData.meditation_streak || 0;
        document.getElementById('total-meditations').textContent = userData.total_meditations || 0;
        document.getElementById('journal-entries').textContent = userData.journal_entries || 0;
    }
}

// Check admin access
async function checkAdminAccess() {
    const isAdmin = await auth.isAdmin();
    if (!isAdmin) {
        window.location.href = '../index.html';
    }
}

// Logout function
async function logout() {
    await auth.signOut();
}

// Add event listeners for logout buttons
document.addEventListener('DOMContentLoaded', () => {
    // Logout button on index page
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Logout button on dashboard
    const dashboardLogout = document.getElementById('dashboard-logout');
    if (dashboardLogout) {
        dashboardLogout.addEventListener('click', logout);
    }

    // Admin logout button
    const adminLogout = document.getElementById('admin-logout');
    if (adminLogout) {
        adminLogout.addEventListener('click', logout);
    }
});