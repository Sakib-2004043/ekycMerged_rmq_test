import React, { useState } from 'react';
import './signUp.css';
import KycService from '../../services/kycService';


export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    age: '',
    gender: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Automatically calculate age if DOB changes
    if (name === 'dob') {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      setFormData({
        ...formData,
        dob: value,
        age: age,
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await KycService.submitKyc(formData);
      console.log('Response:', response.data);
      alert('KYC Form Submitted Successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit KYC. Please try again.');
    }
  };


  return (
  <div className="signup-container">
    <div className="signup-card">
      <h2>KYC Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
        />

        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          required
        />

        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          readOnly
        />

        <div className="gender-options">
          <input
            type="radio"
            id="genderMale"
            name="gender"
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={handleChange}
            required
          />
          <label htmlFor="genderMale">Male</label>

          <input
            type="radio"
            id="genderFemale"
            name="gender"
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={handleChange}
          />
          <label htmlFor="genderFemale">Female</label>

          <input
            type="radio"
            id="genderOther"
            name="gender"
            value="Other"
            checked={formData.gender === 'Other'}
            onChange={handleChange}
          />
          <label htmlFor="genderOther">Other</label>
        </div>



        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />

        <button type="submit">Submit KYC</button>
      </form>
    </div>
  </div>
)};
