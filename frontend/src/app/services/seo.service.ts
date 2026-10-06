import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const ORIGIN = 'https://zeilanparadise.com';
const DEFAULT_IMAGE = `${ORIGIN}/img/og-zeilan-paradise.jpg`;
const DEFAULT_DESCRIPTION =
  'Private, tailor-made journeys across Sri Lanka, planned with you from the UK and guided by our own team on the island.';

export interface SeoData {
  title?: string;
  description?: string;
  image?: string;
}

/**
 * Keeps <title>, meta description, social preview tags and the canonical link in step with the page.
 * Static pages declare `data: { description }` on their route; dynamic pages set
 * `data: { dynamicSeo: true }` and call `set()` once their content has loaded.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private doc = inject(DOCUMENT);

  init(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let r = this.route.snapshot;
      while (r.firstChild) r = r.firstChild;
      // Pages with their own data (tours, articles) call set() themselves once loaded.
      if (!r.data['dynamicSeo']) this.set({ description: r.data['description'] });
    });
  }

  set(data: SeoData): void {
    if (data.title) this.title.setTitle(data.title);
    const title = this.title.getTitle();
    const description = data.description || DEFAULT_DESCRIPTION;
    const url = ORIGIN + this.router.url.split(/[?#]/)[0];
    const image = data.image ? new URL(data.image, ORIGIN + '/').href : DEFAULT_IMAGE;

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    let canonical = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.rel = 'canonical';
      this.doc.head.appendChild(canonical);
    }
    canonical.href = url;
  }
}
