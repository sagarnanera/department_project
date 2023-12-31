import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IEvent } from '../interfaces/interfaces';

import { Link } from 'react-router-dom'
import adminService from '../services/adminService';
import eventService from '../services/eventService';
import toast from 'react-hot-toast';

export default function Events() {

    const [searchInput, setSearchInput] = useState("");
    const [events, setEvents] = useState<IEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(events);
        setSearchInput("");
        setFilteredEvents(events);
    }, [events]);

    useEffect(() => {
    }, []);


    useEffect(() => {

        const eventPromise = eventService.getEvents() as Promise<{ events: IEvent[], message: string }>;
        eventPromise.then((res) => {
            console.log("users : ", res.events);
            setEvents(res.events);

        }).catch((error) => {
            console.log("error : ", error);
        })

    }, []);

    function setFilterList(input: String) {
        const tmp = events.filter((event) => {
            return event;
        })
        setFilteredEvents(tmp);
    }

    function formatDateToDdMmYyyy(inputDateString: string) {
        const date = new Date(inputDateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const handelEventDelete = (_id: String) => {
        const eventPromise = eventService.deleteEvent(_id) as Promise<{  message: string }>;
        eventPromise.then((res) => {
            console.log("users : ", res);
            const tmp = events.filter((event) => {
                if (event._id != _id) {
                    return event;                   
                }
            })
            setFilteredEvents(tmp);

        }).catch((error) => {
            console.log("error : ", error);
        })

        toast.promise(
            eventPromise,
            {
                loading: 'please wait while we deleting event',
                success: (data) => data.message,
                error: (err) => err,
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 3000,
                    icon: '🔥',
                },
                error: {
                    duration: 4000,
                    icon: '🔥',
                },
            }
        );
    }

   

    return (
        <div>
            <nav className="bg-gray-300 border-gray-200 dark:bg-gray-900">
                <div className="flex  flex-wrap items-center justify-between mx-auto px-3 py-1">
                    <div className="flex items-center justify-between  w-full md:flex md:w-auto md:order-0" id="navbar-language">
                        <div className='mx-3'>
                            <Link to={"/addEvent"} className="block py-2 pl-3 pr-4 bg-gray-300 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Add</Link>
                        </div>
                      
                        <div className='mx-3'>
                            <div className=" z-0 w-full  group">
                                <select name='designation' id="designation" className="bg-gray-50 h-8 py-0  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="hod">hod</option>
                                    <option value="associate professor">associate professor</option>
                                    <option value="assistant professor">assistant professor</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex md:order-2">
                        <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1" >
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                        <div className="relative hidden md:block">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                                <span className="sr-only">Search icon</span>
                            </div>
                            <input type="text" id="search-navbar" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
                        </div>
                    </div>

                </div>
            </nav>

            <div className='flex flex-col pt-4 '>
                <h1 className='mx-auto  text-2xl font-medium text-gray-900 dark:text-white' >Pending Account details</h1>
                <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase  dark:text-gray-400">
                            <tr className='mb-2 border-b border-gray-200 dark:border-gray-600'>
                                <th scope="col" className="px-6 py-3 bg-gray-100 dark:bg-gray-800">
                                    Event Title
                                </th>
                                <th scope="col" className="px-6 py-3 dark:text-white dark:bg-gray-700">
                                    organizedUnder
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-100 dark:bg-gray-800">
                                    Start date
                                </th>
                                <th scope="col" className="px-6 py-3 dark:text-white dark:bg-gray-700">
                                    Organized under bvm
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-100 dark:bg-gray-800">
                                    totalExpenses
                                </th>
                                <th scope="col" className="px-6 py-3 dark:text-white dark:bg-gray-700">
                                    <span className="sr-only">Edit</span>
                                </th>
                                <th scope="col" className="px-6 py-3 dark:text-white  dark:bg-gray-700">
                                    <span className="sr-only">Delete</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {filteredEvents.map((event) => {
                                return (
                                    <tr key={event._id.toString()} className="border-b border-gray-200 dark:border-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                            {event.title}
                                        </th>
                                        <td className="px-6 py-4 dark:text-white dark:bg-gray-700">
                                            {event.organizedUnder}
                                        </td>
                                        <td className="px-6 py-4 bg-gray-100 dark:bg-gray-800">
                                            {formatDateToDdMmYyyy(event.eventDate.startDate.toString())}
                                        </td>
                                        <td className="px-6 py-4 dark:text-white dark:bg-gray-700">
                                            {event.isOrganizedByBVM ? "Yse" : "No"}
                                        </td>
                                        <td className="px-6 py-4 bg-gray-100 dark:bg-gray-800">
                                            {event.totalExpenses}
                                        </td>
                                        <td className="px-6 py-4 text-right dark:text-white dark:bg-gray-700">
                                            <div onClick={() => { navigate("/editEvent/" + event._id); }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</div>
                                        </td>
                                        <td className="px-6 py-4 text-right dark:text-white dark:bg-gray-700">
                                            <div onClick={() => { handelEventDelete(event._id) }} className="font-medium text-Red-600 dark:text-red-500 hover:underline">Delete</div>
                                        </td>
                                    </tr>)
                            })
                            }

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}
