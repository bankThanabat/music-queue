import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { Tables } from '@/types/database.types';

export async function GET(): Promise<NextResponse<{ data: Tables<'songs'>[] | null }>> {
  const { data: songs, error } = await supabase
    .from('songs')
    .select('*') as { data: Tables<'songs'>[] | null, error: Error };

  if (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  return NextResponse.json({ data: songs });
}