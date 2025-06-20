import React, { useState, useEffect } from "react";
import "../styles/PersonalDetails.css"
import toast, { Toaster } from 'react-hot-toast';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CartOverview from "./CartOverview";

/*
  Buyer details page.
  - Displayed during the checkout process.
  - Collects customer data such as birth date, email, name, address.
  - Buttons to go back or proceed to the next step of the order.
*/

export default function PersonalDetails({ onSubmit, onNext, onBack, steps }) {
    // Progress
    const activeStep = 1;

    // User basic information form
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        cpf: "",
        birthDate: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
        zipCode: ""
    });

    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'cart';
    const addressKey = userId ? `address_${userId}` : 'address';
    const selectedAddressKey = userId ? `selectedAddress_${userId}` : 'selectedAddress';
    const [, setCart] = useState([]);

    // Fetches selected address from the profile on mount
    React.useEffect(() => {
        // Always prioritizes the backend
        if (userId) {
            fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
                .then(res => res.json())
                .then(user => {
                    let addr = {};
                    if (Array.isArray(user.address)) {
                        // Synchronizes localStorage with backend
                        localStorage.setItem(addressKey, JSON.stringify(user.address));
                        localStorage.setItem(selectedAddressKey, user.selectedAddress || (user.address[0]?.id || ''));
                        const selId = user.selectedAddress || (user.address[0]?.id || "");
                        const selAddr = user.address.find(a => a.id === selId) || user.address[0];
                        if (selAddr) {
                            addr = {
                                street: selAddr.street || "",
                                number: selAddr.number || "",
                                complement: selAddr.complement || "",
                                district: selAddr.district || "",
                                city: selAddr.city || "",
                                state: selAddr.state || "",
                                zipCode: selAddr.zipCode || ""
                            };
                        }
                    }
                    setForm(prev => ({
                        ...prev,
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        cpf: user.cpf || "",
                        birthDate: user.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : "",
                        ...addr
                    }));
                    // Alerts if there is no valid address via backend
                    if (!addr.street || !addr.number || !addr.city || !addr.state || !addr.zipCode) {
                        toast.error("No delivery address found in your profile. Please register an address in your profile before proceeding.");
                    }
                })
                .catch(() => {
                    // Fallback: tries to catch from localStorage, if the backend fails
                    const addresses = JSON.parse(localStorage.getItem(addressKey) || '[]');
                    const selectedAddressId = localStorage.getItem(selectedAddressKey);
                    let addressData = {};
                    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
                    if (selectedAddress) {
                        addressData = {
                            street: selectedAddress.street || "",
                            number: selectedAddress.number || "",
                            complement: selectedAddress.complement || "",
                            district: selectedAddress.district || "",
                            city: selectedAddress.city || "",
                            state: selectedAddress.state || "",
                            zipCode: selectedAddress.zipCode || ""
                        };
                    } else if (addresses.length > 0) {
                        const a = addresses[0];
                        addressData = {
                            street: a.street || "",
                            number: a.number || "",
                            complement: a.complement || "",
                            district: a.district || "",
                            city: a.city || "",
                            state: a.state || "",
                            zipCode: a.zipCode || ""
                        };
                    }
                    setForm(prev => ({
                        ...prev,
                        ...addressData
                    }));
                    // Alerts if there is no valid address via localStorage
                    if (!addressData.street || !addressData.number || !addressData.city || !addressData.state || !addressData.zipCode) {
                        toast.error("No delivery address found in your profile. Please register an address in your profile before proceeding.");
                    }
                });
        } else {
            // User not authenticated: only localStorage
            const addresses = JSON.parse(localStorage.getItem(addressKey) || '[]');
            const selectedAddressId = localStorage.getItem(selectedAddressKey);
            let addressData = {};
            const selectedAddress = addresses.find(a => a.id === selectedAddressId);
            if (selectedAddress) {
                addressData = {
                    street: selectedAddress.street || "",
                    number: selectedAddress.number || "",
                    complement: selectedAddress.complement || "",
                    district: selectedAddress.district || "",
                    city: selectedAddress.city || "",
                    state: selectedAddress.state || "",
                    zipCode: selectedAddress.zipCode || ""
                };
            } else if (addresses.length > 0) {
                const a = addresses[0];
                addressData = {
                    street: a.street || "",
                    number: a.number || "",
                    complement: a.complement || "",
                    district: a.district || "",
                    city: a.city || "",
                    state: a.state || "",
                    zipCode: a.zipCode || ""
                };
            }
            setForm(prev => ({
                ...prev,
                ...addressData
            }));
            // Alerts if there is no valid address via localStorage
            if (!addressData.street || !addressData.number || !addressData.city || !addressData.state || !addressData.zipCode) {
                toast.error("No delivery address found in your profile. Please register an address in your profile before proceeding.");
            }
        }
    }, [addressKey, selectedAddressKey, userId]);

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
    }, [cartKey]);

    // CPF formatting
    function formatCPF(value) {
        value = value.replace(/\D/g, "").slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value;
    }
    // Date formatting
    function formatBirthDate(value) {
        value = value.replace(/\D/g, "").slice(0, 8);
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }
        return value;
    }
    // Phone number formatting
    function formatPhoneNumber(value) {
        value = value.replace(/\D/g, "").slice(0, 11); 

        if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        }
        if (value.length > 10) {
            value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
        } else if (value.length > 6) {
            value = value.replace(/(\d{4})(\d{4})$/, "$1-$2");
        }
        return value;
    }

    // Updates the form whenever a field is filled
    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "cpf") {
            newValue = formatCPF(newValue);
        } else if (name === "birthDate") {
            newValue = formatBirthDate(newValue);
        } else if (name === "number") {
            newValue = newValue.replace(/\D/g, "").slice(0, 6);
        } else if (name === "zipCode") {
            newValue = newValue.replace(/\D/g, "").slice(0, 8);
        } else if (["firstName", "lastName", "city", "state", "district"].includes(name)) {
            newValue = newValue.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        } else if (name === "phone") {
            newValue = formatPhoneNumber(newValue);
        } else if (["address", "complement"].includes(name)) {
            newValue = newValue.replace(/[^A-Za-zÀ-ÿ0-9\s]/g, "");
        }
        setForm({ ...form, [name]: newValue });
    }

    // Sends the data to our "database"
    function handleSubmit(e) {
        e.preventDefault();
        console.log("Form submitted!");

        // Birth date validation (DD/MM/YYYY)
        const birthDate = form.birthDate;
        const birthDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = birthDate.match(birthDateRegex);

        if (!match) {
            toast.error("Invalid birth date. Use the format DD/MM/YYYY.");
            return;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        if (day < 1 || day > 31) {
            toast.error("Birth day must be between 01 and 31.");
            return;
        }
        if (month < 1 || month > 12) {
            toast.error("Birth month must be between 01 and 12.");
            return;
        }
        if (year > 2025) {
            toast.error("Birth year must be 2025 or less.");
            return;
        }
        // Checks if address is filled (prevents progress if not)
        if (!form.street || !form.number || !form.city || !form.state || !form.zipCode) {
            toast.error("No delivery address found in your profile. Please register an address in your profile before proceeding.");
            return;
        }

        const addressString = `${form.street}, ${form.number}${form.complement ? ' - ' + form.complement : ''} - ${form.district}, ${form.city}/${form.state}`.replace(/\s+/g, ' ').trim();
        const formWithAddress = { ...form, address: addressString };

        localStorage.setItem("personal", JSON.stringify(formWithAddress));
        // Updates in backend if logged in
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
                .then(res => res.json())
                .then(user => {
                    const addresses = Array.isArray(user.address) ? user.address : [];
                    const selectedAddressKey = userId ? `selectedAddress_${userId}` : 'selectedAddress';
                    const selectedAddressId = localStorage.getItem(selectedAddressKey);
                    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firstName: form.firstName,
                            lastName: form.lastName,
                            email: form.email,
                            phone: form.phone,
                            cpf: form.cpf,
                            birthDate: new Date(`${year}-${month}-${day}`),
                            selectedAddress: selectedAddressId || addresses[0]?.id || ""
                        })
                    });
                });
        }
        if (onSubmit) onSubmit(formWithAddress);
        if (onNext) onNext();
    }

    return (
        <>
        <Toaster />
        <div style={{ width: "100%", margin: "32px 0" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
        <div className="main-content">
            <form className="personal-details-form" onSubmit={handleSubmit}>
                <h2>Personal Data</h2>
                <div className="form-row">
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-zÀ-ÿ\s]+"
                        title="Only letters are allowed"
                    />
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-zÀ-ÿ\s]+"
                        title="Only letters are allowed"
                    />
                </div>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />
                <div className="cpf-nascimento-row">
                    <input
                        id="cpf"
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        value={form.cpf}
                        onChange={handleChange}
                        required
                        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                        title="Enter CPF in the format 000.000.000-00"
                    />
                    <input
                        id="birthDate"
                        type="text"
                        name="birthDate"
                        placeholder="Birth date"
                        value={form.birthDate}
                        onChange={handleChange}
                        required
                        pattern="\d{2}/\d{2}/\d{4}"
                        title="Enter the date in the format DD/MM/YYYY"
                    />
                </div>
                <h3>Address</h3>
                <input
                    id="street"
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={form.street}
                    onChange={handleChange}
                    required
                />
                <div className="form-row">
                    <input
                        id="number"
                        type="text"
                        name="number"
                        placeholder="Number"
                        value={form.number}
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="complement"
                        type="text"
                        name="complement"
                        placeholder="Complement"
                        value={form.complement}
                        onChange={handleChange}
                    />
                </div>
                <input
                    id="district"
                    type="text"
                    name="district"
                    placeholder="Neighborhood"
                    value={form.district}
                    onChange={handleChange}
                    required
                />
                <div className="form-row">
                    <input
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="state"
                        type="text"
                        name="state"
                        placeholder="State"
                        value={form.state}
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        placeholder="ZIP code"
                        value={form.zipCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="button-row">
                    <button
                        type="button"
                        className="back-button"
                        onClick={onBack}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Next
                    </button>
                </div>
            </form>
            <CartOverview />
        </div>
        </>
    );
}