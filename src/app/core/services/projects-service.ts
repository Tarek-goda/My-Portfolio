import { Injectable, inject, signal } from '@angular/core';
import { Project, ProjectInput } from '../models/project-model';
import { SupabaseService } from './supabase-service';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly supabase = inject(SupabaseService).client;
  private loaded = false;

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;
    this.loading.set(true);
    this.error.set(null);

    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false });

    if (error) {
      this.error.set(error.message);
    } else {
      this.projects.set(data as Project[]);
      this.loaded = true;
    }
    this.loading.set(false);
  }

  async create(input: ProjectInput, poster?: File): Promise<void> {
    const poster_url = poster ? await this.uploadPoster(poster) : input.poster_url;
    const { data, error } = await this.supabase
      .from('projects')
      .insert({ ...input, poster_url })
      .select()
      .single();
    if (error) throw error;
    this.projects.update((list) => [...list, data as Project]);
  }

  async update(id: string, input: ProjectInput, poster?: File): Promise<void> {
    const poster_url = poster ? await this.uploadPoster(poster) : input.poster_url;
    const { data, error } = await this.supabase
      .from('projects')
      .update({ ...input, poster_url })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    this.projects.update((list) => list.map((p) => (p.id === id ? (data as Project) : p)));
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    this.projects.update((list) => list.filter((p) => p.id !== id));
  }

  private async uploadPoster(file: File): Promise<string> {
    const path = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await this.supabase.storage.from('posters').upload(path, file);
    if (error) throw error;
    return this.supabase.storage.from('posters').getPublicUrl(path).data.publicUrl;
  }
}
