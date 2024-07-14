# Create Short Url - Business Rule

> ## Success Case

1.  ✅ Receives **Post** request at route **/**
2.  ✅ Checks if client with given id already exists
3.  ✅ Validates if **longUrl** is valid
4.  ✅ Get the last id from last short-url created
5.  ✅ Increments the last id
6.  ✅ **Creates** the short-url in the database
7.  ✅ Decreases the 'creation link quota' from the client based on it's plan
8.  ✅ Returns **201** status code and **id** from short-url created

> ## Error Case

1. ❗Returns status error **400** if **longUrl** is invalid OR too long
2. ❗Returns status error **401** if client does not exists
3. ❗Returns status error **403** if client exceeded it's quota of link creation
4. ❗Returns status error **500** if occurs problem in the database
