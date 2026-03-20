'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

export async function uploadCasFile(formData: FormData) {
  const file = formData.get('file') as File | null
  
  if (!file) {
    return { error: 'No file provided.' }
  }

  if (file.type !== 'application/pdf') {
    return { error: 'Only PDF files are allowed.' }
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: 'File size must be less than 10MB.' }
  }

  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Unauthorized. Please log in.' }
  }

  // Deduplication identifier logic (purposely strips Date.now())
  const fileName = `${user.id}/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const { data: { publicUrl } } = supabase.storage
    .from('cas_uploads')
    .getPublicUrl(fileName)

  // Prevent Duplicate Processing
  try {
    const existing = await prisma.casUpload.findFirst({
      where: { user_id: user.id, file_url: publicUrl }
    })
    if (existing) {
      return { error: 'This specific statement has already been mapped into your portfolio successfully.', isDuplicate: true }
    }
  } catch (e) {
    console.error("Deduplication verification fault", e)
  }

  const { error: storageError } = await supabase.storage
    .from('cas_uploads')
    .upload(fileName, file, { 
      contentType: 'application/pdf',
      upsert: false
    })

  if (storageError) {
    if (storageError.message.toLowerCase().includes('duplicate') || storageError.message.includes('already exists')) {
       return { error: 'Document upload conflict. Either rename the file or check parsing history.' }
    }
    console.error('Upload Error:', storageError)
    return { error: 'Platform failed to securely stream binary to remote store.' }
  }

  try {
    await prisma.casUpload.create({
      data: {
        user_id: user.id,
        file_url: publicUrl,
      }
    })
  } catch (dbError) {
    console.error('Database Tracking Error:', dbError)
    return { error: 'Successfully stored physically but failed synchronization constraints.' }
  }

  // Returns precise REST credentials necessary for Next Client triggers to engage parsing routes smoothly
  return { success: true, fileUrl: publicUrl, userId: user.id }
}
