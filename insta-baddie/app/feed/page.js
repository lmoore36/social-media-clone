import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewPost from '@/components/new-post-server';
import Posts from '@/lib/actions/posts'
import SearchBar from '@/components/search-bar';


export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase.from("posts").select("*, profiles(*), likes(*)");


  const posts =
    data?.map((post) => ({
      ...post,
      user_has_liked_post: !!post.likes.find(
        (like) => like.user_id === session.user.id),
      likes: post.likes.length,
    })) ?? [];

  return (
    <main>
      <div class="flex justify-center w-screen h-screen px-4 text-gray-700">
        <div class="flex w-full max-w-screen-lg">

        {/* SIDEBAR MENU */}
        <div class="flex flex-col w-50 py-4 pr-3">
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="/feed">Home</a>
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="#">Discover</a>
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="#">Notifications</a>            
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="#">Inbox</a>
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="#">Saved Posts</a>
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="/profile">Profile</a>
          <a class="px-3 py-2 mt-2 text-lg font-medium rounded-sm hover:bg-gray-300" href="/account">Settings</a>
        </div>

        {/* MIDDLE OF PAGE - NEW POST AND FEED */}
        <div class="flex flex-col flex-grow border-l border-r border-gray-300">
          <div class="flex justify-between flex-shrink-0 px-8 py-4 border-b border-gray-300">
            <h1 class="text-xl font-semibold"> Posts Feed </h1>           
          </div>
         
          <div>          
            <NewPost/>
          </div>

          {/* POSTS SECTION */}
          <div>
            <Posts posts={posts}/>
          </div>
        </div>

        {/* TRENDING SECTION */}
        <div class="flex flex-col flex-shrink-0 w-1/4 py-4 pl-4">
          <SearchBar />
          <div>              
            <h3 class="mt-6 font-semibold">Trending</h3>
              <div class="flex w-full py-4 border-b border-gray-300">
                <span class="flex-shrink-0 w-10 h-10 rounded-full" style={{ backgroundColor: '#C7A8CB' }}></span>
                <div class="flex flex-col flex-grow ml-2">
                  <div class="flex text-sm">
                    <span class="font-semibold">Lucy Moore</span>
                  </div>
                  <p class="mt-1 text-sm"> This is my instagram clone final project for CS-SG! </p>
                </div>
              </div>
              <div class="flex w-full py-4 border-b border-gray-300">
                <span class="flex-shrink-0 w-10 h-10 rounded-full" style={{ backgroundColor: '#7A2E39' }}></span>
                <div class="flex flex-col flex-grow ml-2">
                  <div class="flex text-sm">
                    <span class="font-semibold">Lucy Moore</span>
                  </div>
                  <p class="mt-1 text-sm"> I built this using JavaScript and CSS, powered by Next.js and React. I used Supabase for data storage. </p>
                </div>
              </div>
              <div class="flex w-full py-4 border-b border-gray-300">
                <span class="flex-shrink-0 w-10 h-10 rounded-full" style={{ backgroundColor: '#B5E5F8' }}></span>
                <div class="flex flex-col flex-grow ml-2">
                  <div class="flex text-sm">
                    <span class="font-semibold"> Lucy Moore </span>
                  </div>
                  <p class="mt-1 text-sm"> 
                          This project creates a secure platform where users can sign up, 
                            log in, and access their personalized feed. 
                          The feed displays posts from accounts they follow, 
                            with each post showing the author&apos;s name, text, and like count. 
                          Users can also view and edit their profile information, including their bio. 
                          Navigation between pages is easy with a built-in navigation bar. 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
};