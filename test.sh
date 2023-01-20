# POST users request
echo "POST users request"
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"nnnaaames", "email":"my@email.com", "password": "pwd"}' | jq

# email verify
echo "email verify"
curl -X POST http://localhost:3000/users/email-verify\?signupVerifyToken\=test_token 

# login
echo "login"
curl -X POST http://localhost:3000/users/login -H "content-Type: application/json" -d '{"email": "your_email@gmail.com", "password": "PASSWORD"}'

# GET user-id
echo "GET user-id"
 curl -X GET http://localhost:3000/users/user-id