import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IssuesService, Issue } from './issues.service';
import { environment } from '../../environments/environment';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  expectRequestGET,
  expectRequestWithParams,
  mockLinkHeader,
  mockResponse,
} from '../../tests/mocks/http-request.mock';

describe('IssuesService', () => {
  let service: IssuesService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.github.baseUrl;
  const issuesUrl = `${baseUrl}/repos/angular/angular/issues`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssuesService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(IssuesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getIssues', () => {
    it('should send the correct request with query params', () => {
      const mockIssues: Issue[] = [
        {
          id: '1',
          number: 10,
          title: 'Issue test',
          body: 'Body',
          html_url: 'http://example.com',
          created_at: new Date().toISOString(),
          user: { login: 'ruan', avatar_url: null },
          state: 'open',
        },
      ];

      service.getIssues('angular', 'angular', 1, 10).subscribe((resp) => {
        expect(resp.items.length).toBe(1);
      });

      const req = expectRequestWithParams(httpMock, issuesUrl, {
        state: 'open',
        page: 1,
        per_page: 10,
      });

      mockResponse(req, mockIssues, mockLinkHeader(true));
    });

    it('should calculate total_count correctly when next page exists', () => {
      service.getIssues('angular', 'angular', 1, 10).subscribe((resp) => {
        expect(resp.total_count).toBe(20);
      });

      const req = expectRequestWithParams(httpMock, issuesUrl, {
        state: 'open',
        page: 1,
        per_page: 10,
      });

      mockResponse(req, [], mockLinkHeader(true));
    });

    it('should calculate total_count correctly when there is no next page', () => {
      service.getIssues('angular', 'angular', 2, 10).subscribe((resp) => {
        expect(resp.total_count).toBe(20);
      });

      const req = expectRequestWithParams(httpMock, issuesUrl, {
        state: 'open',
        page: 2,
        per_page: 10,
      });

      mockResponse(req, [], mockLinkHeader(false));
    });
  });

  describe('getIssue', () => {
    it('should fetch a single issue and convert id to string', () => {
      const mockIssue = {
        id: 123,
        number: 30,
        title: 'Test issue',
        body: 'Body test',
        html_url: 'url',
        created_at: new Date().toISOString(),
        user: { login: 'ruan', avatar_url: null },
        state: 'open',
      };

      service.getIssue('angular', 'angular', 30).subscribe((issue) => {
        expect(issue.id).toBe('123');
      });

      const req = expectRequestGET(httpMock, `${issuesUrl}/30`);

      mockResponse(req, mockIssue);
    });
  });
});
