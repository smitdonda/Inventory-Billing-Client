import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyProfile() {
  const [myprofile, setMyProfile] = useState({});

  useEffect(() => {
    const profileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/my-profile`
        );
        if (response && response.data && response.data.profile.length > 0) {
          setMyProfile(response.data.profile[0]);
        } else {
          setMyProfile({});
        }
      } catch (error) {
        console.error("Error profile data:", error);
      }
    };

    profileData();
  }, []);
  return (
    <>
      <div className="content">
        <div>
          <div>
            <h2 className="text-center text-uppercase">
              {myprofile?.companyname}
            </h2>
          </div>
          <div className="text-center">
            <p className="text-uppercase">{myprofile?.address}</p>
            <p className="text-uppercase">
              City/Town&nbsp;:&nbsp;{myprofile?.city}
            </p>
            <p>
              Country&nbsp;:&nbsp;
              <span className="text-uppercase">{myprofile?.country}</span>
            </p>
            <p>State&nbsp;:&nbsp;{myprofile?.state}</p>
            <p>Zip&nbsp;:&nbsp;{myprofile?.pinno}</p>
            <p>Phone&nbsp;:&nbsp;{myprofile?.phone}</p>
            <p>Email&nbsp;:&nbsp;{myprofile?.cemail}</p>
          </div>
          <div className="text-center">
            <Link to={`/profileForm/${myprofile?._id}`}>
              <button className="btn btn-warning ml-auto" onClick={() => {}}>
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
