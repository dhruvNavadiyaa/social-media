import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'

let socket
export default function Messages() {

    const [post, setPost] = useState([])
    const [users, setUsers] = useState([])
    const [openedChatUser, setOpenedChatUser] = useState()
    const [onlineUsers, setOnlineUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [allMessages, setAllMessages] = useState([])
    const [msg, setMsg] = useState("")
    const followers = useSelector(state => state.userDetail.followers)
    const userId = useSelector(state => state.userDetail.id)

    const appendLeft = (data) => {
        const messageContainer = document.getElementById(`messageContainer`)
        const messageElement = document.createElement('div')
        messageElement.classList.add('my-1', 'inline', 'flex', 'items-center', 'float-start', 'clear-both')
        messageElement.innerHTML = `<p class="">.</p>&nbsp;&nbsp;<p class="px-4 py-2 rounded-lg bg-slate-300">${data?.message}</p>`
        messageContainer?.appendChild(messageElement)
    }
    const appendRight = (data) => {
        const messageContainer = document.getElementById(`messageContainer`)
        const messageElement = document.createElement('div')
        messageElement.classList.add('my-1', 'inline', 'flex', 'items-center', 'float-end', 'clear-both')
        messageElement.innerHTML = ` <p class="px-4 py-2 rounded-lg bg-slate-300">${data.message}</p>&nbsp;&nbsp<p class="text-xs">.</p>`
        messageContainer?.appendChild(messageElement)
    }
    // console.log(userId)

    const getAllPost = async () => {
        const response = await axios.get('http://localhost:3000/posts')
        setPost(response.data)
    }
    const getAllUsers = async () => {
        let response = await axios.get("http://localhost:3000/users")
        setUsers(response.data)
        // console.log(users)
    }
    const allmessages = async () => {
        const response = await axios.get('http://localhost:3000/message')
        setAllMessages(response.data)
    }

    const retrieveMessage = async (data) => {
        try {
            const messages = allMessages.filter((item) => {
                return (item.senderId === userId && item.recieverId === openedChatUser.id) ||
                    (item.senderId === openedChatUser.id && item.recieverId === userId)
            })
            messages.sort((a, b) => a.id - b.id);
            // for (let i = 0; i <= messages.length - 1; i++) {

            //     for (let j = i; j <= messages.length - 1; j++) {

            //         if (messages[i].id > messages[j].id) {
            //             let temp = messages[i]
            //             messages[i] = messages[j]
            //             messages[j] = temp
            //         }
            //     }
            // }
            // console.log('Sorted messages:', messages)
            setMessages(messages)
        } catch (error) {
            console.error('Error retrieving messages:', error);
        }
    }

    const SendMessage = async () => {
        try {
            let data = {
                id: Date.now(),
                senderId: userId,
                recieverId: openedChatUser.id,
                message: msg
            }
            const response = await axios.post('http://localhost:3000/message', data)
            // console.log(data, socket.id)
            appendRight(data)
            const recieverSocketId = onlineUsers.filter((item) => item.userId === data.recieverId)
            // console.log(recieverSocketId)
            if (recieverSocketId) {
                await socket.emit("message", { receiverId: data.recieverId, message: data.message, senderId: data.senderId, socketId: recieverSocketId[0].socketId })
            }
            setMsg("")
        } catch (error) {
            console.error('Error sending messages:', error);
        }
    }

    let socketId
    const connetion = () => {
        if (userId) {
            const newSocket = io('http://localhost:8000');
            // console.log(newSocket)
            newSocket.on("connect", () => {
                console.log(`user socketId :${newSocket.id}, userId :${userId}`)
                socketId = newSocket.id
                newSocket.emit("user-joined", { socketId: socketId, userId: userId })
            })
            newSocket?.on("current-users", (data) => {
                setOnlineUsers(data)
                // console.log("online user data",data)
            })
            socket = newSocket;
        }
    }

    socket?.on("new-user-joined", (data) => {
        setOnlineUsers(prevUsers => [...prevUsers, data])
        // console.log("New user joined", data)
        // console.log("online user:", onlineUsers)
    })
    // console.log("onlineUsers",onlineUsers)
    useEffect(() => {
        getAllPost()
        getAllUsers()
        allmessages()
        connetion()
        socket?.on("receive-msg", (data) => {
            // console.log(data)
            appendLeft(data)
        })
        return () => {
            if (socket) {
                // socket.emit("disconnect", userData)
                socket.disconnect();
            }
        }
    }, [])

    return (
        <div className='flex border'>

            <Sidebar />

            <div className='xl:ms-96 md:ms-20 w-full md:flex border-e'>


                <div className={`md:w-1/3 md:block ${!openedChatUser ? 'w-full' : 'hidden'} h-screen px-3 border-e`}>
                    <p className='my-10 font-mediumm text-3xl'>Messages</p>
                    {
                        users.map((item, index) => {
                            // console.log(item)
                            if (followers?.includes(item.id)) {
                                return (
                                    <div className='flex items-center bg-slate-100 hover:bg-slate-200 py-2 px-2 my-2 rounded-lg' key={index} onClick={() => { retrieveMessage(item); setOpenedChatUser(item); }}>
                                        <img src={item.profileImg || `https://www.svgrepo.com/show/527946/user-circle.svg`} alt=""
                                            className='w-12 h-12 rounded-full object-cover'
                                        />
                                        <div className='ms-2'>
                                            <p className='mb-0 text-sm font-bold'>{item.userName}</p>
                                            <p className='text-sm'>{item.name}</p>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>


                {/* SEARCHED PERSONED CHAT SECTION */}
                {
                    openedChatUser &&
                    <>
                        <div className="md:w-2/3 w-full flex flex-col h-screen">

                            <div className='border-b px-7'>
                                <div className='flex items-center py-2 px-2 my-2' >
                                    <img src={openedChatUser?.profileImg || 'https://www.svgrepo.com/show/527946/user-circle.svg'} alt=""
                                        className='w-12 h-12 rounded-full object-cover'
                                    />
                                    <div className='ms-4'>
                                        <p className='mb-1 font-bold'>{openedChatUser?.name}</p>
                                        <p className='text-sm text-green-600'>Online...</p>
                                    </div>
                                    {/* <div className='ms-auto text-3xl me-5'>...</div> */}
                                    <img src="https://www.svgrepo.com/show/370957/back-light.svg" alt="" className='h-10 p-2 ms-auto rounded-lg bg-slate-200 border' onClick={() => { setOpenedChatUser('') }} />
                                </div>
                            </div>

                            <div className="p-4 grow rounded-xl overflow-y-scroll vertical-scroll" id="messageContainer">
                                {
                                    messages.map((item, index) => {
                                        // console.log(item.recieverId,userId)
                                        if (item.senderId === openedChatUser.id) {
                                            return (
                                                <div className="my-1  flex items-center float-start clear-both" id="leftMessage" key={index}>
                                                    <p className="text-xs">.</p>&nbsp;&nbsp;
                                                    <p className="px-4 py-2 rounded-lg bg-slate-300 ">{item.message}</p>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="my-1  flex items-center float-end clear-both" id="rightMessage" key={index}>
                                                    <p className="px-4 py-2 rounded-lg bg-slate-300">{item.message}</p>&nbsp;&nbsp;
                                                    <p className="text-xl">.</p>
                                                </div>
                                            )
                                        }
                                    })
                                }

                            </div>

                            <div className="p-4 md:mb-0 mb-14">
                                <form action="" id="form" className="flex" onSubmit={(e) => { e.preventDefault(); SendMessage() }}>
                                    <input type="text" placeholder="Please enter message here!"
                                        className="me-3 px-5 py-2 rounded-lg w-full bg-neutral-200 focus:outline-none"
                                        id="messageInput"
                                        onChange={(e) => { setMsg(e.target.value) }}
                                        value={msg}
                                    />
                                    <button className="px-5 py-2 rounded-lg bg-neutral-500 	text-neutral-300 hover:bg-neutral-600 shadow-2xl" type='submit'>Send</button>
                                </form>
                            </div>

                        </div>
                    </>
                }
            </div>

        </div >
    )
}
