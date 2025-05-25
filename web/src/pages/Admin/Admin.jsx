import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Avatar } from "flowbite-react";
import userImage from '../../assets/icons/userImage.avif';
import api from '../../utils/api';

function Admin(props) {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [active, setActive] = useState(false);
    const token = localStorage.getItem("accessToken");

            useEffect(() => {
                const getUsers = async () => {
                    try{

                    const response = await api.get("https://backendhost-production-1804.up.railway.app/admin", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    // Assuming the response data is an array of users
                    console.log(response.data);
                    setUsers(response.data.users);
                    }
                    catch(err){
                        console.log(err);
                    }
                };

                getUsers();
            }, []);
            const handleAccept = async (id) => {
                
                try {
                    const response = await api.patch(`https://backendhost-production-1804.up.railway.app/admin/${id}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    console.log(response.data);
                    setUsers(users.map(user => user.id === id ? { ...user, status: "accepted", isPaperVerified: true } : user));
                } catch (error) {
                    console.error("Error accepting user:", error);
                }

            }
            const handleRefuse = async(id) => {
                try{
                    const response = await api.delete(`https://backendhost-production-1804.up.railway.app/admin/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    console.log(response.data);
                    setUsers(users.filter(user => user.id !== id));
                }catch(err){
                    console.log(err);
                }
                
            }

            const showPaper = (id) => {
                setActive(true);
                setUser(users.find(user => user.id === id));
                console.log(user);
            }
    return (
        <div className='container mx-auto p-4'>
            <h1 className='font-bold text-2xl mb-3'>Admin Dashboard</h1>

            <Table hoverable={true} >
                <Table.Head>
                    <Table.HeadCell>Profile</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>PhoneNumber</Table.HeadCell>
                    <Table.HeadCell>Type</Table.HeadCell>
                    <Table.HeadCell>Date Registered</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {users.map((user) => (
                        <Table.Row key={user.id} onClick={()=> showPaper(user.id)}>
                            <Table.Cell>
                                <div className='w-10 h-10 rounded-full overflow-hidden'>
                                    <img src={user.profileImage || userImage} alt="" className='w-full h-full object-cover' />
                                </div>
                            </Table.Cell>
                            <Table.Cell>{`${user.firstname} ${user.lastname}`}</Table.Cell>
                            <Table.Cell>{user.phoneNumber}</Table.Cell>
                            <Table.Cell>{user.userType}</Table.Cell>
                            <Table.Cell>{new Date(user.createdAt).toDateString()}</Table.Cell>
                            <Table.Cell>

                                <div className={`py-1 px-4 w-fit rounded-md ${user.isPaperVerified === true ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                                    {user.isPaperVerified === true ? "Accepted" : "Pending"}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex gap-2">
                                    <Button
                                        color="success"
                                        size="xs"
                                        disabled={user.isPaperVerified === true}
                                        onClick={(e) => {e.stopPropagation(); handleAccept(user.id)}}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        color="failure"
                                        size="xs"
                                        disabled={user.isPaperVerified === true}
                                        onClick={(e) => {e.stopPropagation(); handleRefuse(user.id)}}
                                    >
                                        Refuse
                                    </Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            {active && (
                <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white w-[90%] h-[90%] shadow-lg p-5'> 
                        <div className='w-full h-[90%]  mb-4 flex justify-center items-center'>
                            <img src={user.paper} className='w-full h-full object-fit' alt="" />
                        </div>
                        
                        <Button className='mx-auto block mb-4 ' color="failure" onClick={() => setActive(false)}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;