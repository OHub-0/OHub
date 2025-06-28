200 OK — valid success response

201 Created — success where new resource is created

400 Bad Request — client made a bad request (e.g. validation failed, username already taken, etc.)

401 Unauthorized — no valid auth

403 Forbidden — auth ok, but user not allowed to do that

404 Not Found — resource doesn’t exist

409 Conflict — conflict with current resource state (like duplicate username)

422 Unprocessable Entity — validation failed (alternative to 400)

500 Internal Server Error — unexpected crash