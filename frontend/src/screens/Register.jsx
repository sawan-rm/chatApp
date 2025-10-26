import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const Register = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()


    function submitHandler(e) {

        e.preventDefault()

        console.log('📝 [REGISTER FORM] Submitting registration...', { email });

        axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            console.log('✅ [REGISTER FORM] Registration successful!', res.data);
            localStorage.setItem('token', res.data.token);
            console.log('💾 [REGISTER FORM] Token saved to localStorage');
            setUser(res.data.user);
            console.log('👤 [REGISTER FORM] User context updated');
            navigate('/');
        }).catch((err) => {
            console.error('❌ [REGISTER FORM] Registration error:', err);
            if (err.response) {
                console.log('📋 [REGISTER FORM] Server error response:', err.response.data);
                alert(err.response.data.message || 'Registration failed');
            } else if (err.request) {
                console.log('⚠️ [REGISTER FORM] No response from server');
                alert('Cannot connect to server. Please check your connection.');
            } else {
                console.log('⚠️ [REGISTER FORM] Error:', err.message);
                alert('An error occurred: ' + err.message);
            }
        })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
                <form
                    onSubmit={submitHandler}
                >
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 mt-4">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register