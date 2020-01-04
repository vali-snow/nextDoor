import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = 'Bearer ' + localStorage.getItem('authToken');
    if (authToken) {
      const transformedReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });
      return next.handle(transformedReq);
    } else {
      return next.handle(req);
    }
  }
}
