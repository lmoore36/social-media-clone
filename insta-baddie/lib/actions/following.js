'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function FollowButton({ profileId }) {
  const router = useRouter();
  const [user_is_following, setIsFollowing] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Check if there's a record in the followers table where follower is the current user and followee is the profileId
          const { data: existingFollows } = await supabase
            .from('followers')
            .select('*')
            .eq('follower', user.id)
            .eq('followee', profileId)
            .single();

          // Set user_is_following to true if the record exists, otherwise set it to false
          setIsFollowing(existingFollows != null);

          // Ensure the user is following themselves
          const { data: selfFollow } = await supabase
            .from('followers')
            .select('*')
            .eq('follower', user.id)
            .eq('followee', user.id)
            .single();

          if (!selfFollow) {
            // If the user is not following themselves, make them follow themselves
            await supabase.from('followers').insert({ follower: user.id, followee: user.id });
          }
        }
      } catch (error) {
        console.error('Error fetching follow status:', error.message);
      }
    };

    // Call fetchFollowStatus when the component mounts
    fetchFollowStatus();

    // Subscribe to changes in the 'followers' table
    const subscription = supabase
      .channel('public:followers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'followers' }, (payload) => {
        // Check if the change involves the current user and profile
        if (
          payload.new &&
          (payload.new.follower === user?.id || payload.new.followee === profileId)
        ) {
          fetchFollowStatus(); // Refetch follow status
        }
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profileId, supabase]); // Added profileId and supabase to the dependency array

  const handleFollow = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      if (user) {
        if (user_is_following) {
          // Optimistically update UI
          setIsFollowing(false);
          await supabase.from('followers').delete().match({ follower: user.id, followee: profileId });
        } else {
          // Optimistically update UI
          setIsFollowing(true);
          await supabase.from('followers').insert({ follower: user.id, followee: profileId });
        }
        router.refresh();
      }
    } catch (error) {
      console.error('Error handling follow:', error.message);
    }
  };

  return (
    <button onClick={handleFollow}>
      {user_is_following ? 'Unfollow' : 'Follow'}
    </button>
  );
}