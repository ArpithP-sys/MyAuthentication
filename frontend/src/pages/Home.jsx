import React from 'react'
import {Mail, UserCircle2Icon} from 'lucide-react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { AppContent } from '../context/AppContext';
import { useContext, useEffect } from 'react';
const Home = () => {
    const { getUserData } = useContext(AppContent);

  useEffect(() => {
    getUserData(); // Fetch user data when Home mounts
  }, []);
  return (
    <div className='flex flex-col items-center justify-centermin-h-screen'>
     <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#60A5FA,transparent)]"></div></div>
    <Navbar/>
    <Header/>
    </div>
  )
}

export default Home