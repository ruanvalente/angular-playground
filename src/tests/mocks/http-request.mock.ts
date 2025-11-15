import { HttpHeaders } from '@angular/common/http';
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

const baseURL = environment.app.baseURL;

export function expectRequestGET(httpMock: HttpTestingController, url: string): TestRequest {
  return httpMock.expectOne((req) => req.method === 'GET' && req.url === url);
}

export function expectRequestWithParams(
  httpMock: HttpTestingController,
  url: string,
  params: Record<string, string | number>
): TestRequest {
  return httpMock.expectOne((req) => {
    if (req.method !== 'GET') return false;
    if (req.url !== url) return false;

    return Object.entries(params).every(([key, value]) => req.params.get(key) === String(value));
  });
}

export function mockResponse<T>(req: TestRequest, body: T, headers?: Record<string, string>) {
  req.flush(body as any, {
    headers: new HttpHeaders(headers ?? {}),
  });
}

export function mockLinkHeader(hasNext: boolean) {
  return hasNext ? { Link: `<${baseURL}page=2>; rel="next"` } : { Link: '' };
}
