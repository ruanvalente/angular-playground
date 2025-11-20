import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let title: Title;
  let meta: Meta;

  function expectMetaUpdated(tag: Record<string, string>) {
    expect(meta.updateTag).toHaveBeenCalledWith(tag);
  }

  function expectMetaNotUpdated(match: Partial<Record<string, string>>) {
    expect(meta.updateTag).not.toHaveBeenCalledWith(jasmine.objectContaining(match));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Title, Meta, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);

    spyOn(title, 'setTitle');
    spyOn(meta, 'updateTag');
  });

  it('should update all SEO tags when all fields are provided', () => {
    service.updateTags({
      title: 'Test Page',
      description: 'Test Description',
      image: 'https://example.com/image.png',
      url: 'https://example.com',
    });

    expect(title.setTitle).toHaveBeenCalledWith('Test Page');

    expectMetaUpdated({ name: 'description', content: 'Test Description' });
    expectMetaUpdated({ property: 'og:description', content: 'Test Description' });
    expectMetaUpdated({ property: 'og:title', content: 'Test Page' });
    expectMetaUpdated({ property: 'og:type', content: 'website' });
    expectMetaUpdated({ property: 'og:image', content: 'https://example.com/image.png' });
    expectMetaUpdated({ property: 'og:url', content: 'https://example.com' });
  });

  it('should update only mandatory tags when optional fields are missing', () => {
    service.updateTags({
      title: 'Only Title',
    });

    expect(title.setTitle).toHaveBeenCalledWith('Only Title');

    expectMetaUpdated({ property: 'og:title', content: 'Only Title' });
    expectMetaUpdated({ property: 'og:type', content: 'website' });

    expectMetaNotUpdated({ name: 'description' });
    expectMetaNotUpdated({ property: 'og:description' });
    expectMetaNotUpdated({ property: 'og:image' });
    expectMetaNotUpdated({ property: 'og:url' });
  });
});
