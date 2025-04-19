import React from 'react'

const ForgotPassword = () => {
  return (
    <div>
      <h1>Forgot Password</h1>
      <p>Please enter your email address to reset your password.</p>
      <form>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default ForgotPassword