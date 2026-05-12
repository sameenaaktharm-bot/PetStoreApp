import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Only intercept if we have a token AND it's not a login request
  if (token && !req.url.includes('/api/login')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}` // trim ensures no accidental spaces
      },
    });
    return next(cloned);
  }

  return next(req);
};
