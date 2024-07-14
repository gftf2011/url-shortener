# Login - Business Rule

> ## Success Case

1.  ✅ Receives **POST** request at route **/clients/login**
2.  ✅ Validates required fields **email**, **password**
3.  ✅ Validates if **email** is valid
4.  ✅ Validates if **password** has at least:
    1. 8 numbers
    2. 1 lowercase letter
    3. 1 uppercase letter
    4. 1 special character - (^!@#$%&?)
5.  ✅ Checks if user with given email already exists
6.  ✅ User email is checked with the one in database
7.  ✅ User password is again **hashed** to check with the one in database
8.  ✅ Checks if user password matches with the one in database
9.  ✅ Creates **access-token** using code retrieved ID
10. ✅ Returns **200** status code with **access-token**

> ## Error Case

1. ❗Returns status error **400** if **email**, **password** were invalid
2. ❗Returns status error **401** if email provided does not exists
3. ❗Returns status error **403** if password provided does not match
4. ❗Returns status error **500** if occurs problem in the database
