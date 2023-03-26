import React, { useState, useContext } from 'react'
// auth 
import { AuthContext } from '../../../components/context/AuthContext';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
// react icons
import { AiFillEdit } from 'react-icons/ai';
// scss styles 
import './AuthTab.scss';

export default function AuthTab() {
    // User context for current user
    const { currentUser } = useContext(AuthContext);

    const [passwordChangeLoginAccess, setPasswordChangeLoginAccess] = useState(false);
    const [passwordChangeAccess, setPasswordChangeAccess] = useState(false);

    // form data
    const [formData, setFormData] = useState({
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    });

    // Error states
    const [formErrors, setFormErrors] = useState({

    });

    // handling old password input
    const handleFormLoginChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
        //after user input validate that field matches the requirements
        const newErrors = validateFormField(name, value);

        setFormErrors({
            ...formErrors,
            [name]: newErrors[name],
        });
    };

    // Auth function to access password change form
    const handleFormLoginSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validateFormField(formData);
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            // call login function
            try {
                const credential = EmailAuthProvider.credential(
                    currentUser.email,
                    formData.password
                );
                // authenticating the user 
                await reauthenticateWithCredential(currentUser, credential).then((res) => {
                    // User re-authenticated.
                    // Code...
                    console.log(res)
                    alert("Please, enter the new password");
                    setPasswordChangeAccess(!passwordChangeAccess);
                    setPasswordChangeLoginAccess(!passwordChangeLoginAccess);
                });
            } catch (error) {
                console.log(error.message);
            }
        }

    }

    const handlePasswordInput = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        const newErrors = validateFormField(name, value);
        setFormErrors({
            ...formErrors,
            [name]: newErrors[name],
        });
    }

    const handleNewPasswordSubmit = async (e) => {

        if (formData.newPassword) {
            await updatePassword(currentUser, formData.newPassword).then(() => {
                alert("Password updated, please log in.")
            }).catch((error) => {
                // An error ocurred
                console.log(error)
                // ...
            });
        }
        else {
            alert("Password was not changed")
            setPasswordChangeAccess(!passwordChangeAccess)
        }
    }

    const validateFormField = (name, value) => {
        const errors = {};

        if (name === "password") {
            if (!value.trim()) {
                errors.password = "Password is required";
            } else if (value.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }
        }
        if (name === "newPassword") {
            if (!value.trim()) {
                errors.newPassword = "Password is required";
            } else if (value.length < 6) {
                errors.newPassword = "Password must be at least 6 characters";
            }
        } else if (name === "repeatNewPassword") {
            if (value !== formData.newPassword) {
                errors.repeatNewPassword = "Passwords do not match";
            }
        }
        return errors;
    };


    return (
        <>
            <div className="usefulForms">
                <h3>Useful forms</h3>
                <div className="passwordChange">
                    <button
                        className=' formBtn'
                        onClick={() => { setPasswordChangeLoginAccess(!passwordChangeLoginAccess); }}
                        hidden={passwordChangeLoginAccess || passwordChangeAccess}>
                        Change your password
                    </button>

                    {passwordChangeLoginAccess &&
                        <form className="passwordForm" onSubmit={handleFormLoginSubmit}>
                            <input
                                className="profileInput"
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="Enter current password"
                                onChange={handleFormLoginChange}
                            />
                            {formErrors.password && (
                                <span className="formError">{formErrors.password}</span>
                            )}
                            <button className="iconBtn" type="submit" disabled={formErrors.email || formErrors.password}>Log in<AiFillEdit /></button>
                        </form>
                    }
                    {passwordChangeAccess &&
                        <form className="passwordForm" onSubmit={handleNewPasswordSubmit}>
                            <input
                                className="profileInput"
                                type="password"
                                name='newPassword'
                                value={formData.newPassword}
                                placeholder='New Password'
                                onChange={handlePasswordInput}
                            />
                            {formErrors.newPassword && (
                                <span className="formError">{formErrors.newPassword}</span>
                            )}
                            <input
                                className="profileInput"
                                type="password"
                                name='repeatNewPassword'
                                value={formData.repeatNewPassword}
                                placeholder='Repeat, please'
                                onChange={handlePasswordInput}
                            />
                            {formErrors.repeatNewPassword && (
                                <span className="formError">{formErrors.repeatNewPassword}</span>
                            )}
                            <button className='submitBtn' type="submit">Change Password</button>
                        </form>}
                </div>
            </div>
        </>
    )
}
