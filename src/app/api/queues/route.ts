import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { Tables } from '@/types/database.types';

export async function GET(): Promise<NextResponse<{ data: (Tables<'queue'> & { song: Tables<'songs'> })[] | null }>> {
  const { data: queues, error } = await supabase
    .from('queue')
    .select(`
      *,
      song:songs(*)
    `)
    .in('status', ['in-queue', 'playing'])
    .order('ordered_at', { ascending: true });


  if (error) {
    console.error('Error fetching queues:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  return NextResponse.json({ data: queues });
}
