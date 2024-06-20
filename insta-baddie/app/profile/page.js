'use client';

import Nav from '../nav';
import '../globals.css';
import './profile.css';
import { useEffect, useState } from 'react';
import { createClientComponentClient, } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
  
        if (authError) {
          console.error('Error fetching user:', authError.message);
          return;
        }
  
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, username, bio')
            .eq('id', user.id)
            .single();
  
          if (error) {
            console.error('Error loading user data:', error.message);
          } else if (data) {
            setFullname(data.full_name);
            setUsername(data.username);
            setBio(data.bio);
          }
  
          const { data: userPostsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id);

          if (postsError) {
          console.error('Error fetching user posts:', postsError.message);
        } else {
          setUserPosts(userPostsData.reverse() || []);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };
  
    fetchUserData();
  }, []);
  

  return (
    <main>
      <Nav/> 
      <div className="container">          
      <div className="profile-section">
        <div className="profile-header">
          <img src="https://picsum.photos/200/300" alt="Random Image" className="profile-picture" />
          <h1 className="profile-name">{fullname}</h1>
          <p className="profile-username">@{username}</p>
          <p className="profile-bio">{bio}</p>
        </div>

        <div className="profile-timeline">
          {userPosts.map((post, index) => (
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