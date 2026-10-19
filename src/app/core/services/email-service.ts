import { Injectable } from '@angular/core';

/**
 * فتح الإيميل حسب الجهاز:
 * - كمبيوتر: Gmail على الويب في تاب جديد
 * - أندرويد: تطبيق Gmail لو موجود، وإلا Gmail على المتصفح
 * - آيفون: تطبيق Gmail لو موجود، وإلا Gmail على المتصفح
 */
@Injectable({ providedIn: 'root' })
export class EmailService {
  readonly address = 'tarrekgoda@gmail.com';

  /** رابط Gmail على الويب. يصلح كـ href وكخيار احتياطي */
  webUrl(subject = '', body = ''): string {
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: this.address });
    if (subject) params.set('su', subject);
    if (body) params.set('body', body);
    return `https://mail.google.com/mail/?${params}`;
  }

  open(subject = '', body = ''): void {
    const web = this.webUrl(subject, body);
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIos = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      window.location.href = this.androidIntent(subject, body, web);
    } else if (isIos) {
      this.openIos(subject, body, web);
    } else {
      window.open(web, '_blank', 'noopener');
    }
  }

  /** Intent بيفتح تطبيق Gmail، ولو مش متسطب Chrome بيروح للرابط الاحتياطي (الويب) */
  private androidIntent(subject: string, body: string, web: string): string {
    const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return (
      `intent:${this.address}?${query}` +
      `#Intent;scheme=mailto;package=com.google.android.gm;` +
      `S.browser_fallback_url=${encodeURIComponent(web)};end`
    );
  }

  /** iOS: نحاول تطبيق Gmail، ولو الصفحة لسه ظاهرة بعد ثانية ونص نفتح الويب */
  private openIos(subject: string, body: string, web: string): void {
    const gmailApp =
      `googlegmail:///co?to=${encodeURIComponent(this.address)}` +
      `&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    let leftPage = false;
    const onVisibility = () => {
      if (document.hidden) leftPage = true;
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.location.href = gmailApp;

    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (!leftPage) window.location.href = web;
    }, 1500);
  }
}