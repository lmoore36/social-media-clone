'use client';

import Nav from '../nav';
import '../globals.css';
import './profile.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import FollowButton from '@/lib/actions/following';

export default function ProfilePage() {
  const { username } = useParams();
  const [fullname, setFullname] = useState('');
  const [bio, setBio] = useState('');
  const [profileId, setProfileId] = useState('');
  const [profilePosts, setProfilePosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('full_name, bio, id')
        .eq('username', username)
        .single();

      if (userError) {
        console.error('Error loading user data:', userError.message);
      } else if (user) {
        setFullname(user.full_name);
        setBio(user.bio);
        setProfileId(user.id);
      }

      const { data: profilePostsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id);

      if (postsError) {
        console.error('Error fetching user posts:', postsError.message);
      } else {
        setProfilePosts( profilePostsData.reverse() || []);        
      }

    };

    if (username) {
      fetchUserData();
    }

  }, [username]);

  

  return (
    <main>
      <Nav />
      <div className="container">
        <div className="profile-section">
          <div className="profile-header">
            <img src="https://picsum.photos/200/300" alt="Random Image" className="profile-picture" />
            <h1 className="profile-name">{fullname}</h1>
            <p className="profile-username">@{username}</p>
            <p className="profile-bio">{bio}</p>
            {profileId && <FollowButton profileId={profileId} />}
          </div>

          <div className="profile-timeline">
            {profilePosts.map((post, index) => (
          <div key={index} className="post">
            <div className="flex w-full p-8 border-b border-gray-300">
              <span className="flex-shrink-0 w-12 h-12 bg-gray-400 rounded-full"></span>
              <div className="flex flex-col flex-grow ml-4">
                <div className="flex">
                  <span className="font-semibold" style={{ color: 'black' }}>{fullname}</span>
                  <div className="ml-1" style={{ color: 'black' }}>@{username}</div>
                </div>
                  <p className="mt-1" style={{ color: 'black' }}> {post.text} </p>
              </div>                
            </div>
          </div> ))}
          </div>
        </div>
      </div>
    </main>
  );
}
