import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoTags {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  updateTags({ title, description, image, url }: SeoTags): void {
    this.title.setTitle(title);

    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    if (image) this.meta.updateTag({ property: 'og:image', content: image });
    if (url) this.meta.updateTag({ property: 'og:url', content: url });
  }
}
