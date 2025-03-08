
import{useNavigate} from "react-router-dom" ;

const Dashboard = ()=>{
    const navigate = useNavigate();

    return(
        <div className='min-h-screen bg-blue-50 flex items-center justify-center'>
            <div className=' grid grid-cols-1 md:grid-cols-2 gap-10'>

                {/*Create Ticket card */}
                <div className='bg-white shadow-lg rounded-2xl p-6 text-center'>
                    <h2 className='text-xl font-bold-mb-4'>
                        CREATE<span className='text-red-500'>TICKET</span>
                    </h2>
                    <img
                       src= "https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
                       alt ="Create Ticket"
                       className='mx-auto w-24 h-24 mb-4'
                    />
                    <p className='text-gray-600 mb-6'>
                        Raise your Questions, Problems, Featuresas a ticket to any department.
                    </p>
                    <button onClick={()=>navigate("/createTicket")}
                        className='bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition'> 
                        Create
                        </button>
                </div>
                {/*Display Ticket card */}
                <div className='bg-white shadow-lg rounded-2xl p-6 text-center'>
                    <h2 className='text-xl font-bold mb-4'>
                        DISPLAY <span className='text-red-500'>TICKET</span>
                    </h2>
                    <img
                      src = "https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
                      alt = "Display Ticket"
                      className='mx-auto w-24 h-24 mb-4'
                    />
                    <p className='text-gray-600 mb-6'>
                        Follow up on your tickets and check the status.
                    </p>
                    <button
                      onClick={()=>navigate("/displayUserTickets")}
                      className='bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition'>
                        Display
                      </button>
                </div>
                
            </div>
        </div>

    )
}

export default Dashboard;