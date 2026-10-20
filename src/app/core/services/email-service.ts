import { Injectable, signal } from '@angular/core';

export interface EmailDraft {
  subject: string;
  body: string;
}

/**
 * فتح الإيميل حسب الجهاز:
 * - كمبيوتر: Gmail على الويب في تاب جديد
 * - أندرويد: تطبيق Gmail لو موجود، وإلا Gmail على المتصفح
 * - آيفون: نافذة اختيار (Gmail / Mail / المتصفح / نسخ العنوان)، لأن iOS مبيسمحش
 *   نعرف لو التطبيق متسطب، وGmail على الويب مبيدعمش فتح رسالة جديدة بشكل موثوق
 */
@Injectable({ providedIn: 'root' })
export class EmailService {
  readonly address = 'tarrekgoda@gmail.com';

  /** المسودة المعروضة في نافذة الاختيار (آيفون فقط). null = النافذة مقفولة */
  readonly chooser = signal<EmailDraft | null>(null);

  /** رابط Gmail على الويب. يصلح كـ href وكخيار احتياطي */
  webUrl(subject = '', body = ''): string {
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: this.address });
    if (subject) params.set('su', subject);
    if (body) params.set('body', body);
    return `https://mail.google.com/mail/?${params}`;
  }

  open(subject = '', body = ''): void {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIos =
      /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      window.location.href = this.androidIntent(subject, body);
    } else if (isIos) {
      this.chooser.set({ subject, body });
    } else {
      window.open(this.webUrl(subject, body), '_blank', 'noopener');
    }
  }

  closeChooser(): void {
    this.chooser.set(null);
  }

  openGmailApp(draft: EmailDraft): void {
    this.closeChooser();
    window.location.href =
      `googlegmail:///co?to=${encodeURIComponent(this.address)}` +
      `&subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  }

  openMailApp(draft: EmailDraft): void {
    this.closeChooser();
    window.location.href =
      `mailto:${this.address}` +
      `?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  }

  openGmailWeb(draft: EmailDraft): void {
    this.closeChooser();
    window.open(this.webUrl(draft.subject, draft.body), '_blank', 'noopener');
  }

  async copyAddress(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(this.address);
      return true;
    } catch {
      return false;
    }
  }

  /** Intent بيفتح تطبيق Gmail، ولو مش متسطب Chrome بيروح للرابط الاحتياطي (الويب) */
  private androidIntent(subject: string, body: string): string {
    const web = this.webUrl(subject, body);
    const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return (
      `intent:${this.address}?${query}` +
      `#Intent;scheme=mailto;package=com.google.android.gm;` +
      `S.browser_fallback_url=${encodeURIComponent(web)};end`
    );
  }
}