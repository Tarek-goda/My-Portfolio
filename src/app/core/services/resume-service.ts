import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';

const CV_PATH = 'Tarek_Goda_CV.pdf';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private readonly supabase = inject(SupabaseService).client;
  private loaded = false;

  readonly url = signal<string | null>(null);

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;
    const { data } = await this.supabase.from('resume').select('file_url').eq('id', 1).single();
    this.url.set(data?.file_url ?? null);
    this.loaded = true;
  }

  async upload(file: File): Promise<void> {
    const { error } = await this.supabase.storage
      .from('resume')
      .upload(CV_PATH, file, { upsert: true, contentType: 'application/pdf' });
    if (error) throw error;

    // ?v= يكسر كاش المتصفح بعد استبدال الملف
    const publicUrl = this.supabase.storage.from('resume').getPublicUrl(CV_PATH).data.publicUrl;
    const file_url = `${publicUrl}?v=${Date.now()}`;

    const { error: dbError } = await this.supabase
      .from('resume')
      .update({ file_url, updated_at: new Date().toISOString() })
      .eq('id', 1);
    if (dbError) throw dbError;
    this.url.set(file_url);
  }

  async remove(): Promise<void> {
    await this.supabase.storage.from('resume').remove([CV_PATH]);
    const { error } = await this.supabase.from('resume').update({ file_url: null }).eq('id', 1);
    if (error) throw error;
    this.url.set(null);
  }
}
