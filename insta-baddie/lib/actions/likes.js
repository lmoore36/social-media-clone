"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Likes({ post, addOptimisticFilteredPost}) {
    const router = useRouter();
    
  const handleLikes = async () => {
    const supabase = createClientComponentClient();
    const {data: { user },} = await supabase.auth.getUser();

    if (user) {
      if (post.user_has_liked_post) {

        addOptimisticFilteredPost({
          post,
          likes: post.likes-1,
          user_has_liked_post: !post.user_has_liked_post,
        })

        // remove like from "likes" table
        await supabase
          .from("likes")
          .delete().
          match({ user_id: user.id, post_id: post.id });

          // decrease like_count in "posts" table
        await supabase
          .from('posts')
          .update({ like_count: post.like_count - 1 })
          .match({ id: post.id });
      } else {

        // add like to "likes" table
        await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: post.id });

        // increase like_count in "posts" table 
        await supabase
          .from('posts')
          .update({ like_count: post.like_count + 1 })
          .match({ id: post.id });
      }
      
      router.refresh();

      console.log(post.user_has_liked_post);
    }
  };

  return (
    <button onClick={handleLikes} className="group flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" 
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="white"
        />
      </svg>
      <span
        className={`ml-2 text-sm group-hover:text-red-600 ${
          post.user_has_liked_post ? "text-red-600" : "text-gray-500"
        }`}
      >
        {post.likes}
      </span>
    </button>
  );
}