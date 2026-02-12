import { HttpInterceptorFn } from '@angular/common/http';
import { TOKEN_KEY } from '../services/auth/auth.constants';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return next(req);
  }

  const isApiRequest =
    req.url.startsWith(environment.apiBaseUrl) || req.url.startsWith('/api/');

  if (!isApiRequest || req.headers.has('Authorization')) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
