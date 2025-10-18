import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// Update gallery image (toggle featured status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { is_featured } = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('gallery_images')
      .update({ is_featured })
      .eq('id', params.id);

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    // Get image URL first to delete from storage
    const { data: image, error: fetchError } = await supabase
      .from('gallery_images')
      .select('url')
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      // If the image is not found in the DB, it might be an orphan, proceed to delete anyway
      if (fetchError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: fetchError.message },
          { status: 500 }
        );
      }
    }

    // Delete from storage if it's a Supabase Storage URL
    if (image && image.url.includes('supabase.co/storage')) {
      const pathMatch = image.url.match(/\/gallery-images\/(.+)$/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        await supabase.storage.from('gallery-images').remove([filePath]);
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
