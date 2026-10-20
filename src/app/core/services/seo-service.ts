import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

const SITE_URL = 'https://tarekgoda.dev'; // غيّره للدومين الفعلي
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  set({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false }: SeoConfig): void {
    const url = SITE_URL + path;
    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setCanonical(url);
  }

  setPersonJsonLd(): void {
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Tarek Goda',
      jobTitle: 'Front-End Developer',
      url: SITE_URL,
      email: 'mailto:tarrekgoda@gmail.com',
      address: { '@type': 'PostalAddress', addressRegion: 'Fayoum', addressCountry: 'EG' },
      knowsAbout: ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS'],
      sameAs: ['https://www.linkedin.com/in/tarekgoda22/'],
    });
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;
  }

  private setJsonLd(data: object): void {
    let script = this.doc.getElementById('json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'json-ld';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
