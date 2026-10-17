import { Injectable, computed, inject, signal } from '@angular/core';
import type { Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(SupabaseService).client.auth;
  private readonly session = signal<Session | null>(null);

  readonly isAdmin = computed(() => this.session() !== null);

  /** يكتمل بعد استرجاع الجلسة المحفوظة، والـ guard بيستناه */
  readonly initialized: Promise<void>;

  constructor() {
    this.initialized = this.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
    });
    this.auth.onAuthStateChange((_event, session) => this.session.set(session));
  }

  /** يرجّع null لو نجح، أو رسالة الخطأ */
  async signIn(email: string, password: string): Promise<string | null> {
    const { data, error } = await this.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    this.session.set(data.session);
    return null;
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.session.set(null);
  }
}
