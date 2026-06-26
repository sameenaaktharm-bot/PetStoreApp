import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const cartGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userId = localStorage.getItem('userId');

  if (userId) {
    console.log('Access Granted: userId found in storage -', userId);
    return true;
  } else {
    console.warn('Access Denied: No userId found. Redirecting to login...');
    alert('User is not logged in. Please log in to access your cart.');
    
    router.navigate(['/login']);
    return false;
  }
};