"use client";
import Likes from '@/lib/actions/likes';
import { useEffect, useState, useOptimistic } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Posts({ posts }) {

  const [filteredPosts, setFilteredPosts] = useState([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [optimisticFilteredPosts, addOptimisticFilteredPost] = useOptimistic(
    filteredPosts,
    (currentOptimisticPosts, newPost) => {
      const newOptimisticPosts = [...currentOptimisticPosts];
      const index = newOptimisticPosts.findIndex(post => post.id === newPost.id);
      newOptimisticPosts[index] = newPost;
      return newOptimisticPosts;
    }
  );

  useEffect(() => {
    const channel = supabase.channel("realtime posts").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => { router.refresh(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  useEffect(() => {
    const fetchFollowedPosts = async () => {
      try {
        // Fetch the current user's follow status
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get the list of users the current user is following
        const { data: followedUsers, error: followError } = await supabase
          .from('followers')
          .select('followee')
          .eq('follower', user.id);

        if (followError) {
          console.error('Error fetching followed users:', followError.message);
          return;
        }

        // Filter posts to include only those made by users the current user is following
        const filteredPosts = posts.filter(post =>
          followedUsers.some(followedUser => followedUser.followee === post.user_id))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).reverse();

        setFilteredPosts(filteredPosts.reverse());
      } catch (error) {
        console.error('Error fetching followed posts:', error.message);
      }
    };

    fetchFollowedPosts();
  }, [posts, supabase]);

  const colors = [
    { backgroundColor: '#b9d2b5' }, // debut
    { backgroundColor: '#f4cb8d' }, // fearless
    { backgroundColor: '#d1b2d2' }, // speak now
    { backgroundColor: '#823549' }, // red
    { backgroundColor: '#b5e9f6' }, // 1989
    { backgroundColor: '#847e80' }, // reputation
    { backgroundColor: '#f9b2d0' }, // lover
    { backgroundColor: '#cfcac6' }, // folklore
    { backgroundColor: '#c8ae95' }, // evermore
    { backgroundColor: '#434961' }, // midnights
    { backgroundColor: '#edebe7' }  // tortured poets

  ];

  return (
    optimisticFilteredPosts.map((post, index) => {
      // Pick a color based on the index
      const color = colors[index % colors.length];

      return (
        <div key={post.id}>
          <div className="flex w-full p-8 border-b border-gray-300">
          <span className="flex-shrink-0 w-12 h-12 rounded-full" style={color}></span>
            <div className="flex flex-col flex-grow ml-4">
              <div className="flex">
                <span className="font-semibold">{post?.profiles?.full_name}</span>
                <Link href={`/${post?.profiles?.username}`}>
                  <div className="ml-1">@{post?.profiles?.username}</div>
                </Link>
              </div>
              <p className="mt-1">{post.text}</p>
              <div className="flex mt-2">
                <Likes post={post} addOptimisticFilteredPost={addOptimisticFilteredPost} />
                <button className="ml-2 text-sm font-semibold">Reply</button>
                <button className="ml-2 text-sm font-semibold">Share</button>
              </div>
            </div>
          </div>
        </div>
      );
    })
  );
}