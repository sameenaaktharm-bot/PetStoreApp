import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const cartGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Retrieve the userId we just stored from the Profile API
  const userId = localStorage.getItem('userId');

  if (userId) {
    // Console log to verify the guard is working as expected
    console.log('Access Granted: userId found in storage -', userId);
    return true;
  } else {
    // User is not logged in or userId is missing
    console.warn('Access Denied: No userId found. Redirecting to login...');
    alert('User is not logged in. Please log in to access your cart.');
    
    // Redirect to the login page
    router.navigate(['/login']);
    return false;
  }
};