# Delete Short Url - Business Rule

> ## Success Case

1.  ✅ Receives **Delete** request at route **/:id**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Checks if client do exists
4.  ✅ Checks if short-url **id** do exists OR was not marked as 'deleted'
5.  ✅ Decreases the 'deletion link quota' from the client based on it's plan
6.  ✅ Mark the short-url as deleted AND delete the value in the cache database
7.  ✅ Returns **204** status code

> ## Error Case

1. ❗Returns status error **401** if client does not exists
2. ❗Returns status error **403** if client exceeded it's quota of link deletion
3. ❗Returns status error **404** if short-url does not exists
4. ❗Returns status error **500** if occurs problem in the database
