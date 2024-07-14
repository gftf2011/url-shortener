# Redirect - Business Rule

> ## Success Case

1.  ✅ Receives **GET** request at route **/**
2.  ✅ Validates required field **id**
3.  ✅ Checks if short-url already exists
4.  ✅ Retrieves short-url from database AND saves short-url response in cache
5.  ✅ Returns **302** and redirects to original link

> ## Error Case

1. ❗Returns status error **400** if **id** is invalid
2. ❗Returns status error **404** if short-url does not exists
3. ❗Returns status error **500** if occurs problem in the database
