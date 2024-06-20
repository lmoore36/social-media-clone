'use client';

import { useRef } from 'react';

export default function NewPostForm({ addPost }) {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(formRef.current);
    await addPost(formData);
    formRef.current.reset(); // Clear the form input after submission
  };

  return (
    <form
      ref={formRef}
      className="flex w-full p-8 border-b-4 border-gray-300"
      onSubmit={handleSubmit}
    >
      <span class="flex-shrink-0 w-12 h-12 rounded-full" style={{ backgroundColor: '#434961' }}></span>
      <div className="flex flex-col flex-grow ml-4">
        <input
          name="text"
          className="p-3 bg-transparent border border-white rounded-sm"
          placeholder="What&apos;s happening?"
        ></input>
        <div className="flex justify-between mt-2">
          <button
            type="button"
            className="flex items-center h-8 px-3 text-xs rounded-sm hover:bg-gray-200"
          >
            Attach
          </button>
          <button
            type="submit"
            className="flex items-center h-8 px-3 text-xs rounded-sm hover:bg-gray-400"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
