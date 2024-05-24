import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../css/Sidebar.css'
import '../css/Utility.css'

export default function Sidebar() {

    const [filterUsers, setFIlterUsers] = useState([])
    const [users, setUsers] = useState([])

    const getusers = async () => {
        let response = await axios.get("http://localhost:3000/users")
        setUsers(response.data)
        console.log(users)
    }

    const slideLeft = () => {
        const elements = document.querySelectorAll(".sidebar_items");
        // console.log(elements)    
        elements.forEach(element => {
            element.classList.toggle("slide-left");
            element.classList.toggle("slide-right");
        });
    }
    const hidesearch = () => {
        const element = document.querySelector("#searched")
        // console.log(element)
        element.classList.toggle("width-0")
        element.classList.toggle("width-100")
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const value = e.target.value;
        if (value !== '') {
            setFIlterUsers(users.filter(item => {
                return item?.userName.toLowerCase().includes(value.toLowerCase())
            }))
        }
    }

    useEffect(() => {
        getusers()
    }, [])

    return (
        <>
            <div className='sidebar md:h-screen  h-16 xl:w-96 md:w-24 w-screen md:fixed fixed border-t '>

                {/* <div className='h-screen'> */}

                <div className='md:h-full md:flex  flex rounded-lg overflow-hidden '>

                    {/* ALL COMPONENTS ICONS */}
                    <div className='md:h-screen h-16 md:w-20 w-full flex md:flex-col justify-evenly shadow-xl bg-white'>
                        
                        <div className='h-28 md:flex hidden items-center justify-center'>
                            <i className="bi bi-instagram text-2xl font-bold rounded-lg p-2 px-3"></i>
                        </div>
                        <div className='my-1 h-12 flex items-center justify-center bg-white'>
                            <Link to='/'><i className="bi bi-house-door-fill text-2xl rounded-lg p-2 px-3 hover:bg-slate-200"></i></Link>
                        </div>
                        <div className='my-1 h-12  flex items-center justify-center bg-white z-10' onClick={() => { slideLeft(), hidesearch() }}>
                            <i className="bi bi-search text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200"></i>
                        </div>
                        <div className='my-1 h-12  flex items-center justify-center bg-white'>
                            <Link to='/Explore'><i className="bi bi-compass text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200"></i></Link>
                        </div>
                        <div className='my-1 h-12  flex items-center justify-center bg-white'>
                            <Link to='/Messages'><i className="bi bi-chat-dots text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200"></i></Link>
                        </div>
                        <div className='my-1 h-12  flex items-center justify-center bg-white'>
                            <Link to='/CreatePost'><i className="bi bi-plus-circle text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200"></i></Link>
                        </div>
                        <div className='my-1 h-12  flex items-center justify-center bg-white'>
                            <Link to='/Profile'><i className="bi bi-person-circle text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200 bg-white"></i></Link>
                        </div>
                        <div className='mt-auto my-1 h-12 md:flex hidden items-center justify-center bg-white '>
                            <i className="bi bi-threads text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200 bg-white"></i>
                        </div>
                        <div className='my-1 h-12 md:flex hidden items-center justify-center bg-white'>
                            <i className="bi bi-list text-2xl font-bold rounded-lg p-2 px-3 hover:bg-slate-200 bg-white"></i>
                        </div>
                    </div>

                    <div className='overflow-hidden xl:w-full w-0 '>
                        {/* ALL COMPONENTS NAME */}
                        <div className='w-11/12 h-full flex flex-col sidebar_items slide-right shadow-xl' id=''>
                            <div className="ps-3 h-28 flex items-center">
                                <h1 className='font-serif text-2xl font-bold'><i>Instagram</i></h1>
                            </div>
                            <Link to='/'>
                                <p className='ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg' >Home</p>
                            </Link>
                            <p className='ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg' onClick={() => { slideLeft(), hidesearch() }}>Search</p>
                            <Link to='/Explore'>
                                <p className='ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg'>Explore</p>
                            </Link>
                            <Link to='/Messages'>
                                <p className='ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg'>Messages</p>
                            </Link>
                            <Link to='/CreatePost'>
                                <p className='ps-3 my-1 h-12 flex text-lg items-center w-full hover:bg-slate-100 rounded-lg'>Create</p>
                            </Link>
                            <Link to='/Profile'>
                                <p className='ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg'>Profile</p>
                            </Link>
                            <p className='mt-auto ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg'>Threads</p>
                            <p className='ps-3 my-1 h-12 text-lg flex items-center w-full hover:bg-slate-100 rounded-lg'>More</p>
                        </div>

                        {/* SEARCH SECTION */}
                        <div className='h-full bg-white absolute top-0 overflow-hidden width-0 shadow-xl' id='searched'>
                            <div className='shadow-md p-5'>
                                <p className='text-2xl font-semibold'>Search</p>
                                <input type="text" className='mt-6 py-2 px-2 w-full text-md rounded-md bg-zinc-200 focus:outline-none'
                                    placeholder='Search Here!'
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>
                            <div className='px-5 py-2 h-full overflow-hidden verticle-scroll'>
                                {
                                    filterUsers.map((item, index) => {
                                        return (
                                            <div className='py-1 my-1 flex items-center hover:bg-slate-100 rounded-lg' key={item.id}>
                                                <img src={item.profileImg || `https://www.svgrepo.com/show/527946/user-circle.svg`} alt=""
                                                    className='w-11 h-11 rounded-full object-cover' />
                                                <div className='ms-2'>
                                                    <p className='mb-0 text-xs font-bold'>{item.userName}</p>
                                                    <p className='text-xs'>{item.name}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    </div>
                </div>
                {/* </div> */}
            </div>
        </>
    )
}
