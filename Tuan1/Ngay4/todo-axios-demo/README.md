
A compact demo showing Axios features integrated into a TodoList application.

Features included:
- Axios instance with defaults (timeout, headers)
- Interceptors (request/response)
- TransformRequest/TransformResponse usage
- Cancellation with AbortController
- Error handling
- Fake backend implemented via axios adapter using localStorage (no server required)

## Run
2. npm install
3. npm run dev

The fake adapter stores todos under localStorage key `axios_todos_v1`.
