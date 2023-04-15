import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../../environments/firebase";
// import AddImg from "../../imgs/addAvatar.png";
import { BiImageAdd } from "react-icons/bi";
import Logbar from "../../components/Logbar/Logbar";
import "./Register.scss";

const Register = () => {
  // setting an object to contain current form values
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  // setting an object to contain current form errors
  const [errors, setErrors] = useState({});
  //state to contain img uploading errors
  const [imgError, setImgError] = useState();

  // we will need navigation when the firebase will be connected
  const navigator = useNavigate();

  // function looks for the input field when the user starts typing
  // and changes the corresponding data inside the formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    //after user input validate that field matches the requirements
    const newErrors = validateField(name, value);
    setErrors({
      ...errors,
      [name]: newErrors[name],
    });
  };

  //check if there are any errors in the form and if none trigger
  // registration in the firebase
  const handleSubmit = async (event) => {
    event.preventDefault();
    //get the uploaded picture reference
    const avatar = event.target[4].files[0];
    //before proceeding check for errors
    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // call function to create user in the firebase
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)

        .then(async (userCredential) => {
          //get reference to the newly created user
          const user = userCredential.user;
          //create reference between the user and picture storage
          // change path before production
          const storageRef = ref(storage, `${user.uid}/profile/avatar`);
          //upload picture to the cloud storage and get it's url

          await uploadBytesResumable(storageRef, avatar)
            .then(() => {
              getDownloadURL(storageRef).then(async (downloadURL) => {
                //on successful image upload get the link to the cloudstore
                //and link it to the user's profile along with the nickname
                await updateProfile(user, {
                  displayName: formData.nickname,
                  photoURL: downloadURL,
                });
                //create a copy of user data to firestorage to allow 
                //interactions with another users
                await setDoc(doc(db, "users", user.uid), {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: downloadURL,
                  online: true,
                  profileDescription: {
                    age: 0,
                    location: "Somewhere",
                    career: "Someone",
                    hobbies: "Something",
                    maritalStatus: "No idea"
                  }
                });
                //create a collection of chats for the user
                await setDoc(doc(db, "userChats", user.uid), {});

                //redirect user to the home page after successful registration
                navigator("/");
              });
            }).catch(err => {
              console.log(err);
            });

          // console.log(user)
          // ...
        })
        .catch((error) => {
          // Handle unsuccessful uploads
          setImgError(error);
          // Error concat string to output
          console.log(`${error.code}: ${error.message}`);
        });
    }
  };

  //check for the errors in selected input and update the error state
  const validateField = (name, value) => {
    const errors = {};

    if (name === "nickname") {
      if (!value.trim()) {
        errors.nickname = "Nickname is required";
      }
    } else if (name === "email") {
      if (!value.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = "Email is invalid";
      }
    } else if (name === "password") {
      if (!value.trim()) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    } else if (name === "repeatPassword") {
      if (value !== formData.password) {
        errors.repeatPassword = "Passwords do not match";
      }
    }
    return errors;
  };

  //used on form submit, double checks that all fields are matching the requirements
  const validateFormData = (data) => {
    const errors = {};

    if (!data.nickname.trim()) {
      errors.nickname = "Nickname is required";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (data.password !== data.repeatPassword) {
      errors.repeatPassword = "Passwords do not match";
    }

    return errors;
  };

  return (
    <div className="registerContainer">
      <Logbar />
      <div className="registerWrap">
        <span className="title">WebChat Register</span>
        <form className="registerForm" onSubmit={handleSubmit}>
          <input
            className="registerInput"
            type="text"
            name="nickname"
            value={formData.nickname}
            placeholder="Display name"
            onChange={handleChange}
          />
          {errors.nickname && (
            <span className="formError">{errors.nickname}</span>
          )}
          <input
            className="registerInput"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
          {errors.email && <span className="formError">{errors.email}</span>}
          <input
            className="registerInput"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && (
            <span className="formError">{errors.password}</span>
          )}
          <input
            className="registerInput"
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            placeholder="Repeat password"
            onChange={handleChange}
          />
          {errors.repeatPassword && (
            <span className="formError">{errors.repeatPassword}</span>
          )}
          <label id="avatarInput">
            <BiImageAdd className="regImg" />

            <span>Choose avatar</span>
            {/* to customize standard input look we hide the input element and wrap it in a
                        label with desired output content */}
            <input type="file" hidden={true} />
          </label>
          {imgError && <span className="formError">{imgError}</span>}
          <button id="registerSubmit" type="submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;
