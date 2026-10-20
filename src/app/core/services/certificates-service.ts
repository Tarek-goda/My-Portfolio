import { Injectable, inject, signal } from '@angular/core';
import { Certificate, CertificateInput } from '../models/certificate-model';
import { SupabaseService } from './supabase-service';

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private readonly supabase = inject(SupabaseService).client;
  private loaded = false;

  readonly certificates = signal<Certificate[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;
    this.loading.set(true);
    this.error.set(null);

    const { data, error } = await this.supabase
      .from('certificates')
      .select('*')
      .order('sort_order')
      .order('issued_on', { ascending: false });

    if (error) {
      this.error.set(error.message);
    } else {
      this.certificates.set(data as Certificate[]);
      this.loaded = true;
    }
    this.loading.set(false);
  }

  async create(input: CertificateInput, image?: File): Promise<void> {
    const image_url = image ? await this.uploadImage(image) : input.image_url;
    const { data, error } = await this.supabase
      .from('certificates')
      .insert({ ...input, image_url })
      .select()
      .single();
    if (error) throw error;
    this.certificates.update((list) => [...list, data as Certificate]);
  }

  async update(id: string, input: CertificateInput, image?: File): Promise<void> {
    const image_url = image ? await this.uploadImage(image) : input.image_url;
    const { data, error } = await this.supabase
      .from('certificates')
      .update({ ...input, image_url })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    this.certificates.update((list) => list.map((c) => (c.id === id ? (data as Certificate) : c)));
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
    this.certificates.update((list) => list.filter((c) => c.id !== id));
  }

  private async uploadImage(file: File): Promise<string> {
    const path = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await this.supabase.storage.from('certificates').upload(path, file);
    if (error) throw error;
    return this.supabase.storage.from('certificates').getPublicUrl(path).data.publicUrl;
  }
}
