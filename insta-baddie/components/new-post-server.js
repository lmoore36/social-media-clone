import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NewPostForm from './post-form'; // Import the client component

export default function NewPost() {
  const addPost = async (formData) => {
    'use server';
    console.log('submitted');

    const text = String(formData.get('text'));
    const supabase = createServerActionClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('posts').insert({ text, user_id: user.id });
    }
  };

  return <NewPostForm addPost={addPost} />; 
}
