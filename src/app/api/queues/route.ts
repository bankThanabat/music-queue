import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { Tables } from '@/types/database.types';

export async function GET(): Promise<NextResponse<{ data: (Tables<'queue'> & { song: Tables<'songs'> })[] | null }>> {
  const { data: queues, error } = await supabase
    .from('queue')
    .select(`
      *,
      song:songs(*)
    `) as { data: (Tables<'queue'> & { song: Tables<'songs'> })[] | null, error: any };

  if (error) {
    console.error('Error fetching queues:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  return NextResponse.json({ data: queues });
}
