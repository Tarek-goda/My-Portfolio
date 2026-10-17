import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/** نقطة الاتصال الوحيدة بـ Supabase. باقي الخدمات تحقنها ولا تنشئ client خاص بها. */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
  );
}
