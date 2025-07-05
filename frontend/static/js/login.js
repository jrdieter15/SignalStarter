// Login page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const togglePasswordButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');
  
  // Check if user is already logged in
  const user = localStorage.getItem('signalcraft_user');
  if (user) {
    // Redirect to dashboard if already logged in
    window.location.href = '/dashboard';
  }
  
  // Toggle password visibility
  togglePasswordButton.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.add('hidden');
      eyeOffIcon.classList.remove('hidden');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('hidden');
      eyeOffIcon.classList.add('hidden');
    }
  });
  
  // Handle form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }
    
    // Simulate login (in a real app, this would be an API call)
    simulateLogin(email, password);
  });
  
  function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.remove('hidden');
  }
  
  function simulateLogin(email, password) {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll just simulate a successful login
    
    // Show loading state
    const loginButton = document.getElementById('login-button');
    loginButton.textContent = 'Signing in...';
    loginButton.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
      // Create a mock user object
      const user = {
        id: '1',
        email: email,
        full_name: 'Demo User',
        subscription_tier: 'free'
      };
      
      // Store user in localStorage (in a real app, you'd store a token)
      localStorage.setItem('signalcraft_user', JSON.stringify(user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 1000);
  }
});