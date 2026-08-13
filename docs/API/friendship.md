friend system, I'd settle on 9 Friendship APIs + 1 User search API = 10 APIs.

🤝 Friendship — 9 APIs
POST /api/friend/request/:userId — Send request
PATCH /api/friend/request/:requestId/accept — Accept request
PATCH /api/friend/request/:requestId/reject — Reject request
DELETE /api/friend/:userId — Remove friend
GET /api/friend/requests — Incoming requests
GET /api/friend/requests/sent — Sent requests
GET /api/friend/list — My friends
GET /api/friend/status/:userId — Check relationship with a user
👤 User — 1 API
GET /api/user/search?q=... — Search use