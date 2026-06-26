import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token && !req.url.includes('/api/login')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}` 
      },
    });
    return next(cloned);
  }

  return next(req);
};
