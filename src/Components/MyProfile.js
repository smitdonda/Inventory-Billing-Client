import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import SiderBar from "./SiderBar";

function MyProfile() {
  let [myprofile, setMyProfile] = useState();
  let ProfileData = async () => {
    let mypro = await axios.get(
      "https://bill-book-server.herokuapp.com/users/getmyprofile"
    );
    if (mypro) {
      setMyProfile(mypro.data.profile[0]);
    }
  };
  useEffect(() => {
    ProfileData();
  }, []);
  return (
    <>
      <Header></Header>
      <SiderBar />
      <div className="content">
        <div style={{ marginTop: "100px" }}>
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
