# DevTinder APIs

💡

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password  // Forgot password 

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
// the above two intrested and ignored can be made dynamic 
- POST /request/send/:status/:userId


- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/requests
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform


Status: ignore, interested, accepted, rejected