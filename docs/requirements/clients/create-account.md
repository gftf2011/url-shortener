# Create Account - Business Rule

> ## Success Case

1.  ✅ Receives **POST** request at route **/clients/create-account**
2.  ✅ Validates required fields **fullName**, **email**, **password**
3.  ✅ Validates if **fullName** has at least 2 characters per white space that is composed by the name itself
4.  ✅ Validates if **email** is valid
5.  ✅ Validates if **password** has at least:
    1. 8 numbers
    2. 1 lowercase letter
    3. 1 uppercase letter
    4. 1 special character - (^!@#$%&?)
6.  ✅ Checks if client with given email does not exists
7.  ✅ Client password is **hashed** for security reasons - (not reversible)
8.  ✅ **Creates** client account with encrypted and hashed values AND with FREE tier plan
9.  ✅ Creates **access-token** using code generated ID
10. ✅ Returns **201** status code with **access-token**

> ## Error Case

1. ❗Returns status error **400** if **fullName**, **email**, **password** were invalid
2. ❗Returns status error **403** email provided already exists
3. ❗Returns status error **500** if occurs problem in the database
