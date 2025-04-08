export const checkIsLoggedInUser = async () => {
    try {
        // Only use localStorage for user data
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return { user: null, isAuthenticated: false };
            }

            // Get user data from localStorage
            const userData = localStorage.getItem('user_data');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    console.log('User data found in localStorage');
                    return {
                        user,
                        token,
                        isAuthenticated: true
                    };
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }

            // Create a minimal user profile if no data found
            const email = localStorage.getItem('user_email') || 'user@example.com';
            const name = email.split('@')[0];

            const fallbackUser = {
                id: `user_${Date.now()}`,
                email,
                name,
                fullName: name,
                role: localStorage.getItem('user_role') || 'learner',
                profilePicture: null,
                phoneNo: '',
                aboutMe: '',
                education: []
            };

            // Store for future use
            localStorage.setItem('user_data', JSON.stringify(fallbackUser));

            return {
                user: fallbackUser,
                token,
                isAuthenticated: true
            };
        }

        return { user: null, isAuthenticated: false };
    } catch (error) {
        console.error('Error checking logged in user:', error);
        return {
            user: null,
            isAuthenticated: false,
            error: error.message
        };
    }
};
