import React,{useState,useEffect} from "react";
import axios from 'axios';
import "./team.css";
import Navbar from "./components/HomePage/Navbar";

const FindTeammates = () => {
  const [teammates, setTeammates] = useState([]);
     const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = "http://localhost:8000";

    useEffect(() => {
    //     const fetchTeammates = async () => {
    //         try {
    //             const token = localStorage.getItem("accessToken");
    //             if (!token) {
    //                 setError("You must be logged in to view teammates.");
    //                 setLoading(false);
    //                 return;
    //             }
    //             // Fetch users from the new backend endpoint
    //             const res = await axios.get(`${backendUrl}/api/users/all`, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             setTeammates(res.data);
    //         } catch (err) {
    //             setError("Failed to fetch teammates.");
    //             console.error("Error fetching teammates:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchTeammates();
    // }, []); // Empty dependency array ensures this runs only once

    // if (loading) {
    //     return (
    //         <>
    //             <Navbar />
    //             <section className="teammates"><h2>Loading Teammates...</h2></section>
    //         </>
    //     );
    // }

    // if (error) {
    //     return (
    //         <>
    //             <Navbar />
    //             <section className="teammates"><h2>Error</h2><p>{error}</p></section>
    //         </>
    //     );
    // }
const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("You must be logged in.");
                    setLoading(false);
                    return;
                }
                // Fetch both teammates and the logged-in user's projects
                const [teammatesRes, myProjectsRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/users/all`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${backendUrl}/api/projects/me/created`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                setTeammates(teammatesRes.data.data || teammatesRes.data);
                setMyProjects(myProjectsRes.data.data || myProjectsRes.data);

            } catch (err) {
                setError("Failed to fetch data.");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // This function now handles the entire "Connect" logic
    const handleConnectClick = async (userToInvite) => {
        // First, check if the logged-in user has any projects
        if (myProjects.length === 0) {
            alert("You must create a project before you can invite teammates.");
            return;
        }

        // The projects are already sorted by date, so the first one is the most recent
        const mostRecentProject = myProjects[0];

        try {
            const token = localStorage.getItem("accessToken");
            // Call your existing 'sendProjectInvitation' endpoint
            // Assumes your route is POST /api/invitations/send/:projectId/:userId
            await axios.post(
                `${backendUrl}/api/invites/send/${mostRecentProject._id}/${userToInvite._id}`,
                {}, // Empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Invitation for project '${mostRecentProject.title}' sent to ${userToInvite.name}!`);
        } catch (err) {
            console.error("Failed to send invitation:", err);
            alert(`Error: ${err.response?.data?.message || 'Could not send invitation.'}`);
        }
    };

    if (loading) return <> <Navbar /> <section className="teammates"><h2>Loading...</h2></section> </>;
    if (error) return <> <Navbar /> <section className="teammates"><h2>Error</h2><p>{error}</p></section> </>

  return (
   <>
   <Navbar/>

      <section className="teammates">
        <h2>Find Teammates</h2>
        <p className="subtext">
          Discover talented students to collaborate with on your next project
        </p>
       

        <div className="cardsrr">
         {teammates.map(user => (
                        <div className="carduu" key={user._id}>
                            <div className="card-header">
                            
                <div className="author-avatar">
        {user.avatarUrl ? (
            // If an avatar image exists, display it
            <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="avatar-img" />
        ) : (
            // Otherwise, display the styled div with the first initial
            <div className="avatar-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
        )}
    </div>
                               
                                <div>
                <h3>
                  {user.name ? user.name : 'Ashi'} <span className="verified">✔</span>
                </h3>
                <p>{user.academicYear} • {user.major} • {user.university}</p>
                <p>Location N/A • Active recently</p>
              </div>
            </div>

            <p className="desc">
              {user.bio || "This user hasn't added a bio yet."}
            </p>

            <div className="tags">
              <strong>Skills:</strong>
              {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, index) => (
                                        <span key={index}>{skill}</span>
                                    ))
                                ) : (
                                    <span>No skills listed.</span>
                                )}
            </div>

            <div className="tags">
              <strong>Interests:</strong>
              <span>Web Development</span>
              <span>AI/ML</span>
              <span>Hackathons</span>
            </div>

            <div className="footer">
              • {user.projectCount} projects 
              <div className="actions">
                <button>Chat</button>
                <button className="primary" onClick={() => handleConnectClick(user)}>Connect</button>
                                </div>
            </div>
          </div>
         ))}
        </div>
      </section>
    </>
  );
};

export default FindTeammates;
