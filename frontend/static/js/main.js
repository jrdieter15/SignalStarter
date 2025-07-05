// Main JavaScript file for the landing page
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const user = localStorage.getItem('signalcraft_user');
  if (user) {
    // Update login/signup buttons if user is logged in
    const signInButton = document.querySelector('a[href="/login"]');
    const startFreeButton = document.querySelector('a.btn-primary[href="/login"]');
    
    if (signInButton) {
      signInButton.textContent = 'Dashboard';
      signInButton.href = '/dashboard';
    }
    
    if (startFreeButton) {
      startFreeButton.textContent = 'Go to Dashboard';
      startFreeButton.href = '/dashboard';
    }
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});