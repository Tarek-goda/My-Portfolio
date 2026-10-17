import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  input,
  viewChild,
} from '@angular/core';

let nextId = 0;

/** نص بيتكتب بخط SVG عن طريق stroke-dashoffset. تقدر تستخدمه أكتر من مرة في الصفحة */
@Component({
  selector: 'app-hero-draw-name',
  templateUrl: './hero-draw-name-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDrawNameComponent implements AfterViewInit, OnDestroy {
  readonly text = input.required<string>();
  readonly strokeWidth = input(2.4);
  readonly durationMs = input(5500);
  /** تأخير بداية أول رسمة (بالميلي ثانية) لعمل تتابع بين نصين */
  readonly delayMs = input(0);
  readonly fontSize = input(120);
  readonly viewBoxWidth = input(900);
  readonly viewBoxHeight = input(190);

  /** id مختلف لكل نسخة، عشان ما يتكررش في الصفحة */
  protected readonly gradientId = `draw-gradient-${nextId++}`;

  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly label = viewChild.required<ElementRef<SVGTextElement>>('label');
  private animation?: Animation;
  private destroyed = false;

  async ngAfterViewInit(): Promise<void> {
    // لازم الخط يتحمّل قبل القياس، وإلا الطول يطلع غلط (مع مهلة لو النت ضعيف)
    await Promise.race([
      document.fonts.load(`800 ${this.fontSize()}px "Bricolage Grotesque"`),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
    if (this.destroyed) return;

    const el = this.label().nativeElement;
    // 1.15 هامش أمان: مجموع مسارات الحروف أطول من عرض النص
    const length = Math.ceil(el.getComputedTextLength() * 1.15);
    this.svg().nativeElement.style.visibility = 'visible';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.strokeDasharray = `${length}`;
    this.animation = el.animate(
      [
        { strokeDashoffset: length, offset: 0 },
        { strokeDashoffset: 0, offset: 0.8 },
        { strokeDashoffset: 0, offset: 1 }, // وقفة قصيرة والنص كامل قبل ما يعيد
      ],
      {
        duration: this.durationMs(),
        delay: this.delayMs(),
        fill: 'backwards', // يخفي النص أثناء فترة التأخير بدل ما يظهر كامل
        iterations: Infinity,
        easing: 'ease-in-out',
      },
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animation?.cancel();
  }
}
